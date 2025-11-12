from collections import defaultdict

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import serializers

from .models import (
    ChatGroup,
    FriendRequest,
    Friendship,
    GroupMembership,
    Message,
    MessageReaction,
)

User = get_user_model()


class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('userid', 'username', 'firstname', 'lastname')
        read_only_fields = fields


class FriendRequestSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = FriendRequest
        fields = ('id', 'sender_username', 'status', 'created_at')


class FriendshipSerializer(serializers.Serializer):
    friend_id = serializers.IntegerField()
    friend_username = serializers.CharField()


class ChatGroupSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    description = serializers.CharField(allow_blank=True, required=False)
    member_count = serializers.IntegerField()
    admin_count = serializers.IntegerField()
    last_message = serializers.CharField(allow_blank=True, required=False)
    last_message_time = serializers.DateTimeField(allow_null=True, required=False)
    last_message_has_attachment = serializers.BooleanField(required=False)
    last_message_attachment_type = serializers.CharField(allow_null=True, required=False)


class GroupMemberSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    username = serializers.CharField()
    is_admin = serializers.BooleanField()


class GroupInfoSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    description = serializers.CharField(allow_blank=True)
    member_count = serializers.IntegerField()
    admin_count = serializers.IntegerField()
    current_user_is_admin = serializers.BooleanField()
    members = GroupMemberSerializer(many=True)


class MessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField(source='sender.userid', read_only=True)
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    type = serializers.CharField(source='message_type', read_only=True)
    timestamp = serializers.DateTimeField(source='created_at', read_only=True)
    has_attachment = serializers.SerializerMethodField()
    attachment_url = serializers.SerializerMethodField()
    attachment_filename = serializers.CharField(source='attachment_original_name', read_only=True)
    reply_to_message = serializers.SerializerMethodField()
    reactions = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = (
            'id',
            'content',
            'sender_id',
            'sender_username',
            'type',
            'timestamp',
            'read',
            'delivered',
            'has_attachment',
            'attachment_url',
            'attachment_type',
            'attachment_filename',
            'reply_to_message',
            'reactions',
            'is_deleted',
        )

    def get_has_attachment(self, obj: Message) -> bool:
        return obj.has_attachment

    def get_attachment_url(self, obj: Message) -> str | None:
        if not obj.attachment:
            return None
        request = self.context.get('request')
        url = obj.attachment.url
        if request is not None:
            return request.build_absolute_uri(url)
        return url

    def get_reply_to_message(self, obj: Message):
        if not obj.reply_to:
            return None
        reply = obj.reply_to
        data = {
            'id': reply.id,
            'sender_username': reply.sender.username,
            'sender_id': reply.sender.userid,
            'content': reply.content,
            'has_attachment': reply.has_attachment,
            'attachment_type': reply.attachment_type,
        }
        return data

    def get_reactions(self, obj: Message):
        grouped = defaultdict(list)
        for reaction in obj.reactions.all():
            grouped[reaction.emoji].append(reaction.user.userid)
        return grouped
