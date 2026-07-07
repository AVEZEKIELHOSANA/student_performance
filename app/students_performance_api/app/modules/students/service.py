from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional

from app.modules.students.models import StudentProfile
from app.modules.students.schemas import StudentProfileUpdate


class StudentService:
    
    @staticmethod
    def get_profile(db: Session, user_id: UUID) -> Optional[StudentProfile]:
        return db.query(StudentProfile).filter(
            StudentProfile.user_id == user_id
        ).first()
    
    @staticmethod
    def create_profile(db: Session, user_id: UUID, data: Optional[StudentProfileUpdate] = None) -> StudentProfile:
        profile = StudentProfile(
            user_id=user_id,
            student_id=data.student_id if data else None,
            phone_number=data.phone_number if data else None,
            address=data.address if data else None,
            emergency_contact=data.emergency_contact if data else None,
            bio=data.bio if data else None,
            school_id=data.school_id if data else None,
            faculty_id=data.faculty_id if data else None,
            department_id=data.department_id if data else None,
            level=data.level if data else None,
            current_gpa=data.current_gpa if data else None,
            total_credits=data.total_credits if data else None,
            academic_year=data.academic_year if data else None,
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile
    
    @staticmethod
    def update_profile(db: Session, user_id: UUID, data: StudentProfileUpdate) -> Optional[StudentProfile]:
        profile = db.query(StudentProfile).filter(
            StudentProfile.user_id == user_id
        ).first()
        
        if not profile:
            return None
        
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(profile, key, value)
        
        db.commit()
        db.refresh(profile)
        return profile
