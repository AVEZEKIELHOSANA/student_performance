export interface School {
  id: string;
  name: string;
}

export interface Faculty {
  id: string;
  name: string;
  school_id?: string;
}

export interface Department {
  id: string;
  name: string;
  faculty_id?: string;
}

export interface Level {
  id: string;
  name: string;
  value: number;
}

export interface StudentProfile {
  id?: string;
  user_id?: string;
  student_id?: string;
  phone_number?: string;
  address?: string;
  emergency_contact?: string;
  bio?: string;
  school_id?: string;
  faculty_id?: string;
  department_id?: string;
  level?: number;
  current_gpa?: number;
  total_credits?: number;
  academic_year?: string;
  created_at?: string;
  updated_at?: string;
}

// Fields required before we consider the profile "complete"
const REQUIRED_PROFILE_FIELDS: (keyof StudentProfile)[] = [
  'school_id',
  'faculty_id',
  'department_id',
  'level',
  'student_id',
  'phone_number',
];

export function isProfileComplete(profile: StudentProfile | null | undefined): boolean {
  if (!profile) return false;
  return REQUIRED_PROFILE_FIELDS.every((field) => {
    const value = profile[field];
    return value !== undefined && value !== null && value !== '';
  });
}