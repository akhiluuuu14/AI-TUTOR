from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict

class UserBase(BaseModel):
    """
    Shared core user properties for serialization integrity.
    """
    email: EmailStr
    full_name: Optional[str] = None
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    """
    Validation schema checked during self-registration or admin creation.
    Requires password string characters.
    """
    password: str

class UserUpdate(BaseModel):
    """
    Updatable attributes for profile edit sessions.
    All properties are optional here.
    """
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    full_name: Optional[str] = None

class UserInDBBase(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    # Pydantic v2 configuration to load attributes from ORM models directly
    model_config = ConfigDict(from_attributes=True)

class UserResponse(UserInDBBase):
    """
    Outbound system representation. Excludes digest fields for data safety.
    """
    pass

class UserInDB(UserInDBBase):
    hashed_password: str
