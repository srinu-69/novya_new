from __future__ import annotations

import mimetypes
from datetime import datetime, timedelta
from typing import Any

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from authentication.models import StudentRegistration

from .models import (
  DirectMessage,
  DirectMessageReaction,
  FriendRequest,
  Friendship,
  GroupMembership,
  GroupMessage,
  GroupMessageReaction,
  GroupMessageRead,
  StudyGroup,
  GroupUnreadCount,
)
from .serializers import DirectMessageSerializer, FriendRequestSerializer, GroupMessageSerializer
from .services import (
  accept_friend_request,
  ensure_friendships_synced,
  get_direct_unread_count,
  get_group_with_membership,
  get_or_create_friendship,
  get_or_create_thread,
  increment_direct_unread_count,
  increment_group_unread_count,
  last_direct_message_summary,
  latest_group_message_info,
  mark_group_messages_as_read,
  normalize_friendship_pair,
  reset_direct_unread_count,
  reset_group_unread_count,
  unread_direct_count_for_user,
  unread_group_count_for_user,
)
from . import realtime

User = get_user_model()

_USER_FALLBACK_VALUES = {"", "nan", "null", "undefined"}
_STUDYROOM_TOKEN_TTL = timedelta(days=30)


def _generate_studyroom_token(user: User) -> str:
  payload = {
    "user_id": user.userid,
    "exp": datetime.utcnow() + _STUDYROOM_TOKEN_TTL,
    "iat": datetime.utcnow(),
  }
  return jwt.encode(payload, settings.STUDYROOM_JWT_SECRET, algorithm="HS256")


