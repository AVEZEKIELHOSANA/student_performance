from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime


class SchoolBase(BaseModel):
    name: str
    code: Optional[str] = None


class SchoolResponse(SchoolBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class FacultyBase(BaseModel):
    name: str
    code: Optional[str] = None
    school_id: UUID


class FacultyResponse(FacultyBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class DepartmentBase(BaseModel):
    name: str
    code: Optional[str] = None
    faculty_id: UUID


class DepartmentResponse(DepartmentBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class LevelResponse(BaseModel):
    id: UUID
    name: str
    value: int
    created_at: datetime

    class Config:
        from_attributes = True


class SchoolWithFacultiesResponse(SchoolResponse):
    faculties: List[FacultyResponse] = []


class FacultyWithDepartmentsResponse(FacultyResponse):
    departments: List[DepartmentResponse] = []
