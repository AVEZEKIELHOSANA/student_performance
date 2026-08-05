from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.modules.users.models import User
from app.modules.students.service import StudentService
from app.modules.students.schemas import StudentProfileResponse, StudentProfileUpdate

router = APIRouter()

@router.get("/profile", response_model=StudentProfileResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = StudentService.get_profile(db, current_user.id)
    if not profile:
        profile = StudentService.create_profile(db, current_user.id)
    return profile

@router.put("/profile", response_model=StudentProfileResponse)
def update_my_profile(
    data: StudentProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = StudentService.update_profile(db, current_user.id, data)
    if not profile:
        profile = StudentService.create_profile(db, current_user.id, data)
    return profile
