from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.crud.crud_user import user_crud
from app.api import deps
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserResponse

router = APIRouter()

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate
) -> Any:
    """
    Self-register endpoint verifying email duplication before committing 
    to PostgreSQL states.
    """
    user = user_crud.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user credential with matching email address already exists."
        )
    return user_crud.create(db, obj_in=user_in)

@router.get("/me", response_model=UserResponse)
def read_user_me(
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Returns verified payload profile claims belonging to the login session user.
    """
    return current_user

@router.put("/me", response_model=UserResponse)
def update_user_me(
    *,
    db: Session = Depends(get_db),
    user_in: UserUpdate,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Updates designated profile fields for the authenticated user session.
    """
    return user_crud.update(db, db_obj=current_user, obj_in=user_in)
