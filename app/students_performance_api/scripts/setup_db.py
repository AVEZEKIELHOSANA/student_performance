# -*- coding: utf-8 -*-
"""
Run this script ONCE to create the database, tables, and admin account.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# ── Step 1: Create the database ──────────────────────────────
print("Step 1: Connecting to PostgreSQL...")

# CHANGE THIS TO YOUR POSTGRES PASSWORD
DB_PASSWORD = "ezekiel673717424"  # Replace with your PostgreSQL password

try:
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        user="postgres",
        password=DB_PASSWORD
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    cursor.execute("SELECT 1 FROM pg_database WHERE datname = 'student_performance'")
    exists = cursor.fetchone()
    
    if not exists:
        cursor.execute("CREATE DATABASE student_performance")
        print("  ✅ Database 'student_performance' created.")
    else:
        print("  ℹ️ Database 'student_performance' already exists.")
    
    cursor.close()
    conn.close()
except psycopg2.OperationalError as e:
    print(f"  ❌ ERROR: {e}")
    print("  Make sure PostgreSQL is running and the password is correct.")
    sys.exit(1)

# ── Step 2: Create all tables ─────────────────────────────────
print("\nStep 2: Creating database tables...")

try:
    from app.core.database import engine, Base
    
    # ✅ Import ALL models so they register with Base
    from app.modules.users.models import User
    from app.modules.predictions.models import Prediction
    
    Base.metadata.create_all(bind=engine)
    print("  ✅ All tables created successfully.")
except Exception as e:
    print(f"  ❌ ERROR creating tables: {e}")
    sys.exit(1)

# ── Step 3: Create admin account ──────────────────────────────
print("\nStep 3: Creating admin account...")

try:
    from app.core.database import SessionLocal
    from app.modules.users.models import User, UserRole
    from app.core.security import hash_password
    
    db = SessionLocal()
    
    existing = db.query(User).filter(User.email == "admin@ub.cm").first()
    
    if not existing:
        admin = User(
            username="admin",
            email="admin@ub.cm",
            password_hash=hash_password("admin123"),
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True
        )
        db.add(admin)
        db.commit()
        print("  ✅ Admin account created successfully!")
        print("     Email: admin@ub.cm")
        print("     Password: admin123")
        print("  ⚠️ CHANGE THIS PASSWORD AFTER FIRST LOGIN!")
    else:
        print("  ℹ️ Admin account already exists.")
    
    db.close()
except Exception as e:
    print(f"  ❌ ERROR creating admin account: {e}")
    sys.exit(1)

print("\n" + "="*50)
print("✅ SETUP COMPLETE!")
print("="*50)
print("\nTo start the FastAPI backend:")
print("  uvicorn app.main:app --reload --port 8000")