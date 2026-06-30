import { 
  FaGraduationCap, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle 
} from 'react-icons/fa';

interface QuickStatsProps {
  totalPredictions: number;
  riskLevel: string;
}

export const QuickStats = ({ totalPredictions, riskLevel }: QuickStatsProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
      <h2 className="text-lg font-semibold text-[#1a2a6c] mb-4">Quick Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#f0f4ff] rounded-lg p-4 text-center border border-[#e2e8f0]">
          <FaGraduationCap className="text-[#1a2a6c] mx-auto text-xl mb-1" />
          <p className="text-2xl font-bold text-[#1a2a6c]">{totalPredictions || 0}</p>
          <p className="text-xs text-[#4a5568]">Total Predictions</p>
        </div>
        <div className="bg-[#f0f4ff] rounded-lg p-4 text-center border border-[#e2e8f0]">
          <FaCheckCircle className="text-[#1a2a6c] mx-auto text-xl mb-1" />
          <p className="text-2xl font-bold text-[#1a2a6c]">74%</p>
          <p className="text-xs text-[#4a5568]">Avg. Accuracy</p>
        </div>
        <div className="bg-[#f0f4ff] rounded-lg p-4 text-center border border-[#e2e8f0]">
          <FaClock className="text-[#1a2a6c] mx-auto text-xl mb-1" />
          <p className="text-2xl font-bold text-[#1a2a6c]">12</p>
          <p className="text-xs text-[#4a5568]">Study Hours/Week</p>
        </div>
        <div className="bg-[#f0f4ff] rounded-lg p-4 text-center border border-[#e2e8f0]">
          <FaExclamationTriangle className="text-[#1a2a6c] mx-auto text-xl mb-1" />
          <p className="text-2xl font-bold text-[#1a2a6c]">{riskLevel || 'N/A'}</p>
          <p className="text-xs text-[#4a5568]">Risk Level</p>
        </div>
      </div>
    </div>
  );
};