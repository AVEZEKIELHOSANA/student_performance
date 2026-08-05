'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  FaBell,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChartLine,
  FaCheck,
  FaTimes,
  FaTrash,
  FaHandsHelping,
  FaClock,
  FaShieldAlt,
  FaArrowLeft,
  FaEnvelope,
  FaMobileAlt,
  FaFileAlt,
  FaInfoCircle,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { apiClient } from '@/lib/axios';

interface Notification {
  id: string;
  type: 'prediction' | 'risk_alert' | 'system' | 'reminder' | 'intervention';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  action_url?: string;
}

interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  weekly_reports: boolean;
  prediction_alerts: boolean;
  risk_alerts: boolean;
  intervention_alerts: boolean;
  reminder_notifications: boolean;
  marketing_emails: boolean;
}

type FilterType = 'all' | 'prediction' | 'risk_alert' | 'intervention' | 'reminder' | 'system';

const filterOptions: { id: FilterType; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All', icon: FaBell },
  { id: 'prediction', label: 'Predictions', icon: FaChartLine },
  { id: 'risk_alert', label: 'Risk Alerts', icon: FaExclamationTriangle },
  { id: 'intervention', label: 'Interventions', icon: FaHandsHelping },
  { id: 'reminder', label: 'Reminders', icon: FaClock },
  { id: 'system', label: 'System', icon: FaShieldAlt },
];

const typeConfig = {
  prediction: { icon: FaChartLine, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Prediction' },
  risk_alert: { icon: FaExclamationTriangle, color: 'text-red-500', bg: 'bg-red-50', label: 'Risk Alert' },
  intervention: { icon: FaHandsHelping, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Intervention' },
  reminder: { icon: FaClock, color: 'text-yellow-500', bg: 'bg-yellow-50', label: 'Reminder' },
  system: { icon: FaShieldAlt, color: 'text-gray-500', bg: 'bg-gray-50', label: 'System' },
};

export const InstructorNotificationsContent = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showRead, setShowRead] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_notifications: true,
    push_notifications: false,
    weekly_reports: true,
    prediction_alerts: true,
    risk_alerts: true,
    intervention_alerts: true,
    reminder_notifications: true,
    marketing_emails: false,
  });
  const [prefLoading, setPrefLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [notifsRes, prefsRes] = await Promise.all([
          apiClient.get('/instructors/notifications'),
          apiClient.get('/instructors/notifications/preferences'),
        ]);
        setNotifications(notifsRes.data);
        setPreferences(prefsRes.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await apiClient.put(`/instructors/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/instructors/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiClient.put('/instructors/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleUpdatePreference = async (key: keyof NotificationPreferences) => {
    setPrefLoading(true);
    try {
      const newPrefs = { ...preferences, [key]: !preferences[key] };
      await apiClient.put('/instructors/notifications/preferences', newPrefs);
      setPreferences(newPrefs);
      toast.success('Preference updated');
    } catch (error) {
      toast.error('Failed to update preference');
    } finally {
      setPrefLoading(false);
    }
  };

  const filteredNotifications = notifications
    .filter((n) => filter === 'all' || n.type === filter)
    .filter((n) => showRead || !n.is_read);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2a6c]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/instructor')}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#1a2a6c] flex items-center gap-2">
            <FaBell /> Notifications
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm rounded-full px-3 py-0.5 ml-2">
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="text-[#4a5568] text-sm">Manage your notifications and preferences</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 bg-white p-3 rounded-xl shadow-sm border border-[#e2e8f0]">
        {filterOptions.map((option) => {
          const Icon = option.icon;
          const isActive = filter === option.id;
          return (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all ${
                isActive ? 'bg-[#1a2a6c] text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={14} />
              {option.label}
            </button>
          );
        })}
        {notifications.length > 0 && unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="ml-auto text-sm text-[#1a2a6c] hover:underline flex items-center gap-1"
          >
            <FaCheck size={12} /> Mark all read
          </button>
        )}
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-[#e2e8f0]">
          <FaBell className="mx-auto text-4xl text-[#cbd5e1] mb-4" />
          <p className="text-[#4a5568] font-medium">No notifications</p>
          <p className="text-sm text-[#4a5568] mt-1">
            {filter !== 'all' || !showRead ? 'Try changing your filters' : 'When you receive notifications, they will appear here'}
          </p>
          {(filter !== 'all' || !showRead) && (
            <button
              onClick={() => {
                setFilter('all');
                setShowRead(true);
              }}
              className="mt-4 text-sm text-[#1a2a6c] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
          <div className="divide-y divide-[#e2e8f0]">
            {filteredNotifications.map((notification) => {
              const config = typeConfig[notification.type as keyof typeof typeConfig] || typeConfig.system;
              const Icon = config.icon;
              const formattedDate = new Date(notification.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-all ${
                    !notification.is_read ? 'bg-blue-50/30 border-l-4 border-[#1a2a6c]' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-0.5 w-10 h-10 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`${config.color} text-lg`} />
                    </div>
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
                          </div>
                          <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-400 whitespace-nowrap">{formattedDate}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {!notification.is_read && (
                          <button
                            onClick={() => handleMarkRead(notification.id)}
                            className="text-xs text-green-600 hover:text-green-700 px-3 py-1 bg-green-50 rounded-full hover:bg-green-100 transition-all flex items-center gap-1"
                          >
                            <FaCheck size={10} /> Mark as Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="text-xs text-red-500 hover:text-red-600 px-3 py-1 bg-red-50 rounded-full hover:bg-red-100 transition-all flex items-center gap-1"
                        >
                          <FaTrash size={10} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-4 py-3 bg-gray-50 text-center text-xs text-gray-500 border-t border-[#e2e8f0]">
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-[#1a2a6c] flex items-center gap-2">
            <FaBell /> Notification Preferences
          </h2>
          <span className="text-sm text-gray-500">Manage delivery options</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(
            [
              { key: 'email_notifications', label: 'Email Notifications', icon: FaEnvelope },
              { key: 'push_notifications', label: 'Push Notifications', icon: FaMobileAlt },
              { key: 'weekly_reports', label: 'Weekly Reports', icon: FaFileAlt },
              { key: 'prediction_alerts', label: 'Prediction Alerts', icon: FaChartLine },
              { key: 'risk_alerts', label: 'Risk Alerts', icon: FaExclamationTriangle },
              { key: 'intervention_alerts', label: 'Intervention Alerts', icon: FaHandsHelping },
              { key: 'reminder_notifications', label: 'Reminder Notifications', icon: FaClock },
              { key: 'marketing_emails', label: 'Marketing Emails', icon: FaInfoCircle },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-center justify-between gap-4 p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#1a2a6c]/10 text-[#1a2a6c]">
                    <Icon />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-500">{preferences[item.key] ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleUpdatePreference(item.key)}
                  disabled={prefLoading}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    preferences[item.key]
                      ? 'bg-[#1a2a6c] text-white hover:bg-[#2d4373]'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {preferences[item.key] ? 'Disable' : 'Enable'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
