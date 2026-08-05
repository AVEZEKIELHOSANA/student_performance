'use client';

import { Student } from './StaticData';
import { FaExclamationTriangle, FaUserGraduate, FaChartPie } from 'react-icons/fa';

interface RiskOverviewProps {
  students: Student[];
}

export const RiskOverview = ({ students }: RiskOverviewProps) => {
  const riskCounts = {
    critical: students.filter(s => s.riskLevel === 'critical').length,
    high: students.filter(s => s.riskLevel === 'high').length,
    medium: students.filter(s => s.riskLevel === 'medium').length,
    low: students.filter(s => s.riskLevel === 'low').length,
  };

  const total = students.length;
  const riskData = [
    { label: 'Critical', count: riskCounts.critical, color: 'bg-red-500', textColor: 'text-red-600' },
    { label: 'High', count: riskCounts.high, color: 'bg-orange-500', textColor: 'text-orange-600' },
    { label: 'Medium', count: riskCounts.medium, color: 'bg-yellow-500', textColor: 'text-yellow-600' },
    { label: 'Low', count: riskCounts.low, color: 'bg-green-500', textColor: 'text-green-600' },
  ];

  const atRiskTotal = riskCounts.critical + riskCounts.high;
  const atRiskPercentage = total > 0 ? (atRiskTotal / total) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1a2a6c] flex items-center gap-2">
          <FaExclamationTriangle className="text-red-500" />
          Risk Overview
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">At Risk:</span>
          <span className="font-bold text-red-600">{atRiskTotal} students</span>
          <span className="text-gray-400">({atRiskPercentage.toFixed(1)}%)</span>
        </div>
      </div>

      <div className="space-y-4">
        {riskData.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{item.label} Risk</span>
              <span className="font-medium">{item.count} students</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`${item.color} h-2.5 rounded-full transition-all duration-500`}
                style={{ width: `${(item.count / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-[#e2e8f0]">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{riskCounts.low}</p>
            <p className="text-xs text-gray-500">Low Risk</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">{riskCounts.medium}</p>
            <p className="text-xs text-gray-500">Medium Risk</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">{riskCounts.high}</p>
            <p className="text-xs text-gray-500">High Risk</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{riskCounts.critical}</p>
            <p className="text-xs text-gray-500">Critical</p>
          </div>
        </div>
      </div>
    </div>
  );
};