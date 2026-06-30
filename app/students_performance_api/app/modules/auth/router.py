from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.modules.users.models import User
from app.modules.auth.schemas import (
    RegisterRequest, LoginRequest, LoginResponse,
    RefreshTokenRequest, RefreshTokenResponse,
    ForgotPasswordRequest, ResetPasswordRequest,
    ChangePasswordRequest, MessageResponse
)
from app.modules.auth.service import AuthService
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):
    """Register a new user account."""
    try:
        logger.info(f"Registration attempt: {request.email}")
        
        user = AuthService.register(
            db=db,
            username=request.username,
            email=request.email,
            password=request.password,
            role=request.role
        )
        
        logger.info(f"Registration successful: {user.email}")
        return MessageResponse(message=f"Account created successfully. Welcome, {user.username}!")
        
    except HTTPException as e:
        logger.error(f"Registration HTTP error: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )