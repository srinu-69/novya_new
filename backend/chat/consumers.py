from __future__ import annotations

from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.backends import TokenBackend

from .models import (
    ChatGroup,
    FriendRequest,
    Friendship,
    GroupMembership,
    Message,
    MessageReadReceipt,
)
from .utils import (
    compute_group_unread_count,
    compute_unread_count,
    get_direct_room_name,
    get_group_room_name,
)

User = get_user_model()


class BaseChatConsumer(AsyncWebsocketConsumer):
    token_backend = TokenBackend(algorithm=settings.SIMPLE_JWT['ALGORITHM'], signing_key=settings.SECRET_KEY)

    async def connect(self):
        self.user = await self._authenticate_user()
        if not self.user:
            await self.close(code=4401)
            return
        await self._perform_connect()

    async def disconnect(self, close_code):
        if getattr(self, 'room_group_name', None):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        if text_data:
            await self._handle_message(text_data.strip())

    async def chat_event(self, event):
        payload = event['payload']
        await self._dispatch_payload(payload)

    async def _authenticate_user(self):
        query_string = self.scope.get('query_string', b'').decode()
        params = parse_qs(query_string)
        token_list = params.get('token')
        if not token_list:
            return None
        token = token_list[0]
        try:
            validated_data = self.token_backend.decode(token, verify=True)
        except Exception:
            return None
        user_id = validated_data.get(settings.SIMPLE_JWT.get('USER_ID_CLAIM', 'user_id'))
        user = await database_sync_to_async(User.objects.filter(userid=user_id).first)()
        return user

    async def _perform_connect(self):
        raise NotImplementedError

    async def _handle_message(self, text_data: str):
        raise NotImplementedError

    async def _dispatch_payload(self, payload: dict):
        raise NotImplementedError


class DirectChatConsumer(BaseChatConsumer):
    async def _perform_connect(self):
        self.friend_id = int(self.scope['url_route']['kwargs']['friend_id'])
        friend = await database_sync_to_async(User.objects.filter(userid=self.friend_id).first)()
        if not friend:
            await self.close()
            return
        self.friend = friend
        are_friends = await database_sync_to_async(Friendship.objects.are_friends)(self.user, self.friend)
        if not are_friends:
            await self.close()
            return
        self.room_group_name = get_direct_room_name(self.user.userid, self.friend.userid)
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def _handle_message(self, text_data: str):
        if text_data.startswith('REPLY:'):
            _, reply_to_id, message_content = text_data.split(':', 2)
            reply_to = int(reply_to_id) if reply_to_id and reply_to_id != 'null' else None
            message = await self._create_message(message_content, reply_to)
            await self._broadcast_message(message, event='reply')
        else:
            message = await self._create_message(text_data, reply_to=None)
            await self._broadcast_message(message, event='message')

    async def _dispatch_payload(self, payload: dict):
        event = payload.get('event')
        if event == 'message':
            text = f"{payload['sender_id']}:{payload['content']}:{payload['timestamp']}"
            if self.user.userid == payload.get('receiver_id'):
                unread = payload.get('unread_for_receiver')
                if unread is not None:
                    text = f"{text}:UNREAD:{unread}"
            await self.send(text_data=text)
        elif event == 'reply':
            reply_to_id = payload.get('reply_to_id') or ''
            text = f"REPLY:{payload['message_id']}:{payload['sender_id']}:{payload['content']}:{reply_to_id}:{payload['timestamp']}"
            if self.user.userid == payload.get('receiver_id'):
                unread = payload.get('unread_for_receiver')
                if unread is not None:
                    text = f"{text}:UNREAD:{unread}"
            await self.send(text_data=text)
        elif event == 'file':
            reply_to_id = payload.get('reply_to_id') or ''
            content = payload.get('content', '')
            text = (
                f"FILE:{payload['sender_id']}:{payload.get('filename','')}:{payload.get('file_type','')}"
                f":{payload.get('file_url','')}:{content}:{reply_to_id}:{payload['message_id']}:{payload['timestamp']}"
            )
            if self.user.userid == payload.get('receiver_id'):
                unread = payload.get('unread_for_receiver')
                if unread is not None:
                    text = f"{text}:UNREAD:{unread}"
            await self.send(text_data=text)
        elif event == 'reaction':
            text = f"REACTION:{payload['message_id']}:{payload['emoji']}:{payload['action']}"
            await self.send(text_data=text)
        elif event == 'unread_update':
            text = f"UNREAD_UPDATE:{payload['friend_id']}:{payload['unread_count']}"
            await self.send(text_data=text)

    @database_sync_to_async
    def _create_message(self, content: str, reply_to_id: int | None):
        reply_to = Message.objects.filter(pk=reply_to_id).first() if reply_to_id else None
        message = Message.objects.create(
            sender=self.user,
            receiver=self.friend,
            content=content,
            reply_to=reply_to,
            delivered=True,
        )
        MessageReadReceipt.objects.get_or_create(message=message, user=self.user)
        return message

    async def _broadcast_message(self, message: Message, event: str):
        unread_count = await database_sync_to_async(compute_unread_count)(message.receiver, message.sender.userid)
        payload = {
            'event': event,
            'message_id': message.id,
            'sender_id': message.sender.userid,
            'receiver_id': message.receiver.userid,
            'content': message.content,
            'reply_to_id': message.reply_to_id,
            'timestamp': message.created_at.isoformat(),
            'unread_for_receiver': unread_count,
        }
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat.event',
                'payload': payload,
            }
        )


