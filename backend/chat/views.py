from collections import defaultdict
from typing import Dict, List

from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from django.db.models import Count, Max, Q
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    ChatGroup,
    FriendRequest,
    Friendship,
    GroupMembership,
    Message,
    MessageReaction,
    MessageReadReceipt,
    determine_attachment_type,
)
from .serializers import (
    ChatGroupSerializer,
    FriendRequestSerializer,
    GroupInfoSerializer,
    MessageSerializer,
)
from .utils import (
    broadcast_event,
    compute_group_unread_count,
    compute_unread_count,
    get_direct_room_name,
    get_group_room_name,
)

User = get_user_model()


def get_direct_room_name(user_a_id: int, user_b_id: int) -> str:
    first, second = sorted([user_a_id, user_b_id])
    return f"chat_{first}_{second}"


def get_group_room_name(group_id: int) -> str:
    return f"group_{group_id}"


def compute_unread_count(current_user: User, friend_id: int) -> int:
    return (
        Message.objects
        .filter(
            message_type=Message.TYPE_INDIVIDUAL,
            sender_id=friend_id,
            receiver=current_user,
            is_deleted=False,
        )
        .exclude(read_receipts__user=current_user)
        .count()
    )


def compute_group_unread_count(user: User, group: ChatGroup) -> int:
    return (
        Message.objects
        .filter(
            group=group,
            message_type=Message.TYPE_GROUP,
            is_deleted=False,
        )
        .exclude(sender=user)
        .exclude(read_receipts__user=user)
        .count()
    )


def broadcast_event(room_name: str, payload: dict):
    channel_layer = get_channel_layer()
    channel_layer.group_send(
        room_name,
        {
            'type': 'chat.event',
            'payload': payload,
        },
    )


class UsersSearchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('query', '').strip()
        if not query:
            return Response([], status=status.HTTP_200_OK)

        users = (
            User.objects
            .filter(Q(username__icontains=query) | Q(email__icontains=query))
            .exclude(userid=request.user.userid)
        )[:25]
        data = [{'id': u.userid, 'username': u.username} for u in users]
        return Response(data)


class FriendListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id: int):
        if request.user.userid != user_id:
            raise Http404

        friendships = Friendship.objects.friends_of(request.user)
        friends_payload = []
        for friendship in friendships:
            friend = friendship.friend_of(request.user)
            friends_payload.append({
                'friend_id': friend.userid,
                'friend_username': friend.username,
            })
        return Response(friends_payload)


class FriendSearchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id: int):
        if request.user.userid != user_id:
            raise Http404
        query = request.query_params.get('query', '').strip()
        friendships = Friendship.objects.friends_of(request.user)
        result = []
        for friendship in friendships:
            friend = friendship.friend_of(request.user)
            if query.lower() in friend.username.lower():
                result.append({
                    'friend_id': friend.userid,
                    'friend_username': friend.username,
                })
        return Response(result)


class FriendRequestListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id: int):
        if request.user.userid != user_id:
            raise Http404
        requests_qs = FriendRequest.objects.filter(receiver=request.user, status=FriendRequest.STATUS_PENDING)
        serializer = FriendRequestSerializer(requests_qs, many=True)
        return Response(serializer.data)


class FriendRequestCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        receiver_id = request.data.get('receiver_id')
        if not receiver_id:
            return Response({'detail': 'receiver_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        receiver = get_object_or_404(User, userid=receiver_id)
        if receiver == request.user:
            return Response({'detail': 'You cannot send a friend request to yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        if Friendship.objects.are_friends(request.user, receiver):
            return Response({'detail': 'You are already friends.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friend_request, created = FriendRequest.objects.get_or_create(
                sender=request.user,
                receiver=receiver,
                defaults={'status': FriendRequest.STATUS_PENDING},
            )
        except IntegrityError:
            created = False

        if not created:
            return Response({'detail': 'Friend request already sent.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = FriendRequestSerializer(friend_request)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class FriendRequestAcceptView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, request_id: int):
        friend_request = get_object_or_404(FriendRequest, pk=request_id, receiver=request.user)
        if friend_request.status != FriendRequest.STATUS_PENDING:
            return Response({'detail': 'Request already processed.'}, status=status.HTTP_400_BAD_REQUEST)

        friend_request.accept()
        return Response({'detail': 'Friend request accepted.'})


class UnreadCountsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id: int):
        if request.user.userid != user_id:
            raise Http404
        unread_map: Dict[int, int] = {}
        friendships = Friendship.objects.friends_of(request.user)
        for friendship in friendships:
            friend = friendship.friend_of(request.user)
            unread_map[friend.userid] = compute_unread_count(request.user, friend.userid)
        return Response(unread_map)


class LastMessageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, friend_id: int):
        friend = get_object_or_404(User, userid=friend_id)
        if not Friendship.objects.are_friends(request.user, friend):
            return Response({'detail': 'Not friends.'}, status=status.HTTP_400_BAD_REQUEST)

        message = (
            Message.objects
            .filter(
                message_type=Message.TYPE_INDIVIDUAL,
                is_deleted=False,
                Q(sender=request.user, receiver=friend) | Q(sender=friend, receiver=request.user),
            )
            .order_by('-created_at')
            .first()
        )
        if not message:
            return Response({'content': '', 'timestamp': None, 'sender_id': None, 'read': True, 'delivered': True, 'has_attachment': False})

        data = {
            'content': message.content,
            'timestamp': message.created_at,
            'sender_id': message.sender.userid,
            'read': message.read if message.receiver == request.user else True,
            'delivered': True,
            'has_attachment': message.has_attachment,
            'attachment_type': message.attachment_type,
        }
        return Response(data)


class MessageListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, identifier: int):
        friend = get_object_or_404(User, userid=identifier)
        if not Friendship.objects.are_friends(request.user, friend):
            raise Http404

        messages = (
            Message.objects
            .filter(
                message_type=Message.TYPE_INDIVIDUAL,
                Q(sender=request.user, receiver=friend) | Q(sender=friend, receiver=request.user),
            )
            .order_by('created_at')
            .select_related('sender', 'receiver', 'reply_to__sender')
            .prefetch_related('reactions')
        )

        # Mark unread messages as read for the requesting user
        unread_messages = [m for m in messages if m.receiver == request.user]
        for message in unread_messages:
            if not MessageReadReceipt.objects.filter(message=message, user=request.user).exists():
                MessageReadReceipt.objects.create(message=message, user=request.user)
                if message.message_type == Message.TYPE_INDIVIDUAL and not message.read:
                    message.read = True
                    message.save(update_fields=['read'])

        serializer = MessageSerializer(messages, many=True, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, identifier: int):
        message = get_object_or_404(Message, pk=identifier)
        if message.sender != request.user:
            return Response({'detail': 'You can only delete your own messages.'}, status=status.HTTP_403_FORBIDDEN)
        message.is_deleted = True
        message.content = ''
        message.save(update_fields=['is_deleted', 'content'])
        return Response({'detail': 'Message deleted.'}, status=status.HTTP_204_NO_CONTENT)


class MessageReactionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, message_id: int):
        message = get_object_or_404(Message, pk=message_id)
        emoji = request.data.get('emoji')
        action = request.data.get('action', 'add')
        if not emoji:
            return Response({'detail': 'emoji is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if message.message_type == Message.TYPE_INDIVIDUAL:
            if request.user not in [message.sender, message.receiver]:
                return Response({'detail': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)
            room = get_direct_room_name(message.sender.userid, message.receiver.userid)
        else:
            if not GroupMembership.objects.filter(group=message.group, user=request.user).exists():
                return Response({'detail': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)
            room = get_group_room_name(message.group_id)

        if action == 'remove':
            MessageReaction.objects.filter(message=message, user=request.user, emoji=emoji).delete()
        else:
            MessageReaction.objects.get_or_create(message=message, user=request.user, emoji=emoji)

        payload = {
            'event': 'reaction',
            'message_id': message.id,
            'emoji': emoji,
            'action': 'add' if action != 'remove' else 'remove',
            'targets': None,
        }
        broadcast_event(room, payload)
        return Response({'detail': 'Reaction updated.'})


class GroupListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id: int):
        if request.user.userid != user_id:
            raise Http404

        memberships = (
            GroupMembership.objects
            .filter(user=request.user)
            .select_related('group')
        )
        groups = [membership.group for membership in memberships]

        serialized = []
        for group in groups:
            member_count = group.memberships.count()
            admin_count = group.memberships.filter(is_admin=True).count()
            last_message = (
                group.chat_messages
                .filter(is_deleted=False)
                .order_by('-created_at')
                .first()
            )
            serialized.append({
                'id': group.id,
                'name': group.name,
                'description': group.description,
                'member_count': member_count,
                'admin_count': admin_count,
                'last_message': (last_message.content if last_message else ''),
                'last_message_time': (last_message.created_at if last_message else None),
                'last_message_has_attachment': bool(last_message and last_message.has_attachment),
                'last_message_attachment_type': (last_message.attachment_type if last_message else None),
            })
        serializer = ChatGroupSerializer(serialized, many=True)
        return Response(serializer.data)


class GroupCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        name = request.data.get('name', '').strip()
        description = request.data.get('description', '').strip()
        member_ids = request.data.get('member_ids', [])
        if not name:
            return Response({'detail': 'Group name is required.'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            group = ChatGroup.objects.create(name=name, description=description, created_by=request.user)
            GroupMembership.objects.create(group=group, user=request.user, is_admin=True)
            added_members = []
            for member_id in member_ids:
                member = User.objects.filter(userid=member_id).first()
                if not member or member == request.user:
                    continue
                if not Friendship.objects.are_friends(request.user, member):
                    continue
                GroupMembership.objects.get_or_create(group=group, user=member)
                added_members.append(member.username)
        return Response({'id': group.id, 'name': group.name, 'members_added': added_members}, status=status.HTTP_201_CREATED)


class GroupMemberManageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, group_id: int, action: str):
        group = get_object_or_404(ChatGroup, pk=group_id)
        membership = get_object_or_404(GroupMembership, group=group, user=request.user)
        if not membership.is_admin:
            return Response({'detail': 'Only group admins can perform this action.'}, status=status.HTTP_403_FORBIDDEN)

        target_user_id = request.data.get('user_id')
        target_user = get_object_or_404(User, userid=target_user_id)
        target_membership = GroupMembership.objects.filter(group=group, user=target_user).first()

        if action == 'add_member':
            if target_membership:
                return Response({'detail': 'User already in group.'}, status=status.HTTP_400_BAD_REQUEST)
            if not Friendship.objects.are_friends(request.user, target_user):
                return Response({'detail': 'You can only add friends to the group.'}, status=status.HTTP_400_BAD_REQUEST)
            GroupMembership.objects.create(group=group, user=target_user)
            return Response({'detail': 'Member added.'}, status=status.HTTP_201_CREATED)

        if not target_membership:
            return Response({'detail': 'User is not part of the group.'}, status=status.HTTP_400_BAD_REQUEST)

        if action == 'remove_member':
            if target_membership.is_admin and group.memberships.filter(is_admin=True).count() == 1:
                return Response({'detail': 'Assign a new admin before removing the last admin.'}, status=status.HTTP_400_BAD_REQUEST)
            target_membership.delete()
            return Response({'detail': 'Member removed.'})

        if action == 'make_admin':
            target_membership.is_admin = True
            target_membership.save(update_fields=['is_admin'])
            return Response({'detail': 'Member promoted to admin.'})

        if action == 'remove_admin':
            if group.memberships.filter(is_admin=True).count() == 1 and target_membership.is_admin:
                return Response({'detail': 'At least one admin is required.'}, status=status.HTTP_400_BAD_REQUEST)
            target_membership.is_admin = False
            target_membership.save(update_fields=['is_admin'])
            return Response({'detail': 'Admin role removed.'})

        return Response({'detail': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)


class GroupExitView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, group_id: int):
        group = get_object_or_404(ChatGroup, pk=group_id)
        membership = GroupMembership.objects.filter(group=group, user=request.user).first()
        if not membership:
            return Response({'detail': 'You are not part of this group.'}, status=status.HTTP_400_BAD_REQUEST)
        if membership.is_admin and group.memberships.filter(is_admin=True).count() == 1:
            return Response({'detail': 'Assign another admin before exiting.'}, status=status.HTTP_400_BAD_REQUEST)
        membership.delete()
        return Response({'detail': 'Exited the group.'})


class GroupInfoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, group_id: int):
        group = get_object_or_404(ChatGroup, pk=group_id)
        membership = GroupMembership.objects.filter(group=group, user=request.user).first()
        if not membership:
            raise Http404

        members = group.memberships.select_related('user').order_by('user__username')
        payload = {
            'id': group.id,
            'name': group.name,
            'description': group.description,
            'member_count': members.count(),
            'admin_count': members.filter(is_admin=True).count(),
            'current_user_is_admin': membership.is_admin,
            'members': [
                {
                    'user_id': m.user.userid,
                    'username': m.user.username,
                    'is_admin': m.is_admin,
                }
                for m in members
            ],
        }
        serializer = GroupInfoSerializer(payload)
        return Response(serializer.data)


class GroupMessagesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, group_id: int):
        group = get_object_or_404(ChatGroup, pk=group_id)
        if not GroupMembership.objects.filter(group=group, user=request.user).exists():
            raise Http404

        messages = (
            Message.objects
            .filter(group=group, message_type=Message.TYPE_GROUP)
            .order_by('created_at')
            .select_related('sender', 'reply_to__sender')
            .prefetch_related('reactions')
        )

        for message in messages:
            MessageReadReceipt.objects.get_or_create(message=message, user=request.user)

        serializer = MessageSerializer(messages, many=True, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, group_id: int):
        message = get_object_or_404(Message, pk=group_id, message_type=Message.TYPE_GROUP)
        if message.sender != request.user:
            return Response({'detail': 'You can only delete your own messages.'}, status=status.HTTP_403_FORBIDDEN)
        message.is_deleted = True
        message.content = ''
        message.save(update_fields=['is_deleted', 'content'])
        return Response({'detail': 'Message deleted.'}, status=status.HTTP_204_NO_CONTENT)


class GroupUnreadCountsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id: int):
        if request.user.userid != user_id:
            raise Http404
        unread_map: Dict[int, int] = {}
        memberships = GroupMembership.objects.filter(user=request.user)
        for membership in memberships:
            unread_map[membership.group_id] = compute_group_unread_count(request.user, membership.group)
        return Response(unread_map)


class MessageUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, scope: str, target_id: int):
        uploaded_file = request.FILES.get('file')
        text_content = request.data.get('message', '').strip()
        reply_to_id = request.data.get('reply_to_message_id')

        reply_to = None
        if reply_to_id:
            reply_to = Message.objects.filter(pk=reply_to_id).first()

        if scope == 'individual':
            receiver = get_object_or_404(User, userid=target_id)
            if not Friendship.objects.are_friends(request.user, receiver):
                return Response({'detail': 'You are not friends.'}, status=status.HTTP_400_BAD_REQUEST)
            room_name = get_direct_room_name(request.user.userid, receiver.userid)
            message = Message.objects.create(
                sender=request.user,
                receiver=receiver,
                content=text_content,
                reply_to=reply_to,
                delivered=True,
            )
        else:
            group = get_object_or_404(ChatGroup, pk=target_id)
            if not GroupMembership.objects.filter(group=group, user=request.user).exists():
                return Response({'detail': 'You are not part of this group.'}, status=status.HTTP_403_FORBIDDEN)
            room_name = get_group_room_name(group.id)
            message = Message.objects.create(
                sender=request.user,
                group=group,
                content=text_content,
                reply_to=reply_to,
            )

        if uploaded_file:
            message.attachment = uploaded_file
            message.attachment_original_name = uploaded_file.name
            message.attachment_type = determine_attachment_type(uploaded_file.name)
            message.save(update_fields=['attachment', 'attachment_original_name', 'attachment_type', 'content'])
        else:
            message.save(update_fields=['content'])

        MessageReadReceipt.objects.get_or_create(message=message, user=request.user)

        serializer = MessageSerializer(message, context={'request': request})

        payload = {
            'event': 'file' if message.has_attachment else ('reply' if message.reply_to else 'message'),
            'message_id': message.id,
            'sender_id': request.user.userid,
            'timestamp': message.created_at.isoformat(),
            'targets': None,
        }

        if message.message_type == Message.TYPE_INDIVIDUAL:
            unread_count = compute_unread_count(message.receiver, request.user.userid)
            payload.update({
                'receiver_id': message.receiver.userid,
                'content': message.content,
                'unread_for_receiver': unread_count,
            })
            if message.has_attachment:
                payload.update({
                    'filename': message.attachment_original_name,
                    'file_type': message.attachment_type,
                    'file_url': serializer.data.get('attachment_url'),
                    'reply_to_id': message.reply_to_id,
                })
            elif message.reply_to:
                payload.update({'reply_to_id': message.reply_to_id, 'content': message.content})
            else:
                payload.update({'content': message.content})
        else:
            payload.update({
                'group_id': message.group_id,
                'content': message.content,
                'reply_to_id': message.reply_to_id,
                'filename': message.attachment_original_name,
                'file_type': message.attachment_type,
                'file_url': serializer.data.get('attachment_url'),
            })

        broadcast_event(room_name, payload)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
