'use client';

import { ReactElement } from 'react';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  change?: string;
}

export const StatsCard = ({ label, value, icon: Icon, color, change }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-[#1a2a6c] mt-1">{value}</p>
          {change && <p className="text-xs text-gray-400 mt-1">{change}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon />
        </div>
      </div>
    </div>
  );
};