import { apiClient } from '@/lib/axios';
import { TargetGPARequest, GPAGoalResponse } from '../types/simulator.types';

export const simulatorService = {
  // Get GPA goal analysis
  getGPAGoalAnalysis: async (data: TargetGPARequest): Promise<GPAGoalResponse> => {
    const response = await apiClient.post('/simulator/gpa-goal', data);
    return response.data;
  },

  // Get feature importance for a student
  getFeatureImportance: async (): Promise<Record<string, number>> => {
    const response = await apiClient.get('/predictions/feature-importance');
    return response.data;
  },
};