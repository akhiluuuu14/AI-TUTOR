from typing import Generator
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core import security
from app.core.config import settings
from app.db.session import get_db
from app.crud.crud_user import user_crud
from app.models.user import User
from app.schemas.token import TokenPayload

# Standard OAuth2 bearer scheme pointing to our login access-token endpoint 
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

def get_current_user(
    db: Session = Depends(get_db), 
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    Decodes high-entropy JWT Bearer token claims, validates expirations, 
    verifies cryptography signatures, and returns the authorized User record.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials. Please authenticate again.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenPayload(sub=username)
    except (jwt.PyJWTError, ValueError):
        raise credentials_exception
        
    user = user_crud.get_by_email(db, email=token_data.sub)
    if not user:
        raise HTTPException(
            status_code=404, 
            detail="User not found inside current session bounds."
        )
    if not user.is_active:
        raise HTTPException(
            status_code=400, 
            detail="User account has been deactivated."
        )
    return user
