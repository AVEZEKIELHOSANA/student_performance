'use client';

import { useState } from 'react';
import { FaBell, FaEnvelope, FaMobileAlt, FaFileAlt, FaChartLine, FaHandsHelping, FaClock, FaMailBulk } from 'react-icons/fa';
import { NotificationPreferences as PrefType } from '../../types/notification.types';

interface NotificationPreferencesProps {
  preferences: PrefType;
  onUpdate: (prefs: Partial<PrefType>) => void;
  loading: boolean;
}

const ToggleSwitch = ({ 
  enabled, 
  onChange, 
  label 
}: { 
  enabled: boolean; 
  onChange: () => void; 
  label: string;
}) => {
  return (
    <div 
      className={`w-12 h-6 rounded-full cursor-pointer transition-all relative ${
        enabled ? 'bg-[#1a2a6c]' : 'bg-gray-300'
      }`}
      onClick={onChange}
    >
      <div 
        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
          enabled ? 'right-0.5' : 'left-0.5'
        }`}
      />
    </div>
  );
};

export const NotificationPreferences = ({ preferences, onUpdate, loading }: NotificationPreferencesProps) => {
  const [prefs, setPrefs] = useState(preferences);

  const handleToggle = (key: keyof PrefType) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    onUpdate(newPrefs);
  };

  const items = [
    { key: 'email_notifications', label: 'Email Notifications', icon: FaEnvelope, desc: 'Receive notifications via email' },
    { key: 'push_notifications', label: 'Push Notifications', icon: FaMobileAlt, desc: 'Receive push notifications on your device' },
    { key: 'weekly_reports', label: 'Weekly Reports', icon: FaFileAlt, desc: 'Get a weekly summary of your performance' },
    { key: 'prediction_alerts', label: 'Prediction Alerts', icon: FaChartLine, desc: 'Get notified when your prediction changes' },
    { key: 'intervention_alerts', label: 'Intervention Alerts', icon: FaHandsHelping, desc: 'Get notified when an instructor intervenes' },
    { key: 'reminder_notifications', label: 'Reminder Notifications', icon: FaClock, desc: 'Get reminders for upcoming deadlines' },
    { key: 'marketing_emails', label: 'Marketing Emails', icon: FaMailBulk, desc: 'Receive updates and promotional content' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
      <h2 className="text-lg font-semibold text-[#1a2a6c] mb-4 flex items-center gap-2">
        <FaBell className="text-[#1a2a6c]" /> Notification Preferences
      </h2>

      <div className="space-y-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg hover:bg-gray-50 transition-all">
              <div className="flex items-center gap-3">
                <Icon className="text-gray-400" size={16} />
                <div>
                  <p className="text-sm font-medium text-gray-700">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={prefs[item.key as keyof PrefType]}
                onChange={() => handleToggle(item.key as keyof PrefType)}
                label={item.label}
              />
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1a2a6c]"></div>
          Saving preferences...
        </div>
      )}
    </div>
  );
};