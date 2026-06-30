import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/student_performance")
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "#myselfperformance")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    
    # Email
    SENDGRID_API_KEY: str = os.getenv("SENDGRID_API_KEY", "")
    FROM_EMAIL: str = os.getenv("FROM_EMAIL", "noreply@studentperformance.com")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Model Paths
    MODEL_PATH: str = os.getenv("MODEL_PATH", "models/best_model.pkl")
    SCALER_PATH: str = os.getenv("SCALER_PATH", "models/scaler.pkl")
    ENCODER_PATH: str = os.getenv("ENCODER_PATH", "models/label_encoder.pkl")
    FEATURES_PATH: str = os.getenv("FEATURES_PATH", "models/feature_names.pkl")
    
    # CORS
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    
    # App
    APP_NAME: str = os.getenv("APP_NAME", "Student Performance Prediction System")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"

settings = Settings()