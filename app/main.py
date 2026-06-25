# -*- coding: utf-8 -*-
"""
main.py - COMPLETE FIXED VERSION
FastAPI backend for Student Performance Prediction System
"""

import os
import joblib
import numpy as np
import pandas as pd
from contextlib import asynccontextmanager
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator
from sqlalchemy.orm import Session

from app.database import get_db, init_db
from app import models
from app.auth import hash_password, verify_password, create_access_token, get_current_user, require_role

# ── ML artefact storage ───────────────────────────────────────
ML = {}

# ── Application lifespan ──────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML artefacts on startup."""
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_dir = os.path.join(base, "models")
    
    try:
        ML["model"] = joblib.load(os.path.join(model_dir, "best_model.pkl"))
        ML["scaler"] = joblib.load(os.path.join(model_dir, "scaler.pkl"))
        ML["encoder"] = joblib.load(os.path.join(model_dir, "label_encoder.pkl"))
        ML["feature_names"] = joblib.load(os.path.join(model_dir, "feature_names.pkl"))
        print("✅ ML artefacts loaded successfully.")
    except Exception as e:
        print(f"⚠️ Error loading ML artefacts: {e}")
        ML["model"] = None
        ML["scaler"] = None
        ML["encoder"] = None
        ML["feature_names"] = []
    
    init_db()
    yield
    ML.clear()

# ── FastAPI application ──────────────────────────────────────
app = FastAPI(
    title="Student Performance Prediction API",
    description="University of Buea — FET — Final Year Project 2025/2026",
    version="1.0.0",
    lifespan=lifespan
)

# ── CORS ──────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8501", "http://localhost:8000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Root route ─────────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "message": "Student Performance Prediction API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "online" if ML.get("model") else "model not loaded"
    }

@app.get("/api/v1/health")
def health():
    return {
        "status": "online",
        "model_loaded": ML.get("model") is not None,
        "scaler_loaded": ML.get("scaler") is not None
    }

# ── Pydantic Schemas ──────────────────────────────────────────
class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=80)
    email: str = Field(..., min_length=5)
    password: str = Field(..., min_length=6)
    role: str = Field(default="student")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    username: str

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
    predicted_grade: str
    predicted_gpa_range: str
    academic_status: str
    top_probability: float
    all_probabilities: Dict[str, float]
    recommendations: List[str]

# ── Grade config ──────────────────────────────────────────────
GPA_RANGES = {
    "A": "3.50 – 4.00",
    "B": "3.00 – 3.49",
    "C": "2.50 – 2.99",
    "D": "2.00 – 2.49",
    "Fail": "Below 2.00"
}

STATUS_MAP = {
    "A": "Excellent Performance",
    "B": "Good Performance",
    "C": "Average Performance",
    "D": "Below Average — At Risk",
    "Fail": "Fail — Immediate Action Required"
}

COLS_TO_SCALE = [
    'Hours_Studied', 'Attendance', 'Sleep_Hours', 'Stress_Level', 'Screen_Time',
    'Previous_GPA', 'Diet_Quality', 'Internet_Quality', 'Tutoring_Sessions_Per_Week',
    'Family_Income_Level', 'Exam_Anxiety_Score', 'Electricity_Availability',
    'Internet_Accessibility', 'Peer_Influence', 'Community_Beliefs', 'Family_Support',
    'Home_Study_Environment', 'Motivation_Level', 'Lecture_Quality',
    'Physical_Health', 'Psychological_State'
]

