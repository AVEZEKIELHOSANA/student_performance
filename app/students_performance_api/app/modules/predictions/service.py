import json
import numpy as np
import pandas as pd
from sqlalchemy.orm import Session
from sqlalchemy import desc
from uuid import UUID
from typing import List, Dict, Optional, Any
from fastapi import HTTPException, status

from app.modules.predictions.models import Prediction
from app.ml.model_loader import ModelLoader
from app.core.config import settings

# ── Grade Constants ──────────────────────────────────────────

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

# ── Feature Names for Importance ─────────────────────────────

FEATURE_NAMES = [
    'Hours_Studied', 'Tutoring_Sessions_Per_Week', 'Exam_Anxiety_Score',
    'Stress_Level', 'Previous_GPA', 'Motivation_Level', 'Screen_Time',
    'Attendance', 'Psychological_State', 'Sleep_Hours', 'Diet_Quality',
    'Community_Beliefs', 'Electricity_Availability', 'Family_Support',
    'Home_Study_Environment'
]

FEATURE_ICONS = {
    'Hours_Studied': '📚',
    'Tutoring_Sessions_Per_Week': '👨‍🏫',
    'Exam_Anxiety_Score': '😰',
    'Stress_Level': '💆',
    'Previous_GPA': '📈',
    'Motivation_Level': '💪',
    'Screen_Time': '📱',
    'Attendance': '📊',
    'Psychological_State': '🧠',
    'Sleep_Hours': '😴',
    'Diet_Quality': '🍎',
    'Community_Beliefs': '🤝',
    'Electricity_Availability': '⚡',
    'Family_Support': '👨‍👩‍👧',
    'Home_Study_Environment': '🏠'
}

# ── Advice Engine ────────────────────────────────────────────

def generate_advice(req) -> List[str]:
    tips = []
    
    if req.hours_studied < 3:
        tips.append("⚠️ Your study hours are critically low. Aim for a minimum of 5 hours per day.")
    elif req.hours_studied < 5:
        tips.append("📈 Your study hours are moderate. Increasing to 6+ hours would improve outcomes.")
    else:
        tips.append("✅ Your study commitment is strong. Maintain this discipline.")
    
    if req.exam_anxiety >= 7:
        tips.append("🧘 Your exam anxiety is high. Practice past questions regularly and seek counselling.")
    elif req.exam_anxiety >= 5:
        tips.append("📝 Moderate exam anxiety detected. Regular revision will help.")
    else:
        tips.append("✅ Your exam anxiety is well managed.")
    
    if req.stress_level >= 7:
        tips.append("💆 You are experiencing high stress. Seek support from your academic advisor.")
    elif req.stress_level >= 5:
        tips.append("🏃 Your stress level is moderate. Physical exercise can help reduce it.")
    else:
        tips.append("✅ Your stress level is well managed.")
    
    if req.sleep_hours < 6:
        tips.append("😴 You are sleeping less than recommended. Aim for 7-8 hours per night.")
    
    if req.attendance < 60:
        tips.append("🚨 CRITICAL: Your attendance is below 60%. You may be barred from examinations.")
    elif req.attendance < 75:
        tips.append("📚 Your attendance is below the required threshold. Attend all remaining lectures.")
    else:
        tips.append("✅ Your attendance is good. Keep it up!")
    
    if req.motivation_level < 3:
        tips.append("💪 Your motivation is low. Set short-term academic goals to rebuild your drive.")
    
    if req.tutoring_sessions == 0:
        tips.append("👨‍🏫 You are not attending extra study sessions. Join a study group or tutoring session.")
    
    return tips

# ── Feature Importance Calculator ────────────────────────────

