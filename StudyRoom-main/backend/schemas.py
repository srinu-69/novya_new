from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any

# ----------------- USER -----------------
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# ----------------- FRIEND REQUEST -----------------
class FriendRequestCreate(BaseModel):
    receiver_id: int

# ----------------- MESSAGE -----------------
class MessageCreate(BaseModel):
    sender_id: int
    receiver_id: int
    content: str
    reply_to_message_id: Optional[int] = None

class MessageOut(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: str
    timestamp: datetime
    read: bool
    delivered: bool
    has_attachment: bool = False
    attachment_url: Optional[str] = None
    attachment_type: Optional[str] = None
    attachment_filename: Optional[str] = None
    reply_to_message_id: Optional[int] = None
    reply_to_message: Optional[Dict] = None
    reactions: Dict[str, List[int]] = {}
    is_deleted: bool = False

class ReactionUpdate(BaseModel):
    message_id: int
    emoji: str
    action: str  # 'add' or 'remove'

class ReplyMessage(BaseModel):
    message_id: int
    content: str

# ----------------- GROUP -----------------
class GroupCreate(BaseModel):
    name: str
    description: Optional[str] = None
    member_ids: List[int]

class GroupOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    created_by: int
    created_at: datetime

class GroupMemberOut(BaseModel):
    id: int
    group_id: int
    user_id: int
    username: str
    is_admin: bool

class GroupMessageOut(BaseModel):
    id: int
    group_id: int
    sender_id: int
    sender_username: str
    content: str
    timestamp: datetime
    has_attachment: bool = False
    attachment_url: Optional[str] = None
    attachment_type: Optional[str] = None
    attachment_filename: Optional[str] = None
    reply_to_message_id: Optional[int] = None
    reply_to_message: Optional[Dict] = None
    reactions: Dict[str, List[int]] = {}
    is_deleted: bool = False

# ----------------- ATTACHMENT -----------------
class AttachmentInfo(BaseModel):
    filename: str
    file_type: str
    file_size: int

# ----------------- EMOJI -----------------
class EmojiReaction(BaseModel):
    emoji: str
    count: int
    reacted: bool