from datetime import datetime, timedelta, timezone
from typing import Any, Union
import jwt
from passlib.context import CryptContext
from app.core.config import settings

# Setup password hashing context using Bcrypt algorithm 
# CryptContext handles salt generation and hashing complexity automatically
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    """
    Generates a secure, cryptographically signed JSON Web Token (JWT)
    containing user identifier credentials as the subject claim (sub).
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Compares clear-text password characters against the stored bcrypt 
    one-way digest mapping safely to protect against timing attacks.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Generates salt buffer and hashes input characters into a secure Bcrypt 
    representation for storage in the users collection.
    """
    return pwd_context.hash(password)
