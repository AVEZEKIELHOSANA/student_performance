from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.modules.users.models import User
from app.core.security import hash_password, verify_password, create_access_token
import logging

logger = logging.getLogger(__name__)

class AuthService:
    
    @staticmethod
    def register(db: Session, username: str, email: str, password: str, role: str):
        try:
            # Check if user exists
            if db.query(User).filter(User.email == email).first():
                raise HTTPException(status_code=400, detail="Email already registered")
            
            if db.query(User).filter(User.username == username).first():
                raise HTTPException(status_code=400, detail="Username already taken")
            
            # Validate role as string
            valid_roles = ["student", "instructor", "admin"]
            role_lower = role.lower()
            
            if role_lower not in valid_roles:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Invalid role. Must be student, instructor, or admin"
                )
            
            # Create user
            user = User(
                username=username,
                email=email,
                password_hash=hash_password(password),
                role=role_lower,
                is_active=True,
                is_verified=False
            )
            
            db.add(user)
            db.commit()
            db.refresh(user)
            
            logger.info(f"✅ User created: {user.id}")
            return user
            
        except HTTPException:
            db.rollback()
            raise
        except Exception as e:
            db.rollback()
            logger.error(f"Registration error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")
    
    @staticmethod
    def login(db: Session, email: str, password: str):
        user = db.query(User).filter(User.email == email).first()
        
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        if not user.is_active:
            raise HTTPException(status_code=403, detail="Account is deactivated")
        
        token = create_access_token({"sub": str(user.id), "role": user.role})
        
        return {
            "access_token": token,
            "refresh_token": token,
            "token_type": "bearer",
            "user": {
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "is_active": user.is_active,
                "is_verified": user.is_verified
            }
        }