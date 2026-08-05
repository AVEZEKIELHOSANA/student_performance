from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class Instructor(Base):
    __tablename__ = "instructors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    faculty_id = Column(UUID(as_uuid=True), ForeignKey("faculties.id"))
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"))
    role = Column(String(50), nullable=False, default="lecturer")
    hire_date = Column(DateTime(timezone=True))
    office_hours = Column(String(100))
    phone_number = Column(String(20))
    office_location = Column(String(100))
    bio = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="instructor_profile")
    faculty = relationship("Faculty")
    department = relationship("Department")
