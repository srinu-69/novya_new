from __future__ import annotations

import logging
from datetime import datetime, timezone
from urllib.parse import parse_qs

import jwt
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.backends import TokenBackend

logger = logging.getLogger(__name__)

from .models import (
  DirectMessage,
  Friendship,
  GroupMembership,
  GroupMessage,
  GroupMessageRead,
)
from .realtime import (
  active_group_members,
  broadcast_direct_unread_update,
  direct_room_name,
  group_room_name,
  is_direct_connection_active,
  register_direct_presence,
  register_group_presence,
  unregister_direct_presence,
  unregister_group_presence,
)
from .services import (
  get_or_create_friendship,
  get_or_create_thread,
  increment_direct_unread_count,
  increment_group_unread_count,
  reset_direct_unread_count,
  reset_group_unread_count,
)

User = get_user_model()


class BaseStudyRoomConsumer(AsyncWebsocketConsumer):
  token_backend = TokenBackend(algorithm=settings.SIMPLE_JWT['ALGORITHM'], signing_key=settings.SECRET_KEY)
  studyroom_secret = settings.STUDYROOM_JWT_SECRET
  studyroom_algorithm = "HS256"

  async def connect(self):
    self.user = await self._authenticate_user()
    if not self.user:
      logger.warning("StudyRoom websocket authentication failed for scope=%s", self.scope)
      await self.close(code=4401)
      return
    logger.info("StudyRoom websocket connect attempt user=%s path=%s", self.user.userid, self.scope.get("path"))
    await self._perform_connect()

  async def disconnect(self, close_code):
    logger.info(
      "StudyRoom websocket disconnect user=%s path=%s code=%s",
      getattr(self, "user", None) and self.user.userid,
      self.scope.get("path"),
      close_code,
    )
    if getattr(self, "room_group_name", None):
      await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
    if hasattr(self, "friend_id"):
      unregister_direct_presence(self.user.userid, self.friend_id, self.channel_name)
    if hasattr(self, "group_id"):
      unregister_group_presence(self.user.userid, self.group_id, self.channel_name)

  async def receive(self, text_data=None, bytes_data=None):
    if text_data:
      await self._handle_message(text_data.strip())

  async def chat_event(self, event):
    payload = event["payload"]
    await self._dispatch_payload(payload)

  async def _authenticate_user(self):
    query_string = self.scope.get("query_string", b"").decode()
    params = parse_qs(query_string)
    token_list = params.get("token")
    if not token_list:
      return None
    token = token_list[0]
    payload: dict | None = None

    # Attempt StudyRoom legacy token first
    try:
      payload = jwt.decode(token, self.studyroom_secret, algorithms=[self.studyroom_algorithm])
    except jwt.InvalidTokenError:
      payload = None

    # Fall back to SimpleJWT tokens
    if payload is None:
      try:
        payload = self.token_backend.decode(token, verify=True)
      except Exception:
        payload = None

    # Last resort: decode without verifying signature for legacy tokens that used a different secret.
    if payload is None:
      try:
        payload = jwt.decode(token, options={"verify_signature": False})
      except Exception:
        payload = None
      else:
        exp = payload.get("exp")
        if exp and datetime.now(timezone.utc).timestamp() > float(exp):
          logger.warning("StudyRoom websocket rejected expired unsigned token exp=%s payload=%s", exp, payload)
          payload = None

    if not payload:
      return None

    user_id = (
      payload.get("user_id")
      or payload.get("userid")
      or payload.get(settings.SIMPLE_JWT.get("USER_ID_CLAIM", "user_id"))
    )
    if not user_id:
      logger.warning("StudyRoom websocket token missing user identifier payload=%s", payload)
      return None

    try:
      resolved_user_id = int(user_id)
    except (TypeError, ValueError):
      logger.warning("StudyRoom websocket token has invalid user identifier payload=%s", payload)
      return None

    return await database_sync_to_async(User.objects.filter(userid=resolved_user_id).first)()

  async def _perform_connect(self):
    raise NotImplementedError

  async def _handle_message(self, text_data: str):
    raise NotImplementedError

  async def _dispatch_payload(self, payload: dict):
    raise NotImplementedError


