import { apiClient } from '@/lib/axios';
import {
  AdminUser,
  AdminUserCreatePayload,
  AdminUserUpdatePayload,
  AdminStudent,
  AdminInstructor,
  Assignment,
  AdminDashboardStats,
} from '../types/admin.types';

export const adminService = {
  getUsers: async (params?: { role?: string; search?: string; is_active?: boolean }): Promise<AdminUser[]> => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },

  createUser: async (payload: AdminUserCreatePayload): Promise<AdminUser> => {
    const response = await apiClient.post('/admin/users', payload);
    return response.data;
  },

  updateUser: async (userId: string, payload: AdminUserUpdatePayload): Promise<AdminUser> => {
    const response = await apiClient.put(`/admin/users/${userId}`, payload);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/admin/users/${userId}`);
  },

  getStudents: async (params?: { school_id?: string; faculty_id?: string; department_id?: string; unassigned_only?: boolean; }): Promise<AdminStudent[]> => {
    const response = await apiClient.get('/admin/students', { params });
    return response.data;
  },

  getInstructors: async (params?: { school_id?: string; faculty_id?: string; department_id?: string; }): Promise<AdminInstructor[]> => {
    const response = await apiClient.get('/admin/instructors', { params });
    return response.data;
  },

  getEligibleInstructors: async (studentId: string): Promise<AdminInstructor[]> => {
    const response = await apiClient.get(`/admin/assignments/eligible-instructors/${studentId}`);
    return response.data;
  },

  assignInstructor: async (studentId: string, instructorId: string): Promise<Assignment> => {
    const response = await apiClient.post('/admin/assignments', { student_id: studentId, instructor_id: instructorId });
    return response.data;
  },

  unassignInstructor: async (assignmentId: string): Promise<void> => {
    await apiClient.delete(`/admin/assignments/${assignmentId}`);
  },

  getAssignments: async (instructorId?: string): Promise<Assignment[]> => {
    const response = await apiClient.get('/admin/assignments', { params: instructorId ? { instructor_id: instructorId } : undefined });
    return response.data;
  },

  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    const response = await apiClient.get('/admin/dashboard/stats');
    return response.data;
  },
};
