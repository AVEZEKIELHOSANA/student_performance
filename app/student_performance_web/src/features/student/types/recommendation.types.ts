export interface Recommendation {
  id: string;
  title: string;
  description: string;
  action_plan: string;
  priority: number;
  category: string;
  feature_focus: string;
  generated_at: string;
  is_implemented: boolean;
  implemented_at?: string;
  effectiveness_rating?: number;
}