'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { 
  FaSlidersH, 
  FaChartLine, 
  FaGraduationCap, 
  FaClock, 
  FaBed,
  FaBrain,
  FaHome,
  FaHeartbeat,
  FaBook,
  FaLightbulb,
  FaArrowRight,
  FaRedo,
  FaSave,
  FaBullseye,
  FaCalendarWeek,
  FaCheckCircle,
  FaExclamationTriangle,
  FaStar,
  FaUserGraduate
} from 'react-icons/fa';
import { apiClient } from '@/lib/axios';

interface GPAGoalResponse {
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

export const SimulatorContent = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GPAGoalResponse | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [targetGPA, setTargetGPA] = useState(3.0);
  
  // Current student data
  const [currentData, setCurrentData] = useState({
    hours_studied: 4,
    attendance: 75,
    sleep_hours: 7,
    stress_level: 5,
    exam_anxiety: 5,
    tutoring_sessions: 1,
    motivation_level: 3,
    home_study_environment: 3,
    family_support: 3,
    physical_health: 3,
    psychological_state: 3,
    previous_gpa: 2.5,
  });

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/simulator/gpa-goal', {
        target_gpa: targetGPA,
        current_gpa: currentData.previous_gpa,
        current_features: {
          hours_studied: currentData.hours_studied,
          attendance: currentData.attendance,
          sleep_hours: currentData.sleep_hours,
          stress_level: currentData.stress_level,
          exam_anxiety: currentData.exam_anxiety,
          tutoring_sessions: currentData.tutoring_sessions,
          motivation_level: currentData.motivation_level,
          home_study_environment: currentData.home_study_environment,
          family_support: currentData.family_support,
          physical_health: currentData.physical_health,
          psychological_state: currentData.psychological_state,
        }
      });
      setResult(response.data);
      setShowResults(true);
      toast.success('GPA goal analysis complete!');
    } catch (error) {
      console.error('Simulation error:', error);
      toast.error('Failed to run simulation');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTargetGPA(3.0);
    setResult(null);
    setShowResults(false);
    toast.info('Reset to default values');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getFeasibilityColor = (feasibility: string) => {
    switch(feasibility) {
      case 'High': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getFeasibilityIcon = (feasibility: string) => {
    switch(feasibility) {
      case 'High': return <FaCheckCircle className="text-green-600" />;
      case 'Medium': return <FaClock className="text-yellow-600" />;
      case 'Low': return <FaExclamationTriangle className="text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2a6c] flex items-center gap-2">
            <FaBullseye /> GPA Goal Simulator
          </h1>
          <p className="text-[#4a5568] text-sm">
            Set a target GPA and get personalized recommendations to achieve it
          </p>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all text-sm flex items-center gap-2"
        >
          <FaRedo /> Reset
        </button>
      </div>

      {/* ─── Input Section ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Target GPA */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
          <h3 className="text-sm font-semibold text-[#1a2a6c] mb-4 flex items-center gap-2">
            <FaBullseye /> Set Your Target GPA
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Target GPA</span>
                <span className="font-medium text-[#1a2a6c]">{targetGPA.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="4.0"
                step="0.1"
                value={targetGPA}
                onChange={(e) => setTargetGPA(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1a2a6c]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1.0</span>
                <span>2.5</span>
                <span>4.0</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                Current GPA: <span className="font-medium text-[#1a2a6c]">{currentData.previous_gpa}</span>
              </p>
              <p className="text-sm text-gray-600">
                Gap: <span className="font-medium text-[#1a2a6c]">{(targetGPA - currentData.previous_gpa).toFixed(1)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Current Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
          <h3 className="text-sm font-semibold text-[#1a2a6c] mb-4 flex items-center gap-2">
            <FaChartLine /> Current Academic Profile
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-500">Study Hours</p>
              <p className="text-sm font-medium text-[#1a2a6c]">{currentData.hours_studied}h</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-500">Attendance</p>
              <p className="text-sm font-medium text-[#1a2a6c]">{currentData.attendance}%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-500">Tutoring</p>
              <p className="text-sm font-medium text-[#1a2a6c]">{currentData.tutoring_sessions}/wk</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-500">Stress Level</p>
              <p className="text-sm font-medium text-[#1a2a6c]">{currentData.stress_level}/10</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Simulate Button ───────────────────────────────────── */}
      <div className="flex justify-center">
        <button
          onClick={handleSimulate}
          disabled={loading}
          className="px-12 py-3 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all disabled:opacity-50 flex items-center gap-3 text-lg font-medium shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Analyzing...
            </>
          ) : (
            <>
              <FaBullseye /> Generate Roadmap to {targetGPA.toFixed(1)} GPA
            </>
          )}
        </button>
      </div>

      {/* ─── Results ───────────────────────────────────────────── */}
      {showResults && result && (
        <div className="mt-6 space-y-6 animate-fadeIn">
          {/* Summary Card */}
          <div className="bg-white rounded-xl shadow-lg border border-[#e2e8f0] overflow-hidden">
            <div className="bg-gradient-to-r from-[#1a2a6c] to-[#2d4373] px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaChartLine /> GPA Goal Analysis
              </h2>
            </div>

            <div className="p-6">
              {/* Feasibility */}
              <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl">
                  {getFeasibilityIcon(result.feasibility)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Feasibility</p>
                  <p className={`text-lg font-bold ${getFeasibilityColor(result.feasibility)}`}>
                    {result.feasibility} - {result.estimated_time}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm text-gray-600">Target GPA</p>
                  <p className="text-lg font-bold text-[#1a2a6c]">{result.target_gpa.toFixed(1)}</p>
                </div>
              </div>

              {/* Motivation Message */}
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-700 italic">💡 {result.motivation_message}</p>
              </div>

              {/* Required Changes */}
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaSlidersH /> Required Changes
              </h3>
              <div className="space-y-3 mb-6">
                {result.required_changes.map((change, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        {change.feature.replace(/_/g, ' ')}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">Current: {change.current_value}</span>
                        <FaArrowRight className="text-gray-400 text-xs" />
                        <span className="text-xs font-medium text-[#1a2a6c]">
                          Target: {change.required_value}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(change.difficulty)}`}>
                          {change.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#1a2a6c]">
                        +{change.improvement}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaLightbulb /> Action Plan
              </h3>
              <div className="space-y-4 mb-6">
                {result.recommendations.map((rec, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#1a2a6c]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-[#1a2a6c]">{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium text-gray-800">{rec.title}</h4>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            {rec.timeline}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                        <ul className="mt-2 space-y-1">
                          {rec.action_items.map((item, i) => (
                            <li key={i} className="text-xs text-gray-500 flex items-start gap-2">
                              <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={12} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Weekly Plan */}
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaCalendarWeek /> Weekly Roadmap
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.weekly_plan.map((week) => (
                  <div key={week.week} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-[#1a2a6c]">Week {week.week}</span>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{week.focus}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">Target: {week.target_metric}</p>
                    <ul className="space-y-1">
                      {week.actions.map((action, i) => (
                        <li key={i} className="text-xs text-gray-500 flex items-start gap-2">
                          <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={10} />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button className="flex-1 py-2.5 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all flex items-center justify-center gap-2 text-sm">
                  <FaSave /> Save Plan
                </button>
                <button className="flex-1 py-2.5 border-2 border-[#1a2a6c] text-[#1a2a6c] rounded-lg hover:bg-[#f0f4ff] transition-all flex items-center justify-center gap-2 text-sm">
                  <FaBook /> View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};