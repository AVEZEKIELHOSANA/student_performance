from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.modules.users.models import User
from app.modules.students.models import StudentProfile
from app.modules.instructors.models import Instructor
from app.modules.schools.models import Faculty, Department
from app.modules.admin.schemas import (
    AdminUser,
    AdminStudent,
    AdminInstructor,
    Assignment,
    AdminDashboardStats,
    CreateUserPayload,
    UpdateUserPayload,
    AssignPayload,
)

import uuid
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/admin")


def admin_required(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return user


@router.get("/dashboard/stats", response_model=AdminDashboardStats)
def dashboard_stats(current: User = Depends(admin_required), db: Session = Depends(get_db)):
    total_students = db.query(StudentProfile).count()
    total_instructors = db.query(Instructor).count()
    total_admins = db.query(User).filter(User.role == 'admin').count()
    assigned_students = db.query(StudentProfile).filter(StudentProfile.assigned_instructor_id != None).count()
    unassigned_students = total_students - assigned_students
    return AdminDashboardStats(
        total_students=total_students,
        total_instructors=total_instructors,
        total_admins=total_admins,
        assigned_students=assigned_students,
        unassigned_students=unassigned_students,
    )


@router.get("/users", response_model=List[AdminUser])
def list_users(role: Optional[str] = None, search: Optional[str] = None, is_active: Optional[bool] = None, current: User = Depends(admin_required), db: Session = Depends(get_db)):
    q = db.query(User)
    if role:
        q = q.filter(User.role == role)
    if is_active is not None:
        q = q.filter(User.is_active == is_active)
    if search:
        q = q.filter((User.username.ilike(f"%{search}%")) | (User.email.ilike(f"%{search}%")))
    users = q.all()
    return [AdminUser(id=str(u.id), username=getattr(u,'username',None), email=u.email, role=u.role, is_active=u.is_active, created_at=u.created_at) for u in users]


@router.post("/users", response_model=AdminUser)
def create_user(payload: CreateUserPayload, current: User = Depends(admin_required), db: Session = Depends(get_db)):
    user = User(id=uuid.uuid4(), username=payload.username, email=payload.email, role=payload.role, is_active=True)
    # password handling left to AuthService elsewhere; set raw for now
    user.password = payload.password
    db.add(user)
    db.commit()
    db.refresh(user)
    return AdminUser(id=str(user.id), username=user.username, email=user.email, role=user.role, is_active=user.is_active, created_at=user.created_at)


@router.put("/users/{user_id}", response_model=AdminUser)
def update_user(user_id: str, payload: UpdateUserPayload, current: User = Depends(admin_required), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if payload.username is not None:
        user.username = payload.username
    if payload.email is not None:
        user.email = payload.email
    if payload.role is not None:
        user.role = payload.role
    if payload.is_active is not None:
        user.is_active = payload.is_active
    if payload.password:
        user.password = payload.password
    db.commit()
    db.refresh(user)
    return AdminUser(id=str(user.id), username=user.username, email=user.email, role=user.role, is_active=user.is_active, created_at=user.created_at)


@router.delete("/users/{user_id}")
def delete_user(user_id: str, current: User = Depends(admin_required), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}


@router.get("/students", response_model=List[AdminStudent])
def list_students(school_id: Optional[str] = None, faculty_id: Optional[str] = None, department_id: Optional[str] = None, unassigned_only: Optional[bool] = None, current: User = Depends(admin_required), db: Session = Depends(get_db)):
    q = db.query(StudentProfile)
    if school_id:
        q = q.filter(StudentProfile.school_id == school_id)
    if faculty_id:
        q = q.filter(StudentProfile.faculty_id == faculty_id)
    if department_id:
        q = q.filter(StudentProfile.department_id == department_id)
    if unassigned_only:
        q = q.filter(StudentProfile.assigned_instructor_id == None)
    students = q.all()
    out = []
    for s in students:
        u = db.query(User).filter(User.id == s.user_id).first()
        out.append(AdminStudent(id=str(s.id), user_id=str(s.user_id), username=getattr(u,'username',None), email=getattr(u,'email',None), student_id=s.student_id, school_id=s.school_id, faculty_id=s.faculty_id, department_id=s.department_id, level=str(getattr(s,'level',None)), assigned_instructor_id=getattr(s,'assigned_instructor_id',None)))
    return out


@router.get("/instructors", response_model=List[AdminInstructor])
def list_instructors(school_id: Optional[str] = None, faculty_id: Optional[str] = None, department_id: Optional[str] = None, current: User = Depends(admin_required), db: Session = Depends(get_db)):
    q = db.query(Instructor)
    if school_id:
        q = q.filter(Instructor.school_id == school_id)
    if faculty_id:
        q = q.filter(Instructor.faculty_id == faculty_id)
    if department_id:
        q = q.filter(Instructor.department_id == department_id)
    instrs = q.all()
    out = []
    for i in instrs:
        u = db.query(User).filter(User.id == i.user_id).first()
        count = db.query(StudentProfile).filter(StudentProfile.assigned_instructor_id == i.id).count()
        out.append(AdminInstructor(id=str(i.id), user_id=str(i.user_id), username=getattr(u,'username',None), email=getattr(u,'email',None), assigned_student_count=count))
    return out


@router.get("/assignments/eligible-instructors/{student_id}", response_model=List[AdminInstructor])
def eligible_instructors(student_id: str, current: User = Depends(admin_required), db: Session = Depends(get_db)):
    student = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    q = db.query(Instructor)
    if student.department_id:
        q = q.filter(Instructor.department_id == student.department_id)
    elif student.faculty_id:
        q = q.filter(Instructor.faculty_id == student.faculty_id)
    instrs = q.all()
    out = []
    for i in instrs:
        u = db.query(User).filter(User.id == i.user_id).first()
        out.append(AdminInstructor(id=str(i.id), user_id=str(i.user_id), username=getattr(u,'username',None), email=getattr(u,'email',None)))
    return out


@router.post("/assignments", response_model=Assignment)
def create_assignment(payload: AssignPayload, current: User = Depends(admin_required), db: Session = Depends(get_db)):
    student = db.query(StudentProfile).filter(StudentProfile.id == payload.student_id).first()
    instructor = db.query(Instructor).filter(Instructor.id == payload.instructor_id).first()
    if not student or not instructor:
        raise HTTPException(status_code=404, detail="Student or instructor not found")
    student.assigned_instructor_id = instructor.id
    db.commit()
    return Assignment(id=str(uuid.uuid4()), student_id=str(student.id), student_name=getattr(student,'student_id',None), instructor_id=str(instructor.id), instructor_name=getattr(instructor,'user',''), assigned_at=None)


@router.delete("/assignments/{assignment_id}")
def delete_assignment(assignment_id: str, current: User = Depends(admin_required), db: Session = Depends(get_db)):
    student = db.query(StudentProfile).filter(StudentProfile.assigned_instructor_id == assignment_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Assignment not found")
    student.assigned_instructor_id = None
    db.commit()
    return {"message": "Assignment removed"}


@router.get("/assignments", response_model=List[Assignment])
def list_assignments(instructor_id: Optional[str] = None, current: User = Depends(admin_required), db: Session = Depends(get_db)):
    q = db.query(StudentProfile).filter(StudentProfile.assigned_instructor_id != None)
    if instructor_id:
        q = q.filter(StudentProfile.assigned_instructor_id == instructor_id)
    rows = q.all()
    out = []
    for s in rows:
        instr = db.query(Instructor).filter(Instructor.id == s.assigned_instructor_id).first()
        u = db.query(User).filter(User.id == instr.user_id).first() if instr else None
        out.append(Assignment(id=str(s.assigned_instructor_id), student_id=str(s.id), student_name=getattr(s,'student_id',None), instructor_id=str(instr.id) if instr else None, instructor_name=getattr(u,'username',None) if u else None, assigned_at=None))
    return out
from fastapi import APIRouter

router = APIRouter()

# We'll add endpoints later