def calculate_feature_importance(req) -> Dict[str, float]:
    """Calculate feature importance based on input values."""
    # Normalize each feature to 0-100 scale based on typical ranges
    importance = {}
    
    # Study Hours (0-12 -> 0-100)
    importance['Hours_Studied'] = min(100, (req.hours_studied / 12) * 100)
    
    # Tutoring Sessions (0-5 -> 0-100)
    importance['Tutoring_Sessions_Per_Week'] = min(100, (req.tutoring_sessions / 5) * 100)
    
    # Exam Anxiety (1-10 -> inverted, lower is better)
    importance['Exam_Anxiety_Score'] = max(0, 100 - ((req.exam_anxiety / 10) * 100))
    
    # Stress Level (1-10 -> inverted, lower is better)
    importance['Stress_Level'] = max(0, 100 - ((req.stress_level / 10) * 100))
    
    # Previous GPA (0-4 -> 0-100)
    importance['Previous_GPA'] = min(100, (req.previous_gpa / 4) * 100)
    
    # Motivation Level (1-5 -> 0-100)
    importance['Motivation_Level'] = min(100, (req.motivation_level / 5) * 100)
    
    # Screen Time (0-12 -> inverted, lower is better)
    importance['Screen_Time'] = max(0, 100 - ((req.screen_time / 12) * 100))
    
    # Attendance (0-100)
    importance['Attendance'] = min(100, req.attendance)
    
    # Psychological State (1-5 -> 0-100)
    importance['Psychological_State'] = min(100, (req.psychological_state / 5) * 100)
    
    # Sleep Hours (3-10 -> 0-100)
    importance['Sleep_Hours'] = min(100, ((req.sleep_hours - 3) / 7) * 100)
    
    # Diet Quality (0-2 -> 0-100)
    importance['Diet_Quality'] = min(100, (req.diet_quality / 2) * 100)
    
    # Community Beliefs (1-5 -> 0-100)
    importance['Community_Beliefs'] = min(100, (req.community_beliefs / 5) * 100)
    
    # Electricity Availability (0-1 -> 0-100)
    importance['Electricity_Availability'] = min(100, req.electricity_availability * 100)
    
    # Family Support (1-5 -> 0-100)
    importance['Family_Support'] = min(100, (req.family_support / 5) * 100)
    
    # Home Study Environment (1-5 -> 0-100)
    importance['Home_Study_Environment'] = min(100, (req.home_study_environment / 5) * 100)
    
    return importance

# ── Prediction Service ───────────────────────────────────────

