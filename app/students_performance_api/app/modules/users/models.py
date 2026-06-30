# app/modules/users/models.py

import enum
from sqlalchemy import Column, String, Boolean, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.core.database import Base

class UserRole(str, enum.Enum):
    STUDENT = "STUDENT"      # ← value must match what PostgreSQL stores
    INSTRUCTOR = "INSTRUCTOR"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(80), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    
    # The key fix: values_callable tells SQLAlchemy to use the .value of each member
    role = Column(
        Enum(UserRole, values_callable=lambda x: [e.value for e in x]),
        nullable=False,
        default=UserRole.STUDENT
    )
    
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)

    predictions = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")