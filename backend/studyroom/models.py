from __future__ import annotations

import os
import uuid
from typing import Optional

from django.conf import settings
from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils import timezone

User = settings.AUTH_USER_MODEL


def attachment_upload_path(instance, filename: str) -> str:
  ext = os.path.splitext(filename)[1]
  token = uuid.uuid4().hex
  return f"studyroom/attachments/{token}{ext}"


class FriendRequest(models.Model):
  STATUS_PENDING = "pending"
  STATUS_ACCEPTED = "accepted"
  STATUS_DECLINED = "declined"
  STATUS_CANCELLED = "cancelled"

  STATUS_CHOICES = (
    (STATUS_PENDING, "Pending"),
    (STATUS_ACCEPTED, "Accepted"),
    (STATUS_DECLINED, "Declined"),
    (STATUS_CANCELLED, "Cancelled"),
  )

  sender = models.ForeignKey(
    User, related_name="studyroom_friend_requests_sent", on_delete=models.CASCADE
  )
  receiver = models.ForeignKey(
    User, related_name="studyroom_friend_requests_received", on_delete=models.CASCADE
  )
  status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_PENDING)
  created_at = models.DateTimeField(auto_now_add=True)
  responded_at = models.DateTimeField(null=True, blank=True)

  class Meta:
    unique_together = ("sender", "receiver")
    db_table = "studyroom_friend_request"
    ordering = ("-created_at",)

  def __str__(self) -> str:
    return f"{self.sender_id} -> {self.receiver_id} ({self.status})"

  def mark_response(self, status: str) -> None:
    self.status = status
    self.responded_at = timezone.now()
    self.save(update_fields=["status", "responded_at"])


class Friendship(models.Model):
  user1 = models.ForeignKey(
    User, related_name="studyroom_friendships_primary", on_delete=models.CASCADE
  )
  user2 = models.ForeignKey(
    User, related_name="studyroom_friendships_secondary", on_delete=models.CASCADE
  )
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    unique_together = ("user1", "user2")
    db_table = "studyroom_friendship"
    ordering = ("-created_at",)

  def __str__(self) -> str:
    return f"Friendship({self.user1_id}, {self.user2_id})"

  def save(self, *args, **kwargs):
    # ensure consistent ordering
    if self.user1_id == self.user2_id:
      raise ValueError("Friendship cannot be created with the same user.")
    if self.user1_id > self.user2_id:
      self.user1_id, self.user2_id = self.user2_id, self.user1_id
    super().save(*args, **kwargs)

  @property
  def participants(self):
    return (self.user1_id, self.user2_id)


class DirectChatThread(models.Model):
  friendship = models.OneToOneField(
    Friendship, related_name="thread", on_delete=models.CASCADE
  )
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    db_table = "studyroom_direct_thread"

  def __str__(self):
    return f"Thread({self.friendship_id})"

  def other_user(self, user_id: int):
    if self.friendship.user1_id == user_id:
      return self.friendship.user2
    return self.friendship.user1


