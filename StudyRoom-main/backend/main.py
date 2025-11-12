from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect, Header, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models, schemas, auth
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from jose import jwt, JWTError
import datetime
from typing import List, Dict, Optional
import os
import shutil
from pathlib import Path
import pytz

# ----------------- DATABASE -----------------
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Create upload directories
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
(UPLOAD_DIR / "individual").mkdir(exist_ok=True)
(UPLOAD_DIR / "group").mkdir(exist_ok=True)

# Mount static files for serving uploaded files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ----------------- CORS -----------------
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"]
)

# ----------------- DEPENDENCY -----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------------- AUTH HELPER -----------------
def get_user_id_from_token(token: str):
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        return payload.get("user_id")
    except JWTError:
        return None

# ----------------- TIME HELPER -----------------
def get_current_utc_time():
    """Get current time in UTC timezone"""
    return datetime.datetime.now(pytz.UTC)

# ----------------- UNREAD COUNT HELPERS -----------------
def increment_unread_count(db: Session, user_id: int, friend_id: int):
    """Increment unread count for a user from a specific friend"""
    unread_count = db.query(models.UnreadCount).filter(
        models.UnreadCount.user_id == user_id,
        models.UnreadCount.friend_id == friend_id
    ).first()
    
    if unread_count:
        unread_count.count += 1
    else:
        unread_count = models.UnreadCount(
            user_id=user_id,
            friend_id=friend_id,
            count=1
        )
        db.add(unread_count)
    
    db.commit()
    return unread_count.count

def reset_unread_count(db: Session, user_id: int, friend_id: int):
    """Reset unread count to 0 when user opens a chat"""
    unread_count = db.query(models.UnreadCount).filter(
        models.UnreadCount.user_id == user_id,
        models.UnreadCount.friend_id == friend_id
    ).first()
    
    if unread_count:
        unread_count.count = 0
        db.commit()
    
    return 0

def get_unread_count(db: Session, user_id: int, friend_id: int):
    """Get unread count for a specific friend"""
    unread_count = db.query(models.UnreadCount).filter(
        models.UnreadCount.user_id == user_id,
        models.UnreadCount.friend_id == friend_id
    ).first()
    
    return unread_count.count if unread_count else 0

# ----------------- GROUP UNREAD COUNT HELPERS -----------------
def increment_group_unread_count(db: Session, user_id: int, group_id: int):
    """Increment unread count for a user in a specific group"""
    unread_count = db.query(models.GroupUnreadCount).filter(
        models.GroupUnreadCount.user_id == user_id,
        models.GroupUnreadCount.group_id == group_id
    ).first()
    
    if unread_count:
        unread_count.count += 1
    else:
        unread_count = models.GroupUnreadCount(
            user_id=user_id,
            group_id=group_id,
            count=1
        )
        db.add(unread_count)
    
    db.commit()
    return unread_count.count

def reset_group_unread_count(db: Session, user_id: int, group_id: int):
    """Reset unread count to 0 when user opens a group chat"""
    unread_count = db.query(models.GroupUnreadCount).filter(
        models.GroupUnreadCount.user_id == user_id,
        models.GroupUnreadCount.group_id == group_id
    ).first()
    
    if unread_count:
        unread_count.count = 0
        db.commit()
    
    return 0

def get_group_unread_count(db: Session, user_id: int, group_id: int):
    """Get unread count for a specific group"""
    unread_count = db.query(models.GroupUnreadCount).filter(
        models.GroupUnreadCount.user_id == user_id,
        models.GroupUnreadCount.group_id == group_id
    ).first()
    
    return unread_count.count if unread_count else 0

# ----------------- FILE UPLOAD HELPER -----------------
ALLOWED_EXTENSIONS = {
    'image': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
    'audio': ['.mp3', '.wav', '.ogg', '.m4a', '.flac'],
    'video': ['.mp4', '.avi', '.mov', '.mkv', '.webm'],
    'document': ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt']
}

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

def get_file_type(filename: str) -> str:
    ext = Path(filename).suffix.lower()
    for file_type, extensions in ALLOWED_EXTENSIONS.items():
        if ext in extensions:
            return file_type
    return 'other'