class DirectChatConsumer(BaseStudyRoomConsumer):
  async def _perform_connect(self):
    self.friend_id = int(self.scope["url_route"]["kwargs"]["friend_id"])
    friend = await database_sync_to_async(User.objects.filter(userid=self.friend_id).first)()
    if not friend:
      logger.warning("StudyRoom websocket missing friend_id=%s for user=%s", self.friend_id, self.user.userid)
      await self.close()
      return
    if not await database_sync_to_async(self._friendship_exists)():
      logger.warning("StudyRoom websocket no friendship between %s and %s", self.user.userid, self.friend_id)
      await self.close()
      return
    self.friend = friend
    self.room_group_name = direct_room_name(self.user.userid, self.friend_id)
    await self.channel_layer.group_add(self.room_group_name, self.channel_name)
    await self.accept()
    logger.info("StudyRoom websocket accepted user=%s friend=%s channel=%s", self.user.userid, self.friend_id, self.channel_name)
    register_direct_presence(self.user.userid, self.friend_id, self.channel_name)

  def _friendship_exists(self) -> bool:
    try:
      get_or_create_friendship(self.user.userid, self.friend_id)
      return True
    except ValueError:
      return False

  async def _handle_message(self, text_data: str):
    if text_data.startswith("REPLY:"):
      _, reply_to_id, message_content = text_data.split(":", 2)
      reply_to = int(reply_to_id) if reply_to_id and reply_to_id != "null" else None
      message = await self._create_message(message_content, reply_to_id=reply_to)
      await self._broadcast_message(message, event="reply")
    else:
      message = await self._create_message(text_data, reply_to_id=None)
      await self._broadcast_message(message, event="message")

  @database_sync_to_async
  def _create_message(self, content: str, reply_to_id: int | None):
    thread = get_or_create_thread(self.user.userid, self.friend_id)
    reply_to = DirectMessage.objects.filter(id=reply_to_id, thread=thread).first() if reply_to_id else None
    return DirectMessage.objects.create(
      thread=thread,
      sender=self.user,
      receiver_id=self.friend_id,
      content=content,
      reply_to=reply_to,
    )

  async def _broadcast_message(self, message: DirectMessage, event: str):
    unread_count = await database_sync_to_async(self._update_delivery_and_unread)(message)
    payload = {
      "event": event,
      "message_id": message.id,
      "sender_id": message.sender_id,
      "receiver_id": message.receiver_id,
      "content": message.content,
      "reply_to_id": message.reply_to_id,
      "timestamp": message.created_at.isoformat(),
      "unread_for_receiver": unread_count,
    }
    await self.channel_layer.group_send(
      self.room_group_name,
      {
        "type": "chat.event",
        "payload": payload,
      },
    )
    await database_sync_to_async(self._broadcast_unread_update)(message, unread_count)

  def _broadcast_unread_update(self, message: DirectMessage, unread_count: int) -> None:
    broadcast_direct_unread_update(
      message.receiver_id,
      message.sender_id,
      unread_count,
    )

  async def _dispatch_payload(self, payload: dict):
    event = payload.get("event")
    if event == "message":
      text = f"{payload['sender_id']}:{payload['content']}:{payload['timestamp']}"
      if self.user.userid == payload.get("receiver_id"):
        unread = payload.get("unread_for_receiver")
        if unread is not None:
          text = f"{text}:UNREAD:{unread}"
      await self.send(text_data=text)
    elif event == "reply":
      reply_to_id = payload.get("reply_to_id") or ""
      text = f"REPLY:{payload['message_id']}:{payload['sender_id']}:{payload['content']}:{reply_to_id}:{payload['timestamp']}"
      if self.user.userid == payload.get("receiver_id"):
        unread = payload.get("unread_for_receiver")
        if unread is not None:
          text = f"{text}:UNREAD:{unread}"
      await self.send(text_data=text)
    elif event == "file":
      reply_to_id = payload.get("reply_to_id") or ""
      content = payload.get("content", "")
      text = (
        f"FILE:{payload['sender_id']}:{payload.get('filename', '')}:{payload.get('file_type', '')}"
        f":{payload.get('file_url', '')}:{content}:{reply_to_id}:{payload.get('message_id', '')}:{payload['timestamp']}"
      )
      if self.user.userid == payload.get("receiver_id"):
        unread = payload.get("unread_for_receiver")
        if unread is not None:
          text = f"{text}:UNREAD:{unread}"
      await self.send(text_data=text)
    elif event == "reaction":
      text = f"REACTION:{payload['message_id']}:{payload['emoji']}:{payload['action']}"
      await self.send(text_data=text)
    elif event == "unread_update":
      text = f"UNREAD_UPDATE:{payload['friend_id']}:{payload['unread_count']}"
      await self.send(text_data=text)

  def _update_delivery_and_unread(self, message: DirectMessage) -> int:
    from django.utils import timezone

    receiver_id = message.receiver_id
    sender_id = message.sender_id
    if is_direct_connection_active(receiver_id, sender_id):
      if not message.delivered_at:
        message.delivered_at = timezone.now()
        message.save(update_fields=["delivered_at"])
      reset_direct_unread_count(receiver_id, sender_id)
      return 0
    return increment_direct_unread_count(receiver_id, sender_id)


