from sqlalchemy import Column, Integer, String, ForeignKey, Text, TIMESTAMP, Table, Boolean, DateTime, JSON, UniqueConstraint
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(200), nullable=False)

class FriendRequest(Base):
    __tablename__ = "friend_requests"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    receiver_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    status = Column(String(20), default="pending")
    
    # Ensure unique friendship
    __table_args__ = (UniqueConstraint('sender_id', 'receiver_id', name='unique_friendship'),)

# NEW: UnreadCount model to track unread messages per chat
class UnreadCount(Base):
    __tablename__ = "unread_counts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    friend_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    count = Column(Integer, default=0)
    
    # Ensure one record per user-friend pair
    __table_args__ = (UniqueConstraint('user_id', 'friend_id', name='unique_user_friend'),)

# NEW: GroupUnreadCount model to track unread group messages per user
class GroupUnreadCount(Base):
    __tablename__ = "group_unread_counts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    group_id = Column(Integer, ForeignKey("groups.id", ondelete="CASCADE"), nullable=False)
    count = Column(Integer, default=0)
    
    # Ensure one record per user-group pair
    __table_args__ = (UniqueConstraint('user_id', 'group_id', name='unique_user_group'),)

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    receiver_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    content = Column(Text)
    timestamp = Column(TIMESTAMP, server_default=func.now())
    read = Column(String(10), default="False")
    delivered = Column(String(10), default="False")
    has_attachment = Column(Boolean, default=False)
    attachment_url = Column(String(500), nullable=True)
    attachment_type = Column(String(50), nullable=True)
    attachment_filename = Column(String(255), nullable=True)
    
    # Advanced features fields
    reply_to_message_id = Column(Integer, ForeignKey("messages.id"), nullable=True)
    reactions = Column(JSON, default=dict)
    is_deleted = Column(Boolean, default=False)
    deleted_at = Column(TIMESTAMP, nullable=True)

class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    created_at = Column(TIMESTAMP, server_default=func.now())

class GroupMember(Base):
    __tablename__ = "group_members"
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    joined_at = Column(TIMESTAMP, server_default=func.now())
    is_admin = Column(String(10), default="False")

class GroupMessage(Base):
    __tablename__ = "group_messages"
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id", ondelete="CASCADE"))
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    content = Column(Text)
    timestamp = Column(TIMESTAMP, server_default=func.now())
    has_attachment = Column(Boolean, default=False)
    attachment_url = Column(String(500), nullable=True)
    attachment_type = Column(String(50), nullable=True)
    attachment_filename = Column(String(255), nullable=True)
    
    # Advanced features fields
    reply_to_message_id = Column(Integer, ForeignKey("group_messages.id"), nullable=True)
    reactions = Column(JSON, default=dict)
    is_deleted = Column(Boolean, default=False)
    deleted_at = Column(TIMESTAMP, nullable=True)