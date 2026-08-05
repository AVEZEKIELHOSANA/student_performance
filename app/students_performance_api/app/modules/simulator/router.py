from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.core.database import get_db
from app.core.security import get_current_user
from app.modules.users.models import User

router = APIRouter()

@router.post("/gpa-goal", response_model=dict)
def analyze_gpa_goal(
    req: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    target_gpa = req.get("target_gpa", 3.0)
    current_gpa = req.get("current_gpa", 2.5)
    features = req.get("current_features", {})

    gap = target_gpa - current_gpa
    if gap <= 0.5:
        feasibility = "High"
        estimated_time = "4-6 weeks"
    elif gap <= 1.0:
        feasibility = "Medium"
        estimated_time = "8-12 weeks"
    else:
        feasibility = "Low"
        estimated_time = "1-2 semesters"

    required_changes = []
    current_hours = features.get("hours_studied", 4)
    if current_hours < 6:
        required_changes.append({
            "feature": "hours_studied",
            "current_value": current_hours,
            "required_value": min(8, current_hours + (gap * 2)),
            "improvement": round(min(8, current_hours + (gap * 2)) - current_hours, 1),
            "priority": 1,
            "difficulty": "Medium" if gap > 0.5 else "Easy"
        })

    current_attendance = features.get("attendance", 75)
    if current_attendance < 85:
        required_changes.append({
            "feature": "attendance",
            "current_value": current_attendance,
            "required_value": min(95, current_attendance + (gap * 10)),
            "improvement": round(min(95, current_attendance + (gap * 10)) - current_attendance, 1),
            "priority": 2,
            "difficulty": "Easy" if gap <= 0.5 else "Medium"
        })

    recommendations = []
    if current_hours < 6:
        recommendations.append({
            "title": "📚 Increase Study Hours",
            "description": "Your current study hours are below optimal levels.",
            "action_items": [
                "Create a daily study schedule with 2-hour blocks",
                "Use the Pomodoro technique (25 min study, 5 min break)",
                "Track your progress daily"
            ],
            "timeline": "Weeks 1-2",
            "priority": 1
        })

    weekly_plan = [
        {"week": 1, "focus": "Assessment & Planning", "actions": ["Assess current study habits"], "target_metric": f"{current_hours + 1}h/day"},
        {"week": 2, "focus": "Building Habits", "actions": ["Increase study time by 1 hour"], "target_metric": f"{current_hours + 2}h/day"}
    ]

    motivation_messages = {
        "High": "You're already close to your goal! Keep pushing! 🚀",
        "Medium": "This goal is achievable with dedication! 💪",
        "Low": "This is a challenging goal. Break it down into smaller milestones! 🌟"
    }

    return {
        "target_gpa": target_gpa,
        "current_gpa": current_gpa,
        "gap": round(gap, 1),
        "required_changes": required_changes,
        "feasibility": feasibility,
        "estimated_time": estimated_time,
        "recommendations": recommendations,
        "weekly_plan": weekly_plan,
        "motivation_message": motivation_messages.get(feasibility, "You've got this! 💪")
    }
