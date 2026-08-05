import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaExclamationTriangle, FaCheckCircle, FaMinusCircle } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

interface RiskDistributionProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderWidth: number;
    }[];
  };
}

const iconMap = {
  'Low Risk': <FaCheckCircle className="text-green-500" />,
  'Medium Risk': <FaMinusCircle className="text-yellow-500" />,
  'High Risk': <FaExclamationTriangle className="text-red-500" />,
};

export const RiskDistribution = ({ data }: RiskDistributionProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
      <h2 className="text-lg font-semibold text-[#1a2a6c] mb-4">Risk Distribution</h2>
      <div className="flex items-center gap-8">
        <div className="w-32 h-32">
          <Doughnut data={data} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {iconMap['Low Risk']}
            <span className="text-sm text-[#4a5568]">Low Risk: 60%</span>
          </div>
          <div className="flex items-center gap-2">
            {iconMap['Medium Risk']}
            <span className="text-sm text-[#4a5568]">Medium Risk: 25%</span>
          </div>
          <div className="flex items-center gap-2">
            {iconMap['High Risk']}
            <span className="text-sm text-[#4a5568]">High Risk: 15%</span>
          </div>
        </div>
      </div>
    </div>
  );
};