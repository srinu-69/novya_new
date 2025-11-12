from __future__ import annotations

from django.conf import settings
from django.core.validators import FileExtensionValidator
from django.db import migrations, models
import django.db.models.deletion
import studyroom.models


class Migration(migrations.Migration):

  initial = True

  dependencies = [
    ('authentication', 'fix_coin_transaction_constraint'),
  ]

  operations = [
    migrations.CreateModel(
      name='FriendRequest',
      fields=[
        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        ('status', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined'), ('cancelled', 'Cancelled')], default='pending', max_length=10)),
        ('created_at', models.DateTimeField(auto_now_add=True)),
        ('responded_at', models.DateTimeField(blank=True, null=True)),
        ('receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='studyroom_friend_requests_received', to=settings.AUTH_USER_MODEL)),
        ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='studyroom_friend_requests_sent', to=settings.AUTH_USER_MODEL)),
      ],
      options={
        'db_table': 'studyroom_friend_request',
        'ordering': ('-created_at',),
        'unique_together': {('sender', 'receiver')},
      },
    ),
    migrations.CreateModel(
      name='Friendship',
      fields=[
        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        ('created_at', models.DateTimeField(auto_now_add=True)),
        ('user1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='studyroom_friendships_primary', to=settings.AUTH_USER_MODEL)),
        ('user2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='studyroom_friendships_secondary', to=settings.AUTH_USER_MODEL)),
      ],
      options={
        'db_table': 'studyroom_friendship',
        'ordering': ('-created_at',),
        'unique_together': {('user1', 'user2')},
      },
    ),
    migrations.CreateModel(
      name='StudyGroup',
      fields=[
        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        ('name', models.CharField(max_length=120)),
        ('description', models.TextField(blank=True)),
        ('created_at', models.DateTimeField(auto_now_add=True)),
        ('updated_at', models.DateTimeField(auto_now=True)),
        ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='studyroom_groups_created', to=settings.AUTH_USER_MODEL)),
      ],
      options={
        'db_table': 'studyroom_group',
        'ordering': ('name',),
      },
    ),
    migrations.CreateModel(
      name='DirectChatThread',
      fields=[
        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        ('created_at', models.DateTimeField(auto_now_add=True)),
        ('friendship', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='thread', to='studyroom.friendship')),
      ],
      options={
        'db_table': 'studyroom_direct_thread',
      },
    ),
    migrations.CreateModel(
      name='GroupMembership',
      fields=[
        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        ('is_admin', models.BooleanField(default=False)),
        ('joined_at', models.DateTimeField(auto_now_add=True)),
        ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='memberships', to='studyroom.studygroup')),
        ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='studyroom_group_memberships', to=settings.AUTH_USER_MODEL)),
      ],
      options={
        'db_table': 'studyroom_group_membership',
        'ordering': ('group_id', 'user_id'),
        'unique_together': {('group', 'user')},
      },
    ),
    migrations.CreateModel(
      name='DirectMessage',
      fields=[
        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        ('content', models.TextField(blank=True)),
        ('attachment', models.FileField(blank=True, null=True, upload_to=studyroom.models.attachment_upload_path, validators=[FileExtensionValidator(allowed_extensions=None)])),
        ('attachment_type', models.CharField(blank=True, max_length=20)),
        ('attachment_filename', models.CharField(blank=True, max_length=255)),
        ('is_deleted', models.BooleanField(default=False)),
        ('delivered_at', models.DateTimeField(auto_now_add=True)),
        ('read_at', models.DateTimeField(blank=True, null=True)),
        ('created_at', models.DateTimeField(auto_now_add=True)),
        ('updated_at', models.DateTimeField(auto_now=True)),
        ('receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='studyroom_direct_messages_received', to=settings.AUTH_USER_MODEL)),
        ('reply_to', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='replies', to='studyroom.directmessage')),
        ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='studyroom_direct_messages_sent', to=settings.AUTH_USER_MODEL)),
        ('thread', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='studyroom.directchatthread')),
      ],
      options={
        'db_table': 'studyroom_direct_message',
        'ordering': ('created_at',),
      },
    ),
    migrations.CreateModel(
      name='GroupMessage',
      fields=[
        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        ('content', models.TextField(blank=True)),
        ('attachment', models.FileField(blank=True, null=True, upload_to=studyroom.models.attachment_upload_path, validators=[FileExtensionValidator(allowed_extensions=None)])),
        ('attachment_type', models.CharField(blank=True, max_length=20)),
        ('attachment_filename', models.CharField(blank=True, max_length=255)),
        ('is_deleted', models.BooleanField(default=False)),
        ('created_at', models.DateTimeField(auto_now_add=True)),
        ('updated_at', models.DateTimeField(auto_now=True)),
        ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='studyroom.studygroup')),
        ('reply_to', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='group_replies', to='studyroom.groupmessage')),
        ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='studyroom_group_messages', to=settings.AUTH_USER_MODEL)),
      ],
      options={
        'db_table': 'studyroom_group_message',
        'ordering': ('created_at',),
      },
    ),
    migrations.CreateModel(
      name='DirectMessageReaction',
      fields=[
        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        ('emoji', models.CharField(max_length=16)),
        ('created_at', models.DateTimeField(auto_now_add=True)),
        ('message', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reaction_entries', to='studyroom.directmessage')),
        ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='studyroom_direct_reactions', to=settings.AUTH_USER_MODEL)),
      ],
      options={
        'db_table': 'studyroom_direct_message_reaction',
        'ordering': ('created_at',),
        'unique_together': {('message', 'user', 'emoji')},
      },
    ),
    migrations.CreateModel(
      name='GroupMessageRead',
      fields=[
        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        ('read_at', models.DateTimeField(auto_now_add=True)),
        ('message', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='read_receipts', to='studyroom.groupmessage')),
        ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='studyroom_group_reads', to=settings.AUTH_USER_MODEL)),
      ],
      options={
        'db_table': 'studyroom_group_message_read',
        'ordering': ('read_at',),
        'unique_together': {('message', 'user')},
      },
    ),
    migrations.CreateModel(
      name='GroupMessageReaction',
      fields=[
        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        ('emoji', models.CharField(max_length=16)),
        ('created_at', models.DateTimeField(auto_now_add=True)),
        ('message', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reaction_entries', to='studyroom.groupmessage')),
        ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='studyroom_group_reactions', to=settings.AUTH_USER_MODEL)),
      ],
      options={
        'db_table': 'studyroom_group_message_reaction',
        'ordering': ('created_at',),
        'unique_together': {('message', 'user', 'emoji')},
      },
    ),
  ]

