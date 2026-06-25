# -*- coding: utf-8 -*-
"""
database.py
Handles PostgreSQL connection and table initialisation.
University of Buea — Student Performance Prediction System
"""

from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ── PostgreSQL connection string ──────────────────────────────
# Update these credentials to match your local PostgreSQL setup
DATABASE_URL = "postgresql://postgres:ezekiel673717424@localhost:5432/student_performance"

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency that provides a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables defined in models.py."""
    from app import models  # noqa: F401 — import triggers table registration
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")