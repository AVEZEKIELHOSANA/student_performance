# app/models.py
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(80), unique=True, nullable=False, index=True)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="student")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    predictions = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")
    cohorts = relationship("Cohort", back_populates="instructor", cascade="all, delete-orphan")

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    hours_studied = Column(Float)
    attendance = Column(Float)
    stress_level = Column(Float)
    exam_anxiety = Column(Float)
    previous_gpa = Column(Float)
    sleep_hours = Column(Float)
    tutoring_sessions = Column(Integer)
    
    predicted_gpa_range = Column(String(20))
    academic_status = Column(String(60))
    top_probability = Column(Float)
    predicted_grade = Column(String(10))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="predictions")

class Cohort(Base):
    __tablename__ = "cohorts"
    
    id = Column(Integer, primary_key=True, index=True)
    instructor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    cohort_name = Column(String(120), nullable=False)
    academic_year = Column(String(20))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    instructor = relationship("User", back_populates="cohorts")
    students = relationship("CohortStudent", back_populates="cohort", cascade="all, delete-orphan")

class CohortStudent(Base):
    __tablename__ = "cohort_students"
    
    id = Column(Integer, primary_key=True, index=True)
    cohort_id = Column(Integer, ForeignKey("cohorts.id"), nullable=False)
    student_name = Column(String(120), default="Anonymous")
    predicted_gpa_range = Column(String(20))
    academic_status = Column(String(60))
    probability = Column(Float)
    predicted_grade = Column(String(10))
    predicted_at = Column(DateTime(timezone=True), server_default=func.now())
    
    cohort = relationship("Cohort", back_populates="students")