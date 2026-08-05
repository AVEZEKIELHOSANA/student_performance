from sqlalchemy.orm import Session
from sqlalchemy import asc
from uuid import UUID
from typing import List, Optional

from app.modules.schools.models import School, Faculty, Department, Level


class SchoolService:
    
    @staticmethod
    def get_schools(db: Session) -> List[School]:
        return db.query(School).order_by(asc(School.name)).all()
    
    @staticmethod
    def get_school(db: Session, school_id: UUID) -> Optional[School]:
        return db.query(School).filter(School.id == school_id).first()
    
    @staticmethod
    def get_faculties(db: Session, school_id: UUID) -> List[Faculty]:
        return db.query(Faculty).filter(
            Faculty.school_id == school_id
        ).order_by(asc(Faculty.name)).all()
    
    @staticmethod
    def get_faculty(db: Session, faculty_id: UUID) -> Optional[Faculty]:
        return db.query(Faculty).filter(Faculty.id == faculty_id).first()
    
    @staticmethod
    def get_departments(db: Session, faculty_id: UUID) -> List[Department]:
        return db.query(Department).filter(
            Department.faculty_id == faculty_id
        ).order_by(asc(Department.name)).all()
    
    @staticmethod
    def get_department(db: Session, department_id: UUID) -> Optional[Department]:
        return db.query(Department).filter(Department.id == department_id).first()
    
    @staticmethod
    def get_levels(db: Session) -> List[Level]:
        return db.query(Level).order_by(asc(Level.value)).all()
