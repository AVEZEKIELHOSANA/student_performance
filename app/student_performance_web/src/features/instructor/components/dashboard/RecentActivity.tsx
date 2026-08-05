'use client';

import { Activity } from './StaticData';
import { FaBell, FaExclamationCircle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <FaExclamationCircle className="text-red-500" />;
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-red-50';
      case 'success':
        return 'bg-green-50';
      case 'info':
        return 'bg-blue-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6">
      <h3 className="text-lg font-semibold text-[#1a2a6c] flex items-center gap-2 mb-4">
        <FaBell className="text-yellow-500" />
        Recent Activity
      </h3>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`flex items-start gap-3 p-3 rounded-lg ${getBgColor(activity.type)} border border-[#e2e8f0]`}
          >
            <div className="mt-0.5">{getIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">
                {activity.studentName}
              </p>
              <p className="text-xs text-gray-600">{activity.action}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[#e2e8f0]">
        <button className="text-sm text-[#1a2a6c] hover:underline w-full text-center">
          View All Activity
        </button>
      </div>
    </div>
  );
};