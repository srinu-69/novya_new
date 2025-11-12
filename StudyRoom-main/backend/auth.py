from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt

# ----------------- JWT CONFIG -----------------
SECRET_KEY = "aP9v2!xKf$3Lq8#bR7tZyW1uM6mQ0hS4"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# ----------------- PASSWORD HASHING -----------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    """
    Hash the password using bcrypt.
    Truncate to 72 characters due to bcrypt limitation.
    """
    truncated_password = password[:72]  # bcrypt limit
    return pwd_context.hash(truncated_password)

def verify_password(plain_password, hashed_password):
    """
    Verify a plaintext password against a hashed password.
    Truncate to 72 characters for bcrypt.
    """
    truncated_password = plain_password[:72]
    return pwd_context.verify(truncated_password, hashed_password)

# ----------------- JWT TOKEN -----------------
def create_access_token(data: dict):
    """
    Create a JWT token with expiration.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)