# -*- coding: utf-8 -*-
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from sqlalchemy import text

DB_PASSWORD = "ezekiel673717424"  # CHANGE THIS

print("Step 1: Creating database...")
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
        print("  ✅ Database created.")
    else:
        print("  ℹ️ Database already exists.")
    
    cursor.close()
    conn.close()
except Exception as e:
    print(f"  ❌ Error: {e}")
    sys.exit(1)

print("\nStep 2: Creating tables...")
try:
    from app.core.database import engine, Base
    from app.modules.users.models import User
    from app.modules.predictions.models import Prediction
    
    # Drop existing enum type if it exists
    with engine.connect() as conn:
        conn.execute(text("DROP TYPE IF EXISTS userrole CASCADE"))
        conn.commit()
        print("  ✅ Dropped existing enum type.")
    
    Base.metadata.create_all(bind=engine)
    print("  ✅ Tables created.")
    
except Exception as e:
    print(f"  ❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\nStep 3: Creating admin account...")
try:
    from app.core.database import SessionLocal
    from app.modules.users.models import User  # ✅ No UserRole needed
    from app.core.security import hash_password
    
    db = SessionLocal()
    existing = db.query(User).filter(User.email == "admin@ub.cm").first()
    
    if not existing:
        admin = User(
            username="admin",
            email="admin@ub.cm",
            password_hash=hash_password("admin123"),
            role="admin",  # ✅ Just a string
            is_active=True,
            is_verified=True
        )
        db.add(admin)
        db.commit()
        print("  ✅ Admin created: admin@ub.cm / admin123")
    else:
        print("  ℹ️ Admin already exists.")
    
    db.close()
except Exception as e:
    print(f"  ❌ Error: {e}")
    sys.exit(1)

print("\n" + "="*50)
print("✅ SETUP COMPLETE!")
print("="*50)