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

export interface TopFeatures {
  best: Feature;
  second: Feature;
  third: Feature;
  worst: Feature;
}

export interface ActivityData {
  labels: string[];
  study_hours: number[];
  attendance: number[];
}

export interface RiskDistribution {
  low: number;
  medium: number;
  high: number;
}

export interface QuickStats {
  total_predictions: number;
  average_accuracy: number;
  study_hours_per_week: number;
  risk_level: string;
}

export interface DashboardStats {
  top_features: TopFeatures;
  activity_data: ActivityData;
  risk_distribution: RiskDistribution;
  quick_stats: QuickStats;
  latest_prediction: Prediction | null;
}