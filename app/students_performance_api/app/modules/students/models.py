from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)

    # Personal Information
    student_id = Column(String(50))
    phone_number = Column(String(20))
    address = Column(String(255))
    emergency_contact = Column(String(255))
    bio = Column(Text)

    # Academic Information
    school_id = Column(UUID(as_uuid=True), ForeignKey("schools.id"))
    faculty_id = Column(UUID(as_uuid=True), ForeignKey("faculties.id"))
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"))
    level = Column(Integer)

    current_gpa = Column(Float)
    total_credits = Column(Integer)
    academic_year = Column(String(20))
    # Instructor notes and flags (stored as JSON)
    flags = Column(JSON, default=list)
    notes = Column(JSON, default=list)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="student_profile")
    school = relationship("School")
    faculty = relationship("Faculty")
    department = relationship("Department")
