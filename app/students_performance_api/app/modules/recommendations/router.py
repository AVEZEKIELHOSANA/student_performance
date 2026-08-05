from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.modules.users.models import User

router = APIRouter()

@router.get("/", response_model=List[dict])
def get_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return [
        {
            "id": "1",
            "title": "📚 Increase Study Hours",
            "description": "Your current study hours are below optimal levels.",
            "action_plan": "Create a daily study schedule with 2-hour blocks.",
            "priority": 1,
            "category": "Study Habits",
            "feature_focus": "hours_studied",
            "is_implemented": False,
            "generated_at": "2024-01-15T10:30:00Z"
        }
    ]

@router.put("/{recommendation_id}/implement")
def mark_implemented(recommendation_id: str):
    return {"message": "Recommendation marked as implemented"}
