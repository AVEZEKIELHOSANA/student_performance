export interface Prediction {
  id: string;
  grade_label: string;
  gpa_range: string;
  academic_status: string;
  probability: number;
  created_at: string;
  recommendations?: string[];
}

export interface PredictionHistoryResponse {
  id: string;
  grade_label: string;
  gpa_range: string;
  academic_status: string;
  probability: number;
  created_at: string;
}