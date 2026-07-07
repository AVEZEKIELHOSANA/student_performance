'use client';

import { useState } from 'react';
import { 
  FaBell, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaInfoCircle,
  FaCheck,
  FaExclamation,
  FaTrash,
  FaChartLine,
  FaShieldAlt,
  FaChevronDown,
  FaChevronUp,
  FaClock
} from 'react-icons/fa';
import { Notification } from '../../types/notification.types';

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const typeConfig = {
  prediction: { 
    icon: FaChartLine, 
    color: 'text-blue-500', 
    bg: 'bg-blue-50',
    label: 'Prediction'
  },
  risk_alert: { 
    icon: FaExclamationTriangle, 
    color: 'text-red-500', 
    bg: 'bg-red-50',
    label: 'Risk Alert'
  },
  system: { 
    icon: FaShieldAlt, 
    color: 'text-gray-500', 
    bg: 'bg-gray-50',
    label: 'System'
  },
  reminder: { 
    icon: FaClock, 
    color: 'text-purple-500', 
    bg: 'bg-purple-50',
    label: 'Reminder'
  },
};

export const NotificationItem = ({ notification, onMarkRead, onDelete }: NotificationItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = typeConfig[notification.type as keyof typeof typeConfig] || typeConfig.system;
  const Icon = config.icon;

  const formattedDate = new Date(notification.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = new Date(notification.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Risk level styling
  const getRiskBadge = (risk?: string) => {
    if (!risk) return null;
    const colors = {
      'Low': 'bg-green-100 text-green-700',
      'Medium': 'bg-yellow-100 text-yellow-700',
      'High': 'bg-red-100 text-red-700',
    };
    return colors[risk as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div 
      className={`p-4 hover:bg-gray-50/50 transition-all cursor-pointer ${
        !notification.is_read ? 'bg-blue-50/30 border-l-4 border-[#1a2a6c]' : ''
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`mt-0.5 w-10 h-10 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`${config.color} text-lg`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`text-sm font-medium ${!notification.is_read ? 'text-[#1a2a6c]' : 'text-gray-700'}`}>
                  {notification.title}
                </p>
                {!notification.is_read && (
                  <span className="w-2 h-2 bg-[#1a2a6c] rounded-full flex-shrink-0"></span>
                )}
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                  {config.label}
                </span>
                {notification.metadata?.risk_level && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getRiskBadge(notification.metadata.risk_level)}`}>
                    Risk: {notification.metadata.risk_level}
                  </span>
                )}
              </div>
              <p className={`text-sm mt-0.5 ${isExpanded ? 'text-gray-700' : 'text-gray-500 line-clamp-2'}`}>
                {notification.message}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-400 whitespace-nowrap">{formattedDate}</span>
              <span className="text-xs text-gray-400">{formattedTime}</span>
              {isExpanded ? <FaChevronUp className="text-gray-400" size={12} /> : <FaChevronDown className="text-gray-400" size={12} />}
            </div>
          </div>

          {/* Expanded actions */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-[#e2e8f0] flex flex-wrap gap-2">
              {notification.action_url && (
                <a
                  href={notification.action_url}
                  className="text-xs text-[#1a2a6c] hover:underline px-3 py-1 bg-[#f0f4ff] rounded-full flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Details →
                </a>
              )}
              {!notification.is_read && (
                <button
                  onClick={(e) => { e.stopPropagation(); onMarkRead(notification.id); }}
                  className="text-xs text-green-600 hover:text-green-700 px-3 py-1 bg-green-50 rounded-full hover:bg-green-100 transition-all flex items-center gap-1"
                >
                  <FaCheck size={10} /> Mark as Read
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
                className="text-xs text-red-500 hover:text-red-600 px-3 py-1 bg-red-50 rounded-full hover:bg-red-100 transition-all flex items-center gap-1"
              >
                <FaTrash size={10} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};