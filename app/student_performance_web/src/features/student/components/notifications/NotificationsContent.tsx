'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  FaBell, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaInfoCircle,
  FaTimes,
  FaCheck,
  FaExclamation,
  FaTrash,
  FaChartLine,
  FaLightbulb,
  FaHandsHelping,
  FaBullseye,
  FaCalendarAlt,
  FaFire,
  FaShieldAlt,
  FaFilter,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaClock
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { notificationService } from '../../services/notification.service';
import { Notification } from '../../types/notification.types';
import { NotificationItem } from './NotificationItem';

type FilterType = 'all' | 'prediction' | 'risk_alert' | 'system' | 'reminder';

const filterOptions: { id: FilterType; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All', icon: FaBell },
  { id: 'prediction', label: 'Predictions', icon: FaChartLine },
  { id: 'risk_alert', label: 'Risk Alerts', icon: FaExclamationTriangle },
  { id: 'reminder', label: 'Reminders', icon: FaClock },
  { id: 'system', label: 'System', icon: FaShieldAlt },
];

export const NotificationsContent = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showRead, setShowRead] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const getFilteredNotifications = () => {
    let filtered = [...notifications];
    
    // Filter by type
    if (filter !== 'all') {
      filtered = filtered.filter(n => n.type === filter);
    }
    
    // Filter read/unread
    if (!showRead) {
      filtered = filtered.filter(n => !n.is_read);
    }
    
    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2a6c] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ─── Header ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/student')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaArrowLeft size={18} />
            </button>
            <h1 className="text-2xl font-bold text-[#1a2a6c] flex items-center gap-2">
              <FaBell /> Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm rounded-full px-3 py-0.5 ml-2">
                  {unreadCount} unread
                </span>
              )}
            </h1>
          </div>
          <p className="text-[#4a5568] text-sm mt-1 ml-10">
            Stay updated on your academic progress
          </p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all text-sm flex items-center gap-2"
          >
            <FaCheck /> Mark all as read
          </button>
        )}
      </div>

      {/* ─── Filters ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-[#e2e8f0]">
        <div className="flex flex-wrap gap-1">
          {filterOptions.map((option) => {
            const Icon = option.icon;
            const isActive = filter === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setFilter(option.id)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all
                  ${isActive 
                    ? 'bg-[#1a2a6c] text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <Icon size={14} />
                {option.label}
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowRead(!showRead)}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all ${
              showRead ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {showRead ? <FaEye /> : <FaEyeSlash />}
            {showRead ? 'Show All' : 'Unread Only'}
          </button>
        </div>
      </div>

      {/* ─── Notification List ─────────────────────────────────── */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-[#e2e8f0]">
          <FaBell className="mx-auto text-4xl text-[#cbd5e1] mb-4" />
          <p className="text-[#4a5568] font-medium">No notifications</p>
          <p className="text-sm text-[#4a5568] mt-1">
            {filter !== 'all' || showRead 
              ? 'Try changing your filters' 
              : 'When you receive notifications, they will appear here'}
          </p>
          {(filter !== 'all' || showRead) && (
            <button
              onClick={() => { setFilter('all'); setShowRead(false); }}
              className="mt-4 text-sm text-[#1a2a6c] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
            <div className="divide-y divide-[#e2e8f0]">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 text-center text-xs text-gray-500 border-t border-[#e2e8f0] flex justify-between items-center">
              <span>Showing {filteredNotifications.length} of {notifications.length} notifications</span>
              {unreadCount > 0 && (
                <span className="text-[#1a2a6c]">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-[#e2e8f0]">
              <p className="text-2xl font-bold text-[#1a2a6c]">{notifications.length}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-[#e2e8f0]">
              <p className="text-2xl font-bold text-red-500">{unreadCount}</p>
              <p className="text-xs text-gray-500">Unread</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-[#e2e8f0]">
              <p className="text-2xl font-bold text-blue-500">
                {notifications.filter(n => n.type === 'prediction').length}
              </p>
              <p className="text-xs text-gray-500">Predictions</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center border border-[#e2e8f0]">
              <p className="text-2xl font-bold text-red-500">
                {notifications.filter(n => n.type === 'risk_alert').length}
              </p>
              <p className="text-xs text-gray-500">Risk Alerts</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};