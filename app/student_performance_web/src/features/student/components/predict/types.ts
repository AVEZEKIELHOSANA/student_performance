export interface PredictionFormData {
  hours_studied?: number;
  attendance?: number;
  previous_gpa?: number;
  tutoring_sessions?: number;
  lecture_quality?: number;
  sleep_hours?: number;
  screen_time?: number;
  diet_quality?: number;
  motivation_level?: number;
  physical_health?: number;
  electricity_availability?: number;
  home_study_environment?: number;
  internet_quality?: number;
  peer_influence?: number;
  family_support?: number;
  family_income_level?: number;
  community_beliefs?: number;
  stress_level?: number;
  exam_anxiety?: number;
  psychological_state?: number;
}

export interface PredictionResult {
  predicted_grade: string;
  predicted_gpa_range: string;
  top_probability: number;
  academic_status: string;
  all_probabilities: Record<string, number>;
  recommendations?: string[];
}
