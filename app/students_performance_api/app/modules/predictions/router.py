from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.modules.users.models import User
from app.modules.predictions.models import Prediction
from app.modules.predictions.schemas import PredictionRequest, PredictionResponse
from app.modules.predictions.service import PredictionService

router = APIRouter()

# ── Run Prediction ─────────────────────────────────────────────

@router.post("/", response_model=PredictionResponse)
def predict(
    req: PredictionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Run a prediction and save to history."""
    try:
        result = PredictionService.run_prediction(req)
        prediction = PredictionService.save_prediction(db, current_user.id, req, result)
        
        return PredictionResponse(
            prediction_id=str(prediction.prediction_id),
            predicted_grade=result["grade"],
            predicted_gpa_range=result["gpa_range"],
            academic_status=result["status"],
            top_probability=result["top_prob"],
            all_probabilities=result["all_probs"],
            recommendations=result["recommendations"],
            created_at=prediction.created_at.isoformat() if prediction.created_at else None
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )

# ── Get Prediction History ────────────────────────────────────

@router.get("/", response_model=List[dict])
def get_predictions(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get prediction history for the current user."""
    try:
        return PredictionService.get_predictions(db, current_user.id, limit)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get predictions: {str(e)}"
        )

# ── Get Latest Prediction ─────────────────────────────────────

@router.get("/latest", response_model=dict)
def get_latest_prediction(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the latest prediction for the current user."""
    try:
        result = PredictionService.get_latest_prediction(db, current_user.id)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No predictions found"
            )
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get latest prediction: {str(e)}"
        )

# ── Get Dashboard Stats ───────────────────────────────────────

@router.get("/dashboard/stats", response_model=dict)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all dashboard statistics for the current user."""
    try:
        return PredictionService.get_dashboard_stats(db, current_user.id)
    except Exception as e:
        print(f"Dashboard stats error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get dashboard stats: {str(e)}"
        )