class DirectMessage(models.Model):
  thread = models.ForeignKey(
    DirectChatThread, related_name="messages", on_delete=models.CASCADE
  )
  sender = models.ForeignKey(
    User, related_name="studyroom_direct_messages_sent", on_delete=models.CASCADE
  )
  receiver = models.ForeignKey(
    User, related_name="studyroom_direct_messages_received", on_delete=models.CASCADE
  )
  content = models.TextField(blank=True)
  attachment = models.FileField(
    upload_to=attachment_upload_path,
    null=True,
    blank=True,
    validators=[FileExtensionValidator(allowed_extensions=None)],
  )
  attachment_type = models.CharField(max_length=20, blank=True)
  attachment_filename = models.CharField(max_length=255, blank=True)
  reply_to = models.ForeignKey(
    "self", null=True, blank=True, on_delete=models.SET_NULL, related_name="replies"
  )
  is_deleted = models.BooleanField(default=False)
  delivered_at = models.DateTimeField(null=True, blank=True)
  read_at = models.DateTimeField(null=True, blank=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    db_table = "studyroom_direct_message"
    ordering = ("created_at",)

  def __str__(self) -> str:
    return f"DM {self.id} from {self.sender_id} to {self.receiver_id}"

  @property
  def has_attachment(self) -> bool:
    return bool(self.attachment)

  def mark_read(self) -> None:
    if not self.read_at:
      self.read_at = timezone.now()
      self.save(update_fields=["read_at"])


class DirectMessageReaction(models.Model):
  message = models.ForeignKey(
    DirectMessage, related_name="reaction_entries", on_delete=models.CASCADE
  )
  user = models.ForeignKey(
    User, related_name="studyroom_direct_reactions", on_delete=models.CASCADE
  )
  emoji = models.CharField(max_length=16)
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    unique_together = ("message", "user", "emoji")
    db_table = "studyroom_direct_message_reaction"
    ordering = ("created_at",)

  def __str__(self) -> str:
    return f"Reaction({self.emoji}) on {self.message_id} by {self.user_id}"


class StudyGroup(models.Model):
  name = models.CharField(max_length=120)
  description = models.TextField(blank=True)
  creator = models.ForeignKey(
    User, related_name="studyroom_groups_created", on_delete=models.CASCADE
  )
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    db_table = "studyroom_group"
    ordering = ("name",)

  def __str__(self) -> str:
    return f"Group({self.id} - {self.name})"


class GroupMembership(models.Model):
  group = models.ForeignKey(
    StudyGroup, related_name="memberships", on_delete=models.CASCADE
  )
  user = models.ForeignKey(
    User, related_name="studyroom_group_memberships", on_delete=models.CASCADE
  )
  is_admin = models.BooleanField(default=False)
  joined_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    unique_together = ("group", "user")
    db_table = "studyroom_group_membership"
    ordering = ("group_id", "user_id")

  def __str__(self) -> str:
    return f"Membership group={self.group_id} user={self.user_id}"


class GroupMessage(models.Model):
  group = models.ForeignKey(
    StudyGroup, related_name="messages", on_delete=models.CASCADE
  )
  sender = models.ForeignKey(
    User, related_name="studyroom_group_messages", on_delete=models.CASCADE
  )
  content = models.TextField(blank=True)
  attachment = models.FileField(
    upload_to=attachment_upload_path,
    null=True,
    blank=True,
    validators=[FileExtensionValidator(allowed_extensions=None)],
  )
  attachment_type = models.CharField(max_length=20, blank=True)
  attachment_filename = models.CharField(max_length=255, blank=True)
  reply_to = models.ForeignKey(
    "self", null=True, blank=True, on_delete=models.SET_NULL, related_name="group_replies"
  )
  is_deleted = models.BooleanField(default=False)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    db_table = "studyroom_group_message"
    ordering = ("created_at",)

  def __str__(self) -> str:
    return f"GroupMessage {self.id} in group {self.group_id}"

  @property
  def has_attachment(self) -> bool:
    return bool(self.attachment)


class GroupMessageRead(models.Model):
  message = models.ForeignKey(
    GroupMessage, related_name="read_receipts", on_delete=models.CASCADE
  )
  user = models.ForeignKey(
    User, related_name="studyroom_group_reads", on_delete=models.CASCADE
  )
  read_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    unique_together = ("message", "user")
    db_table = "studyroom_group_message_read"
    ordering = ("read_at",)


class GroupMessageReaction(models.Model):
  message = models.ForeignKey(
    GroupMessage, related_name="reaction_entries", on_delete=models.CASCADE
  )
  user = models.ForeignKey(
    User, related_name="studyroom_group_reactions", on_delete=models.CASCADE
  )
  emoji = models.CharField(max_length=16)
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    unique_together = ("message", "user", "emoji")
    db_table = "studyroom_group_message_reaction"
    ordering = ("created_at",)

  def __str__(self) -> str:
    return f"Reaction({self.emoji}) on group message {self.message_id}"


class UnreadCount(models.Model):
  user_id = models.IntegerField()
  friend_id = models.IntegerField()
  count = models.PositiveIntegerField(default=0)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    unique_together = ("user_id", "friend_id")
    db_table = "studyroom_unread_count"
    indexes = [
      models.Index(fields=["user_id", "friend_id"]),
    ]

  def __str__(self) -> str:
    return f"UnreadCount(user={self.user_id}, friend={self.friend_id}, count={self.count})"


class GroupUnreadCount(models.Model):
  user_id = models.IntegerField()
  group = models.ForeignKey(
    StudyGroup, related_name="unread_counters", on_delete=models.CASCADE
  )
  count = models.PositiveIntegerField(default=0)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    unique_together = ("user_id", "group")
    db_table = "studyroom_group_unread_count"
    indexes = [
      models.Index(fields=["user_id", "group"]),
    ]

  def __str__(self) -> str:
    return f"GroupUnreadCount(user={self.user_id}, group={self.group_id}, count={self.count})"

