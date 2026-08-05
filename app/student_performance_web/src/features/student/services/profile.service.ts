import { apiClient } from '@/lib/axios';
import { StudentProfile, School, Faculty, Department, Level } from '../types/profile.types';

export const profileService = {
  getProfile: async (): Promise<StudentProfile> => {
    const response = await apiClient.get('/students/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<StudentProfile>): Promise<StudentProfile> => {
    const response = await apiClient.put('/students/profile', data);
    return response.data;
  },

  getSchools: async (): Promise<School[]> => {
    const response = await apiClient.get('/schools');
    return response.data;
  },

  getFaculties: async (schoolId: string): Promise<Faculty[]> => {
    const response = await apiClient.get(`/schools/${schoolId}/faculties`);
    return response.data;
  },

  getDepartments: async (facultyId: string): Promise<Department[]> => {
    const response = await apiClient.get(`/faculties/${facultyId}/departments`);
    return response.data;
  },

  getLevels: async (): Promise<Level[]> => {
    const response = await apiClient.get('/levels');
    return response.data;
  },
};