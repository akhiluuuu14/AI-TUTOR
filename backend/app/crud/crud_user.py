from typing import Optional, Any, Dict, Union
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

class CRUDUser:
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        """
        Queries user record matching the given email address.
        """
        statement = select(User).where(User.email == email)
        return db.execute(statement).scalar_one_or_none()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        """
        Creates and stores a credentials record, automatically converting raw input 
        passwords into secure bcrypt hashes.
        """
        db_obj = User(
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
            is_active=obj_in.is_active,
            is_superuser=False
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: User, obj_in: Union[UserUpdate, Dict[str, Any]]) -> User:
        """
        Updates database rows safely, hashes updating credentials dynamically if supplied.
        """
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)

        if "password" in update_data and update_data["password"]:
            hashed_password = get_password_hash(update_data["password"])
            db_obj.hashed_password = hashed_password
            del update_data["password"]

        for field, value in update_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def authenticate(self, db: Session, *, email: str, password: str) -> Optional[User]:
        """
        Verifies login request: returns the User object if authentication is 
        successful, otherwise yields None.
        """
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

# Global CRUD instance
user_crud = CRUDUser()