# ── Prediction Engine ──────────────────────────────────────────
def run_prediction(req: PredictionRequest) -> dict:
    if ML.get("model") is None:
        raise HTTPException(503, "Model not loaded. Please try again later.")
    
    raw = {
        'Hours_Studied': req.hours_studied,
        'Attendance': req.attendance,
        'Sleep_Hours': req.sleep_hours,
        'Stress_Level': req.stress_level,
        'Screen_Time': req.screen_time,
        'Previous_GPA': req.previous_gpa,
        'Part_Time_Job': req.part_time_job,
        'Diet_Quality': req.diet_quality,
        'Internet_Quality': req.internet_quality,
        'Extracurricular': req.extracurricular,
        'Tutoring_Sessions_Per_Week': req.tutoring_sessions,
        'Family_Income_Level': req.family_income_level,
        'Exam_Anxiety_Score': req.exam_anxiety,
        'Electricity_Availability': req.electricity_availability,
        'Internet_Accessibility': req.internet_accessibility,
        'Peer_Influence': req.peer_influence,
        'Community_Beliefs': req.community_beliefs,
        'Family_Support': req.family_support,
        'Home_Study_Environment': req.home_study_environment,
        'Motivation_Level': req.motivation_level,
        'Lecture_Quality': req.lecture_quality,
        'Physical_Health': req.physical_health,
        'Psychological_State': req.psychological_state,
        'Gender_Female': req.gender_female,
        'Gender_Male': req.gender_male,
        'Gender_Non-Binary': req.gender_nonbinary,
        'Study_Method_Hybrid': req.study_method_hybrid,
        'Study_Method_Offline': req.study_method_offline,
        'Study_Method_Online': req.study_method_online,
    }
    
    feature_names = ML.get("feature_names", [])
    if not feature_names:
        raise HTTPException(503, "Feature names not loaded.")
    
    df = pd.DataFrame([raw])
    
    # Ensure all required columns exist
    for col in feature_names:
        if col not in df.columns:
            df[col] = 0
    
    df = df[feature_names]
    
    scaler = ML.get("scaler")
    if scaler:
        df[COLS_TO_SCALE] = scaler.transform(df[COLS_TO_SCALE])
    
    model = ML.get("model")
    pred = model.predict(df)
    probs = model.predict_proba(df)[0]
    
    encoder = ML.get("encoder")
    grade = encoder.inverse_transform(pred)[0]
    classes = encoder.classes_
    
    return {
        "grade": grade,
        "gpa_range": GPA_RANGES.get(grade, ""),
        "status": STATUS_MAP.get(grade, ""),
        "top_prob": round(float(max(probs)) * 100, 1),
        "all_probs": {g: round(float(p) * 100, 1) for g, p in zip(classes, probs)},
    }

# ── Advice Engine ─────────────────────────────────────────────
def generate_advice(req: PredictionRequest) -> List[str]:
    tips = []
    
    if req.hours_studied < 3:
        tips.append("Your daily study hours are critically low. Aim for a minimum of 5 hours per day.")
    elif req.hours_studied < 5:
        tips.append("Your study hours are moderate. Increasing to 6+ hours would improve outcomes.")
    else:
        tips.append("Your study commitment is strong. Maintain this discipline.")
    
    if req.exam_anxiety >= 7:
        tips.append("Your exam anxiety is high. Practice past questions and join study groups.")
    elif req.exam_anxiety >= 5:
        tips.append("Moderate exam anxiety detected. Regular revision will help.")
    else:
        tips.append("Your exam anxiety is well managed.")
    
    if req.stress_level >= 7:
        tips.append("You are experiencing high stress. Seek support from your academic advisor.")
    elif req.stress_level >= 5:
        tips.append("Your stress level is moderate. Physical exercise can help reduce it.")
    
    if req.sleep_hours < 6:
        tips.append("You are sleeping less than recommended. Aim for 7-8 hours per night.")
    
    if req.attendance < 60:
        tips.append("CRITICAL: Your attendance is below 60%. You may be barred from examinations.")
    elif req.attendance < 75:
        tips.append("Your attendance is below the required threshold. Attend all remaining lectures.")
    else:
        tips.append("Your attendance is good. Keep it up!")
    
    if req.motivation_level < 3:
        tips.append("Your motivation is low. Set short-term academic goals to rebuild your drive.")
    
    if req.tutoring_sessions == 0:
        tips.append("You are not attending extra study sessions. Join a study group or tutoring session.")
    
    return tips