def save_upload_file(upload_file: UploadFile, chat_type: str, chat_id: int) -> str:
    chat_dir = UPLOAD_DIR / chat_type / str(chat_id)
    chat_dir.mkdir(parents=True, exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    file_extension = Path(upload_file.filename).suffix
    filename = f"{timestamp}{file_extension}"
    file_path = chat_dir / filename
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    return f"/uploads/{chat_type}/{chat_id}/{filename}"

# ----------------- FIXED WEBSOCKET CONNECTION MANAGER -----------------
class ConnectionManager:
    def __init__(self):
        # FIXED: Store multiple connections per user for different chats
        self.individual_connections: Dict[str, WebSocket] = {}  # key: "user_id:friend_id"
        self.group_connections: Dict[int, set] = {}

    async def connect_individual(self, websocket: WebSocket, user_id: int, friend_id: int):
        await websocket.accept()
        connection_key = f"{user_id}:{friend_id}"
        self.individual_connections[connection_key] = websocket
        print(f"Individual connection established: {connection_key}")

    async def connect_group(self, websocket: WebSocket, group_id: int):
        await websocket.accept()
        if group_id not in self.group_connections:
            self.group_connections[group_id] = set()
        self.group_connections[group_id].add(websocket)

    def disconnect_individual(self, user_id: int, friend_id: int):
        connection_key = f"{user_id}:{friend_id}"
        if connection_key in self.individual_connections:
            del self.individual_connections[connection_key]
            print(f"Individual connection removed: {connection_key}")

    def disconnect_group(self, websocket: WebSocket, group_id: int):
        if group_id in self.group_connections:
            self.group_connections[group_id].discard(websocket)
            if not self.group_connections[group_id]:
                del self.group_connections[group_id]

    async def send_individual_message(self, message: str, user_id: int, friend_id: int):
        """Send message to a specific user for a specific friend chat"""
        connection_key = f"{user_id}:{friend_id}"
        if connection_key in self.individual_connections:
            websocket = self.individual_connections[connection_key]
            try:
                await websocket.send_text(message)
                return True
            except Exception as e:
                print(f"Error sending message to {connection_key}: {e}")
                # Remove broken connection
                del self.individual_connections[connection_key]
        return False

    async def broadcast_individual_message(self, message: str, user_id: int):
        """Broadcast to all individual connections for a user (for unread count updates)"""
        disconnected = []
        for connection_key, websocket in self.individual_connections.items():
            if connection_key.startswith(f"{user_id}:"):
                try:
                    await websocket.send_text(message)
                except Exception:
                    disconnected.append(connection_key)
        
        # Clean up disconnected sockets
        for key in disconnected:
            del self.individual_connections[key]

    async def broadcast_group_message(self, message: str, group_id: int):
        if group_id in self.group_connections:
            disconnected_websockets = set()
            for websocket in self.group_connections[group_id]:
                try:
                    await websocket.send_text(message)
                except Exception:
                    disconnected_websockets.add(websocket)
            
            for websocket in disconnected_websockets:
                self.group_connections[group_id].discard(websocket)

manager = ConnectionManager()

# ----------------- EXISTING ROUTES (unchanged) -----------------
@app.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.hash_password(user.password)
    new_user = models.User(username=user.username, email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"msg": "User created successfully"}

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = auth.create_access_token({"user_id": db_user.id})
    return {"access_token": token, "username": db_user.username, "user_id": db_user.id}

# ----------------- USER SEARCH -----------------
@app.get("/users")
def search_users(query: str, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    current_user_id = get_user_id_from_token(token)
    if not current_user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    users = db.query(models.User).filter(
        models.User.username.ilike(f"{query}%"),
        models.User.id != current_user_id
    ).all()
    
    return [{"id": u.id, "username": u.username} for u in users]

# ----------------- FRIEND REQUEST -----------------
@app.post("/friend_request")
def send_request(request: schemas.FriendRequestCreate, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    sender_id = get_user_id_from_token(token)
    if not sender_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    existing_friendship = db.query(models.FriendRequest).filter(
        ((models.FriendRequest.sender_id == sender_id) & (models.FriendRequest.receiver_id == request.receiver_id)) |
        ((models.FriendRequest.sender_id == request.receiver_id) & (models.FriendRequest.receiver_id == sender_id)),
        models.FriendRequest.status == "accepted"
    ).first()
    
    if existing_friendship:
        raise HTTPException(status_code=400, detail="You are already friends with this user")

    pending_request = db.query(models.FriendRequest).filter(
        models.FriendRequest.sender_id == sender_id,
        models.FriendRequest.receiver_id == request.receiver_id,
        models.FriendRequest.status == "pending"
    ).first()
    
    if pending_request:
        raise HTTPException(status_code=400, detail="Friend request already sent")

    fr = models.FriendRequest(sender_id=sender_id, receiver_id=request.receiver_id)
    db.add(fr)
    db.commit()
    db.refresh(fr)
    return {"msg": "Friend request sent"}

@app.get("/friend_requests/{user_id}")
def get_friend_requests(user_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    requester_id = get_user_id_from_token(token)
    if requester_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    requests = db.query(models.FriendRequest).filter(models.FriendRequest.receiver_id == user_id,
                                                     models.FriendRequest.status == "pending").all()
    return [{"id": r.id,
             "sender_id": r.sender_id,
             "sender_username": db.query(models.User).get(r.sender_id).username} for r in requests]

# ----------------- FRIENDS LIST -----------------
@app.get("/friends/{user_id}")
def get_friends(user_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    requester_id = get_user_id_from_token(token)
    if requester_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    sent = db.query(models.FriendRequest).filter(
        models.FriendRequest.sender_id == user_id, 
        models.FriendRequest.status == "accepted"
    ).all()
    received = db.query(models.FriendRequest).filter(
        models.FriendRequest.receiver_id == user_id, 
        models.FriendRequest.status == "accepted"
    ).all()
    
    friends = []

    for f in sent:
        user_obj = db.query(models.User).get(f.receiver_id)
        # Get unread count for each friend
        unread_count = get_unread_count(db, user_id, f.receiver_id)
        friends.append({
            "friend_id": user_obj.id, 
            "friend_username": user_obj.username,
            "unread_count": unread_count
        })

    for f in received:
        user_obj = db.query(models.User).get(f.sender_id)
        # Get unread count for each friend
        unread_count = get_unread_count(db, user_id, f.sender_id)
        friends.append({
            "friend_id": user_obj.id, 
            "friend_username": user_obj.username,
            "unread_count": unread_count
        })

    return friends

@app.get("/friends/{user_id}/search")
def search_friends(user_id: int, query: str, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    requester_id = get_user_id_from_token(token)
    if requester_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    sent = db.query(models.FriendRequest).filter(
        models.FriendRequest.sender_id == user_id, 
        models.FriendRequest.status == "accepted"
    ).all()
    received = db.query(models.FriendRequest).filter(
        models.FriendRequest.receiver_id == user_id, 
        models.FriendRequest.status == "accepted"
    ).all()
    
    all_friends = []
    friend_ids = set()

    for f in sent:
        if f.receiver_id not in friend_ids:
            user_obj = db.query(models.User).get(f.receiver_id)
            unread_count = get_unread_count(db, user_id, f.receiver_id)
            all_friends.append({
                "friend_id": user_obj.id, 
                "friend_username": user_obj.username,
                "unread_count": unread_count
            })
            friend_ids.add(f.receiver_id)

    for f in received:
        if f.sender_id not in friend_ids:
            user_obj = db.query(models.User).get(f.sender_id)
            unread_count = get_unread_count(db, user_id, f.sender_id)
            all_friends.append({
                "friend_id": user_obj.id, 
                "friend_username": user_obj.username,
                "unread_count": unread_count
            })
            friend_ids.add(f.sender_id)

    if query:
        filtered_friends = [
            friend for friend in all_friends 
            if query.lower() in friend["friend_username"].lower()
        ]
        return filtered_friends
    
    return all_friends

@app.post("/accept_request/{request_id}")
def accept_request(request_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    user_id = get_user_id_from_token(token)
    fr = db.query(models.FriendRequest).get(request_id)
    if not fr or fr.receiver_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    fr.status = "accepted"
    db.commit()
    return {"msg": "Request accepted"}

# ----------------- MESSAGE ROUTES -----------------
@app.get("/messages/{friend_id}")
def get_messages(friend_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    user_id = get_user_id_from_token(token)
    
    # Reset unread count when user opens the chat
    reset_unread_count(db, user_id, friend_id)
    
    unread_messages = db.query(models.Message).filter(
        models.Message.sender_id == friend_id,
        models.Message.receiver_id == user_id,
        models.Message.read == "False"
    ).all()
    
    for msg in unread_messages:
        msg.read = "True"
    
    db.commit()
    
    msgs = db.query(models.Message).filter(
        ((models.Message.sender_id == user_id) & (models.Message.receiver_id == friend_id)) |
        ((models.Message.sender_id == friend_id) & (models.Message.receiver_id == user_id))
    ).order_by(models.Message.timestamp.asc()).all()
    
    result = []
    for m in msgs:
        # Use database timestamp as-is without any conversion
        message_data = {
            "id": m.id,
            "sender_id": m.sender_id, 
            "receiver_id": m.receiver_id, 
            "content": m.content,
            "timestamp": m.timestamp.isoformat() if m.timestamp else None,  # Raw timestamp from database
            "read": m.read == "True", 
            "delivered": m.delivered == "True",
            "has_attachment": m.has_attachment,
            "attachment_url": m.attachment_url,
            "attachment_type": m.attachment_type,
            "attachment_filename": m.attachment_filename,
            "reply_to_message_id": m.reply_to_message_id,
            "reactions": m.reactions or {},
            "is_deleted": m.is_deleted
        }
        
        if m.reply_to_message_id:
            reply_msg = db.query(models.Message).get(m.reply_to_message_id)
            if reply_msg:
                reply_sender = db.query(models.User).get(reply_msg.sender_id)
                message_data["reply_to_message"] = {
                    "id": reply_msg.id,
                    "sender_id": reply_msg.sender_id,
                    "sender_username": reply_sender.username,
                    "content": reply_msg.content,
                    "has_attachment": reply_msg.has_attachment,
                    "attachment_type": reply_msg.attachment_type,
                    "timestamp": reply_msg.timestamp.isoformat() if reply_msg.timestamp else None  # Raw timestamp
                }
        
        result.append(message_data)
    
    return result

# FIXED: Return empty response instead of 404 when no messages found
@app.get("/last_message/{friend_id}")
def get_last_message(friend_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    user_id = get_user_id_from_token(token)
    
    last_msg = db.query(models.Message).filter(
        ((models.Message.sender_id == user_id) & (models.Message.receiver_id == friend_id)) |
        ((models.Message.sender_id == friend_id) & (models.Message.receiver_id == user_id))
    ).order_by(models.Message.timestamp.desc()).first()
    
    if last_msg:
        return {
            "content": last_msg.content,
            "timestamp": last_msg.timestamp.isoformat() if last_msg.timestamp else None,  # Raw timestamp from database
            "sender_id": last_msg.sender_id,
            "read": last_msg.read == "True",
            "delivered": last_msg.delivered == "True",
            "has_attachment": last_msg.has_attachment,
            "attachment_type": last_msg.attachment_type
        }
    else:
        # Return empty response instead of 404
        return {
            "content": "",
            "timestamp": None,
            "sender_id": None,
            "read": True,
            "delivered": True,
            "has_attachment": False,
            "attachment_type": None
        }

@app.get("/unread_count/{friend_id}")
def get_unread_count_endpoint(friend_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    user_id = get_user_id_from_token(token)
    
    # Use our new unread count system
    count = get_unread_count(db, user_id, friend_id)
    
    return {"unread_count": count}

# NEW: Get all unread counts for a user
@app.get("/unread_counts/{user_id}")
def get_all_unread_counts(user_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    requester_id = get_user_id_from_token(token)
    if requester_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Get all unread counts for this user
    unread_counts = db.query(models.UnreadCount).filter(
        models.UnreadCount.user_id == user_id
    ).all()
    
    result = {}
    for uc in unread_counts:
        result[uc.friend_id] = uc.count
    
    return result

# NEW: Get all group unread counts for a user
@app.get("/group_unread_counts/{user_id}")
def get_all_group_unread_counts(user_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    requester_id = get_user_id_from_token(token)
    if requester_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Get all group unread counts for this user
    unread_counts = db.query(models.GroupUnreadCount).filter(
        models.GroupUnreadCount.user_id == user_id
    ).all()
    
    result = {}
    for uc in unread_counts:
        result[uc.group_id] = uc.count
    
    return result

# ----------------- ADVANCED FEATURES ROUTES -----------------
@app.post("/messages/{message_id}/react")
def react_to_message(message_id: int, reaction: schemas.ReactionUpdate, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    user_id = get_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    message = db.query(models.Message).get(message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    if not message.reactions:
        message.reactions = {}

    if reaction.action == "add":
        if reaction.emoji not in message.reactions:
            message.reactions[reaction.emoji] = []
        if user_id not in message.reactions[reaction.emoji]:
            message.reactions[reaction.emoji].append(user_id)
    else:
        if reaction.emoji in message.reactions and user_id in message.reactions[reaction.emoji]:
            message.reactions[reaction.emoji].remove(user_id)
            if not message.reactions[reaction.emoji]:
                del message.reactions[reaction.emoji]

    db.commit()
    return {"message": "Reaction updated successfully", "reactions": message.reactions}

@app.post("/group_messages/{message_id}/react")
def react_to_group_message(message_id: int, reaction: schemas.ReactionUpdate, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    user_id = get_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    message = db.query(models.GroupMessage).get(message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    membership = db.query(models.GroupMember).filter(
        models.GroupMember.group_id == message.group_id,
        models.GroupMember.user_id == user_id
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")

    if not message.reactions:
        message.reactions = {}

    if reaction.action == "add":
        if reaction.emoji not in message.reactions:
            message.reactions[reaction.emoji] = []
        if user_id not in message.reactions[reaction.emoji]:
            message.reactions[reaction.emoji].append(user_id)
    else:
        if reaction.emoji in message.reactions and user_id in message.reactions[reaction.emoji]:
            message.reactions[reaction.emoji].remove(user_id)
            if not message.reactions[reaction.emoji]:
                del message.reactions[reaction.emoji]

    db.commit()
    return {"message": "Reaction updated successfully", "reactions": message.reactions}

@app.delete("/messages/{message_id}")
def delete_message(message_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    user_id = get_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    message = db.query(models.Message).get(message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    if message.sender_id != user_id:
        raise HTTPException(status_code=403, detail="Can only delete your own messages")

    message.is_deleted = True
    message.deleted_at = get_current_utc_time()
    db.commit()

    return {"message": "Message deleted successfully"}

@app.delete("/group_messages/{message_id}")
def delete_group_message(message_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    user_id = get_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    message = db.query(models.GroupMessage).get(message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    membership = db.query(models.GroupMember).filter(
        models.GroupMember.group_id == message.group_id,
        models.GroupMember.user_id == user_id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")

    if message.sender_id != user_id and membership.is_admin != "True":
        raise HTTPException(status_code=403, detail="Can only delete your own messages unless you're an admin")

    message.is_deleted = True
    message.deleted_at = get_current_utc_time()
    db.commit()

    return {"message": "Message deleted successfully"}

# ----------------- FILE UPLOAD ROUTES -----------------
@app.post("/upload/individual/{receiver_id}")
async def upload_individual_file(
    receiver_id: int,
    file: UploadFile = File(...),
    message: Optional[str] = Form(None),
    reply_to_message_id: Optional[int] = Form(None),
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    token = authorization.split(" ")[1]
    user_id = get_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large")
    
    file_type = get_file_type(file.filename)
    file_url = save_upload_file(file, "individual", user_id)
    
    current_time = get_current_utc_time()
    db_message = models.Message(
        sender_id=user_id,
        receiver_id=receiver_id,
        content=message or f"Sent a {file_type}: {file.filename}",
        timestamp=current_time,
        read="False",
        delivered="False",
        has_attachment=True,
        attachment_url=file_url,
        attachment_type=file_type,
        attachment_filename=file.filename,
        reply_to_message_id=reply_to_message_id
    )
    
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # FIXED: Use new connection check logic
    connection_key = f"{receiver_id}:{user_id}"
    is_receiver_connected = connection_key in manager.individual_connections
    
    # Increment unread count for receiver if they're not currently in the chat with this specific friend
    if not is_receiver_connected:
        increment_unread_count(db, receiver_id, user_id)
    
    if is_receiver_connected:
        db_message.delivered = "True"
        db.commit()
    
    try:
        # FIXED: Use the new send_individual_message with both user_id and friend_id
        unread_count = get_unread_count(db, receiver_id, user_id)
        await manager.send_individual_message(
            f"FILE:{user_id}:{file.filename}:{file_type}:{file_url}:{message or ''}:{reply_to_message_id or ''}:{db_message.id}:{db_message.timestamp.isoformat() if db_message.timestamp else ''}:UNREAD:{unread_count}", 
            receiver_id,  # target user
            user_id       # from friend (sender)
        )
        
        # Also broadcast unread count update to all connections of the receiver
        await manager.broadcast_individual_message(
            f"UNREAD_UPDATE:{user_id}:{unread_count}",
            receiver_id
        )
    except Exception as e:
        print(f"Error sending file notification: {e}")
    
    return {
        "message": "File uploaded successfully",
        "file_url": file_url,
        "file_type": file_type,
        "filename": file.filename,
        "message_id": db_message.id,
        "timestamp": db_message.timestamp.isoformat() if db_message.timestamp else None  # Raw timestamp from database
    }

@app.post("/upload/group/{group_id}")
async def upload_group_file(
    group_id: int,
    file: UploadFile = File(...),
    message: Optional[str] = Form(None),
    reply_to_message_id: Optional[int] = Form(None),
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    token = authorization.split(" ")[1]
    user_id = get_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    membership = db.query(models.GroupMember).filter(
        models.GroupMember.group_id == group_id,
        models.GroupMember.user_id == user_id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")

    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large")
    
    file_type = get_file_type(file.filename)
    file_url = save_upload_file(file, "group", group_id)
    
    current_time = get_current_utc_time()
    db_message = models.GroupMessage(
        group_id=group_id,
        sender_id=user_id,
        content=message or f"Sent a {file_type}: {file.filename}",
        timestamp=current_time,
        has_attachment=True,
        attachment_url=file_url,
        attachment_type=file_type,
        attachment_filename=file.filename,
        reply_to_message_id=reply_to_message_id
    )
    
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Increment unread count for all group members except sender
    members = db.query(models.GroupMember).filter(
        models.GroupMember.group_id == group_id,
        models.GroupMember.user_id != user_id
    ).all()
    
    for member in members:
        if member.user_id not in manager.group_connections.get(group_id, set()):
            increment_group_unread_count(db, member.user_id, group_id)
    
    sender = db.query(models.User).get(user_id)
    
    try:
        await manager.broadcast_group_message(
            f"FILE:{user_id}:{sender.username}:{file.filename}:{file_type}:{file_url}:{message or ''}:{reply_to_message_id or ''}:{db_message.id}:{db_message.timestamp.isoformat() if db_message.timestamp else ''}", 
            group_id
        )
    except Exception as e:
        print(f"Error broadcasting file notification: {e}")
    
    return {
        "message": "File uploaded successfully",
        "file_url": file_url,
        "file_type": file_type,
        "filename": file.filename,
        "message_id": db_message.id,
        "timestamp": db_message.timestamp.isoformat() if db_message.timestamp else None  # Raw timestamp from database
    }

# ----------------- GROUP CHAT ROUTES -----------------
@app.post("/groups")
def create_group(group: schemas.GroupCreate, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    user_id = get_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    current_time = get_current_utc_time()
    new_group = models.Group(
        name=group.name,
        description=group.description,
        created_by=user_id,
        created_at=current_time
    )
    db.add(new_group)
    db.commit()
    db.refresh(new_group)

    creator_member = models.GroupMember(
        group_id=new_group.id,
        user_id=user_id,
        is_admin="True",
        joined_at=current_time
    )
    db.add(creator_member)

    for member_id in group.member_ids:
        if member_id != user_id:
            member = models.GroupMember(
                group_id=new_group.id,
                user_id=member_id,
                joined_at=current_time
            )
            db.add(member)

    db.commit()
    return {"msg": "Group created successfully", "group_id": new_group.id}

@app.get("/groups/{user_id}")
def get_user_groups(user_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    requester_id = get_user_id_from_token(token)
    if requester_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    memberships = db.query(models.GroupMember).filter(models.GroupMember.user_id == user_id).all()
    groups = []
    
    for membership in memberships:
        group = db.query(models.Group).get(membership.group_id)
        if group:
            last_msg = db.query(models.GroupMessage).filter(
                models.GroupMessage.group_id == group.id
            ).order_by(models.GroupMessage.timestamp.desc()).first()
            
            member_count = db.query(models.GroupMember).filter(
                models.GroupMember.group_id == group.id
            ).count()
            
            # Get unread count for this group
            unread_count = get_group_unread_count(db, user_id, group.id)
            
            last_message_time = last_msg.timestamp.isoformat() if last_msg and last_msg.timestamp else None
            created_at = group.created_at.isoformat() if group.created_at else None
            
            groups.append({
                "id": group.id,
                "name": group.name,
                "description": group.description,
                "created_by": group.created_by,
                "created_at": created_at,
                "last_message": last_msg.content if last_msg else None,
                "last_message_time": last_message_time,
                "last_message_has_attachment": last_msg.has_attachment if last_msg else False,
                "last_message_attachment_type": last_msg.attachment_type if last_msg else None,
                "member_count": member_count,
                "is_admin": membership.is_admin == "True",
                "unread_count": unread_count  # Add unread count for groups
            })
    
    return groups

@app.get("/group_members/{group_id}")
def get_group_members(group_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    user_id = get_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    membership = db.query(models.GroupMember).filter(
        models.GroupMember.group_id == group_id,
        models.GroupMember.user_id == user_id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")

    members = db.query(models.GroupMember).filter(models.GroupMember.group_id == group_id).all()
    result = []
    
    for member in members:
        user = db.query(models.User).get(member.user_id)
        joined_at = member.joined_at.isoformat() if member.joined_at else None
        
        result.append({
            "id": member.id,
            "user_id": member.user_id,
            "username": user.username,
            "is_admin": member.is_admin == "True",
            "joined_at": joined_at
        })
    
    return result

@app.get("/group_messages/{group_id}")
def get_group_messages(group_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    user_id = get_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    membership = db.query(models.GroupMember).filter(
        models.GroupMember.group_id == group_id,
        models.GroupMember.user_id == user_id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")

    # Reset group unread count when user opens the chat
    reset_group_unread_count(db, user_id, group_id)

    messages = db.query(models.GroupMessage).filter(
        models.GroupMessage.group_id == group_id
    ).order_by(models.GroupMessage.timestamp.asc()).all()
    
    result = []
    for msg in messages:
        sender = db.query(models.User).get(msg.sender_id)
        
        message_data = {
            "id": msg.id,
            "group_id": msg.group_id,
            "sender_id": msg.sender_id,
            "sender_username": sender.username,
            "content": msg.content,
            "timestamp": msg.timestamp.isoformat() if msg.timestamp else None,  # Raw timestamp from database
            "has_attachment": msg.has_attachment,
            "attachment_url": msg.attachment_url,
            "attachment_type": msg.attachment_type,
            "attachment_filename": msg.attachment_filename,
            "reply_to_message_id": msg.reply_to_message_id,
            "reactions": msg.reactions or {},
            "is_deleted": msg.is_deleted
        }
        
        if msg.reply_to_message_id:
            reply_msg = db.query(models.GroupMessage).get(msg.reply_to_message_id)
            if reply_msg:
                reply_sender = db.query(models.User).get(reply_msg.sender_id)
                message_data["reply_to_message"] = {
                    "id": reply_msg.id,
                    "sender_id": reply_msg.sender_id,
                    "sender_username": reply_sender.username,
                    "content": reply_msg.content,
                    "has_attachment": reply_msg.has_attachment,
                    "attachment_type": reply_msg.attachment_type,
                    "timestamp": reply_msg.timestamp.isoformat() if reply_msg.timestamp else None  # Raw timestamp
                }
        
        result.append(message_data)
    
    return result

# ----------------- GROUP MANAGEMENT ROUTES -----------------
@app.get("/group_info/{group_id}")
def get_group_info(group_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    user_id = get_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    membership = db.query(models.GroupMember).filter(
        models.GroupMember.group_id == group_id,
        models.GroupMember.user_id == user_id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")

    group = db.query(models.Group).get(group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    members = db.query(models.GroupMember).filter(models.GroupMember.group_id == group_id).all()
    member_details = []
    
    for member in members:
        user = db.query(models.User).get(member.user_id)
        joined_at = member.joined_at.isoformat() if member.joined_at else None
        
        member_details.append({
            "id": member.id,
            "user_id": member.user_id,
            "username": user.username,
            "is_admin": member.is_admin == "True",
            "joined_at": joined_at
        })

    member_count = len(member_details)
    admin_count = sum(1 for member in member_details if member["is_admin"])
    created_at = group.created_at.isoformat() if group.created_at else None

    return {
        "id": group.id,
        "name": group.name,
        "description": group.description,
        "created_by": group.created_by,
        "created_at": created_at,
        "member_count": member_count,
        "admin_count": admin_count,
        "members": member_details,
        "current_user_is_admin": membership.is_admin == "True"
    }

@app.post("/groups/{group_id}/add_member")
def add_group_member(group_id: int, member_data: dict, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    user_id = get_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    membership = db.query(models.GroupMember).filter(
        models.GroupMember.group_id == group_id,
        models.GroupMember.user_id == user_id,
        models.GroupMember.is_admin == "True"
    ).first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="Only group admins can add members")

    member_user = db.query(models.User).get(member_data["user_id"])
    if not member_user:
        raise HTTPException(status_code=404, detail="User not found")

    existing_member = db.query(models.GroupMember).filter(
        models.GroupMember.group_id == group_id,
        models.GroupMember.user_id == member_data["user_id"]
    ).first()
    
    if existing_member:
        raise HTTPException(status_code=400, detail="User is already a member of this group")

    new_member = models.GroupMember(
        group_id=group_id,
        user_id=member_data["user_id"],
        joined_at=get_current_utc_time()
    )
    db.add(new_member)
    db.commit()

    return {"msg": f"Added {member_user.username} to the group"}

@app.post("/groups/{group_id}/remove_member")
def remove_group_member(group_id: int, member_data: dict, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    user_id = get_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    membership = db.query(models.GroupMember).filter(
        models.GroupMember.group_id == group_id,
        models.GroupMember.user_id == user_id,
        models.GroupMember.is_admin == "True"
    ).first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="Only group admins can remove members")

    if member_data["user_id"] == user_id:
        raise HTTPException(status_code=400, detail="Cannot remove yourself from group")

    member_to_remove = db.query(models.GroupMember).filter(
        models.GroupMember.group_id == group_id,
        models.GroupMember.user_id == member_data["user_id"]
    ).first()
    
    if not member_to_remove:
        raise HTTPException(status_code=404, detail="Member not found in group")

    member_user = db.query(models.User).get(member_data["user_id"])
    
    db.delete(member_to_remove)
    db.commit()

    return {"msg": f"Removed {member_user.username} from the group"}

@app.post("/groups/{group_id}/make_admin")
def make_group_admin(group_id: int, member_data: dict, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    user_id = get_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    membership = db.query(models.GroupMember).filter(
        models.GroupMember.group_id == group_id,
        models.GroupMember.user_id == user_id,
        models.GroupMember.is_admin == "True"
    ).first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="Only group admins can assign admin roles")

    member_to_update = db.query(models.GroupMember).filter(
        models.GroupMember.group_id == group_id,
        models.GroupMember.user_id == member_data["user_id"]
    ).first()
    
    if not member_to_update:
        raise HTTPException(status_code=404, detail="Member not found in group")

    member_user = db.query(models.User).get(member_data["user_id"])
    
    member_to_update.is_admin = "True"
    db.commit()

    return {"msg": f"Made {member_user.username} a group admin"}

@app.post("/groups/{group_id}/remove_admin")
def remove_group_admin(group_id: int, member_data: dict, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    user_id = get_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    membership = db.query(models.GroupMember).filter(
        models.GroupMember.group_id == group_id,
        models.GroupMember.user_id == user_id,
        models.GroupMember.is_admin == "True"
    ).first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="Only group admins can remove admin roles")

    if member_data["user_id"] == user_id:
        raise HTTPException(status_code=400, detail="Cannot remove your own admin status")

    member_to_update = db.query(models.GroupMember).filter(
        models.GroupMember.group_id == group_id,
        models.GroupMember.user_id == member_data["user_id"]
    ).first()
    
    if not member_to_update:
        raise HTTPException(status_code=404, detail="Member not found in group")

    member_user = db.query(models.User).get(member_data["user_id"])
    
    member_to_update.is_admin = "False"
    db.commit()

    return {"msg": f"Removed admin role from {member_user.username}"}

@app.post("/groups/{group_id}/exit")
def exit_group(group_id: int, db: Session = Depends(get_db), authorization: str = Header(None)):
    token = authorization.split(" ")[1]
    user_id = get_user_id_from_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    membership = db.query(models.GroupMember).filter(
        models.GroupMember.group_id == group_id,
        models.GroupMember.user_id == user_id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="Not a member of this group")

    group = db.query(models.Group).get(group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    if membership.is_admin == "True":
        admin_count = db.query(models.GroupMember).filter(
            models.GroupMember.group_id == group_id,
            models.GroupMember.is_admin == "True"
        ).count()
        
        if admin_count <= 1:
            raise HTTPException(
                status_code=400, 
                detail="You are the last admin of this group. Please assign another admin before exiting."
            )

    db.delete(membership)
    db.commit()

    return {"msg": f"You have exited the group '{group.name}'"}

# ----------------- FIXED WEBSOCKET ENDPOINTS -----------------
@app.websocket("/ws/{friend_id}")
async def websocket_individual(websocket: WebSocket, friend_id: int):
    try:
        query_params = dict(websocket.query_params)
        token = query_params.get('token')
        
        if not token:
            await websocket.close()
            return

        user_id = get_user_id_from_token(token)
        if not user_id:
            await websocket.close()
            return

        # FIXED: Use new connection manager with user_id and friend_id
        await manager.connect_individual(websocket, user_id, friend_id)
        print(f"User {user_id} connected to chat with friend {friend_id}")

        try:
            while True:
                data = await websocket.receive_text()
                print(f"Message received from user {user_id} to friend {friend_id}: {data}")

                if data.startswith("FILE:"):
                    # FIXED: Use new send_individual_message with both user_id and friend_id
                    await manager.send_individual_message(data, friend_id, user_id)
                elif data.startswith("REACTION:"):
                    await manager.send_individual_message(data, friend_id, user_id)
                elif data.startswith("REPLY:"):
                    parts = data.split(':', 3)
                    reply_to_id = parts[1]
                    message_content = parts[2]
                    
                    db = SessionLocal()
                    try:
                        current_time = get_current_utc_time()
                        msg = models.Message(
                            sender_id=user_id, 
                            receiver_id=friend_id, 
                            content=message_content, 
                            timestamp=current_time, 
                            read="False",
                            delivered="False",
                            reply_to_message_id=int(reply_to_id) if reply_to_id else None
                        )
                        db.add(msg)
                        db.commit()
                        db.refresh(msg)
                        
                        # FIXED: Use new connection check logic
                        connection_key = f"{friend_id}:{user_id}"
                        is_receiver_connected = connection_key in manager.individual_connections
                        
                        # Increment unread count for receiver if they're not currently in the chat
                        if not is_receiver_connected:
                            increment_unread_count(db, friend_id, user_id)
                        
                        if is_receiver_connected:
                            msg.delivered = "True"
                            db.commit()
                        
                        # FIXED: Use new send_individual_message with both parameters
                        unread_count = get_unread_count(db, friend_id, user_id)
                        await manager.send_individual_message(
                            f"REPLY:{msg.id}:{user_id}:{message_content}:{reply_to_id}:{msg.timestamp.isoformat() if msg.timestamp else ''}:UNREAD:{unread_count}", 
                            friend_id,  # target user
                            user_id     # from friend (sender)
                        )
                        
                        # Also broadcast unread count update
                        await manager.broadcast_individual_message(
                            f"UNREAD_UPDATE:{user_id}:{unread_count}",
                            friend_id
                        )
                    except Exception as e:
                        print(f"Error saving reply message: {e}")
                        db.rollback()
                    finally:
                        db.close()
                else:
                    db = SessionLocal()
                    try:
                        current_time = get_current_utc_time()
                        msg = models.Message(
                            sender_id=user_id, 
                            receiver_id=friend_id, 
                            content=data, 
                            timestamp=current_time, 
                            read="False",
                            delivered="False"
                        )
                        db.add(msg)
                        db.commit()
                        db.refresh(msg)
                        
                        # FIXED: Use new connection check logic
                        connection_key = f"{friend_id}:{user_id}"
                        is_receiver_connected = connection_key in manager.individual_connections
                        
                        # Increment unread count for receiver if they're not currently in the chat
                        if not is_receiver_connected:
                            increment_unread_count(db, friend_id, user_id)
                        
                        if is_receiver_connected:
                            msg.delivered = "True"
                            db.commit()
                            
                        print(f"Message saved to database with ID: {msg.id}")
                    except Exception as e:
                        print(f"Error saving message to database: {e}")
                        db.rollback()
                    finally:
                        db.close()

                    try:
                        # FIXED: Use new send_individual_message with both parameters
                        unread_count = get_unread_count(db, friend_id, user_id)
                        await manager.send_individual_message(
                            f"{user_id}:{data}:{msg.timestamp.isoformat() if msg.timestamp else ''}:UNREAD:{unread_count}", 
                            friend_id,  # target user
                            user_id     # from friend (sender)
                        )
                        
                        # Also broadcast unread count update to all connections of the receiver
                        await manager.broadcast_individual_message(
                            f"UNREAD_UPDATE:{user_id}:{unread_count}",
                            friend_id
                        )
                        
                        print(f"Message sent to friend {friend_id}")
                    except Exception as e:
                        print(f"Error sending message to friend: {e}")

        except WebSocketDisconnect:
            print(f"User {user_id} disconnected from chat with friend {friend_id}")
            manager.disconnect_individual(user_id, friend_id)
        except Exception as e:
            print(f"WebSocket error for user {user_id}: {e}")
            manager.disconnect_individual(user_id, friend_id)

    except Exception as e:
        print(f"WebSocket connection error: {e}")

@app.websocket("/ws/group/{group_id}")
async def websocket_group(websocket: WebSocket, group_id: int):
    try:
        query_params = dict(websocket.query_params)
        token = query_params.get('token')
        
        if not token:
            await websocket.close()
            return

        user_id = get_user_id_from_token(token)
        if not user_id:
            await websocket.close()
            return

        db = SessionLocal()
        try:
            membership = db.query(models.GroupMember).filter(
                models.GroupMember.group_id == group_id,
                models.GroupMember.user_id == user_id
            ).first()
            
            if not membership:
                await websocket.close()
                return
                
            sender = db.query(models.User).get(user_id)
            sender_username = sender.username
        finally:
            db.close()

        await manager.connect_group(websocket, group_id)
        print(f"User {user_id} connected to group {group_id}")

        try:
            while True:
                data = await websocket.receive_text()
                print(f"Group message received from user {user_id} in group {group_id}: {data}")

                # FIXED: Handle all message types in a unified way to prevent duplication
                if data.startswith("FILE:"):
                    # For file messages, just broadcast - the file upload endpoint already handles database saving
                    await manager.broadcast_group_message(data, group_id)
                elif data.startswith("REACTION:"):
                    # For reactions, just broadcast - the reaction endpoint already handles database saving
                    await manager.broadcast_group_message(data, group_id)
                elif data.startswith("REPLY:"):
                    # Handle reply messages
                    parts = data.split(':', 3)
                    reply_to_id = parts[1]
                    message_content = parts[2]
                    
                    db = SessionLocal()
                    try:
                        current_time = get_current_utc_time()
                        msg = models.GroupMessage(
                            group_id=group_id,
                            sender_id=user_id,
                            content=message_content,
                            timestamp=current_time,
                            reply_to_message_id=int(reply_to_id) if reply_to_id else None
                        )
                        db.add(msg)
                        db.commit()
                        db.refresh(msg)
                        
                        # Increment unread count for all group members except sender
                        members = db.query(models.GroupMember).filter(
                            models.GroupMember.group_id == group_id,
                            models.GroupMember.user_id != user_id
                        ).all()
                        
                        for member in members:
                            if member.user_id not in manager.group_connections.get(group_id, set()):
                                increment_group_unread_count(db, member.user_id, group_id)
                        
                        # Broadcast the reply message with proper formatting
                        await manager.broadcast_group_message(
                            f"REPLY:{msg.id}:{user_id}:{sender_username}:{message_content}:{reply_to_id}:{msg.timestamp.isoformat() if msg.timestamp else ''}", 
                            group_id
                        )
                    except Exception as e:
                        print(f"Error saving group reply message: {e}")
                        db.rollback()
                    finally:
                        db.close()
                else:
                    # FIXED: Handle regular text messages - save to database and broadcast only once
                    db = SessionLocal()
                    try:
                        current_time = get_current_utc_time()
                        msg = models.GroupMessage(
                            group_id=group_id,
                            sender_id=user_id,
                            content=data,
                            timestamp=current_time
                        )
                        db.add(msg)
                        db.commit()
                        db.refresh(msg)
                        
                        # Increment unread count for all group members except sender
                        members = db.query(models.GroupMember).filter(
                            models.GroupMember.group_id == group_id,
                            models.GroupMember.user_id != user_id
                        ).all()
                        
                        for member in members:
                            if member.user_id not in manager.group_connections.get(group_id, set()):
                                increment_group_unread_count(db, member.user_id, group_id)
                        
                        print(f"Group message saved to database with ID: {msg.id}")
                        
                        # FIXED: Broadcast the message only once with proper formatting
                        message_to_send = f"{user_id}:{sender_username}:{data}:{msg.timestamp.isoformat() if msg.timestamp else ''}"
                        await manager.broadcast_group_message(message_to_send, group_id)
                        print(f"Group message broadcasted to group {group_id}")
                        
                    except Exception as e:
                        print(f"Error saving group message to database: {e}")
                        db.rollback()
                    finally:
                        db.close()

        except WebSocketDisconnect:
            print(f"User {user_id} disconnected from group {group_id}")
            manager.disconnect_group(websocket, group_id)
        except Exception as e:
            print(f"Group WebSocket error for user {user_id}: {e}")
            manager.disconnect_group(websocket, group_id)

    except Exception as e:
        print(f"Group WebSocket connection error: {e}")

# ----------------- DEBUG ENDPOINTS -----------------
@app.get("/debug/messages")
def debug_messages(db: Session = Depends(get_db)):
    messages = db.query(models.Message).all()
    group_messages = db.query(models.GroupMessage).all()
    unread_counts = db.query(models.UnreadCount).all()
    group_unread_counts = db.query(models.GroupUnreadCount).all()
    
    return {
        "individual_messages": [
            {
                "id": m.id,
                "sender_id": m.sender_id,
                "receiver_id": m.receiver_id,
                "content": m.content,
                "timestamp": m.timestamp.isoformat() if m.timestamp else None,
                "read": m.read,
                "delivered": m.delivered,
                "has_attachment": m.has_attachment,
                "attachment_url": m.attachment_url,
                "attachment_type": m.attachment_type,
                "reactions": m.reactions,
                "is_deleted": m.is_deleted
            } for m in messages
        ],
        "group_messages": [
            {
                "id": m.id,
                "group_id": m.group_id,
                "sender_id": m.sender_id,
                "content": m.content,
                "timestamp": m.timestamp.isoformat() if m.timestamp else None,
                "has_attachment": m.has_attachment,
                "attachment_url": m.attachment_url,
                "attachment_type": m.attachment_type,
                "reactions": m.reactions,
                "is_deleted": m.is_deleted
            } for m in group_messages
        ],
        "unread_counts": [
            {
                "id": uc.id,
                "user_id": uc.user_id,
                "friend_id": uc.friend_id,
                "count": uc.count
            } for uc in unread_counts
        ],
        "group_unread_counts": [
            {
                "id": uc.id,
                "user_id": uc.user_id,
                "group_id": uc.group_id,
                "count": uc.count
            } for uc in group_unread_counts
        ],
        "counts": {
            "individual": len(messages),
            "group": len(group_messages),
            "unread_counts": len(unread_counts),
            "group_unread_counts": len(group_unread_counts)
        }
    }

@app.get("/debug/websocket_connections")
def debug_websocket_connections():
    return {
        "individual_connections": list(manager.individual_connections.keys()),
        "group_connections": list(manager.group_connections.keys())
    }

@app.get("/debug/time")

def debug_time():
    current_utc = get_current_utc_time()
    return {
        "server_utc_time": current_utc.isoformat() if current_utc else None,
        "server_timezone": str(current_utc.tzinfo) if current_utc else None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)