export interface PredictionFormData {
  // Academic
  hours_studied: number;
  attendance: number;
  previous_gpa: number;
  tutoring_sessions: number;
  study_method: number;
  
  // Daily Habits
  sleep_hours: number;
  screen_time: number;
  stress_level: number;
  exam_anxiety: number;
  diet_quality: number;
  
  // Environment
  electricity_availability: number;
  home_study_environment: number;
  internet_quality: number;
  internet_accessibility: number;
  peer_influence: number;
  family_support: number;
  family_income_level: number;
  
  // Health & Wellbeing
  motivation_level: number;
  physical_health: number;
  psychological_state: number;
  community_beliefs: number;
  lecture_quality: number;
  
  // Demographics
  gender_female: number;
  gender_male: number;
  gender_nonbinary: number;
  part_time_job: number;
  extracurricular: number;
  study_method_hybrid: number;
  study_method_offline: number;
  study_method_online: number;
}

export interface PredictionResult {
  prediction_id: string;
  predicted_grade: string;
  predicted_gpa_range: string;
  academic_status: string;
  top_probability: number;
  all_probabilities: Record<string, number>;
  recommendations: string[];
}

export interface GAD7Scores {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
}

export interface PHQ9Scores {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
}