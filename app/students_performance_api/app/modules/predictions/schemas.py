from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from uuid import UUID

class PredictionRequest(BaseModel):
    hours_studied: float = Field(..., ge=0, le=12)
    attendance: float = Field(..., ge=0, le=100)
    sleep_hours: float = Field(..., ge=3, le=10)
    stress_level: float = Field(..., ge=1, le=10)
    screen_time: float = Field(..., ge=0, le=12)
    previous_gpa: float = Field(..., ge=0, le=4)
    part_time_job: int = Field(..., ge=0, le=1)
    diet_quality: int = Field(..., ge=0, le=2)
    internet_quality: int = Field(..., ge=0, le=3)
    extracurricular: int = Field(..., ge=0, le=1)
    tutoring_sessions: int = Field(..., ge=0, le=5)
    family_income_level: int = Field(..., ge=0, le=2)
    exam_anxiety: float = Field(..., ge=1, le=10)
    electricity_availability: float = Field(..., ge=0, le=1)
    internet_accessibility: int = Field(..., ge=0, le=2)
    peer_influence: int = Field(..., ge=0, le=2)
    community_beliefs: float = Field(..., ge=1, le=5)
    family_support: float = Field(..., ge=1, le=5)
    home_study_environment: float = Field(..., ge=1, le=5)
    motivation_level: float = Field(..., ge=1, le=5)
    lecture_quality: float = Field(..., ge=1, le=5)
    physical_health: float = Field(..., ge=1, le=5)
    psychological_state: float = Field(..., ge=1, le=5)
    gender_female: int = Field(..., ge=0, le=1)
    gender_male: int = Field(..., ge=0, le=1)
    gender_nonbinary: int = Field(..., ge=0, le=1)
    study_method_hybrid: int = Field(..., ge=0, le=1)
    study_method_offline: int = Field(..., ge=0, le=1)
    study_method_online: int = Field(..., ge=0, le=1)

class PredictionResponse(BaseModel):
    prediction_id: Optional[str] = None
    predicted_grade: str
    predicted_gpa_range: str
    academic_status: str
    top_probability: float
    all_probabilities: Dict[str, float]
    recommendations: List[str]
    created_at: Optional[str] = None