from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from uuid import UUID

class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=80)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field(default="student")
    
    @validator('role')
    def validate_role(cls, v):
        if v not in ["student", "instructor", "admin"]:
            raise ValueError('Role must be student, instructor, or admin')
        return v

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class RefreshTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)

class UserOut(BaseModel):
    id: UUID
    username: str
    email: str
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class MessageResponse(BaseModel):
    message: str