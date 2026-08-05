'use client';

import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface PHQ9FormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scores: number[]) => void;
}

const questions = [
  'Little interest or pleasure in doing things?',
  'Feeling down, depressed, or hopeless?',
  'Trouble falling or staying asleep, or sleeping too much?',
  'Feeling tired or having little energy?',
  'Poor appetite or overeating?',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down?',
  'Trouble concentrating on things, such as reading the newspaper or watching television?',
  'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?',
  'Thoughts that you would be better off dead, or of hurting yourself?',
];

const options = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
];

export const PHQ9Form = ({ isOpen, onClose, onSave }: PHQ9FormProps) => {
  const [answers, setAnswers] = useState<number[]>(Array(9).fill(0));

  if (!isOpen) return null;

  const handleChange = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    onSave(answers);
    onClose();
  };

  const total = answers.reduce((sum, val) => sum + val, 0);
  let severity = 'Minimal depression';
  let color = 'text-green-600';
  if (total >= 20) { severity = 'Severe depression'; color = 'text-red-600'; }
  else if (total >= 15) { severity = 'Moderately severe depression'; color = 'text-orange-600'; }
  else if (total >= 10) { severity = 'Moderate depression'; color = 'text-yellow-600'; }
  else if (total >= 5) { severity = 'Mild depression'; color = 'text-blue-500'; }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#1a2a6c]">PHQ-9 Depression Assessment</h2>
            <p className="text-sm text-gray-500">Over the last 2 weeks, how often have you been bothered by the following problems?</p>
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
                      px-3 py-1.5 text-xs rounded-full border transition-all
                      ${answers[idx] === opt.value 
                        ? 'bg-[#1a2a6c] text-white border-[#1a2a6c]' 
                        : 'border-gray-300 text-gray-600 hover:border-[#1a2a6c] hover:text-[#1a2a6c]'
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm">
            <span className="font-medium">Total Score: {total}</span>
            <span className={`ml-3 font-medium ${color}`}>— {severity}</span>
          </p>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all"
          >
            Use These Results
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