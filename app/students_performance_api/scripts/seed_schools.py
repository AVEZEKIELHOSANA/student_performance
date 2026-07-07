# -*- coding: utf-8 -*-
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.modules.schools.models import School, Faculty, Department, Level

def seed_schools():
    db = SessionLocal()
    
    try:
        if db.query(School).first():
            print("⚠️ Schools data already exists. Skipping seed.")
            return
        
        ub = School(name="University of Buea", code="UB")
        db.add(ub)
        db.flush()

        fet = Faculty(school_id=ub.id, name="Faculty of Engineering and Technology", code="FET")
        db.add(fet)
        db.flush()

        fasa = Faculty(school_id=ub.id, name="Faculty of Arts and Social Sciences", code="FASS")
        db.add(fasa)
        db.flush()

        fos = Faculty(school_id=ub.id, name="Faculty of Science", code="FS")
        db.add(fos)
        db.flush()

        depts = [
            ("Computer Engineering", "CE", fet.id),
            ("Electrical and Electronic Engineering", "EEE", fet.id),
            ("Mechanical Engineering", "ME", fet.id),
        ]
        for name, code, faculty_id in depts:
            dept = Department(faculty_id=faculty_id, name=name, code=code)
            db.add(dept)

        levels = [("Level 100", 100), ("Level 200", 200), ("Level 300", 300), ("Level 400", 400)]
        for name, value in levels:
            level = Level(name=name, value=value)
            db.add(level)

        db.commit()
        print("✅ Schools data seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding schools: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_schools()
