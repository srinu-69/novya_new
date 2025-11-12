from __future__ import annotations

from typing import Iterable, Optional, Tuple

from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Case, Count, F, IntegerField, Max, Q, When
from django.utils import timezone

from .models import (
  DirectChatThread,
  DirectMessage,
  FriendRequest,
  Friendship,
  GroupMembership,
  GroupMessage,
  GroupMessageRead,
  StudyGroup,
  GroupUnreadCount,
  UnreadCount,
)

User = get_user_model()

try:
  from chat.models import Friendship as LegacyFriendship
except Exception:  # pragma: no cover - legacy app might be removed
  LegacyFriendship = None  # type: ignore[assignment]


def normalize_friendship_pair(user_id: int, friend_id: int) -> Tuple[int, int]:
  if user_id == friend_id:
    raise ValueError("user and friend cannot be the same id")
  return (user_id, friend_id) if user_id < friend_id else (friend_id, user_id)


def get_or_create_friendship(user_id: int, friend_id: int) -> Friendship:
  ordered = normalize_friendship_pair(user_id, friend_id)
  friendship = Friendship.objects.filter(user1_id=ordered[0], user2_id=ordered[1]).first()
  if friendship:
    return friendship
  if LegacyFriendship is not None:
    legacy_exists = LegacyFriendship.objects.filter(user_one_id=ordered[0], user_two_id=ordered[1]).exists()
    if legacy_exists:
      friendship = Friendship.objects.create(user1_id=ordered[0], user2_id=ordered[1])
      return friendship
  friendship, _created = Friendship.objects.get_or_create(user1_id=ordered[0], user2_id=ordered[1])
  return friendship


def ensure_friendships_synced(user: User) -> None:
  if LegacyFriendship is None:
    return
  legacy_friendships = LegacyFriendship.objects.filter(Q(user_one=user) | Q(user_two=user)).values(
    "user_one_id", "user_two_id"
  )
  for entry in legacy_friendships:
    try:
      ordered = normalize_friendship_pair(entry["user_one_id"], entry["user_two_id"])
    except ValueError:
      continue
    Friendship.objects.get_or_create(user1_id=ordered[0], user2_id=ordered[1])


def get_or_create_thread(user_id: int, friend_id: int) -> DirectChatThread:
  friendship = get_or_create_friendship(user_id, friend_id)
  thread, _ = DirectChatThread.objects.get_or_create(friendship=friendship)
  return thread


def get_friends_for_user(user: User):
  friendships = Friendship.objects.filter(Q(user1=user) | Q(user2=user)).annotate(
    friend_id=CaseWhenFriendId(user)
  )
  friend_ids = [item.friend_id for item in friendships]
  return (
    User.objects.filter(userid__in=friend_ids)
    .values("userid", "username", "firstname", "lastname")
    .order_by("username")
  )


class CaseWhenFriendId:
  """
  Helper to annotate friend id from friendship queryset.
  """

  def __new__(cls, user: User):
    return Case(
      When(user1=user, then=F("user2")),
      default=F("user1"),
      output_field=IntegerField(),
    )


def unread_direct_count_for_user(user_id: int) -> dict[int, int]:
  counts = dict(
    UnreadCount.objects.filter(user_id=user_id).values_list("friend_id", "count")
  )
  if counts:
    return counts
  # Fallback for legacy data without counter entries
  messages = (
    DirectMessage.objects.filter(receiver_id=user_id, read_at__isnull=True, is_deleted=False)
    .values("sender_id")
    .annotate(total=Count("id"))
  )
  recalculated = {row["sender_id"]: row["total"] for row in messages}
  if recalculated:
    # Seed counters for future fast lookups
    for friend_id, total in recalculated.items():
      UnreadCount.objects.update_or_create(
        user_id=user_id,
        friend_id=friend_id,
        defaults={"count": total},
      )
  return recalculated


def unread_group_count_for_user(user: User) -> dict[int, int]:
  counts = dict(
    GroupUnreadCount.objects.filter(user_id=user.userid).values_list("group_id", "count")
  )
  if counts:
    return counts
  membership_ids = GroupMembership.objects.filter(user=user).values_list("group_id", flat=True)
  recalculated = {}
  for group_id in membership_ids:
    unread = (
      GroupMessage.objects.filter(group_id=group_id)
      .exclude(read_receipts__user=user)
      .count()
    )
    if unread:
      GroupUnreadCount.objects.update_or_create(
        user_id=user.userid,
        group_id=group_id,
        defaults={"count": unread},
      )
    recalculated[group_id] = unread
  return recalculated


