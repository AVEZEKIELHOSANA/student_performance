from fastapi import FastAPI
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
from fastapi.middleware.cors import CORSMiddleware

# Import models so they register with Base
from app.modules.users.models import User
from app.modules.predictions.models import Prediction

# Create tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML artefacts on startup."""
    print("\n" + "="*50)
    print("Loading ML artefacts...")
    print("="*50)
    
    try:
        from app.ml.model_loader import ModelLoader
        ModelLoader.load_model(
            model_path=settings.MODEL_PATH,
            scaler_path=settings.SCALER_PATH,
            encoder_path=settings.ENCODER_PATH,
            features_path=settings.FEATURES_PATH
        )
        print("\n✅ ML artefacts loaded successfully!")
    except Exception as e:
        print(f"\n⚠️ Warning: Could not load ML artefacts: {e}")
        print("   The API will still run, but prediction endpoints will not work.")
    
    print("="*50 + "\n")
    yield
    
    # Cleanup on shutdown
    from app.ml.model_loader import ModelLoader
    ModelLoader.clear()

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Student Performance Prediction System API",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# ✅ FIXED CORS - Use manual middleware
@app.middleware("http")
async def add_cors_headers(request, call_next):
    response = await call_next(request)
    
    # Allow all origins in development
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept, X-Requested-With, X-CSRF-Token"
    response.headers["Access-Control-Expose-Headers"] = "Content-Type, Authorization"
    
    # Handle preflight OPTIONS requests
    if request.method == "OPTIONS":
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept, X-Requested-With"
        response.headers["Access-Control-Max-Age"] = "86400"
    
    return response

# Also keep the standard CORS middleware as fallback
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/v1/users", tags=["Users"])
app.include_router(predictions_router, prefix="/api/v1/predictions", tags=["Predictions"])
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