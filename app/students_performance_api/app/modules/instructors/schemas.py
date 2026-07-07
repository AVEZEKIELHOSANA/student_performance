from pydantic import BaseModel, Field
from typing import Optional, List


class InstructorProfileUpdate(BaseModel):
    faculty: Optional[str] = None
    department: Optional[str] = None
    role: Optional[str] = None
    hire_date: Optional[str] = None
    office_hours: Optional[str] = None
    phone_number: Optional[str] = None
    office_location: Optional[str] = None
    bio: Optional[str] = None


class InstructorProfileResponse(BaseModel):
    id: str
    user_id: str
    faculty: Optional[str] = None
    faculty_id: Optional[str] = None
    department: Optional[str] = None
    department_id: Optional[str] = None
    role: Optional[str] = None
    hire_date: Optional[str] = None
    office_hours: Optional[str] = None
    phone_number: Optional[str] = None
    office_location: Optional[str] = None
    bio: Optional[str] = None


class StudentListResponse(BaseModel):
	id: str
	student_id: Optional[str] = None
	user_id: str
	username: Optional[str] = None
	first_name: Optional[str] = None
	last_name: Optional[str] = None
	email: str
	department: Optional[str] = None
	level: Optional[str] = None
	current_gpa: Optional[float] = None
	risk_level: Optional[str] = None
	is_flagged: bool = False
	phone_number: Optional[str] = None
	enrollment_date: Optional[str] = None


class NotificationPreferencesUpdate(BaseModel):
    email_notifications: bool = True
    push_notifications: bool = False
    weekly_reports: bool = True
    prediction_alerts: bool = True
    risk_alerts: bool = True
    intervention_alerts: bool = True
    reminder_notifications: bool = True
    marketing_emails: bool = False
