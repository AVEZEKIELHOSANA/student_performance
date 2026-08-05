export interface BatchPredictionResult {
  student_name: string;
  student_email: string;
  predicted_grade: string;
  predicted_gpa: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  confidence_score: number;
  attendance: number;
  hours_studied: number;
  stress_level: number;
  previous_gpa: number;
  recommendations: string[];
}

export interface BatchPredictionResponse {
  cohort_name: string;
  cohort_id: string;
  total_students: number;
  success_count: number;
  failed_count: number;
  grade_distribution: {
    [key: string]: number;
  };
  risk_distribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  average_gpa: number;
  results: BatchPredictionResult[];
  generated_at: string;
}

// Static response for the 5 students in batch_prediction_sample.csv
export const STATIC_BATCH_PREDICTION_RESPONSE: BatchPredictionResponse = {
  cohort_name: "CSC 301 - Sem 1 2026",
  cohort_id: "csc301-s1-2026",
  total_students: 5,
  success_count: 5,
  failed_count: 0,
  grade_distribution: {
    'A': 1,
    'B': 1,
    'C': 1,
    'D': 1,
    'Fail': 1
  },
  risk_distribution: {
    critical: 1,
    high: 1,
    medium: 1,
    low: 2
  },
  average_gpa: 2.78,
  generated_at: new Date().toISOString(),
  results: [
    {
      student_name: "Amara Okafor",
      student_email: "amara.okafor@example.com",
      predicted_grade: "A",
      predicted_gpa: 3.8,
      risk_level: "low",
      confidence_score: 0.92,
      attendance: 95,
      hours_studied: 8.0,
      stress_level: 3,
      previous_gpa: 3.8,
      recommendations: [
        "Continue excellent study habits",
        "Consider peer mentoring opportunities",
        "Apply for honors program"
      ]
    },
    {
      student_name: "Brian Tanko",
      student_email: "brian.tanko@example.com",
      predicted_grade: "Fail",
      predicted_gpa: 1.2,
      risk_level: "critical",
      confidence_score: 0.88,
      attendance: 55,
      hours_studied: 2.0,
      stress_level: 8,
      previous_gpa: 1.9,
      recommendations: [
        "URGENT: Schedule academic counseling",
        "Implement attendance improvement plan",
        "Reduce stress through wellness programs",
        "Consider course load reduction"
      ]
    },
    {
      student_name: "Chika Nwosu",
      student_email: "chika.nwosu@example.com",
      predicted_grade: "C",
      predicted_gpa: 2.7,
      risk_level: "medium",
      confidence_score: 0.85,
      attendance: 78,
      hours_studied: 5.0,
      stress_level: 5,
      previous_gpa: 2.7,
      recommendations: [
        "Increase study hours to 6-7 per week",
        "Join study groups for better engagement",
        "Utilize tutoring services for weak areas"
      ]
    },
    {
      student_name: "Daniel Fru",
      student_email: "daniel.fru@example.com",
      predicted_grade: "B",
      predicted_gpa: 3.2,
      risk_level: "low",
      confidence_score: 0.90,
      attendance: 88,
      hours_studied: 6.5,
      stress_level: 4,
      previous_gpa: 3.2,
      recommendations: [
        "Maintain current study routine",
        "Consider advanced coursework",
        "Mentor struggling students"
      ]
    },
    {
      student_name: "Esther Mensah",
      student_email: "esther.mensah@example.com",
      predicted_grade: "D",
      predicted_gpa: 1.8,
      risk_level: "high",
      confidence_score: 0.86,
      attendance: 45,
      hours_studied: 1.5,
      stress_level: 9,
      previous_gpa: 1.4,
      recommendations: [
        "Immediate academic intervention required",
        "Address high stress levels through counseling",
        "Develop structured study plan",
        "Regular check-ins with academic advisor"
      ]
    }
  ]
};

export default STATIC_BATCH_PREDICTION_RESPONSE;