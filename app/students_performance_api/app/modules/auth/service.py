from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime
from app.modules.users.models import User, UserRole
from app.core.security import (
    hash_password, verify_password, create_access_token,
    create_refresh_token, generate_reset_token
)
from app.utils.email import send_reset_password_email, send_welcome_email
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

class AuthService:

    @staticmethod
    def register(db: Session, username: str, email: str, password: str, role: str):
        """Register a new user."""
        try:
            logger.info(f"🔐 AuthService.register called for {email}")
            logger.info(f"   Role received: '{role}'")

            # Check if user exists
            existing_email = db.query(User).filter(User.email == email).first()
            if existing_email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )

            existing_username = db.query(User).filter(User.username == username).first()
            if existing_username:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already taken"
                )

            role_upper = role.upper()
            logger.info(f"   Role converted to: '{role_upper}'")

            try:
                user_role = UserRole(role_upper)
                logger.info(f"   Role validated: {user_role}")
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid role. Must be student, instructor, or admin. Got: '{role}'"
                )

            hashed_password = hash_password(password)
            logger.info(f"   Password hashed successfully")

            user = User(
                username=username,
                email=email,
                password_hash=hashed_password,
                role=user_role,
                is_active=True,
                is_verified=False
            )

            db.add(user)
            db.commit()
            db.refresh(user)

            logger.info(f"✅ User created successfully: {user.id}")

            try:
                send_welcome_email(email, username)
            except Exception as e:
                logger.warning(f"Welcome email failed (non-critical): {e}")

            return user

        except HTTPException:
            db.rollback()
            raise
        except Exception as e:
            db.rollback()
            logger.error(f"❌ Registration service error: {str(e)}")
            import traceback
            traceback.print_exc()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Registration failed: {str(e)}"
            )