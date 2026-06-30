import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { FaChartLine } from 'react-icons/fa';

interface ActivityChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
      tension: number;
    }[];
  };
}

export const ActivityChart = ({ data }: ActivityChartProps) => {
  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { 
          usePointStyle: true,
          color: '#4a5568',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: '#f0f4ff' },
        ticks: { color: '#4a5568' },
      },
      x: {
        grid: { color: '#f0f4ff' },
        ticks: { color: '#4a5568' },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#1a2a6c] flex items-center gap-2">
          <FaChartLine className="text-[#1a2a6c]" /> Year Activity
        </h2>
        <button className="text-sm text-[#1a2a6c] hover:text-[#2d4373] font-medium hover:underline">
          View More →
        </button>
      </div>
      <Line data={data} options={options} height={250} />
      <div className="flex justify-between mt-4 text-sm text-gray-500">
        <span>⬆ Study Hours: 12h (peak)</span>
        <span>⬇ Attendance: 70% (lowest)</span>
      </div>
    </div>
  );
};