def last_direct_message_summary(user_id: int, friend_id: int) -> Optional[dict]:
  ordered = normalize_friendship_pair(user_id, friend_id)
  try:
    friendship = Friendship.objects.get(user1_id=ordered[0], user2_id=ordered[1])
  except Friendship.DoesNotExist:
    return None
  message = (
    DirectMessage.objects.filter(thread__friendship=friendship)
    .order_by("-created_at")
    .first()
  )
  if not message:
    return None
  return {
    "content": message.content,
    "timestamp": message.created_at,
    "sender_id": message.sender_id,
    "read": message.read_at is not None,
    "delivered": True,
    "has_attachment": message.has_attachment,
    "attachment_type": message.attachment_type,
  }


def latest_group_message_info(group_id: int) -> dict | None:
  message = GroupMessage.objects.filter(group_id=group_id).order_by("-created_at").first()
  if not message:
    return None
  return {
    "last_message": message.content,
    "last_message_time": message.created_at,
    "last_message_has_attachment": message.has_attachment,
    "last_message_attachment_type": message.attachment_type,
  }


@transaction.atomic
def accept_friend_request(request_obj: FriendRequest) -> Friendship:
  request_obj.mark_response(FriendRequest.STATUS_ACCEPTED)
  friendship = get_or_create_friendship(request_obj.sender_id, request_obj.receiver_id)
  DirectChatThread.objects.get_or_create(friendship=friendship)
  return friendship


def get_group_with_membership(group_id: int, user: User) -> tuple[StudyGroup, GroupMembership]:
  group = StudyGroup.objects.prefetch_related("memberships__user").get(id=group_id)
  membership = group.memberships.filter(user=user).first()
  if not membership:
    raise ValueError("User is not a member of this group.")
  return group, membership


def mark_group_messages_as_read(group: StudyGroup, user: User) -> int:
  unread_messages = group.messages.exclude(read_receipts__user=user)
  created = 0
  for message in unread_messages:
    GroupMessageRead.objects.get_or_create(message=message, user=user)
    created += 1
  if created:
    GroupUnreadCount.objects.update_or_create(
      user_id=user.userid,
      group=group,
      defaults={"count": 0},
    )
  return created


def increment_direct_unread_count(user_id: int, friend_id: int) -> int:
  if user_id == friend_id:
    return 0
  updated = UnreadCount.objects.filter(user_id=user_id, friend_id=friend_id).update(count=F("count") + 1)
  if not updated:
    obj, _ = UnreadCount.objects.get_or_create(
      user_id=user_id,
      friend_id=friend_id,
      defaults={"count": 1},
    )
    return obj.count
  return UnreadCount.objects.filter(user_id=user_id, friend_id=friend_id).values_list("count", flat=True).first() or 0


def reset_direct_unread_count(user_id: int, friend_id: int) -> None:
  UnreadCount.objects.update_or_create(
    user_id=user_id,
    friend_id=friend_id,
    defaults={"count": 0},
  )


def get_direct_unread_count(user_id: int, friend_id: int) -> int:
  return (
    UnreadCount.objects.filter(user_id=user_id, friend_id=friend_id)
    .values_list("count", flat=True)
    .first()
    or 0
  )


def increment_group_unread_count(user_id: int, group_id: int) -> int:
  updated = GroupUnreadCount.objects.filter(user_id=user_id, group_id=group_id).update(count=F("count") + 1)
  if not updated:
    obj, _ = GroupUnreadCount.objects.get_or_create(
      user_id=user_id,
      group_id=group_id,
      defaults={"count": 1},
    )
    return obj.count
  return (
    GroupUnreadCount.objects.filter(user_id=user_id, group_id=group_id)
    .values_list("count", flat=True)
    .first()
    or 0
  )


def reset_group_unread_count(user_id: int, group_id: int) -> None:
  GroupUnreadCount.objects.update_or_create(
    user_id=user_id,
    group_id=group_id,
    defaults={"count": 0},
  )


def get_group_unread_count(user_id: int, group_id: int) -> int:
  return (
    GroupUnreadCount.objects.filter(user_id=user_id, group_id=group_id)
    .values_list("count", flat=True)
    .first()
    or 0
  )

