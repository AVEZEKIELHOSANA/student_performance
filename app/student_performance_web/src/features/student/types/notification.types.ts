export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'prediction' | 'risk_alert' | 'system' | 'reminder';
  is_read: boolean;
  created_at: string;
  read_at?: string;
  action_url?: string;
  metadata?: {
    predicted_grade?: string;
    gpa_range?: string;
    risk_level?: 'Low' | 'Medium' | 'High';
    previous_risk?: 'Low' | 'Medium' | 'High';
  };
}

export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  weekly_reports: boolean;
  prediction_alerts: boolean;
  risk_alerts: boolean;
  reminder_notifications: boolean;
  intervention_alerts: boolean;
  marketing_emails: boolean;
}