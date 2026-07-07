from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.modules.users.models import User

router = APIRouter()

@router.get("/", response_model=List[dict])
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return [
        {
            "id": "1",
            "type": "prediction",
            "title": "📊 New Prediction Ready",
            "message": "Your performance prediction is ready! Predicted grade: B (3.00 – 3.49)",
            "is_read": False,
            "created_at": "2024-01-15T10:30:00Z",
            "metadata": {"predicted_grade": "B"},
            "action_url": "/student/predictions"
        }
    ]

@router.get("/unread/count")
def get_unread_count(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {"count": 2}

@router.put("/{notification_id}/read")
def mark_as_read(notification_id: str):
    return {"message": "Notification marked as read"}

@router.put("/read-all")
def mark_all_as_read():
    return {"message": "All notifications marked as read"}

@router.delete("/{notification_id}")
def delete_notification(notification_id: str):
    return {"message": "Notification deleted"}
