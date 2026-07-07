'use client';

import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaCalendarAlt, FaChartLine, FaChevronRight } from 'react-icons/fa';
import { PredictionHistoryResponse } from '../../types/prediction.types';

interface HistoryCardProps {
  prediction: PredictionHistoryResponse;
  gradeColor: string;
  statusColor: string;
}

export const HistoryCard = ({ prediction, gradeColor, statusColor }: HistoryCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(prediction.created_at);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-4 hover:shadow-md transition-all cursor-pointer`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* Left: Grade and Status */}
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${gradeColor} border-2`}>
            {prediction.grade_label}
          </div>
          <div>
            <p className={`font-medium ${statusColor}`}>
              {prediction.academic_status}
            </p>
            <p className="text-sm text-[#4a5568]">{prediction.gpa_range}</p>
          </div>
        </div>

        {/* Middle: Probability */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-[#1a2a6c]">{prediction.probability}%</p>
            <p className="text-xs text-[#4a5568]">Probability</p>
          </div>
        </div>

        {/* Right: Date & Expand */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-[#4a5568] flex items-center gap-1">
              <FaCalendarAlt size={12} /> {formattedDate}
            </p>
            <p className="text-xs text-[#4a5568]">{formattedTime}</p>
          </div>
          <button className="text-[#4a5568] hover:text-[#1a2a6c] transition-all">
            {expanded ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-[#e2e8f0] space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-[#4a5568]">Grade</p>
              <p className="font-medium">{prediction.grade_label}</p>
            </div>
            <div>
              <p className="text-xs text-[#4a5568]">GPA Range</p>
              <p className="font-medium">{prediction.gpa_range}</p>
            </div>
            <div>
              <p className="text-xs text-[#4a5568]">Probability</p>
              <p className="font-medium">{prediction.probability}%</p>
            </div>
            <div>
              <p className="text-xs text-[#4a5568]">Status</p>
              <p className={`font-medium ${statusColor}`}>{prediction.academic_status}</p>
            </div>
          </div>
          
          <button 
            className="text-sm text-[#1a2a6c] hover:underline flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              // Navigate to prediction details
            }}
          >
            View Details <FaChevronRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
};