@api_view(["POST"])
@permission_classes([AllowAny])
def studyroom_signup(request):
  username = (request.data.get("username") or "").strip()
  email = (request.data.get("email") or "").strip().lower()
  password = request.data.get("password") or ""
  firstname = (request.data.get("firstname") or request.data.get("first_name") or "").strip()
  lastname = (request.data.get("lastname") or request.data.get("last_name") or "").strip()

  if not username or not email or not password:
    return Response({"detail": "Username, email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

  if User.objects.filter(username__iexact=username).exists():
    return Response({"detail": "Username already taken."}, status=status.HTTP_400_BAD_REQUEST)

  if User.objects.filter(email__iexact=email).exists():
    return Response({"detail": "Email already registered."}, status=status.HTTP_400_BAD_REQUEST)

  user = User.objects.create_user(
    username=username,
    email=email,
    password=password,
    firstname=firstname,
    lastname=lastname,
  )
  user.role = getattr(user, "role", "Student") or "Student"
  user.save(update_fields=["role"])

  token = _generate_studyroom_token(user)
  return Response(
    {
      "msg": "User created successfully",
      "access_token": token,
      "username": user.username,
      "user_id": user.userid,
    },
    status=status.HTTP_201_CREATED,
  )


@api_view(["POST"])
@permission_classes([AllowAny])
def studyroom_login(request):
  email = (request.data.get("email") or "").strip().lower()
  username = (request.data.get("username") or "").strip()
  password = request.data.get("password") or ""

  if not password or not (email or username):
    return Response({"detail": "Email/username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

  user = None
  if email:
    user = User.objects.filter(email__iexact=email).first()
  if not user and username:
    user = User.objects.filter(username__iexact=username).first()

  if not user or not user.check_password(password):
    return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

  token = _generate_studyroom_token(user)
  return Response(
    {
      "access_token": token,
      "username": user.username,
      "user_id": user.userid,
    },
    status=status.HTTP_200_OK,
  )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def studyroom_refresh_token(request):
  token = _generate_studyroom_token(request.user)
  return Response(
    {
      "access_token": token,
      "username": request.user.username,
      "user_id": request.user.userid,
      "expires_in": int(_STUDYROOM_TOKEN_TTL.total_seconds()),
    },
    status=status.HTTP_200_OK,
  )


def _normalise_user_id(user_value, request_user_id: int) -> int:
  if isinstance(user_value, int):
    return user_value
  candidate = request_user_id if user_value is None else str(user_value).strip()
  if candidate.lower() in _USER_FALLBACK_VALUES:
    return request_user_id
  return int(candidate)


def _ensure_same_user(request, user_value) -> tuple[int | None, Response | None]:
  try:
    resolved_user_id = _normalise_user_id(user_value, request.user.userid)
  except (TypeError, ValueError):
    return None, Response({"detail": "Invalid user id supplied."}, status=status.HTTP_400_BAD_REQUEST)
  if resolved_user_id != request.user.userid and not request.user.is_staff:
    return None, Response({"detail": "You are not authorized to access this resource."}, status=status.HTTP_403_FORBIDDEN)
  return resolved_user_id, None


def _determine_attachment_type(filename: str) -> str:
  mime_type, _ = mimetypes.guess_type(filename)
  if not mime_type:
    return "document"
  if mime_type.startswith("image/"):
    return "image"
  if mime_type.startswith("video/"):
    return "video"
  if mime_type.startswith("audio/"):
    return "audio"
  return "document"


def _friend_list_payload(user: User) -> list[dict[str, Any]]:
  ensure_friendships_synced(user)
  friendships = (
    Friendship.objects.filter(Q(user1=user) | Q(user2=user))
    .select_related("user1", "user2")
    .order_by("-created_at")
  )
  unread_map = unread_direct_count_for_user(user.userid)
  friends: list[dict[str, Any]] = []
  for friendship in friendships:
    friend = friendship.user1 if friendship.user1_id != user.userid else friendship.user2
    if not friend:
      continue
    friends.append(
      {
        "friend_id": friend.userid,
        "friend_username": friend.username,
        "friend_firstname": friend.firstname,
        "friend_lastname": friend.lastname,
        "unread_count": unread_map.get(friend.userid, 0),
      }
    )
  return sorted(friends, key=lambda entry: entry["friend_username"].lower())


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_users(request):
  query = request.GET.get("query", "").strip()
  if not query:
    return Response([], status=status.HTTP_200_OK)
  registrations = StudentRegistration.objects.filter(
    Q(student_username__icontains=query)
    | Q(first_name__icontains=query)
    | Q(last_name__icontains=query)
  ).values("student_username", "first_name", "last_name")[:50]
  registration_usernames = {
    entry["student_username"] for entry in registrations if entry["student_username"]
  }
  user_filters = (
    Q(username__icontains=query)
    | Q(firstname__icontains=query)
    | Q(lastname__icontains=query)
  )
  if registration_usernames:
    user_filters |= Q(username__in=registration_usernames)
  matched_users = (
    User.objects.filter(user_filters)
    .exclude(userid=request.user.userid)
    .order_by("username")
    .distinct()
  )
  registration_lookup = {
    entry["student_username"]: entry for entry in registrations
  }
  payload = []
  seen = set()
  for user in matched_users:
    if user.userid in seen:
      continue
    seen.add(user.userid)
    registration = registration_lookup.get(user.username)
    payload.append(
      {
        "id": user.userid,
        "username": user.username,
        "firstname": user.firstname or (registration or {}).get("first_name") or "",
        "lastname": user.lastname or (registration or {}).get("last_name") or "",
      }
    )
  return Response(payload, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_friend_requests(request, user_id: int):
  resolved_id, error = _ensure_same_user(request, user_id)
  if error:
    return error
  requests_qs = (
    FriendRequest.objects.filter(receiver_id=resolved_id, status=FriendRequest.STATUS_PENDING)
    .select_related("sender")
    .order_by("-created_at")
  )
  serializer = FriendRequestSerializer(requests_qs, many=True)
  return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_friend_request(request):
  receiver_id = request.data.get("receiver_id")
  if not receiver_id:
    return Response({"detail": "receiver_id is required."}, status=status.HTTP_400_BAD_REQUEST)
  if receiver_id == request.user.userid:
    return Response({"detail": "You cannot send a friend request to yourself."}, status=status.HTTP_400_BAD_REQUEST)
  receiver = User.objects.filter(userid=receiver_id).first()
  if not receiver:
    return Response({"detail": "Receiver not found."}, status=status.HTTP_404_NOT_FOUND)
  ordered = normalize_friendship_pair(request.user.userid, receiver_id)
  if Friendship.objects.filter(user1_id=ordered[0], user2_id=ordered[1]).exists():
    return Response({"detail": "You are already friends."}, status=status.HTTP_400_BAD_REQUEST)
  existing_request = FriendRequest.objects.filter(
    Q(sender=request.user, receiver=receiver) | Q(sender=receiver, receiver=request.user),
    status=FriendRequest.STATUS_PENDING,
  ).first()
  if existing_request:
    return Response({"detail": "Friend request already pending."}, status=status.HTTP_400_BAD_REQUEST)
  friend_request = FriendRequest.objects.create(sender=request.user, receiver=receiver)
  serializer = FriendRequestSerializer(friend_request)
  return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def accept_friend_request_view(request, request_id: int):
  friend_request = get_object_or_404(
    FriendRequest,
    pk=request_id,
    receiver=request.user,
    status=FriendRequest.STATUS_PENDING,
  )
  friendship = accept_friend_request(friend_request)
  friend = friendship.user1 if friendship.user1 != request.user else friendship.user2
  payload = {
    "friend_id": friend.userid,
    "friend_username": friend.username,
    "friend_firstname": friend.firstname,
    "friend_lastname": friend.lastname,
    "unread_count": 0,
  }
  return Response(payload, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_friends(request, user_id: int):
  _, error = _ensure_same_user(request, user_id)
  if error:
    return error
  payload = _friend_list_payload(request.user)
  return Response(payload, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_friends(request, user_id: int):
  _, error = _ensure_same_user(request, user_id)
  if error:
    return error
  query = request.GET.get("query", "").strip().lower()
  friends = _friend_list_payload(request.user)
  if query:
    friends = [
      friend
      for friend in friends
      if query in friend["friend_username"].lower()
      or (friend["friend_firstname"] and query in friend["friend_firstname"].lower())
      or (friend["friend_lastname"] and query in friend["friend_lastname"].lower())
    ]
  return Response(friends, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def unread_counts(request, user_id: int):
  resolved_id, error = _ensure_same_user(request, user_id)
  if error:
    return error
  data = unread_direct_count_for_user(resolved_id)
  return Response(data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def unread_count(request, friend_id: int):
  ordered = normalize_friendship_pair(request.user.userid, friend_id)
  if not Friendship.objects.filter(user1_id=ordered[0], user2_id=ordered[1]).exists():
    return Response({"detail": "Friendship not found."}, status=status.HTTP_404_NOT_FOUND)
  count = get_direct_unread_count(request.user.userid, friend_id)
  return Response({"unread_count": count}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def group_unread_counts(request, user_id: int):
  _, error = _ensure_same_user(request, user_id)
  if error:
    return error
  data = unread_group_count_for_user(request.user)
  return Response(data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_groups(request, user_id: int):
  _, error = _ensure_same_user(request, user_id)
  if error:
    return error
  groups = (
    StudyGroup.objects.filter(memberships__user=request.user)
    .annotate(member_count=Count("memberships", distinct=True))
    .order_by("name")
  )
  serialized = []
  for group in groups:
    latest = latest_group_message_info(group.id)
    serialized.append(
      {
        "id": group.id,
        "name": group.name,
        "description": group.description,
        "member_count": group.member_count,
        "last_message": latest.get("last_message") if latest else "",
        "last_message_time": latest.get("last_message_time") if latest else None,
        "last_message_has_attachment": latest.get("last_message_has_attachment") if latest else False,
        "last_message_attachment_type": latest.get("last_message_attachment_type") if latest else "",
      }
    )
  return Response(serialized, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def create_group(request):
  name = request.data.get("name", "").strip()
  description = request.data.get("description", "").strip()
  member_ids = request.data.get("member_ids") or []
  if not name:
    return Response({"detail": "Group name is required."}, status=status.HTTP_400_BAD_REQUEST)
  if not isinstance(member_ids, list) or not member_ids:
    return Response({"detail": "Select at least one friend to create a group."}, status=status.HTTP_400_BAD_REQUEST)
  members = User.objects.filter(userid__in=member_ids).distinct()
  if members.count() != len(member_ids):
    return Response({"detail": "One or more selected members do not exist."}, status=status.HTTP_400_BAD_REQUEST)
  group = StudyGroup.objects.create(name=name, description=description, creator=request.user)
  GroupMembership.objects.create(group=group, user=request.user, is_admin=True)
  for user in members:
    GroupMembership.objects.get_or_create(group=group, user=user, defaults={"is_admin": False})
  serialized = {
    "id": group.id,
    "name": group.name,
    "description": group.description,
    "member_count": group.memberships.count(),
    "last_message": "",
    "last_message_time": None,
    "last_message_has_attachment": False,
    "last_message_attachment_type": "",
  }
  return Response(serialized, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def group_info(request, group_id: int):
  group, membership = get_group_with_membership(group_id, request.user)
  members = (
    group.memberships.select_related("user")
    .order_by("user__username")
  )
  member_payload = [
    {
      "user_id": item.user.userid,
      "username": item.user.username,
      "firstname": item.user.firstname,
      "lastname": item.user.lastname,
      "is_admin": item.is_admin,
    }
    for item in members
  ]
  data = {
    "id": group.id,
    "name": group.name,
    "description": group.description,
    "member_count": len(member_payload),
    "admin_count": sum(1 for item in members if item.is_admin),
    "members": member_payload,
    "current_user_is_admin": membership.is_admin,
  }
  return Response(data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def add_member(request, group_id: int):
  group, membership = get_group_with_membership(group_id, request.user)
  if not membership.is_admin:
    return Response({"detail": "Only admins can add members."}, status=status.HTTP_403_FORBIDDEN)
  user_id = request.data.get("user_id")
  if not user_id:
    return Response({"detail": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST)
  user = User.objects.filter(userid=user_id).first()
  if not user:
    return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
  GroupMembership.objects.get_or_create(group=group, user=user, defaults={"is_admin": False})
  return Response({"detail": "Member added successfully."}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def remove_member(request, group_id: int):
  group, membership = get_group_with_membership(group_id, request.user)
  if not membership.is_admin:
    return Response({"detail": "Only admins can remove members."}, status=status.HTTP_403_FORBIDDEN)
  user_id = request.data.get("user_id")
  if not user_id:
    return Response({"detail": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST)
  member = GroupMembership.objects.filter(group=group, user_id=user_id).first()
  if not member:
    return Response({"detail": "Member not found."}, status=status.HTTP_404_NOT_FOUND)
  if member.is_admin and group.memberships.filter(is_admin=True).count() <= 1:
    return Response({"detail": "Cannot remove the last admin from the group."}, status=status.HTTP_400_BAD_REQUEST)
  member.delete()
  GroupUnreadCount.objects.filter(group=group, user_id=user_id).delete()
  return Response({"detail": "Member removed successfully."}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def make_admin(request, group_id: int):
  group, membership = get_group_with_membership(group_id, request.user)
  if not membership.is_admin:
    return Response({"detail": "Only admins can promote members."}, status=status.HTTP_403_FORBIDDEN)
  user_id = request.data.get("user_id")
  member = GroupMembership.objects.filter(group=group, user_id=user_id).first()
  if not member:
    return Response({"detail": "Member not found."}, status=status.HTTP_404_NOT_FOUND)
  member.is_admin = True
  member.save(update_fields=["is_admin"])
  return Response({"detail": "Member promoted to admin."}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def remove_admin(request, group_id: int):
  group, membership = get_group_with_membership(group_id, request.user)
  if not membership.is_admin:
    return Response({"detail": "Only admins can update admin privileges."}, status=status.HTTP_403_FORBIDDEN)
  user_id = request.data.get("user_id")
  member = GroupMembership.objects.filter(group=group, user_id=user_id).first()
  if not member:
    return Response({"detail": "Member not found."}, status=status.HTTP_404_NOT_FOUND)
  if group.memberships.filter(is_admin=True).count() <= 1:
    return Response({"detail": "At least one admin is required in the group."}, status=status.HTTP_400_BAD_REQUEST)
  member.is_admin = False
  member.save(update_fields=["is_admin"])
  return Response({"detail": "Admin role removed."}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def exit_group(request, group_id: int):
  group, membership = get_group_with_membership(group_id, request.user)
  if membership.is_admin and group.memberships.filter(is_admin=True).count() <= 1:
    return Response({"detail": "Assign another admin before leaving the group."}, status=status.HTTP_400_BAD_REQUEST)
  membership.delete()
  GroupUnreadCount.objects.filter(group=group, user_id=request.user.userid).delete()
  return Response({"detail": "Exited group successfully."}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def last_message(request, friend_id: int):
  ordered = normalize_friendship_pair(request.user.userid, friend_id)
  if not Friendship.objects.filter(user1_id=ordered[0], user2_id=ordered[1]).exists():
    return Response({}, status=status.HTTP_200_OK)
  summary = last_direct_message_summary(request.user.userid, friend_id)
  return Response(summary or {}, status=status.HTTP_200_OK)


def _serialize_direct_messages(queryset, request):
  serializer = DirectMessageSerializer(queryset, many=True, context={"request": request})
  return serializer.data


def _serialize_group_messages(queryset, request):
  serializer = GroupMessageSerializer(queryset, many=True, context={"request": request})
  return serializer.data


def _list_direct_messages_response(request, friend_id: int) -> Response:
  try:
    ordered = normalize_friendship_pair(request.user.userid, friend_id)
  except ValueError:
    return Response({"detail": "Invalid friend identifier."}, status=status.HTTP_400_BAD_REQUEST)
  friendship = Friendship.objects.filter(user1_id=ordered[0], user2_id=ordered[1]).first()
  if not friendship:
    friendship = get_or_create_friendship(request.user.userid, friend_id)
  thread = get_or_create_thread(request.user.userid, friend_id)
  messages = (
    DirectMessage.objects.filter(thread=thread)
    .select_related("sender", "receiver", "reply_to__sender")
    .prefetch_related("reaction_entries__user")
    .order_by("created_at")
  )
  DirectMessage.objects.filter(
    thread=thread,
    receiver=request.user,
    read_at__isnull=True,
  ).update(read_at=timezone.now())
  reset_direct_unread_count(request.user.userid, friend_id)
  serialized = _serialize_direct_messages(messages, request)
  # Broadcast unread update for counterparty
  unread_count = get_direct_unread_count(friend_id, request.user.userid)
  payload = {
    "event": "unread_update",
    "friend_id": request.user.userid,
    "unread_count": unread_count,
  }
  realtime.broadcast_direct_event(request.user.userid, friend_id, payload)
  return Response(serialized, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_direct_messages(request, friend_id: int):
  return _list_direct_messages_response(request, friend_id)


def _list_group_messages_response(request, group_id: int) -> Response:
  group, membership = get_group_with_membership(group_id, request.user)
  messages = (
    GroupMessage.objects.filter(group=group)
    .select_related("sender", "reply_to__sender")
    .prefetch_related("reaction_entries__user")
    .order_by("created_at")
  )
  serialized = _serialize_group_messages(messages, request)
  marked = mark_group_messages_as_read(group, request.user)
  reset_group_unread_count(request.user.userid, group.id)
  if marked:
    payload = {
      "event": "unread_update",
      "group_id": group.id,
      "unread_count": 0,
    }
    realtime.broadcast_group_event(group.id, payload)
  return Response(serialized, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_group_messages(request, group_id: int):
  return _list_group_messages_response(request, group_id)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def react_to_direct_message(request, message_id: int):
  message = get_object_or_404(DirectMessage, pk=message_id)
  if request.user not in (message.sender, message.receiver):
    return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
  emoji = request.data.get("emoji")
  action = request.data.get("action", "add")
  if not emoji:
    return Response({"detail": "emoji is required."}, status=status.HTTP_400_BAD_REQUEST)
  if action == "add":
    DirectMessageReaction.objects.get_or_create(message=message, user=request.user, emoji=emoji)
  elif action == "remove":
    DirectMessageReaction.objects.filter(message=message, user=request.user, emoji=emoji).delete()
  else:
    return Response({"detail": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)
  payload = {
    "event": "reaction",
    "message_id": message.id,
    "emoji": emoji,
    "action": action,
  }
  realtime.broadcast_direct_event(message.sender_id, message.receiver_id, payload)
  return Response({"detail": "Reaction updated."}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def react_to_group_message(request, message_id: int):
  message = get_object_or_404(GroupMessage.objects.select_related("group"), pk=message_id)
  membership = GroupMembership.objects.filter(group=message.group, user=request.user).first()
  if not membership:
    return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
  emoji = request.data.get("emoji")
  action = request.data.get("action", "add")
  if not emoji:
    return Response({"detail": "emoji is required."}, status=status.HTTP_400_BAD_REQUEST)
  if action == "add":
    GroupMessageReaction.objects.get_or_create(message=message, user=request.user, emoji=emoji)
  elif action == "remove":
    GroupMessageReaction.objects.filter(message=message, user=request.user, emoji=emoji).delete()
  else:
    return Response({"detail": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)
  payload = {
    "event": "reaction",
    "message_id": message.id,
    "emoji": emoji,
    "action": action,
  }
  realtime.broadcast_group_event(message.group_id, payload)
  return Response({"detail": "Reaction updated."}, status=status.HTTP_200_OK)


@transaction.atomic
def _delete_direct_message_response(request, message_id: int) -> Response:
  message = get_object_or_404(DirectMessage, pk=message_id)
  if request.user not in (message.sender, message.receiver):
    return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
  message.is_deleted = True
  message.content = ""
  message.save(update_fields=["is_deleted", "content", "updated_at"])
  return Response({"detail": "Message deleted."}, status=status.HTTP_200_OK)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def delete_direct_message(request, message_id: int):
  return _delete_direct_message_response(request, message_id)


@transaction.atomic
def _delete_group_message_response(request, message_id: int) -> Response:
  message = get_object_or_404(GroupMessage.objects.select_related("group"), pk=message_id)
  membership = GroupMembership.objects.filter(group=message.group, user=request.user).first()
  if not membership:
    return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
  if request.user != message.sender and not membership.is_admin:
    return Response({"detail": "Only the sender or a group admin can delete this message."}, status=status.HTTP_403_FORBIDDEN)
  message.is_deleted = True
  message.content = ""
  message.save(update_fields=["is_deleted", "content", "updated_at"])
  return Response({"detail": "Message deleted."}, status=status.HTTP_200_OK)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def delete_group_message(request, message_id: int):
  return _delete_group_message_response(request, message_id)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def upload_individual_attachment(request, friend_id: int):
  ordered = normalize_friendship_pair(request.user.userid, friend_id)
  friendship = Friendship.objects.filter(user1_id=ordered[0], user2_id=ordered[1]).first()
  if not friendship:
    return Response({"detail": "Friendship not found."}, status=status.HTTP_404_NOT_FOUND)
  uploaded_file = request.FILES.get("file")
  if not uploaded_file:
    return Response({"detail": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)
  message_text = request.data.get("message", "").strip()
  reply_to_id = request.data.get("reply_to_message_id")
  reply_to = None
  if reply_to_id:
    reply_to = DirectMessage.objects.filter(id=reply_to_id).first()
  thread = get_or_create_thread(request.user.userid, friend_id)
  attachment_type = _determine_attachment_type(uploaded_file.name)
  if not message_text:
    message_text = f"Sent a {attachment_type}"
  message = DirectMessage.objects.create(
    thread=thread,
    sender=request.user,
    receiver_id=friend_id,
    content=message_text,
    attachment=uploaded_file,
    attachment_type=attachment_type,
    attachment_filename=uploaded_file.name,
    reply_to=reply_to,
  )
  if realtime.is_direct_connection_active(friend_id, request.user.userid):
    if not message.delivered_at:
      message.delivered_at = timezone.now()
      message.save(update_fields=["delivered_at"])
    reset_direct_unread_count(friend_id, request.user.userid)
    unread_count = 0
  else:
    unread_count = increment_direct_unread_count(friend_id, request.user.userid)
  response = DirectMessageSerializer(message, context={"request": request})
  realtime.broadcast_direct_file(message, message_text, reply_to_id=reply_to_id)
  realtime.broadcast_direct_unread_update(friend_id, request.user.userid, unread_count)
  return Response(response.data, status=status.HTTP_201_CREATED)


@api_view(["GET", "DELETE"])
@permission_classes([IsAuthenticated])
def direct_messages_entry(request, identifier: int):
  if request.method == "GET":
    return _list_direct_messages_response(request, identifier)
  return _delete_direct_message_response(request, identifier)


@api_view(["GET", "DELETE"])
@permission_classes([IsAuthenticated])
def group_messages_entry(request, identifier: int):
  if request.method == "GET":
    return _list_group_messages_response(request, identifier)
  return _delete_group_message_response(request, identifier)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def upload_group_attachment(request, group_id: int):
  group, membership = get_group_with_membership(group_id, request.user)
  uploaded_file = request.FILES.get("file")
  if not uploaded_file:
    return Response({"detail": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)
  message_text = request.data.get("message", "").strip()
  reply_to_id = request.data.get("reply_to_message_id")
  reply_to = None
  if reply_to_id:
    reply_to = GroupMessage.objects.filter(id=reply_to_id, group=group).first()
  attachment_type = _determine_attachment_type(uploaded_file.name)
  if not message_text:
    message_text = f"Sent a {attachment_type}"
  message = GroupMessage.objects.create(
    group=group,
    sender=request.user,
    content=message_text,
    attachment=uploaded_file,
    attachment_type=attachment_type,
    attachment_filename=uploaded_file.name,
    reply_to=reply_to,
  )
  GroupMessageRead.objects.get_or_create(message=message, user=request.user)
  active_members = realtime.active_group_members(group.id)
  member_ids = list(
    group.memberships.exclude(user=request.user).values_list("user_id", flat=True)
  )
  for member_id in member_ids:
    if member_id in active_members:
      reset_group_unread_count(member_id, group.id)
    else:
      increment_group_unread_count(member_id, group.id)
  response = GroupMessageSerializer(message, context={"request": request})
  realtime.broadcast_group_file(message, message_text, reply_to_id=reply_to_id)
  return Response(response.data, status=status.HTTP_201_CREATED)

