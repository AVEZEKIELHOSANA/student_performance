from fastapi import APIRouter

router = APIRouter()

@router.get("/", tags=["Cohorts"])
def get_cohorts():
    return {"message": "Cohorts endpoint placeholder"}
