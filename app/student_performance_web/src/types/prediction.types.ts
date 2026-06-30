export interface PredictionRequest {
  hours_studied: number;
  attendance: number;
  sleep_hours: number;
  stress_level: number;
  screen_time: number;
  previous_gpa: number;
  part_time_job: number;
  diet_quality: number;
  internet_quality: number;
  extracurricular: number;
  tutoring_sessions: number;
  family_income_level: number;
  exam_anxiety: number;
  electricity_availability: number;
  internet_accessibility: number;
  peer_influence: number;
  community_beliefs: number;
  family_support: number;
  home_study_environment: number;
  motivation_level: number;
  lecture_quality: number;
  physical_health: number;
  psychological_state: number;
  gender_female: number;
  gender_male: number;
  gender_nonbinary: number;
  study_method_hybrid: number;
  study_method_offline: number;
  study_method_online: number;
}

export interface PredictionResponse {
  prediction_id?: string;
  predicted_grade: string;
  predicted_gpa_range: string;
  academic_status: string;
  top_probability: number;
  all_probabilities: Record<string, number>;
  recommendations: string[];
}