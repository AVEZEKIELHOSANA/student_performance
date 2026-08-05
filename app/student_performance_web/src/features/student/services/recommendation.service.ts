import { apiClient } from '@/lib/axios';
import { Recommendation } from '../types/recommendation.types';

export const recommendationService = {
  // Get all recommendations
  getRecommendations: async (): Promise<Recommendation[]> => {
    const response = await apiClient.get('/recommendations');
    return response.data;
  },

  // Mark recommendation as implemented
  markImplemented: async (id: string, rating?: number): Promise<any> => {
    const response = await apiClient.put(`/recommendations/${id}/implement`, {
      effectiveness_rating: rating,
    });
    return response.data;
  },

  // Get recommendations by category
  getByCategory: async (category: string): Promise<Recommendation[]> => {
    const response = await apiClient.get(`/recommendations?category=${category}`);
    return response.data;
  },
};