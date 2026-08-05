import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:ezekiel673717424@localhost:5432/student_performance")
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))
    
    # Model Paths
    MODEL_PATH: str = os.getenv("MODEL_PATH", "models/best_model.pkl")
    SCALER_PATH: str = os.getenv("SCALER_PATH", "models/scaler.pkl")
    ENCODER_PATH: str = os.getenv("ENCODER_PATH", "models/label_encoder.pkl")
    FEATURES_PATH: str = os.getenv("FEATURES_PATH", "models/feature_names.pkl")
    
    # CORS
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")
    
    # App
    APP_NAME: str = os.getenv("APP_NAME", "Student Performance Prediction System")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

settings = Settings()