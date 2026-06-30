'use client';

import { PredictionFormData } from './types';
import { FormCard } from './FormCard';
import { 
  FaGraduationCap, 
  FaClock, 
  FaHome,
  FaHeartbeat,
  FaChartLine,
  FaFileMedical,
  FaUsers,
  FaWifi,
  FaUtensils,
  FaDollarSign,
  FaBrain,
  FaBed,
  FaBookOpen,
  FaHandHoldingHeart,
  FaSmile,
  FaRunning
} from 'react-icons/fa';

interface PredictionFormProps {
  formData: PredictionFormData;
  onChange: (data: Partial<PredictionFormData>) => void;
  onPredict: () => void;
  loading: boolean;
  onOpenGAD7: () => void;
  onOpenPHQ9: () => void;
  onOpenWellbeing: () => void;
}

export const PredictionForm = ({
  formData,
  onChange,
  onPredict,
  loading,
  onOpenGAD7,
  onOpenPHQ9,
  onOpenWellbeing,
}: PredictionFormProps) => {
  
  const handleChange = (field: keyof PredictionFormData, value: number) => {
    onChange({ [field]: value });
  };

  const InputField = ({ 
    label, 
    field, 
    min, 
    max, 
    step = 1, 
    type = 'range',
    suffix = '',
    scale = '',
    extraButton = null,
    value,
    description = ''
  }: { 
    label: string; 
    field: keyof PredictionFormData; 
    min: number; 
    max: number; 
    step?: number;
    type?: 'range' | 'number' | 'select';
    suffix?: string;
    scale?: string;
    extraButton?: React.ReactNode;
    value?: number;
    description?: string;
  }) => {
    const currentValue = formData[field] ?? value ?? 0;
    
    return (
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">
            {label}
            {scale && <span className="text-xs text-gray-400 ml-1">({scale})</span>}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#1a2a6c]">
              {currentValue}{suffix}
            </span>
            {extraButton}
          </div>
        </div>
        {description && (
          <p className="text-xs text-gray-400">{description}</p>
        )}
        {type === 'range' ? (
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={(e) => handleChange(field, parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1a2a6c]"
          />
        ) : type === 'select' ? (
          <select
            value={currentValue}
            onChange={(e) => handleChange(field, parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-[#1a2a6c]"
          >
            {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        ) : (
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={(e) => handleChange(field, parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-[#1a2a6c]"
          />
        )}
      </div>
    );
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onPredict(); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* ─── Card 1: Academic Information ───────────────────── */}
        <FormCard title="Academic Information" icon={<FaGraduationCap className="text-[#1a2a6c]" />}>
          <InputField 
            label="Study Hours per Day" 
            field="hours_studied" 
            min={0} 
            max={12} 
            step={0.5} 
            suffix=" hrs"
            scale="0-12 hrs"
            description="Average hours you study daily" 
          />
          <InputField 
            label="Attendance Rate" 
            field="attendance" 
            min={0} 
            max={100} 
            suffix="%"
            scale="0-100%"
            description="Percentage of classes attended" 
          />
          <InputField 
            label="Previous GPA" 
            field="previous_gpa" 
            min={0} 
            max={4} 
            step={0.01} 
            type="number" 
            scale="0-4.0"
            description="Your GPA from last semester" 
          />
          <InputField 
            label="Tutoring Sessions per Week" 
            field="tutoring_sessions" 
            min={0} 
            max={5} 
            scale="0-5 sessions"
            description="Number of extra study sessions" 
          />
          <InputField 
            label="Lecture Quality" 
            field="lecture_quality" 
            min={1} 
            max={5} 
            scale="1-5"
            description="Rate your lecture quality from 1 (poor) to 5 (excellent)" 
          />
        </FormCard>

        {/* ─── Card 2: Daily Habits ───────────────────────────── */}
        <FormCard title="Daily Habits" icon={<FaClock className="text-[#1a2a6c]" />}>
          <InputField 
            label="Sleep Hours" 
            field="sleep_hours" 
            min={3} 
            max={10} 
            step={0.5} 
            suffix=" hrs"
            scale="3-10 hrs"
            description="Average hours of sleep per night" 
          />
          <InputField 
            label="Screen Time (non-academic)" 
            field="screen_time" 
            min={0} 
            max={12} 
            step={0.5} 
            suffix=" hrs"
            scale="0-12 hrs"
            description="Hours spent on phone/social media daily" 
          />
          <InputField 
            label="Diet Quality" 
            field="diet_quality" 
            min={0} 
            max={2} 
            type="select"
            scale="0-2"
            description="0=Poor, 1=Average, 2=Good" 
          />
          <InputField 
            label="Motivation Level" 
            field="motivation_level" 
            min={1} 
            max={5} 
            scale="1-5"
            description="Rate your academic motivation from 1 (very low) to 5 (very high)" 
          />
          <InputField 
            label="Physical Health" 
            field="physical_health" 
            min={1} 
            max={5} 
            scale="1-5"
            description="Rate your physical health from 1 (poor) to 5 (excellent)" 
          />
        </FormCard>

        {/* ─── Card 3: Socioeconomic & Environment ────────────── */}
        <FormCard title="Socioeconomic & Environment" icon={<FaHome className="text-[#1a2a6c]" />}>
          <InputField 
            label="Electricity Availability" 
            field="electricity_availability" 
            min={0} 
            max={1} 
            step={0.1} 
            scale="0-1"
            description="0=Never available, 1=Always available" 
          />
          <InputField 
            label="Home Study Environment" 
            field="home_study_environment" 
            min={1} 
            max={10} 
            scale="1-10"
            description="Rate your home study convenience from 1 (very poor) to 10 (excellent)" 
          />
          <InputField 
            label="Internet Quality" 
            field="internet_quality" 
            min={0} 
            max={3} 
            type="select"
            scale="0-3"
            description="0=Poor, 1=Average, 2=Good, 3=Excellent" 
          />
          <InputField 
            label="Peer Influence" 
            field="peer_influence" 
            min={0} 
            max={2} 
            type="select"
            scale="0-2"
            description="0=Negative, 1=Neutral, 2=Positive" 
          />
          <InputField 
            label="Family Support" 
            field="family_support" 
            min={1} 
            max={5} 
            scale="1-5"
            description="Rate family support from 1 (very low) to 5 (very high)" 
          />
          <InputField 
            label="Family Income Level" 
            field="family_income_level" 
            min={0} 
            max={2} 
            type="select"
            scale="0-2"
            description="0=Low, 1=Middle, 2=High" 
          />
          <InputField 
            label="Community Support" 
            field="community_beliefs" 
            min={1} 
            max={5} 
            scale="1-5"
            description="Rate community support for education from 1 (very low) to 5 (very high)" 
          />
        </FormCard>

        {/* ─── Card 4: Health & Wellbeing ────────────────────── */}
        <FormCard title="Health & Wellbeing" icon={<FaHeartbeat className="text-[#1a2a6c]" />}>
          <InputField 
            label="Stress Level" 
            field="stress_level" 
            min={1} 
            max={10} 
            scale="1-10"
            description="1=Very calm, 10=Extremely stressed"
            extraButton={
              <button
                type="button"
                onClick={onOpenPHQ9}
                className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full hover:bg-red-200 transition-all flex items-center gap-1 font-medium shadow-sm"
              >
                <FaFileMedical size={10} /> PHQ-9
              </button>
            }
          />
          <InputField 
            label="Exam Anxiety" 
            field="exam_anxiety" 
            min={1} 
            max={10} 
            scale="1-10"
            description="1=Very calm, 10=Extremely anxious"
            extraButton={
              <button
                type="button"
                onClick={onOpenGAD7}
                className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full hover:bg-blue-200 transition-all flex items-center gap-1 font-medium shadow-sm"
              >
                <FaFileMedical size={10} /> GAD-7
              </button>
            }
          />
          <InputField 
            label="Psychological Wellbeing" 
            field="psychological_state" 
            min={1} 
            max={5} 
            scale="1-5"
            description="Rate your mental wellbeing from 1 (very poor) to 5 (excellent)"
            extraButton={
              <button
                type="button"
                onClick={onOpenWellbeing}
                className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full hover:bg-purple-200 transition-all flex items-center gap-1 font-medium shadow-sm"
              >
                <FaBrain size={10} /> Assess
              </button>
            }
          />
        </FormCard>

      </div>

      {/* Predict Button */}
      <div className="mt-6 flex justify-center">
        <button
          type="submit"
          disabled={loading}
          className="px-12 py-3 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all disabled:opacity-50 flex items-center gap-3 text-lg font-medium shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <FaChartLine /> Predict
            </>
          )}
        </button>
      </div>
    </form>
  );
};