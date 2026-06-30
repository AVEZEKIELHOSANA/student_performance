from pydantic import BaseModel
from typing import Dict, List, Optional
from uuid import UUID

class PredictionRequest(BaseModel):
    hours_studied: float
    attendance: float
    sleep_hours: float
    stress_level: float
    screen_time: float
    previous_gpa: float
    part_time_job: int
    diet_quality: int
    internet_quality: int
    extracurricular: int
    tutoring_sessions: int
    family_income_level: int
    exam_anxiety: float
    electricity_availability: float
    internet_accessibility: int
    peer_influence: int
    community_beliefs: float
    family_support: float
    home_study_environment: float
    motivation_level: float
    lecture_quality: float
    physical_health: float
    psychological_state: float
    gender_female: int
    gender_male: int
    gender_nonbinary: int
    study_method_hybrid: int
    study_method_offline: int
    study_method_online: int

class PredictionResponse(BaseModel):
    prediction_id: Optional[UUID] = None
    predicted_grade: str
    predicted_gpa_range: str
    academic_status: str
    top_probability: float
    all_probabilities: Dict[str, float]
    recommendations: List[str]