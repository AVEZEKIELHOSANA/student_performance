import { InstructorStats, AtRiskStudent, RecentActivity, GradeDistribution } from '../../types/instructor.types';

export const mockStats: InstructorStats = {
  total_students: 128,
  at_risk_students: 7,
  predicted_pass_rate: 78,
  cohorts_created: 4,
  faculty: 'Faculty of Science',
  department: 'Computer Science',
  role: 'Instructor',
};

export const mockAtRiskStudents: AtRiskStudent[] = [
  {
    id: 'a1',
    student_id: 'S1001',
    student_name: 'John Doe',
    student_email: 'john.doe@example.com',
    cohort_name: 'Cohort 2026-A',
    grade_label: 'D',
    gpa_range: '1.6-1.9',
    probability: 82,
    is_flagged: true,
    instructor_note: 'Low attendance',
  },
  {
    id: 'a2',
    student_id: 'S1002',
    student_name: 'Jane Smith',
    student_email: 'jane.smith@example.com',
    cohort_name: 'Cohort 2026-A',
    grade_label: 'C',
    gpa_range: '2.0-2.4',
    probability: 66,
    is_flagged: false,
  },
  {
    id: 'a3',
    student_id: 'S1003',
    student_name: 'Samuel Green',
    student_email: 'sam.green@example.com',
    cohort_name: 'Cohort 2025-B',
    grade_label: 'D',
    gpa_range: '1.5-1.8',
    probability: 88,
    is_flagged: true,
  },
  {
    id: 'a4',
    student_id: 'S1004',
    student_name: 'Emily Tan',
    student_email: 'emily.tan@example.com',
    cohort_name: 'Cohort 2026-A',
    grade_label: 'C',
    gpa_range: '2.1-2.5',
    probability: 60,
    is_flagged: false,
  },
  {
    id: 'a5',
    student_id: 'S1005',
    student_name: 'Carlos Ruiz',
    student_email: 'carlos.ruiz@example.com',
    cohort_name: 'Cohort 2025-B',
    grade_label: 'F',
    gpa_range: '0.8-1.2',
    probability: 95,
    is_flagged: true,
  },
];

export const mockRecentActivity: RecentActivity[] = [
  {
    id: 'r1',
    type: 'batch_prediction',
    message: 'Batch prediction completed for Cohort 2026-A',
    timestamp: new Date().toISOString(),
    cohort_name: 'Cohort 2026-A',
  },
  {
    id: 'r2',
    type: 'flag_student',
    message: 'Flagged student John Doe for intervention',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    cohort_name: 'Cohort 2026-A',
  },
  {
    id: 'r3',
    type: 'report_download',
    message: 'Downloaded performance report for Cohort 2025-B',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    cohort_name: 'Cohort 2025-B',
  },
];

export const mockGradeDistribution: GradeDistribution = {
  A: 30,
  B: 45,
  C: 25,
  D: 15,
  Fail: 13,
};

export default {
  mockStats,
  mockAtRiskStudents,
  mockRecentActivity,
  mockGradeDistribution,
};
