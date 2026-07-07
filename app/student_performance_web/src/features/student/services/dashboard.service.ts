import { apiClient } from '@/lib/axios';
import { DashboardStats, Prediction } from '../types/dashboard.types';

export const dashboardService = {
  // Get dashboard stats from backend
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/predictions/dashboard/stats');
    return response.data;
  },

  // Get prediction history
  getPredictions: async (limit: number = 20): Promise<Prediction[]> => {
    const response = await apiClient.get(`/predictions?limit=${limit}`);
    return response.data;
  },

  // Get latest prediction
  getLatestPrediction: async (): Promise<Prediction | null> => {
    try {
      const response = await apiClient.get('/predictions/latest');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Run prediction
  predict: async (data: any): Promise<any> => {
    const response = await apiClient.post('/predictions', data);
    return response.data;
  },
};