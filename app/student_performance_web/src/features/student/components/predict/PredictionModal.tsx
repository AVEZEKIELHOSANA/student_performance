'use client';

import { FaTimes, FaDownload, FaSave, FaChartBar, FaLightbulb, FaCheckCircle } from 'react-icons/fa';
import { PredictionResult } from './types';

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: PredictionResult | null;
  username: string;
}

export const PredictionModal = ({ isOpen, onClose, result, username }: PredictionModalProps) => {
  if (!isOpen || !result) return null;

  const handleSave = () => {
    // Save logic here - e.g., save to history
    console.log('Saving prediction:', result);
    alert('Prediction saved to history!');
    onClose();
  };

  const handleDownload = () => {
    const reportLines = [
      `Prediction Report for ${username}`,
      `Generated: ${new Date().toLocaleString()}`,
      '',
      `Predicted Grade: ${result.predicted_grade}`,
      `Predicted GPA Range: ${result.predicted_gpa_range}`,
      `Probability: ${result.top_probability}%`,
      `Academic Status: ${result.academic_status}`,
      '',
      'Recommendations:',
      ...(result.recommendations || []).map((rec, idx) => `${idx + 1}. ${rec}`),
      '',
      'Probability Breakdown:',
      ...Object.entries(result.all_probabilities).map(
        ([grade, prob]) => `${grade}: ${prob}%`
      ),
    ];

    const blob = new Blob([reportLines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prediction-report-${username.toLowerCase().replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Get risk level color
  const getRiskColor = (grade: string) => {
    const colors: Record<string, string> = {
      'A': 'text-green-600',
      'B': 'text-blue-600',
      'C': 'text-yellow-600',
      'D': 'text-orange-600',
      'Fail': 'text-red-600',
    };
    return colors[grade] || 'text-gray-600';
  };

  const getRiskBg = (grade: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-green-50 border-green-200',
      'B': 'bg-blue-50 border-blue-200',
      'C': 'bg-yellow-50 border-yellow-200',
      'D': 'bg-orange-50 border-orange-200',
      'Fail': 'bg-red-50 border-red-200',
    };
    return colors[grade] || 'bg-gray-50 border-gray-200';
  };

  // Generate encouragement note based on grade
  const getEncouragement = (grade: string) => {
    const notes: Record<string, string> = {
      'A': '🌟 Excellent work! Your dedication and hard work are paying off. Keep pushing to maintain this high standard!',
      'B': '👏 Great job! You are performing well above average. With a little more effort, you can reach the top tier!',
      'C': '💪 Good effort! You have a solid foundation. Focus on the areas highlighted in the recommendations to level up.',
      'D': '📚 You are on the right track! Don\'t be discouraged. Use the recommendations below to guide your improvement plan.',
      'Fail': '🌱 This is a learning opportunity. Every expert was once a beginner. Follow the recommendations and you will see progress!',
    };
    return notes[grade] || 'Keep going! You\'ve got this! 💪';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1a2a6c]">📊 Prediction Results</h2>
            <p className="text-sm text-gray-500">Hello, {username}! Here's your performance analysis</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Main Result Card */}
        <div className={`rounded-xl p-6 border-2 ${getRiskBg(result.predicted_grade)} mb-4`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Predicted Grade</p>
              <p className={`text-4xl font-bold ${getRiskColor(result.predicted_grade)}`}>
                {result.predicted_grade}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">GPA Range</p>
              <p className="text-2xl font-bold text-[#1a2a6c]">{result.predicted_gpa_range}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Probability</p>
              <p className="text-2xl font-bold text-[#1a2a6c]">{result.top_probability}%</p>
            </div>
          </div>
          <div className="text-center mt-3">
            <span className={`px-4 py-1 rounded-full text-sm font-medium ${getRiskColor(result.predicted_grade)} bg-white/50`}>
              {result.academic_status}
            </span>
          </div>
        </div>

        {/* Probability Chart */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FaChartBar className="text-[#1a2a6c]" /> Probability Breakdown
          </h3>
          <div className="space-y-1">
            {Object.entries(result.all_probabilities).map(([grade, prob]) => (
              <div key={grade} className="flex items-center gap-2">
                <span className="text-sm font-medium w-8">{grade}</span>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${getRiskColor(grade).replace('text-', 'bg-')}`}
                    style={{ width: `${prob}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12">{prob}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-[#1a2a6c] mb-2 flex items-center gap-2">
              <FaLightbulb className="text-[#1a2a6c]" /> Recommendations for Improvement
            </h3>
            <ul className="space-y-1">
              {result.recommendations.map((rec, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-[#1a2a6c] font-bold">{idx + 1}.</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Encouragement Note */}
        <div className="mb-4 p-4 bg-gradient-to-r from-[#f0f4ff] to-[#e8edf5] rounded-lg border border-[#1a2a6c]/10">
          <p className="text-sm text-gray-700 text-center font-medium">
            {getEncouragement(result.predicted_grade)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all flex items-center justify-center gap-2"
          >
            <FaSave /> Save Result
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 border-2 border-[#1a2a6c] text-[#1a2a6c] rounded-lg hover:bg-[#f0f4ff] transition-all flex items-center justify-center gap-2"
          >
            <FaDownload /> Download Report
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};