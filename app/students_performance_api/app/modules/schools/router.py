from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.modules.users.models import User
from app.modules.schools.service import SchoolService
from app.modules.schools.schemas import (
    SchoolResponse,
    FacultyResponse,
    DepartmentResponse,
    LevelResponse,
    SchoolWithFacultiesResponse,
    FacultyWithDepartmentsResponse
)

router = APIRouter()

# ── Schools ──────────────────────────────────────────────────────

@router.get("/", response_model=List[SchoolResponse])
def get_schools(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all schools."""
    return SchoolService.get_schools(db)

@router.get("/{school_id}", response_model=SchoolWithFacultiesResponse)
def get_school(
    school_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a school with its faculties."""
    school = SchoolService.get_school(db, school_id)
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    return school

# ── Faculties ────────────────────────────────────────────────────

@router.get("/{school_id}/faculties", response_model=List[FacultyResponse])
def get_faculties_by_school(
    school_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get faculties by school."""
    return SchoolService.get_faculties(db, school_id)

@router.get("/faculties/{faculty_id}", response_model=FacultyWithDepartmentsResponse)
def get_faculty(
    faculty_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a faculty with its departments."""
    faculty = SchoolService.get_faculty(db, faculty_id)
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    return faculty

# ── Departments ──────────────────────────────────────────────────

@router.get("/faculties/{faculty_id}/departments", response_model=List[DepartmentResponse])
def get_departments_by_faculty(
    faculty_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get departments by faculty."""
    return SchoolService.get_departments(db, faculty_id)

# ── Levels ──────────────────────────────────────────────────────

@router.get("/levels", response_model=List[LevelResponse])
def get_levels(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all levels."""
    return SchoolService.get_levels(db)
