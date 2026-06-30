import { Prediction } from '../../types/dashboard.types';
import { FaChartLine, FaExclamationTriangle, FaCheckCircle, FaClock, FaArrowRight } from 'react-icons/fa';

interface PerformanceCardProps {
  latestPrediction: Prediction | null;
  totalPredictions: number;
  averageGrade: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  onRunPrediction: () => void;
}

const riskColors = {
  Low: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  High: 'bg-red-100 text-red-700',
};

const riskIcons = {
  Low: <FaCheckCircle className="text-green-600" />,
  Medium: <FaClock className="text-yellow-600" />,
  High: <FaExclamationTriangle className="text-red-600" />,
};

export const PerformanceCard = ({ 
  latestPrediction, 
  totalPredictions, 
  averageGrade, 
  riskLevel,
  onRunPrediction 
}: PerformanceCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
      <h2 className="text-lg font-semibold text-[#1a2a6c] mb-4 flex items-center gap-2">
        <FaChartLine className="text-[#1a2a6c]" /> Performance Prediction
      </h2>
      
      {latestPrediction ? (
        <>
          <div className="text-center mb-4 p-4 bg-[#f0f4ff] rounded-lg">
            <p className="text-sm text-[#4a5568]">Predicted GPA Range</p>
            <p className="text-2xl font-bold text-[#1a2a6c]">{averageGrade}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-[#f0f4ff]">
              <span className="text-sm text-[#4a5568] flex items-center gap-2">
                {riskIcons[riskLevel]} Risk Level
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${riskColors[riskLevel]}`}>
                {riskLevel}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-[#f0f4ff]">
              <span className="text-sm text-[#4a5568]">Probability</span>
              <span className="font-medium text-[#1a2a6c]">{latestPrediction.probability}%</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-[#f0f4ff]">
              <span className="text-sm text-[#4a5568]">Status</span>
              <span className="font-medium text-[#1a2a6c]">{latestPrediction.academic_status}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-[#4a5568]">Total Predictions</span>
              <span className="font-medium text-[#1a2a6c]">{totalPredictions}</span>
            </div>
          </div>

          <button 
            onClick={onRunPrediction}
            className="w-full mt-4 py-2.5 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all text-sm font-medium flex items-center justify-center gap-2"
          >
            View Full Report <FaArrowRight size={12} />
          </button>
        </>
      ) : (
        <div className="text-center py-8 text-[#4a5568]">
          <FaChartLine className="mx-auto text-4xl text-[#cbd5e1] mb-4" />
          <p className="font-medium">No predictions yet</p>
          <p className="text-sm mt-1">Run your first prediction to get started</p>
          <button 
            onClick={onRunPrediction}
            className="mt-4 px-6 py-2.5 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all text-sm font-medium"
          >
            Run Your First Prediction
          </button>
        </div>
      )}
    </div>
  );
};