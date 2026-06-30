export interface Feature {
  feature: string;
  value: number;
  icon: string;
}

export interface Prediction {
  id: string;
  grade_label: string;
  gpa_range: string;
  academic_status: string;
  probability: number;
  created_at: string;
}

export interface DashboardStats {
  top_features: {
    best: Feature;
    second: Feature;
    third: Feature;
    worst: Feature;
  };
  predictions: Prediction[];
  latest_prediction: Prediction | null;
  total_predictions: number;
  average_grade: string;
  risk_level: 'Low' | 'Medium' | 'High';
}