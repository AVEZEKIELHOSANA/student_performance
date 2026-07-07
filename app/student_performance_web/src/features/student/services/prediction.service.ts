import { apiClient } from '@/lib/axios';
import { Prediction, PredictionHistoryResponse } from '../types/prediction.types';

export const predictionService = {
  // Get prediction history
  getHistory: async (limit: number = 20): Promise<PredictionHistoryResponse[]> => {
    const response = await apiClient.get(`/predictions?limit=${limit}`);
    return response.data;
  },

  // Get latest prediction
  getLatest: async (): Promise<Prediction | null> => {
    try {
      const response = await apiClient.get('/predictions/latest');
      return response.data;
    } catch {
      return null;
    }
  },

  // Run prediction
  predict: async (data: any): Promise<any> => {
    const response = await apiClient.post('/predictions', data);
    return response.data;
  },

  // Get a single prediction by ID
  getById: async (id: string): Promise<Prediction> => {
    const response = await apiClient.get(`/predictions/${id}`);
    return response.data;
  },
};