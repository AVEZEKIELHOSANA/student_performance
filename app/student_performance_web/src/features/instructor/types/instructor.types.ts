export interface InstructorProfile {
  id: string;
  user_id: string;
  faculty: string;
  department: string;
  role: 'hod' | 'lecturer' | 'senior_lecturer' | 'associate_professor' | 'professor';
  hire_date?: string;
  office_hours?: string;
}

export interface StudentInfo {
  id: string;
  user_id: string;
  faculty: string;
  department: string;
  level: number;
  student_id?: string;
  phone_number?: string;
  email: string;
  username: string;
  is_flagged?: boolean;
  instructor_note?: string;
  predicted_grade?: string;
  predicted_gpa_range?: string;
  probability?: number;
}

export interface CohortStudent {
  id: string;
  cohort_id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  joined_at: string;
  is_active: boolean;
  grade_label?: string;
  gpa_range?: string;
  probability?: number;
  is_flagged?: boolean;
  instructor_note?: string;
}

export interface Cohort {
  id: string;
  instructor_id: string;
  name: string;
  faculty: string;
  department: string;
  academic_year: string;
  semester: string;
  performance_goal?: number;
  created_at: string;
  students: CohortStudent[];
}

export interface AtRiskStudent {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  cohort_name: string;
  grade_label: string;
  gpa_range: string;
  probability: number;
  is_flagged: boolean;
  instructor_note?: string;
}

export interface InstructorStats {
  total_students: number;
  at_risk_students: number;
  predicted_pass_rate: number;
  cohorts_created: number;
  faculty: string;
  department: string;
  role: string;
}

export interface GradeDistribution {
  A: number;
  B: number;
  C: number;
  D: number;
  Fail: number;
}

export interface RecentActivity {
  id: string;
  type: 'batch_prediction' | 'report_download' | 'flag_student' | 'note_added';
  message: string;
  timestamp: string;
  cohort_name?: string;
}
