from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.modules.auth.schemas import (
    RegisterRequest,
    LoginRequest,
    LoginResponse,
    MessageResponse
)
from app.modules.auth.service import AuthService
from app.modules.users.models import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    try:
        logger.info(f"📝 Registration attempt: {request.email}")
        user = AuthService.register(
            db=db,
            username=request.username,
            email=request.email,
            password=request.password,
            role=request.role
        )
        logger.info(f"✅ User created: {user.id}")
        return MessageResponse(message=f"Account created successfully. Welcome, {user.username}!")
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    try:
        result = AuthService.login(db=db, email=request.email, password=request.password)
        logger.info(f"✅ Login successful: {request.email}")
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@router.get("/me", response_model=dict)
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified
    }