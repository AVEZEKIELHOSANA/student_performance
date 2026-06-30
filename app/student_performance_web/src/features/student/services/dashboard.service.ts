import { apiClient } from '@/lib/axios';
import { DashboardStats, Prediction } from '../types/dashboard.types';

export const dashboardService = {
  getPredictions: async (limit: number = 10): Promise<Prediction[]> => {
    const response = await apiClient.get(`/students/predictions?limit=${limit}`);
    return response.data;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const predictions = await dashboardService.getPredictions();
    
    // Get latest prediction
    const latest = predictions.length > 0 ? predictions[0] : null;
    
    // Calculate stats
    let avgGrade = 'N/A';
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    
    if (latest) {
      if (latest.probability >= 70) riskLevel = 'Low';
      else if (latest.probability >= 50) riskLevel = 'Medium';
      else riskLevel = 'High';
      
      const gradeMap: Record<string, string> = {
        'A': '3.50 – 4.00',
        'B': '3.00 – 3.49',
        'C': '2.50 – 2.99',
        'D': '2.00 – 2.49',
        'Fail': 'Below 2.00'
      };
      avgGrade = gradeMap[latest.grade_label] || 'N/A';
    }
    
    // Feature importance data (from ML model)
    // In production, this comes from the backend
    const topFeatures = {
      best: { feature: 'Hours Studied', value: 92, icon: '📚' },
      second: { feature: 'Tutoring Sessions', value: 78, icon: '👨‍🏫' },
      third: { feature: 'Attendance Rate', value: 65, icon: '📊' },
      worst: { feature: 'Exam Anxiety', value: 42, icon: '😰' },
    };
    
    return {
      top_features: topFeatures,
      predictions,
      latest_prediction: latest,
      total_predictions: predictions.length,
      average_grade: avgGrade,
      risk_level: riskLevel,
    };
  },
};