class GroupChatConsumer(BaseChatConsumer):
    async def _perform_connect(self):
        self.group_id = int(self.scope['url_route']['kwargs']['group_id'])
        group = await database_sync_to_async(ChatGroup.objects.filter(pk=self.group_id).first)()
        if not group:
            await self.close()
            return
        self.group = group
        membership_exists = await database_sync_to_async(GroupMembership.objects.filter(group=group, user=self.user).exists)()
        if not membership_exists:
            await self.close()
            return
        self.room_group_name = get_group_room_name(self.group_id)
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def _handle_message(self, text_data: str):
        if text_data.startswith('REPLY:'):
            _, reply_to_id, message_content = text_data.split(':', 2)
            reply_to = int(reply_to_id) if reply_to_id and reply_to_id != 'null' else None
            message = await self._create_group_message(message_content, reply_to)
            await self._broadcast_group_message(message, event='reply')
        else:
            message = await self._create_group_message(text_data, reply_to=None)
            await self._broadcast_group_message(message, event='message')

    async def _dispatch_payload(self, payload: dict):
        event = payload.get('event')
        if event == 'message':
            text = f"{payload['sender_id']}:{payload['sender_username']}:{payload['content']}:{payload['timestamp']}"
            await self.send(text_data=text)
        elif event == 'reply':
            reply_to_id = payload.get('reply_to_id') or ''
            text = (
                f"REPLY:{payload['message_id']}:{payload['sender_id']}:{payload['sender_username']}:{payload['content']}:{reply_to_id}:{payload['timestamp']}"
            )
            await self.send(text_data=text)
        elif event == 'file':
            reply_to_id = payload.get('reply_to_id') or ''
            content = payload.get('content', '')
            text = (
                f"FILE:{payload['sender_id']}:{payload['sender_username']}:{payload.get('filename','')}:{payload.get('file_type','')}"
                f":{payload.get('file_url','')}:{content}:{reply_to_id}:{payload['message_id']}:{payload['timestamp']}"
            )
            await self.send(text_data=text)
        elif event == 'reaction':
            text = f"REACTION:{payload['message_id']}:{payload['emoji']}:{payload['action']}"
            await self.send(text_data=text)
        elif event == 'unread_update':
            text = f"UNREAD_UPDATE:{payload['group_id']}:{payload['unread_count']}"
            await self.send(text_data=text)

    @database_sync_to_async
    def _create_group_message(self, content: str, reply_to_id: int | None):
        reply_to = Message.objects.filter(pk=reply_to_id).first() if reply_to_id else None
        message = Message.objects.create(
            sender=self.user,
            group=self.group,
            content=content,
            reply_to=reply_to,
        )
        MessageReadReceipt.objects.get_or_create(message=message, user=self.user)
        return message

    async def _broadcast_group_message(self, message: Message, event: str):
        payload = {
            'event': event,
            'message_id': message.id,
            'sender_id': message.sender.userid,
            'sender_username': message.sender.username,
            'content': message.content,
            'reply_to_id': message.reply_to_id,
            'timestamp': message.created_at.isoformat(),
            'group_id': message.group_id,
        }
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat.event',
                'payload': payload,
            }
        )
