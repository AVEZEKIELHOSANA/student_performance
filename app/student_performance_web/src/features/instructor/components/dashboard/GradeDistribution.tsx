'use client';

import { GradeDistribution as GradeDistType } from './StaticData';
import { FaChartBar, FaMale, FaFemale } from 'react-icons/fa';

interface GradeDistributionProps {
  data: GradeDistType[];
}

export const GradeDistribution = ({ data }: GradeDistributionProps) => {
  const maxTotal = Math.max(...data.map(d => d.total));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6">
      <h3 className="text-lg font-semibold text-[#1a2a6c] flex items-center gap-2 mb-4">
        <FaChartBar className="text-blue-500" />
        Students by Grade & Gender
      </h3>

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.grade}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">{item.grade}</span>
              <span className="text-gray-500">{item.total} students</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex-1 flex gap-0.5">
                <div
                  className="bg-blue-500 h-6 rounded-l transition-all"
                  style={{ width: `${(item.male / maxTotal) * 100}%` }}
                />
                <div
                  className="bg-pink-500 h-6 rounded-r transition-all"
                  style={{ width: `${(item.female / maxTotal) * 100}%` }}
                />
              </div>
              <div className="flex gap-2 text-xs text-gray-500 whitespace-nowrap">
                <span className="flex items-center gap-1">
                  <FaMale className="text-blue-500" /> {item.male}
                </span>
                <span className="flex items-center gap-1">
                  <FaFemale className="text-pink-500" /> {item.female}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};