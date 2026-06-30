'use client';

import { useState } from 'react';
import { FaTimes, FaBrain, FaSmile, FaFrown, FaMeh, FaLaughBeam } from 'react-icons/fa';

interface WellbeingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (score: number) => void;
}

const questions = [
  'How often do you feel overwhelmed by your academic workload?',
  'How would you rate your overall mood over the past month?',
  'How well are you able to concentrate on your studies?',
  'How often do you feel anxious or worried about your academic performance?',
  'How well are you sleeping (quality, not quantity)?',
  'How often do you feel a sense of accomplishment after studying?',
  'How connected do you feel to your peers and support systems?',
  'How often do you engage in activities that bring you joy or relaxation?',
];

const options = [
  { value: 1, label: 'Never / Very Poor', icon: <FaFrown className="text-red-500" /> },
  { value: 2, label: 'Rarely / Poor', icon: <FaMeh className="text-orange-400" /> },
  { value: 3, label: 'Sometimes / Average', icon: <FaMeh className="text-yellow-500" /> },
  { value: 4, label: 'Often / Good', icon: <FaSmile className="text-blue-500" /> },
  { value: 5, label: 'Always / Excellent', icon: <FaLaughBeam className="text-green-500" /> },
];

export const WellbeingForm = ({ isOpen, onClose, onSave }: WellbeingFormProps) => {
  const [answers, setAnswers] = useState<number[]>(Array(8).fill(3));

  if (!isOpen) return null;

  const handleChange = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const total = answers.reduce((sum, val) => sum + val, 0);
    const average = Math.round(total / answers.length);
    onSave(average);
    onClose();
  };

  const total = answers.reduce((sum, val) => sum + val, 0);
  const average = Math.round(total / answers.length);
  
  const getWellbeingLevel = (score: number) => {
    if (score >= 4.5) return { label: 'Excellent Wellbeing', color: 'text-green-600', emoji: '🌟' };
    if (score >= 3.5) return { label: 'Good Wellbeing', color: 'text-blue-600', emoji: '😊' };
    if (score >= 2.5) return { label: 'Moderate Wellbeing', color: 'text-yellow-600', emoji: '🙂' };
    if (score >= 1.5) return { label: 'Low Wellbeing', color: 'text-orange-600', emoji: '😕' };
    return { label: 'Poor Wellbeing', color: 'text-red-600', emoji: '😢' };
  };

  const wellbeing = getWellbeingLevel(average);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#1a2a6c] flex items-center gap-2">
              <FaBrain className="text-[#1a2a6c]" /> Psychological Wellbeing Assessment
            </h2>
            <p className="text-sm text-gray-500">Answer these questions to assess your mental wellbeing</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={idx} className="border-b border-gray-100 pb-3">
              <p className="text-sm font-medium text-gray-700 mb-2">{idx + 1}. {q}</p>
              <div className="flex gap-2 flex-wrap">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleChange(idx, opt.value)}
                    className={`
                      px-3 py-1.5 text-xs rounded-full border transition-all flex items-center gap-1
                      ${answers[idx] === opt.value 
                        ? 'bg-[#1a2a6c] text-white border-[#1a2a6c]' 
                        : 'border-gray-300 text-gray-600 hover:border-[#1a2a6c] hover:text-[#1a2a6c]'
                      }
                    `}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm">
              <span className="font-medium">Average Score: {average}/5</span>
              <span className={`ml-3 font-medium ${wellbeing.color}`}>— {wellbeing.emoji} {wellbeing.label}</span>
            </p>
          </div>
          <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                average >= 4 ? 'bg-green-500' :
                average >= 3 ? 'bg-blue-500' :
                average >= 2 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${(average / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all"
          >
            Use This Assessment
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};