# ════════════════════════════════════════════════════════════
# AUTHENTICATION ROUTES
# ════════════════════════════════════════════════════════════
@app.post("/api/v1/auth/register", status_code=201)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user account."""
    # Validate role
    if req.role not in ["student", "instructor", "admin"]:
        raise HTTPException(400, "Role must be student, instructor, or admin.")
    
    # Check existing user
    if db.query(models.User).filter(models.User.username == req.username).first():
        raise HTTPException(400, "Username already exists.")
    
    if db.query(models.User).filter(models.User.email == req.email).first():
        raise HTTPException(400, "Email already registered.")
    
    # Create user
    user = models.User(
        username=req.username,
        email=req.email,
        password_hash=hash_password(req.password),
        role=req.role
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {"message": f"Account created successfully. Welcome, {user.username}!", "user": user.username}

@app.post("/api/v1/auth/login", response_model=TokenResponse)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Authenticate user and return JWT token."""
    user = db.query(models.User).filter(models.User.username == form.username).first()
    
    if not user:
        raise HTTPException(401, "Invalid username or password.")
    
    if not verify_password(form.password, user.password_hash):
        raise HTTPException(401, "Invalid username or password.")
    
    if not user.is_active:
        raise HTTPException(403, "Your account has been deactivated.")
    
    token = create_access_token({"sub": user.username, "role": user.role})
    
    return TokenResponse(
        access_token=token,
        role=user.role,
        username=user.username
    )

# ════════════════════════════════════════════════════════════
# PREDICTION ROUTES
# ════════════════════════════════════════════════════════════
@app.post("/api/v1/predict", response_model=PredictionResponse)
def predict(
    req: PredictionRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Run prediction and save to history."""
    result = run_prediction(req)
    advice = generate_advice(req)
    
    # Save to history
    record = models.Prediction(
        user_id=current_user.id,
        hours_studied=req.hours_studied,
        attendance=req.attendance,
        stress_level=req.stress_level,
        exam_anxiety=req.exam_anxiety,
        previous_gpa=req.previous_gpa,
        sleep_hours=req.sleep_hours,
        tutoring_sessions=req.tutoring_sessions,
        predicted_gpa_range=result["gpa_range"],
        academic_status=result["status"],
        top_probability=result["top_prob"],
        predicted_grade=result["grade"],
    )
    db.add(record)
    db.commit()
    
    return PredictionResponse(
        predicted_grade=result["grade"],
        predicted_gpa_range=result["gpa_range"],
        academic_status=result["status"],
        top_probability=result["top_prob"],
        all_probabilities=result["all_probs"],
        recommendations=advice
    )

@app.post("/api/v1/predict/whatif", response_model=PredictionResponse)
def whatif_predict(
    req: PredictionRequest,
    current_user: models.User = Depends(get_current_user)
):
    """What-If simulation - prediction without saving."""
    result = run_prediction(req)
    advice = generate_advice(req)
    
    return PredictionResponse(
        predicted_grade=result["grade"],
        predicted_gpa_range=result["gpa_range"],
        academic_status=result["status"],
        top_probability=result["top_prob"],
        all_probabilities=result["all_probs"],
        recommendations=advice
    )

@app.get("/api/v1/history")
def get_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get prediction history."""
    records = db.query(models.Prediction).filter(
        models.Prediction.user_id == current_user.id
    ).order_by(models.Prediction.created_at.desc()).limit(20).all()
    
    return [
        {
            "id": r.id,
            "predicted_gpa_range": r.predicted_gpa_range,
            "academic_status": r.academic_status,
            "top_probability": r.top_probability,
            "predicted_grade": r.predicted_grade,
            "hours_studied": r.hours_studied,
            "attendance": r.attendance,
            "stress_level": r.stress_level,
            "created_at": str(r.created_at),
        }
        for r in records
    ]

# ════════════════════════════════════════════════════════════
# ADMIN ROUTES
# ════════════════════════════════════════════════════════════
@app.get("/api/v1/admin/users")
def list_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    users = db.query(models.User).all()
    return [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role,
            "is_active": u.is_active,
            "created_at": str(u.created_at)
        }
        for u in users
    ]

@app.get("/api/v1/admin/stats")
def system_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    return {
        "total_users": db.query(models.User).count(),
        "total_students": db.query(models.User).filter(models.User.role == "student").count(),
        "total_instructors": db.query(models.User).filter(models.User.role == "instructor").count(),
        "total_predictions": db.query(models.Prediction).count(),
    }