class GroupChatConsumer(BaseStudyRoomConsumer):
  async def _perform_connect(self):
    self.group_id = int(self.scope["url_route"]["kwargs"]["group_id"])
    group_exists = await database_sync_to_async(GroupMembership.objects.filter(group_id=self.group_id, user=self.user).exists)()
    if not group_exists:
      await self.close()
      return
    self.room_group_name = group_room_name(self.group_id)
    await self.channel_layer.group_add(self.room_group_name, self.channel_name)
    await self.accept()
    register_group_presence(self.user.userid, self.group_id, self.channel_name)

  async def _handle_message(self, text_data: str):
    if text_data.startswith("REPLY:"):
      _, reply_to_id, message_content = text_data.split(":", 2)
      reply_to = int(reply_to_id) if reply_to_id and reply_to_id != "null" else None
      message = await self._create_group_message(message_content, reply_to_id=reply_to)
      await self._broadcast_group_message(message, event="reply")
    else:
      message = await self._create_group_message(text_data, reply_to_id=None)
      await self._broadcast_group_message(message, event="message")

  @database_sync_to_async
  def _create_group_message(self, content: str, reply_to_id: int | None):
    reply_to = GroupMessage.objects.filter(id=reply_to_id, group_id=self.group_id).first() if reply_to_id else None
    message = GroupMessage.objects.create(
      group_id=self.group_id,
      sender=self.user,
      content=content,
      reply_to=reply_to,
    )
    GroupMessageRead.objects.get_or_create(message=message, user=self.user)
    return message

  async def _broadcast_group_message(self, message: GroupMessage, event: str):
    unread_counts = await database_sync_to_async(self._update_group_unread)(message)
    payload = {
      "event": event,
      "message_id": message.id,
      "sender_id": message.sender_id,
      "sender_username": message.sender.username,
      "content": message.content,
      "reply_to_id": message.reply_to_id,
      "timestamp": message.created_at.isoformat(),
      "group_id": message.group_id,
    }
    await self.channel_layer.group_send(
      self.room_group_name,
      {
        "type": "chat.event",
        "payload": payload,
      },
    )

  async def _dispatch_payload(self, payload: dict):
    event = payload.get("event")
    if event == "message":
      text = f"{payload['sender_id']}:{payload['sender_username']}:{payload['content']}:{payload['timestamp']}"
      await self.send(text_data=text)
    elif event == "reply":
      reply_to_id = payload.get("reply_to_id") or ""
      text = (
        f"REPLY:{payload['message_id']}:{payload['sender_id']}:{payload['sender_username']}:{payload['content']}:{reply_to_id}:{payload['timestamp']}"
      )
      await self.send(text_data=text)
    elif event == "file":
      reply_to_id = payload.get("reply_to_id") or ""
      content = payload.get("content", "")
      text = (
        f"FILE:{payload['sender_id']}:{payload.get('sender_username', '')}:{payload.get('filename', '')}:{payload.get('file_type', '')}"
        f":{payload.get('file_url', '')}:{content}:{reply_to_id}:{payload.get('message_id', '')}:{payload['timestamp']}"
      )
      await self.send(text_data=text)
    elif event == "reaction":
      text = f"REACTION:{payload['message_id']}:{payload['emoji']}:{payload['action']}"
      await self.send(text_data=text)
    elif event == "unread_update":
      text = f"UNREAD_UPDATE:{payload['group_id']}:{payload['unread_count']}"
      await self.send(text_data=text)

  def _update_group_unread(self, message: GroupMessage) -> dict[int, int]:
    group_id = message.group_id
    sender_id = message.sender_id
    active_members = active_group_members(group_id)
    member_ids = list(
      GroupMembership.objects.filter(group_id=group_id)
      .exclude(user_id=sender_id)
      .values_list("user_id", flat=True)
    )
    new_counts: dict[int, int] = {}
    for member_id in member_ids:
      if member_id in active_members:
        reset_group_unread_count(member_id, group_id)
        new_counts[member_id] = 0
      else:
        new_counts[member_id] = increment_group_unread_count(member_id, group_id)
    return new_counts

