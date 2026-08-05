import { apiClient } from '@/lib/axios';
import {
  InstructorStats,
  Cohort,
  CohortStudent,
  AtRiskStudent,
  StudentInfo,
  GradeDistribution,
  RecentActivity,
} from '../types/instructor.types';

const instructorBase = '/instructors';

export const instructorService = {
  getStats: async (): Promise<InstructorStats> => {
    // Backend does not expose a dedicated stats endpoint; derive from profile and students
    const [profileRes, studentsRes] = await Promise.all([
      apiClient.get(`${instructorBase}/profile`).catch(() => ({ data: {} })),
      apiClient.get(`${instructorBase}/students`).catch(() => ({ data: [] })),
    ]);

    const profile = profileRes.data || {};
    const students = studentsRes.data || [];

    const total_students = Array.isArray(students) ? students.length : 0;
    const at_risk_students = Array.isArray(students)
      ? students.filter((s: any) => s.risk_level === 'high' || s.risk_level === 'critical').length
      : 0;

    return {
      total_students,
      at_risk_students,
      predicted_pass_rate: Math.round(((total_students - at_risk_students) / Math.max(1, total_students)) * 100),
      cohorts_created: 0,
      faculty: profile.faculty || null,
      department: profile.department || null,
      role: profile.role || null,
    } as InstructorStats;
  },

  getGradeDistribution: async (): Promise<GradeDistribution> => {
    try {
      const response = await apiClient.get(`${instructorBase}/grade-distribution`);
      return response.data;
    } catch (err) {
      console.warn('grade-distribution endpoint missing or failed:', err);
      return {} as GradeDistribution;
    }
  },

  getRecentActivity: async (): Promise<RecentActivity[]> => {
    try {
      const response = await apiClient.get(`${instructorBase}/recent-activity`);
      return response.data;
    } catch (err) {
      console.warn('recent-activity endpoint missing or failed:', err);
      return [];
    }
  },

  getStudents: async (): Promise<StudentInfo[]> => {
    try {
      const response = await apiClient.get(`${instructorBase}/students`);
      return response.data;
    } catch (err) {
      console.warn('getStudents failed:', err);
      return [];
    }
  },

  getStudent: async (studentId: string): Promise<StudentInfo> => {
    try {
      const response = await apiClient.get(`${instructorBase}/students/${studentId}`);
      return response.data;
    } catch (err) {
      console.warn('getStudent failed:', err);
      return {} as StudentInfo;
    }
  },

  getCohorts: async (): Promise<Cohort[]> => {
    try {
      const response = await apiClient.get(`${instructorBase}/cohorts`);
      const res = response.data;
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.cohorts)) return res.cohorts;
      if (res && Array.isArray(res.data)) return res.data;
      console.warn('Unexpected getCohorts response shape, returning empty array', res);
      return [];
    } catch (err) {
      console.warn('getCohorts failed:', err);
      return [];
    }
  },

  getCohort: async (cohortId: string): Promise<{ cohort: Cohort; students: CohortStudent[] }> => {
    try {
      const response = await apiClient.get(`${instructorBase}/cohorts/${cohortId}`);
      return response.data;
    } catch (err) {
      console.warn('getCohort failed:', err);
      return { cohort: {} as Cohort, students: [] };
    }
  },

  updatePerformanceGoal: async (
    cohortId: string,
    data: { performance_goal: number }
  ): Promise<{ message: string }> => {
    try {
      const response = await apiClient.put(`${instructorBase}/cohorts/${cohortId}/performance-goal`, data);
      return response.data;
    } catch (err) {
      console.warn('updatePerformanceGoal failed:', err);
      return { message: '' };
    }
  },

  getAtRiskStudents: async (): Promise<AtRiskStudent[]> => {
    try {
      const response = await apiClient.get(`${instructorBase}/students`);
      const students = response.data || [];
      return students.filter((s: any) => s.risk_level === 'high' || s.risk_level === 'critical');
    } catch (err) {
      console.warn('getAtRiskStudents failed:', err);
      return [];
    }
  },

  flagStudent: async (
    studentId: string,
    data: { is_flagged: boolean; note?: string }
  ): Promise<{ message: string }> => {
    try {
      const response = await apiClient.patch(`${instructorBase}/students/${studentId}/flag`, data);
      return response.data;
    } catch (err) {
      console.warn('flagStudent failed:', err);
      return { message: '' };
    }
  },

  updateStudentNote: async (
    studentId: string,
    data: { instructor_note: string }
  ): Promise<{ message: string }> => {
    try {
      const response = await apiClient.patch(`${instructorBase}/students/${studentId}/note`, data);
      return response.data;
    } catch (err) {
      console.warn('updateStudentNote failed:', err);
      return { message: '' };
    }
  },

  batchPredict: async (
    data: { cohort_name: string; students: any[] }
  ): Promise<{ cohort_id: string; total_students: number; results: any[] }> => {
    try {
      const response = await apiClient.post(`${instructorBase}/batch-predict`, data);
      return response.data;
    } catch (err) {
      console.warn('batchPredict failed:', err);
      return { cohort_id: '', total_students: 0, results: [] };
    }
  },

  getCohortReport: async (cohortId: string, format: 'pdf' | 'csv'): Promise<Blob> => {
    try {
      const response = await apiClient.get(`${instructorBase}/cohorts/${cohortId}/report?format=${format}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (err) {
      console.warn('getCohortReport failed:', err);
      return new Blob();
    }
  },
  // Add to existing instructorService object

// Flag a student
flagStudent: async (studentId: string, flag: string): Promise<any> => {
  const response = await apiClient.patch(`/instructor/students/${studentId}/flag`, { flag });
  return response.data;
},

// Remove flag
unflagStudent: async (studentId: string): Promise<any> => {
  const response = await apiClient.delete(`/instructor/students/${studentId}/flag`);
  return response.data;
},

// Start intervention
};
