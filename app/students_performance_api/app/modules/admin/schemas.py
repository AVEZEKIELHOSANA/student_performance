from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class AdminUser(BaseModel):
    id: str
    username: Optional[str]
    email: EmailStr
    role: str
    is_active: bool
    created_at: Optional[datetime]


class AdminStudent(BaseModel):
    id: str
    user_id: str
    username: Optional[str]
    email: Optional[EmailStr]
    student_id: Optional[str]
    school_id: Optional[str]
    school_name: Optional[str]
    faculty_id: Optional[str]
    faculty_name: Optional[str]
    department_id: Optional[str]
    department_name: Optional[str]
    level: Optional[str]
    assigned_instructor_id: Optional[str]
    assigned_instructor_name: Optional[str]


class AdminInstructor(BaseModel):
    id: str
    user_id: str
    username: Optional[str]
    email: Optional[EmailStr]
    school_id: Optional[str]
    school_name: Optional[str]
    faculty_id: Optional[str]
    faculty_name: Optional[str]
    department_id: Optional[str]
    department_name: Optional[str]
    assigned_student_count: Optional[int]


class Assignment(BaseModel):
    id: str
    student_id: str
    student_name: Optional[str]
    instructor_id: str
    instructor_name: Optional[str]
    assigned_at: Optional[datetime]


class AdminDashboardStats(BaseModel):
    total_students: int
    total_instructors: int
    total_admins: int
    assigned_students: int
    unassigned_students: int


class CreateUserPayload(BaseModel):
    username: Optional[str]
    email: EmailStr
    password: str
    role: str


class UpdateUserPayload(BaseModel):
    username: Optional[str]
    email: Optional[EmailStr]
    role: Optional[str]
    is_active: Optional[bool]
    password: Optional[str]


class AssignPayload(BaseModel):
    student_id: str
    instructor_id: str

