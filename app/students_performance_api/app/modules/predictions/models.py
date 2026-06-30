from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class Prediction(Base):
    __tablename__ = "predictions"

    prediction_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    grade_label = Column(String(10))
    gpa_range = Column(String(20))
    academic_status = Column(String(60))
    probability = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # ✅ Use string reference for relationship
    user = relationship("User", back_populates="predictions")