class PredictionService:
    
    @staticmethod
    def run_prediction(req) -> Dict[str, Any]:
        """Core prediction logic — encode, scale, predict, decode."""
        # Ensure model is loaded; attempt lazy load if not
        if not ModelLoader.is_loaded():
            try:
                ModelLoader.load_model(
                    settings.MODEL_PATH,
                    settings.SCALER_PATH,
                    settings.ENCODER_PATH,
                    settings.FEATURES_PATH,
                )
            except Exception as e:
                print(f"Lazy load failed: {e}")

        try:
            model = ModelLoader.get_model()
            scaler = ModelLoader.get_scaler()
            encoder = ModelLoader.get_encoder()
            feature_names = ModelLoader.get_feature_names()
        except RuntimeError as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=str(e)
            )
        
        # Prepare raw data
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
        
        # Create DataFrame with correct feature order
        df = pd.DataFrame([raw])
        
        if feature_names:
            for col in feature_names:
                if col not in df.columns:
                    df[col] = 0
            df = df[feature_names]
        
        # Scale features
        if scaler is not None:
            df[COLS_TO_SCALE] = scaler.transform(df[COLS_TO_SCALE])
        
        # Predict
        pred = model.predict(df)
        probs = model.predict_proba(df)[0]
        
        if encoder is not None:
            grade = encoder.inverse_transform(pred)[0]
            classes = encoder.classes_
        else:
            grade = "C"
            classes = ["A", "B", "C", "D", "Fail"]
        
        recommendations = generate_advice(req)
        feature_importance = calculate_feature_importance(req)
        
        return {
            "grade": grade,
            "gpa_range": GPA_RANGES.get(grade, ""),
            "status": STATUS_MAP.get(grade, ""),
            "top_prob": round(float(max(probs)) * 100, 1),
            "all_probs": {g: round(float(p) * 100, 1) for g, p in zip(classes, probs)},
            "recommendations": recommendations,
            "feature_importance": feature_importance
        }
    
    @staticmethod
    def save_prediction(db: Session, user_id: UUID, req, result: Dict[str, Any]) -> Prediction:
        """Save prediction to database."""
        prediction = Prediction(
            user_id=user_id,
            hours_studied=req.hours_studied,
            attendance=req.attendance,
            sleep_hours=req.sleep_hours,
            stress_level=req.stress_level,
            screen_time=req.screen_time,
            previous_gpa=req.previous_gpa,
            part_time_job=req.part_time_job,
            diet_quality=req.diet_quality,
            internet_quality=req.internet_quality,
            extracurricular=req.extracurricular,
            tutoring_sessions=req.tutoring_sessions,
            family_income_level=req.family_income_level,
            exam_anxiety=req.exam_anxiety,
            electricity_availability=req.electricity_availability,
            internet_accessibility=req.internet_accessibility,
            peer_influence=req.peer_influence,
            community_beliefs=req.community_beliefs,
            family_support=req.family_support,
            home_study_environment=req.home_study_environment,
            motivation_level=req.motivation_level,
            lecture_quality=req.lecture_quality,
            physical_health=req.physical_health,
            psychological_state=req.psychological_state,
            gender_female=req.gender_female,
            gender_male=req.gender_male,
            gender_nonbinary=req.gender_nonbinary,
            study_method_hybrid=req.study_method_hybrid,
            study_method_offline=req.study_method_offline,
            study_method_online=req.study_method_online,
            grade_label=result["grade"],
            gpa_range=result["gpa_range"],
            academic_status=result["status"],
            probability=result["top_prob"],
            all_probabilities=json.dumps(result["all_probs"]),
            recommendations=json.dumps(result["recommendations"]),
            feature_importance=json.dumps(result["feature_importance"])
        )
        
        db.add(prediction)
        db.commit()
        db.refresh(prediction)
        
        return prediction
    
    @staticmethod
    def get_predictions(db: Session, user_id: UUID, limit: int = 20) -> List[Dict]:
        """Get prediction history for a user."""
        predictions = db.query(Prediction).filter(
            Prediction.user_id == user_id
        ).order_by(
            desc(Prediction.created_at)
        ).limit(limit).all()
        
        return [
            {
                "id": str(p.prediction_id),
                "grade_label": p.grade_label,
                "gpa_range": p.gpa_range,
                "academic_status": p.academic_status,
                "probability": p.probability,
                "created_at": p.created_at.isoformat() if p.created_at else None
            }
            for p in predictions
        ]
    
    @staticmethod
    def get_latest_prediction(db: Session, user_id: UUID) -> Optional[Dict]:
        """Get the latest prediction for a user."""
        p = db.query(Prediction).filter(
            Prediction.user_id == user_id
        ).order_by(
            desc(Prediction.created_at)
        ).first()
        
        if not p:
            return None
        
        return {
            "id": str(p.prediction_id),
            "grade_label": p.grade_label,
            "gpa_range": p.gpa_range,
            "academic_status": p.academic_status,
            "probability": p.probability,
            "created_at": p.created_at.isoformat() if p.created_at else None
        }
    
    @staticmethod
    def get_dashboard_stats(db: Session, user_id: UUID) -> Dict:
        """Get all dashboard statistics for a user."""
        # Get predictions
        predictions = db.query(Prediction).filter(
            Prediction.user_id == user_id
        ).order_by(
            desc(Prediction.created_at)
        ).all()
        
        # Get latest prediction
        latest = predictions[0] if predictions else None
        
        # Calculate stats
        total_predictions = len(predictions)
        
        # Risk level from latest
        risk_level = "Low"
        if latest:
            if latest.probability >= 70:
                risk_level = "Low"
            elif latest.probability >= 50:
                risk_level = "Medium"
            else:
                risk_level = "High"
        
        # ── Feature Importance from latest prediction ────────
        top_features = {
            "best": {"feature": "N/A", "value": 0, "icon": "📊"},
            "second": {"feature": "N/A", "value": 0, "icon": "📊"},
            "third": {"feature": "N/A", "value": 0, "icon": "📊"},
            "worst": {"feature": "N/A", "value": 0, "icon": "📊"}
        }
        
        if latest and latest.feature_importance:
            try:
                importance_dict = json.loads(latest.feature_importance)
                
                # Sort features by importance value
                sorted_features = sorted(
                    importance_dict.items(),
                    key=lambda x: x[1],
                    reverse=True
                )
                
                # Get top 3 and bottom 1
                if len(sorted_features) >= 4:
                    top_features["best"] = {
                        "feature": sorted_features[0][0].replace('_', ' ').title(),
                        "value": round(sorted_features[0][1]),
                        "icon": FEATURE_ICONS.get(sorted_features[0][0], '📊')
                    }
                    top_features["second"] = {
                        "feature": sorted_features[1][0].replace('_', ' ').title(),
                        "value": round(sorted_features[1][1]),
                        "icon": FEATURE_ICONS.get(sorted_features[1][0], '📊')
                    }
                    top_features["third"] = {
                        "feature": sorted_features[2][0].replace('_', ' ').title(),
                        "value": round(sorted_features[2][1]),
                        "icon": FEATURE_ICONS.get(sorted_features[2][0], '📊')
                    }
                    top_features["worst"] = {
                        "feature": sorted_features[-1][0].replace('_', ' ').title(),
                        "value": round(sorted_features[-1][1]),
                        "icon": FEATURE_ICONS.get(sorted_features[-1][0], '📊')
                    }
            except (json.JSONDecodeError, KeyError, IndexError) as e:
                print(f"Error parsing feature importance: {e}")
        
        # Activity data from predictions
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        study_hours = []
        attendance = []
        
        last_12 = predictions[:12]
        if len(last_12) > 0:
            for p in reversed(last_12):
                study_hours.append(p.hours_studied or 0)
                attendance.append(p.attendance or 0)
        else:
            study_hours = []
            attendance = []
        
        # Risk distribution
        risk_counts = {"low": 0, "medium": 0, "high": 0}
        for p in predictions:
            if p.probability >= 70:
                risk_counts["low"] += 1
            elif p.probability >= 50:
                risk_counts["medium"] += 1
            else:
                risk_counts["high"] += 1
        
        # Quick stats
        avg_accuracy = 0
        if total_predictions > 0:
            avg_prob = sum(p.probability for p in predictions) / total_predictions
            avg_accuracy = round(avg_prob)
        
        study_hours_per_week = 0
        if latest and latest.hours_studied:
            study_hours_per_week = int(latest.hours_studied * 7)
        
        return {
            "top_features": top_features,
            "activity_data": {
                "labels": months,
                "study_hours": study_hours,
                "attendance": attendance
            },
            "risk_distribution": {
                "low": risk_counts["low"],
                "medium": risk_counts["medium"],
                "high": risk_counts["high"]
            },
            "quick_stats": {
                "total_predictions": total_predictions,
                "average_accuracy": avg_accuracy,
                "study_hours_per_week": study_hours_per_week,
                "risk_level": risk_level
            },
            "latest_prediction": {
                "id": str(latest.prediction_id) if latest else None,
                "grade_label": latest.grade_label if latest else None,
                "gpa_range": latest.gpa_range if latest else None,
                "academic_status": latest.academic_status if latest else None,
                "probability": latest.probability if latest else None,
                "created_at": latest.created_at.isoformat() if latest and latest.created_at else None
            } if latest else None
        }