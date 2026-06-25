# -*- coding: utf-8 -*-
"""
setup_db.py - Fixed admin account creation
Run this script ONCE to create database and admin account.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import bcrypt

# ── Step 1: Create the database ──────────────────────────────
print("Step 1: Connecting to PostgreSQL...")
try:
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        user="postgres",
        password="ezekiel673717424"  # Change this to your password
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    cursor.execute("SELECT 1 FROM pg_database WHERE datname = 'student_performance'")
    exists = cursor.fetchone()
    if not exists:
        cursor.execute("CREATE DATABASE student_performance")
        print("  ✅ Database 'student_performance' created.")
    else:
        print("  ✅ Database 'student_performance' already exists.")
    cursor.close()
    conn.close()
except psycopg2.OperationalError as e:
    print(f"  ❌ ERROR: {e}")
    sys.exit(1)

# ── Step 2: Create all tables ─────────────────────────────────
print("\nStep 2: Creating database tables...")
try:
    from app.database import init_db
    init_db()
    print("  ✅ Tables created successfully.")
except Exception as e:
    print(f"  ❌ ERROR: {e}")
    sys.exit(1)

# ── Step 3: Create admin account using direct bcrypt ──────────
print("\nStep 3: Creating default admin account...")
try:
    from app.database import SessionLocal
    from app import models
    from app.auth import hash_password
    
    db = SessionLocal()
    
    # Check if admin exists
    existing = db.query(models.User).filter(
        models.User.username == "admin"
    ).first()
    
    if not existing:
        # Create admin with properly hashed password
        admin = models.User(
            username="admin",
            email="admin@ub.cm",
            password_hash=hash_password("admin123"),
            role="admin",
            is_active=True
        )
        db.add(admin)
        db.commit()
        print("  ✅ Admin account created successfully!")
        print("     Username: admin")
        print("     Password: admin123")
        print("  ⚠️  CHANGE THIS PASSWORD AFTER FIRST LOGIN!")
    else:
        print("  ℹ️  Admin account already exists.")
    
    db.close()
except Exception as e:
    print(f"  ❌ ERROR creating admin: {e}")
    sys.exit(1)

print("\n" + "="*50)
print("✅ SETUP COMPLETE!")
print("="*50)
print("\nTo start the FastAPI backend:")
print("  uvicorn app.main:app --reload --port 8000")
print("\nTo start the Streamlit frontend (in a new terminal):")
print("  streamlit run app/dashboard.py")