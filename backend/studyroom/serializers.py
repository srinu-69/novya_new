from django.conf import settings
from rest_framework import serializers

from .models import (
  DirectMessage,
  DirectMessageReaction,
  FriendRequest,
  Friendship,
  GroupMembership,
  GroupMessage,
  GroupMessageReaction,
  StudyGroup,
)

User = settings.AUTH_USER_MODEL


class UserSummarySerializer(serializers.Serializer):
  user_id = serializers.IntegerField(source="userid")
  username = serializers.CharField()
  firstname = serializers.CharField()
  lastname = serializers.CharField(allow_null=True)


class FriendRequestSerializer(serializers.ModelSerializer):
  sender_username = serializers.CharField(source="sender.username", read_only=True)

  class Meta:
    model = FriendRequest
    fields = ("id", "sender", "sender_username", "status", "created_at")
    read_only_fields = ("id", "status", "created_at", "sender_username")


class DirectMessageSerializer(serializers.ModelSerializer):
  has_attachment = serializers.SerializerMethodField()
  attachment_url = serializers.SerializerMethodField()
  sender_username = serializers.CharField(source="sender.username", read_only=True)
  reply_to_message = serializers.SerializerMethodField()
  reactions = serializers.SerializerMethodField()
  read = serializers.SerializerMethodField()
  delivered = serializers.SerializerMethodField()
  timestamp = serializers.DateTimeField(source="created_at", read_only=True)

  class Meta:
    model = DirectMessage
    fields = (
      "id",
      "content",
      "sender_id",
      "sender_username",
      "receiver_id",
      "timestamp",
      "has_attachment",
      "attachment_url",
      "attachment_type",
      "attachment_filename",
      "reply_to_message",
      "reactions",
      "is_deleted",
      "read",
      "delivered",
    )
    read_only_fields = fields

  def get_has_attachment(self, obj: DirectMessage) -> bool:
    return obj.has_attachment

  def get_attachment_url(self, obj: DirectMessage) -> str | None:
    if not obj.attachment:
      return None
    request = self.context.get("request")
    url = obj.attachment.url
    return request.build_absolute_uri(url) if request else url

  def get_reply_to_message(self, obj: DirectMessage):
    if not obj.reply_to_id:
      return None
    reply = obj.reply_to
    return {
      "id": reply.id,
      "sender_id": reply.sender_id,
      "sender_username": reply.sender.username,
      "content": reply.content,
      "has_attachment": reply.has_attachment,
      "attachment_type": reply.attachment_type,
      "attachment_filename": reply.attachment_filename,
    }

  def get_reactions(self, obj: DirectMessage):
    reactions = obj.reaction_entries.all()
    payload = {}
    for reaction in reactions:
      payload.setdefault(reaction.emoji, []).append(reaction.user_id)
    return payload

  def get_read(self, obj: DirectMessage):
    return obj.read_at is not None

  def get_delivered(self, obj: DirectMessage):
    return obj.delivered_at is not None


class GroupMessageSerializer(serializers.ModelSerializer):
  has_attachment = serializers.SerializerMethodField()
  attachment_url = serializers.SerializerMethodField()
  sender_username = serializers.CharField(source="sender.username", read_only=True)
  reply_to_message = serializers.SerializerMethodField()
  reactions = serializers.SerializerMethodField()
  timestamp = serializers.DateTimeField(source="created_at", read_only=True)

  class Meta:
    model = GroupMessage
    fields = (
      "id",
      "group_id",
      "sender_id",
      "sender_username",
      "content",
      "timestamp",
      "has_attachment",
      "attachment_url",
      "attachment_type",
      "attachment_filename",
      "reply_to_message",
      "reactions",
      "is_deleted",
    )
    read_only_fields = fields

  def get_has_attachment(self, obj: GroupMessage) -> bool:
    return obj.has_attachment

  def get_attachment_url(self, obj: GroupMessage) -> str | None:
    if not obj.attachment:
      return None
    request = self.context.get("request")
    url = obj.attachment.url
    return request.build_absolute_uri(url) if request else url

  def get_reply_to_message(self, obj: GroupMessage):
    if not obj.reply_to_id:
      return None
    reply = obj.reply_to
    return {
      "id": reply.id,
      "sender_id": reply.sender_id,
      "sender_username": reply.sender.username,
      "content": reply.content,
      "has_attachment": reply.has_attachment,
      "attachment_type": reply.attachment_type,
      "attachment_filename": reply.attachment_filename,
    }

  def get_reactions(self, obj: GroupMessage):
    reactions = obj.reaction_entries.all()
    payload = {}
    for reaction in reactions:
      payload.setdefault(reaction.emoji, []).append(reaction.user_id)
    return payload


class GroupMemberSerializer(serializers.Serializer):
  user_id = serializers.IntegerField(source="user.userid")
  username = serializers.CharField(source="user.username")
  is_admin = serializers.BooleanField()
  firstname = serializers.CharField(source="user.firstname")
  lastname = serializers.CharField(source="user.lastname", allow_null=True)


class StudyGroupSerializer(serializers.ModelSerializer):
  member_count = serializers.IntegerField(read_only=True)
  last_message = serializers.CharField(read_only=True)
  last_message_time = serializers.DateTimeField(read_only=True)
  last_message_has_attachment = serializers.BooleanField(read_only=True)
  last_message_attachment_type = serializers.CharField(read_only=True)

  class Meta:
    model = StudyGroup
    fields = (
      "id",
      "name",
      "description",
      "member_count",
      "last_message",
      "last_message_time",
      "last_message_has_attachment",
      "last_message_attachment_type",
    )
    read_only_fields = fields


class GroupInfoSerializer(serializers.Serializer):
  id = serializers.IntegerField()
  name = serializers.CharField()
  description = serializers.CharField(allow_blank=True)
  member_count = serializers.IntegerField()
  admin_count = serializers.IntegerField()
  members = GroupMemberSerializer(many=True)
  current_user_is_admin = serializers.BooleanField()

