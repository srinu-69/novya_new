from __future__ import annotations

from collections import defaultdict
from threading import Lock

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .services import unread_direct_count_for_user


def _get_channel_layer():
  try:
    return get_channel_layer()
  except Exception:
    return None


def direct_room_name(user_a_id: int, user_b_id: int) -> str:
  first, second = sorted([int(user_a_id), int(user_b_id)])
  return f"studyroom-direct-{first}-{second}"


def group_room_name(group_id: int) -> str:
  return f"studyroom-group-{int(group_id)}"


def broadcast_direct_event(user_a_id: int, user_b_id: int, payload: dict) -> None:
  channel_layer = _get_channel_layer()
  if not channel_layer:
    return
  room = direct_room_name(user_a_id, user_b_id)
  async_to_sync(channel_layer.group_send)(
    room,
    {
      "type": "chat.event",
      "payload": payload,
    },
  )


def broadcast_group_event(group_id: int, payload: dict) -> None:
  channel_layer = _get_channel_layer()
  if not channel_layer:
    return
  room = group_room_name(group_id)
  async_to_sync(channel_layer.group_send)(
    room,
    {
      "type": "chat.event",
      "payload": payload,
    },
  )


def broadcast_direct_file(message, content: str, reply_to_id=None) -> None:
  unread_map = unread_direct_count_for_user(message.receiver_id)
  payload = {
    "event": "file",
    "message_id": message.id,
    "sender_id": message.sender_id,
    "receiver_id": message.receiver_id,
    "content": content,
    "filename": message.attachment_filename,
    "file_type": message.attachment_type,
    "file_url": message.attachment.url if message.attachment else "",
    "reply_to_id": reply_to_id,
    "timestamp": message.created_at.isoformat(),
    "unread_for_receiver": unread_map.get(message.sender_id, 0),
  }
  broadcast_direct_event(message.sender_id, message.receiver_id, payload)


def broadcast_group_file(message, content: str, reply_to_id=None) -> None:
  payload = {
    "event": "file",
    "message_id": message.id,
    "sender_id": message.sender_id,
    "sender_username": message.sender.username if message.sender_id else "",
    "content": content,
    "filename": message.attachment_filename,
    "file_type": message.attachment_type,
    "file_url": message.attachment.url if message.attachment else "",
    "reply_to_id": reply_to_id,
    "timestamp": message.created_at.isoformat(),
  }
  broadcast_group_event(message.group_id, payload)


class _ConnectionRegistry:
  def __init__(self):
    self._direct_connections: dict[tuple[int, int], set[str]] = defaultdict(set)
    self._group_connections: dict[int, dict[int, set[str]]] = defaultdict(lambda: defaultdict(set))
    self._lock = Lock()

  def register_direct(self, user_id: int, friend_id: int, channel_name: str) -> None:
    key = (int(user_id), int(friend_id))
    with self._lock:
      self._direct_connections[key].add(channel_name)

  def unregister_direct(self, user_id: int, friend_id: int, channel_name: str) -> None:
    key = (int(user_id), int(friend_id))
    with self._lock:
      if key in self._direct_connections:
        self._direct_connections[key].discard(channel_name)
        if not self._direct_connections[key]:
          del self._direct_connections[key]

  def is_direct_active(self, user_id: int, friend_id: int) -> bool:
    key = (int(user_id), int(friend_id))
    with self._lock:
      return key in self._direct_connections and bool(self._direct_connections[key])

  def register_group(self, user_id: int, group_id: int, channel_name: str) -> None:
    grp = int(group_id)
    usr = int(user_id)
    with self._lock:
      self._group_connections[grp][usr].add(channel_name)

  def unregister_group(self, user_id: int, group_id: int, channel_name: str) -> None:
    grp = int(group_id)
    usr = int(user_id)
    with self._lock:
      if grp in self._group_connections and usr in self._group_connections[grp]:
        self._group_connections[grp][usr].discard(channel_name)
        if not self._group_connections[grp][usr]:
          del self._group_connections[grp][usr]
      if grp in self._group_connections and not self._group_connections[grp]:
        del self._group_connections[grp]

  def is_group_member_active(self, user_id: int, group_id: int) -> bool:
    grp = int(group_id)
    usr = int(user_id)
    with self._lock:
      return grp in self._group_connections and usr in self._group_connections[grp]

  def active_group_members(self, group_id: int) -> set[int]:
    grp = int(group_id)
    with self._lock:
      if grp not in self._group_connections:
        return set()
      return set(self._group_connections[grp].keys())


_registry = _ConnectionRegistry()


def register_direct_presence(user_id: int, friend_id: int, channel_name: str) -> None:
  _registry.register_direct(user_id, friend_id, channel_name)


def unregister_direct_presence(user_id: int, friend_id: int, channel_name: str) -> None:
  _registry.unregister_direct(user_id, friend_id, channel_name)


def is_direct_connection_active(user_id: int, friend_id: int) -> bool:
  return _registry.is_direct_active(user_id, friend_id)


def register_group_presence(user_id: int, group_id: int, channel_name: str) -> None:
  _registry.register_group(user_id, group_id, channel_name)


def unregister_group_presence(user_id: int, group_id: int, channel_name: str) -> None:
  _registry.unregister_group(user_id, group_id, channel_name)


def is_group_member_active(user_id: int, group_id: int) -> bool:
  return _registry.is_group_member_active(user_id, group_id)


def active_group_members(group_id: int) -> set[int]:
  return _registry.active_group_members(group_id)


def broadcast_direct_unread_update(user_id: int, friend_id: int, unread_count: int) -> None:
  payload = {
    "event": "unread_update",
    "friend_id": friend_id,
    "unread_count": unread_count,
  }
  broadcast_direct_event(user_id, friend_id, payload)

