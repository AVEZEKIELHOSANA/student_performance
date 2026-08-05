from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config.settings import settings
from app.core.database import engine, Base
from app.modules.auth.router import router as auth_router
from app.modules.users.router import router as users_router
from app.modules.predictions.router import router as predictions_router
from app.modules.instructors.router import router as instructors_router
from app.modules.admin.router import router as admin_router
from app.modules.cohorts.router import router as cohorts_router
from app.modules.students.router import router as students_router
from app.modules.schools.router import router as schools_router
from app.modules.recommendations.router import router as recommendations_router
from app.modules.notifications.router import router as notifications_router
from app.modules.simulator.router import router as simulator_router
from app.ml.model_loader import ModelLoader
import logging
from fastapi.responses import JSONResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import models so they register with Base
from app.modules.users.models import User
from app.modules.predictions.models import Prediction
from app.modules.students.models import StudentProfile
from app.modules.schools.models import School, Faculty, Department, Level
from app.modules.recommendations.models import Recommendation
from app.modules.notifications.models import Notification

# Create tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML artefacts on startup."""
    print("\n" + "="*50)
    print("🚀 Starting Student Performance API...")
    print("="*50)
    
    print("\n📦 Loading ML artefacts...")
    try:
        loaded = ModelLoader.load_model(
            settings.MODEL_PATH,
            settings.SCALER_PATH,
            settings.ENCODER_PATH,
            settings.FEATURES_PATH,
        )
        if loaded:
            print("✅ ML artefacts loaded successfully!")
        else:
            print("⚠️ Warning: ML artefacts were not loaded. Check model paths.")
    except Exception as e:
        print(f"⚠️ Warning: Could not load ML artefacts: {e}")
    
    print("\n" + "="*50)
    print("✅ API is ready!")
    print(f"   Docs: http://localhost:8000/docs")
    print("="*50 + "\n")
    
    yield
    ModelLoader.clear()

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Student Performance Prediction System API",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled error on {request.method} {request.url.path}")
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Routers with correct prefixes
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/v1/users", tags=["Users"])
app.include_router(students_router, prefix="/api/v1/students", tags=["Students"])
app.include_router(predictions_router, prefix="/api/v1/predictions", tags=["Predictions"])
app.include_router(schools_router, prefix="/api/v1/schools", tags=["Schools"])
app.include_router(recommendations_router, prefix="/api/v1/recommendations", tags=["Recommendations"])
app.include_router(notifications_router, prefix="/api/v1/notifications", tags=["Notifications"])
app.include_router(simulator_router, prefix="/api/v1/simulator", tags=["Simulator"])
app.include_router(instructors_router, prefix="/api/v1/instructors", tags=["Instructors"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(cohorts_router, prefix="/api/v1/cohorts", tags=["Cohorts"])

@app.get("/")
def root():
    return {
        "message": settings.APP_NAME,
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/api/v1/health")
def health():
    return {"status": "healthy"}