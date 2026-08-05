'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/axios';
import { toast } from 'react-toastify';

import { PredictionFormData, PredictionResult } from '@/features/student/types/predict.types';
import { PredictionForm } from '@/features/student/components/predict/PredictionForm';
import { PredictionModal } from '@/features/student/components/predict/PredictionModal';
import { GAD7Form } from '@/features/student/components/predict/GAD7Form';
import { PHQ9Form } from '@/features/student/components/predict/PHQ9Form';
import { WellbeingForm } from '@/features/student/components/predict/WellbeingForm';

const defaultFormData: PredictionFormData = {
  // Academic
  hours_studied: 4,
  attendance: 75,
  previous_gpa: 2.5,
  tutoring_sessions: 1,
  study_method: 1,
  lecture_quality: 3,
  
  // Daily Habits
  sleep_hours: 7,
  screen_time: 3,
  stress_level: 5,
  exam_anxiety: 5,
  diet_quality: 1,
  motivation_level: 3,
  physical_health: 3,
  
  // Socioeconomic & Environment
  electricity_availability: 0.5,
  home_study_environment: 3,
  internet_quality: 1,
  internet_accessibility: 1,
  peer_influence: 1,
  family_support: 3,
  family_income_level: 1,
  community_beliefs: 3,
  
  // Health & Wellbeing
  psychological_state: 3,
  
  // Demographics
  gender_female: 1,
  gender_male: 0,
  gender_nonbinary: 0,
  part_time_job: 0,
  extracurricular: 0,
  study_method_hybrid: 0,
  study_method_offline: 1,
  study_method_online: 0,
};

export default function PredictPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<PredictionFormData>(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showGAD7, setShowGAD7] = useState(false);
  const [showPHQ9, setShowPHQ9] = useState(false);
  const [showWellbeing, setShowWellbeing] = useState(false);

  const handleFormChange = (data: Partial<PredictionFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleGAD7Save = (scores: number[]) => {
    const total = scores.reduce((sum, val) => sum + val, 0);
    const normalized = Math.max(1, Math.min(10, Math.round((total / 21) * 9 + 1)));
    setFormData(prev => ({ ...prev, exam_anxiety: normalized }));
    toast.success(`GAD-7 completed! Anxiety score: ${normalized}/10`);
  };

  const handlePHQ9Save = (scores: number[]) => {
    const total = scores.reduce((sum, val) => sum + val, 0);
    const normalized = Math.max(1, Math.min(10, Math.round((total / 27) * 9 + 1)));
    setFormData(prev => ({ ...prev, stress_level: normalized }));
    toast.success(`PHQ-9 completed! Stress score: ${normalized}/10`);
  };

  const handleWellbeingSave = (score: number) => {
    setFormData(prev => ({ ...prev, psychological_state: score }));
    toast.success(`Wellbeing assessment completed! Score: ${score}/5`);
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const payload = {
        hours_studied: formData.hours_studied,
        attendance: formData.attendance,
        sleep_hours: formData.sleep_hours,
        stress_level: formData.stress_level,
        screen_time: formData.screen_time,
        previous_gpa: formData.previous_gpa,
        part_time_job: formData.part_time_job,
        diet_quality: formData.diet_quality,
        internet_quality: formData.internet_quality,
        extracurricular: formData.extracurricular,
        tutoring_sessions: formData.tutoring_sessions,
        family_income_level: formData.family_income_level,
        exam_anxiety: formData.exam_anxiety,
        electricity_availability: formData.electricity_availability,
        internet_accessibility: formData.internet_accessibility,
        peer_influence: formData.peer_influence,
        community_beliefs: formData.community_beliefs,
        family_support: formData.family_support,
        home_study_environment: formData.home_study_environment,
        motivation_level: formData.motivation_level,
        lecture_quality: formData.lecture_quality,
        physical_health: formData.physical_health,
        psychological_state: formData.psychological_state,
        gender_female: formData.gender_female,
        gender_male: formData.gender_male,
        gender_nonbinary: formData.gender_nonbinary,
        study_method_hybrid: formData.study_method_hybrid,
        study_method_offline: formData.study_method_offline,
        study_method_online: formData.study_method_online,
      };

      const response = await apiClient.post('/predictions', payload);
      setResult(response.data);
      setShowModal(true);
      toast.success('Prediction completed!');
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Failed to generate prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2a6c]">Predict Performance</h1>
          <p className="text-gray-500 text-sm">Enter your details to get a personalized prediction</p>
        </div>
      </div>

      <PredictionForm
        formData={formData}
        onChange={handleFormChange}
        onPredict={handlePredict}
        loading={loading}
        onOpenGAD7={() => setShowGAD7(true)}
        onOpenPHQ9={() => setShowPHQ9(true)}
        onOpenWellbeing={() => setShowWellbeing(true)}
      />

      <PredictionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        result={result}
        username={user?.username || 'Student'}
      />

      <GAD7Form
        isOpen={showGAD7}
        onClose={() => setShowGAD7(false)}
        onSave={handleGAD7Save}
      />

      <PHQ9Form
        isOpen={showPHQ9}
        onClose={() => setShowPHQ9(false)}
        onSave={handlePHQ9Save}
      />

      <WellbeingForm
        isOpen={showWellbeing}
        onClose={() => setShowWellbeing(false)}
        onSave={handleWellbeingSave}
      />
    </div>
  );
}