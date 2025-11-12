from __future__ import annotations

import mimetypes
import os
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

User = settings.AUTH_USER_MODEL


class FriendRequest(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_ACCEPTED = 'accepted'
    STATUS_DECLINED = 'declined'

    STATUS_CHOICES = (
        (STATUS_PENDING, 'Pending'),
        (STATUS_ACCEPTED, 'Accepted'),
        (STATUS_DECLINED, 'Declined'),
    )

    sender = models.ForeignKey(User, related_name='outgoing_friend_requests', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='incoming_friend_requests', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('sender', 'receiver')
        ordering = ['-created_at']

    def clean(self):
        if self.sender_id == self.receiver_id:
            raise ValidationError('You cannot send a friend request to yourself.')

    def accept(self):
        self.status = self.STATUS_ACCEPTED
        self.responded_at = timezone.now()
        self.save(update_fields=['status', 'responded_at'])
        Friendship.objects.create_pair(self.sender, self.receiver)

    def decline(self):
        self.status = self.STATUS_DECLINED
        self.responded_at = timezone.now()
        self.save(update_fields=['status', 'responded_at'])


class FriendshipManager(models.Manager):
    def create_pair(self, user_a, user_b):
        user_one, user_two = sorted([user_a, user_b], key=lambda u: u.pk)
        friendship, created = self.get_or_create(user_one=user_one, user_two=user_two)
        return friendship

    def are_friends(self, user_a, user_b):
        user_one, user_two = sorted([user_a, user_b], key=lambda u: u.pk)
        return self.filter(user_one=user_one, user_two=user_two).exists()

    def friends_of(self, user):
        return self.filter(models.Q(user_one=user) | models.Q(user_two=user))


class Friendship(models.Model):
    user_one = models.ForeignKey(User, related_name='friendships_started', on_delete=models.CASCADE)
    user_two = models.ForeignKey(User, related_name='friendships_received', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = FriendshipManager()

    class Meta:
        unique_together = ('user_one', 'user_two')
        ordering = ['-created_at']

    def clean(self):
        if self.user_one_id == self.user_two_id:
            raise ValidationError('Cannot create friendship with yourself.')

    def save(self, *args, **kwargs):
        if self.user_one_id and self.user_two_id:
            if self.user_one_id == self.user_two_id:
                raise ValidationError('Cannot create friendship with yourself.')
            if self.user_one_id > self.user_two_id:
                self.user_one_id, self.user_two_id = self.user_two_id, self.user_one_id
        super().save(*args, **kwargs)

    def friend_of(self, user):
        if user == self.user_one:
            return self.user_two
        return self.user_one


class ChatGroup(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, related_name='created_chat_groups', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class GroupMembership(models.Model):
    group = models.ForeignKey(ChatGroup, related_name='memberships', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='chat_group_memberships', on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('group', 'user')
        ordering = ['group', 'user']

    def __str__(self):
        return f"{self.user} in {self.group}"


class Message(models.Model):
    TYPE_INDIVIDUAL = 'individual'
    TYPE_GROUP = 'group'

    MESSAGE_TYPES = (
        (TYPE_INDIVIDUAL, 'Individual'),
        (TYPE_GROUP, 'Group'),
    )

    sender = models.ForeignKey(User, related_name='chat_messages_sent', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='chat_messages_received', null=True, blank=True, on_delete=models.CASCADE)
    group = models.ForeignKey(ChatGroup, related_name='chat_messages', null=True, blank=True, on_delete=models.CASCADE)
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reply_to = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='child_messages')
    is_deleted = models.BooleanField(default=False)
    attachment = models.FileField(upload_to='chat_attachments/', null=True, blank=True)
    attachment_type = models.CharField(max_length=20, blank=True)
    attachment_original_name = models.CharField(max_length=255, blank=True)
    delivered = models.BooleanField(default=False)
    read = models.BooleanField(default=False)

    class Meta:
        ordering = ['created_at']

    def clean(self):
        if bool(self.receiver) == bool(self.group):
            raise ValidationError('Message must target either a receiver or a group.')

    def save(self, *args, **kwargs):
        if self.receiver and self.group:
            raise ValidationError('Message target is ambiguous.')
        self.message_type = self.TYPE_GROUP if self.group_id else self.TYPE_INDIVIDUAL
        if self.attachment and not self.attachment_type:
            guessed_type = determine_attachment_type(self.attachment.name)
            self.attachment_type = guessed_type
            self.attachment_original_name = os.path.basename(self.attachment.name)
        super().save(*args, **kwargs)

    @property
    def has_attachment(self):
        return bool(self.attachment)

    def mark_as_read(self, user):
        if self.message_type == self.TYPE_INDIVIDUAL and user == self.receiver and not self.read:
            self.read = True
            self.save(update_fields=['read'])
        MessageReadReceipt.objects.get_or_create(message=self, user=user)


class MessageReaction(models.Model):
    message = models.ForeignKey(Message, related_name='reactions', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='chat_reactions', on_delete=models.CASCADE)
    emoji = models.CharField(max_length=16)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('message', 'user', 'emoji')
        ordering = ['created_at']

    def __str__(self):
        return f"{self.user} reacted {self.emoji}"


class MessageReadReceipt(models.Model):
    message = models.ForeignKey(Message, related_name='read_receipts', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='chat_read_receipts', on_delete=models.CASCADE)
    read_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('message', 'user')
        ordering = ['-read_at']

    def __str__(self):
        return f'{self.user} read message {self.message_id}'


def determine_attachment_type(file_name: str) -> str:
    file_type, _ = mimetypes.guess_type(file_name)
    if not file_type:
        return 'document'
    if file_type.startswith('image/'):
        return 'image'
    if file_type.startswith('video/'):
        return 'video'
    if file_type.startswith('audio/'):
        return 'audio'
    return 'document'
