export interface TargetGPARequest {
  target_gpa: number;
  current_gpa: number;
  current_features: {
    hours_studied: number;
    attendance: number;
    sleep_hours: number;
    stress_level: number;
    exam_anxiety: number;
    tutoring_sessions: number;
    motivation_level: number;
    home_study_environment: number;
    family_support: number;
    physical_health: number;
    psychological_state: number;
  };
}

export interface GPAGoalResponse {
  target_gpa: number;
  current_gpa: number;
  gap: number;
  required_changes: {
    feature: string;
    current_value: number;
    required_value: number;
    improvement: number;
    priority: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }[];
  feasibility: 'High' | 'Medium' | 'Low';
  estimated_time: string;
  recommendations: {
    title: string;
    description: string;
    action_items: string[];
    timeline: string;
    priority: number;
  }[];
  weekly_plan: {
    week: number;
    focus: string;
    actions: string[];
    target_metric: string;
  }[];
  motivation_message: string;
}

export interface FeatureAdjustment {
  feature: string;
  current: number;
  target: number;
  improvement: number;
  priority: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tips: string[];
}