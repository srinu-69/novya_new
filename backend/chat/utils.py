from __future__ import annotations

from typing import Dict

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.contrib.auth import get_user_model
from django.db.models import Q

from .models import ChatGroup, Message

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


def broadcast_event(room_name: str, payload: Dict):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        room_name,
        {
            'type': 'chat.event',
            'payload': payload,
        },
    )
