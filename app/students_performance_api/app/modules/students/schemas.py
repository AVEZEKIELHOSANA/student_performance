from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime


class StudentProfileBase(BaseModel):
    student_id: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    bio: Optional[str] = None
    school_id: Optional[UUID] = None
    faculty_id: Optional[UUID] = None
    department_id: Optional[UUID] = None
    level: Optional[int] = Field(None, ge=100, le=500)
    current_gpa: Optional[float] = Field(None, ge=0, le=4)
    total_credits: Optional[int] = None
    academic_year: Optional[str] = None


class StudentProfileCreate(StudentProfileBase):
    user_id: UUID


class StudentProfileUpdate(StudentProfileBase):
    pass


class StudentProfileResponse(StudentProfileBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
