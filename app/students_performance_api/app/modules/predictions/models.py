from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class Prediction(Base):
    __tablename__ = "predictions"

    prediction_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    # Input features
    hours_studied = Column(Float)
    attendance = Column(Float)
    sleep_hours = Column(Float)
    stress_level = Column(Float)
    screen_time = Column(Float)
    previous_gpa = Column(Float)
    part_time_job = Column(Integer)
    diet_quality = Column(Integer)
    internet_quality = Column(Integer)
    extracurricular = Column(Integer)
    tutoring_sessions = Column(Integer)
    family_income_level = Column(Integer)
    exam_anxiety = Column(Float)
    electricity_availability = Column(Float)
    internet_accessibility = Column(Integer)
    peer_influence = Column(Integer)
    community_beliefs = Column(Float)
    family_support = Column(Float)
    home_study_environment = Column(Float)
    motivation_level = Column(Float)
    lecture_quality = Column(Float)
    physical_health = Column(Float)
    psychological_state = Column(Float)
    gender_female = Column(Integer)
    gender_male = Column(Integer)
    gender_nonbinary = Column(Integer)
    study_method_hybrid = Column(Integer)
    study_method_offline = Column(Integer)
    study_method_online = Column(Integer)

    # Output results
    grade_label = Column(String(10))
    gpa_range = Column(String(20))
    academic_status = Column(String(60))
    probability = Column(Float)
    all_probabilities = Column(Text)
    recommendations = Column(Text)
    feature_importance = Column(Text)  # ✅ Store feature importance as JSON

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="predictions")