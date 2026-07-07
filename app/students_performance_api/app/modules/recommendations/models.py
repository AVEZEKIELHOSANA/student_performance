from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    prediction_id = Column(UUID(as_uuid=True), ForeignKey("predictions.prediction_id"), nullable=True)

    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    action_plan = Column(Text)
    category = Column(String(50))
    priority = Column(Integer, default=1)
    feature_focus = Column(String(100))

    is_implemented = Column(Boolean, default=False)
    implemented_at = Column(DateTime(timezone=True))
    effectiveness_rating = Column(Integer)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    prediction = relationship("Prediction")
