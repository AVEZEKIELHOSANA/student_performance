from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import uuid

from app.core.database import get_db
from app.core.security import get_current_user
from app.modules.users.models import User
from app.modules.instructors.models import Instructor
from app.modules.students.models import StudentProfile
from app.modules.predictions.models import Prediction
from app.modules.notifications.models import Notification
from app.modules.schools.models import Faculty, Department
from app.modules.instructors.schemas import (
    InstructorProfileUpdate,
    InstructorProfileResponse,
    StudentListResponse,
    NotificationPreferencesUpdate,
)

import logging

logger = logging.getLogger(__name__)
router = APIRouter()


async def get_current_instructor(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "instructor":
        raise HTTPException(status_code=403, detail="User is not an instructor")

    instructor = db.query(Instructor).filter(Instructor.user_id == current_user.id).first()
    if not instructor:
        instructor = Instructor(id=uuid.uuid4(), user_id=current_user.id, role="lecturer", is_active=True)
        db.add(instructor)
        db.commit()
        db.refresh(instructor)

    return {"user": current_user, "instructor": instructor}


@router.get("/profile", response_model=InstructorProfileResponse)
def get_profile(current: dict = Depends(get_current_instructor)):
    user = current["user"]
    instructor = current["instructor"]

    return InstructorProfileResponse(
        id=str(instructor.id),
        user_id=str(instructor.user_id),
        faculty=instructor.faculty.name if instructor.faculty else None,
        faculty_id=str(instructor.faculty_id) if instructor.faculty_id else None,
        department=instructor.department.name if instructor.department else None,
        department_id=str(instructor.department_id) if instructor.department_id else None,
        role=instructor.role,
        hire_date=instructor.hire_date.isoformat() if instructor.hire_date else None,
        office_hours=instructor.office_hours,
        phone_number=instructor.phone_number,
        office_location=instructor.office_location,
        bio=instructor.bio,
    )


@router.put("/profile")
def update_profile(
    data: InstructorProfileUpdate,
    current: dict = Depends(get_current_instructor),
    db: Session = Depends(get_db)
):
    instructor = current["instructor"]

    if data.faculty:
        faculty = db.query(Faculty).filter(Faculty.name == data.faculty).first()
        if faculty:
            instructor.faculty_id = faculty.id

    if data.department:
        dept = db.query(Department).filter(Department.name == data.department).first()
        if dept:
            instructor.department_id = dept.id

    if data.role:
        instructor.role = data.role
    if data.hire_date:
        instructor.hire_date = data.hire_date
    if data.office_hours is not None:
        instructor.office_hours = data.office_hours
    if data.phone_number is not None:
        instructor.phone_number = data.phone_number
    if data.office_location is not None:
        instructor.office_location = data.office_location
    if data.bio is not None:
        instructor.bio = data.bio

    db.commit()
    return {"message": "Profile updated successfully"}


@router.get("/students", response_model=List[StudentListResponse])
def get_students(
    current: dict = Depends(get_current_instructor),
    db: Session = Depends(get_db),
    limit: int = 100,
    offset: int = 0,
):
    instructor = current.get("instructor")

    try:
        query = (
            db.query(StudentProfile)
            .join(User, StudentProfile.user_id == User.id)
            .filter(User.is_active == True)
        )

        department_id = getattr(instructor, "department_id", None)
        faculty_id = getattr(instructor, "faculty_id", None)

        if department_id:
            query = query.filter(StudentProfile.department_id == department_id)
        elif faculty_id:
            query = query.filter(StudentProfile.faculty_id == faculty_id)

        students = query.offset(offset).limit(limit).all()

        response = []
        for student in students:
            user = db.query(User).filter(User.id == student.user_id).first()
            if not user:
                continue
            pred = (
                db.query(Prediction)
                .filter(Prediction.user_id == user.id)
                .order_by(Prediction.created_at.desc())
                .first()
            )

            response.append(StudentListResponse(
                id=str(student.id),
                student_id=student.student_id,
                user_id=str(user.id),
                first_name=getattr(user, "first_name", None),
                last_name=getattr(user, "last_name", None),
                email=user.email,
                level=str(getattr(student, "level", None)) if getattr(student, "level", None) is not None else None,
                current_gpa=float(getattr(student, "current_gpa")) if getattr(student, "current_gpa", None) is not None else None,
                risk_level=getattr(pred, "grade_label", None) if pred else None,
                enrollment_date=student.created_at.isoformat() if getattr(student, "created_at", None) else None,
            ))

        return response

    except Exception:
        logger.exception("Failed to fetch instructor students")
        raise HTTPException(status_code=500, detail="Failed to load students - check server logs")


@router.get("/students/{student_id}")
def get_student_detail(student_id: str, current: dict = Depends(get_current_instructor), db: Session = Depends(get_db)):
    student = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    user = db.query(User).filter(User.id == student.user_id).first()
    pred = db.query(Prediction).filter(Prediction.user_id == user.id).order_by(Prediction.created_at.desc()).first()
    return {
        "id": str(student.id),
        "student_id": student.student_id,
        "user": {"id": str(user.id), "email": user.email, "username": getattr(user, 'username', None)},
        "level": str(student.level) if getattr(student, 'level', None) is not None else None,
        "current_gpa": getattr(student, 'current_gpa', None),
        "latest_prediction": {
            "grade_label": pred.grade_label if pred else None,
            "probability": pred.probability if pred else None,
            "created_at": pred.created_at.isoformat() if pred and pred.created_at else None,
        } if pred else None,
        "flags": getattr(student, 'flags', []),
        "notes": getattr(student, 'notes', []),
    }


@router.get("/notifications")
def get_notifications(current: dict = Depends(get_current_instructor), db: Session = Depends(get_db), limit: int = 50, offset: int = 0):
    user = current["user"]
    notifications = db.query(Notification).filter(Notification.user_id == user.id).order_by(Notification.created_at.desc()).offset(offset).limit(limit).all()
    return [
        {
            "id": str(n.id),
            "type": n.type,
            "title": n.title,
            "message": n.message,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat() if n.created_at else None,
            "action_url": n.action_url,
            "metadata": n.metadata_json if hasattr(n, 'metadata_json') else None,
        }
        for n in notifications
    ]


@router.put("/notifications/{notification_id}/read")
def mark_notification_read(notification_id: str, current: dict = Depends(get_current_instructor), db: Session = Depends(get_db)):
    user = current["user"]
    notification = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == user.id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.is_read = True
    notification.read_at = func.now()
    db.commit()
    return {"message": "Notification marked as read"}


@router.put("/notifications/read-all")
def mark_all_notifications_read(current: dict = Depends(get_current_instructor), db: Session = Depends(get_db)):
    user = current["user"]
    db.query(Notification).filter(Notification.user_id == user.id, Notification.is_read == False).update({Notification.is_read: True, Notification.read_at: func.now()})
    db.commit()
    return {"message": "All notifications marked as read"}


@router.delete("/notifications/{notification_id}")
def delete_notification(notification_id: str, current: dict = Depends(get_current_instructor), db: Session = Depends(get_db)):
    user = current["user"]
    notification = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == user.id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(notification)
    db.commit()
    return {"message": "Notification deleted"}


@router.get("/notifications/preferences")
def get_notification_preferences(current: dict = Depends(get_current_instructor)):
    return {
        "email_notifications": True,
        "push_notifications": False,
        "weekly_reports": True,
        "prediction_alerts": True,
        "risk_alerts": True,
        "intervention_alerts": True,
        "reminder_notifications": True,
        "marketing_emails": False,
    }


@router.put("/notifications/preferences")
def update_notification_preferences(data: NotificationPreferencesUpdate, current: dict = Depends(get_current_instructor)):
    return {"message": "Preferences updated successfully"}


@router.get("/grade-distribution")
def get_grade_distribution(current: dict = Depends(get_current_instructor), db: Session = Depends(get_db)):
    instructor = current["instructor"]
    query = db.query(Prediction).join(User)
    if getattr(instructor, 'department_id', None):
        query = query.join(StudentProfile, StudentProfile.user_id == User.id).filter(StudentProfile.department_id == instructor.department_id)
    elif getattr(instructor, 'faculty_id', None):
        query = query.join(StudentProfile, StudentProfile.user_id == User.id).filter(StudentProfile.faculty_id == instructor.faculty_id)

    preds = query.all()
    dist = {"A":0, "B":0, "C":0, "D":0, "Fail":0}
    for p in preds:
        label = p.grade_label if p.grade_label in dist else "C"
        dist[label] += 1
    return {"distribution": dist}


@router.get("/recent-activity")
def get_recent_activity(current: dict = Depends(get_current_instructor), db: Session = Depends(get_db)):
    instructor = current["instructor"]
    query = db.query(Prediction).join(User)
    if getattr(instructor, 'department_id', None):
        query = query.join(StudentProfile, StudentProfile.user_id == User.id).filter(StudentProfile.department_id == instructor.department_id)
    elif getattr(instructor, 'faculty_id', None):
        query = query.join(StudentProfile, StudentProfile.user_id == User.id).filter(StudentProfile.faculty_id == instructor.faculty_id)

    preds = query.order_by(Prediction.created_at.desc()).limit(20).all()
    activities = []
    for p in preds:
        activities.append({
            "student_id": str(p.user_id),
            "grade_label": p.grade_label,
            "probability": p.probability,
            "created_at": p.created_at.isoformat() if p.created_at else None,
        })
    return {"recent_activity": activities}


@router.get("/cohorts")
def get_cohorts(current: dict = Depends(get_current_instructor), db: Session = Depends(get_db)):
    instructor = current["instructor"]
    cohorts = []
    if instructor.faculty:
        for dept in instructor.faculty.departments:
            cohorts.append({"id": str(dept.id), "name": dept.name})
    return {"cohorts": cohorts}


@router.get("/cohorts/{cohort_id}")
def get_cohort_detail(cohort_id: str, current: dict = Depends(get_current_instructor), db: Session = Depends(get_db)):
    dept = db.query(Department).filter(Department.id == cohort_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Cohort not found")
    students = db.query(StudentProfile).filter(StudentProfile.department_id == dept.id).all()
    return {"id": str(dept.id), "name": dept.name, "students": [str(s.id) for s in students]}


@router.get("/cohorts/{cohort_id}/report")
def get_cohort_report(cohort_id: str, format: str = "json", current: dict = Depends(get_current_instructor), db: Session = Depends(get_db)):
    dept = db.query(Department).filter(Department.id == cohort_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Cohort not found")
    students = db.query(StudentProfile).filter(StudentProfile.department_id == dept.id).all()
    report = {"cohort": dept.name, "total_students": len(students)}
    if format == "csv":
        rows = ["student_id,username,email"]
        for s in students:
            u = db.query(User).filter(User.id == s.user_id).first()
            rows.append(f"{s.student_id},{getattr(u,'username','')},{getattr(u,'email','')}")
        return {"report": "\n".join(rows)}
    return {"report": report}


@router.post("/batch-predict")
def batch_predict(payload: dict, current: dict = Depends(get_current_instructor), db: Session = Depends(get_db)):
    ids = payload.get("student_ids", [])
    results = []
    for sid in ids:
        student = db.query(StudentProfile).filter(StudentProfile.id == sid).first()
        if not student:
            results.append({"student_id": sid, "status": "not_found"})
            continue
        results.append({"student_id": sid, "status": "queued"})
    return {"results": results}


@router.patch("/students/{student_id}/flag")
def flag_student(student_id: str, payload: dict, current: dict = Depends(get_current_instructor), db: Session = Depends(get_db)):
    student = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    flag = payload.get("flag")
    if not flag:
        raise HTTPException(status_code=400, detail="flag is required")
    flags = getattr(student, 'flags', []) or []
    flags.append({"flag": flag, "by": str(current['user'].id)})
    student.flags = flags
    db.commit()
    return {"message": "Flag added", "flags": flags}


@router.patch("/students/{student_id}/note")
def note_student(student_id: str, payload: dict, current: dict = Depends(get_current_instructor), db: Session = Depends(get_db)):
    student = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    note = payload.get("note")
    if not note:
        raise HTTPException(status_code=400, detail="note is required")
    notes = getattr(student, 'notes', []) or []
    notes.append({"note": note, "by": str(current['user'].id)})
    student.notes = notes
    db.commit()
    return {"message": "Note added", "notes": notes}
