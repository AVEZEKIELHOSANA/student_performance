'use client';

import { useAuth } from '@/context/AuthContext';
import { 
  FaUser, 
  FaBell, 
  FaSignOutAlt, 
  FaCog,
  FaEnvelope,
  FaMobileAlt,
  FaFileAlt 
} from 'react-icons/fa';

export const SettingsContent = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a2a6c] mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaUser className="text-[#1a2a6c]" /> Profile Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={user?.username || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                disabled
              />
            </div>
            <button className="text-[#1a2a6c] hover:text-[#2d4373] text-sm font-medium">
              Edit Profile →
            </button>
          </div>
        </div>
        
        {/* Notifications Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaBell className="text-[#1a2a6c]" /> Notification Preferences
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 flex items-center gap-2">
                <FaEnvelope className="text-gray-400" size={14} /> Email Notifications
              </span>
              <div className="w-12 h-6 bg-[#1a2a6c] rounded-full cursor-pointer relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 flex items-center gap-2">
                <FaMobileAlt className="text-gray-400" size={14} /> Push Notifications
              </span>
              <div className="w-12 h-6 bg-gray-300 rounded-full cursor-pointer relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 flex items-center gap-2">
                <FaFileAlt className="text-gray-400" size={14} /> Weekly Reports
              </span>
              <div className="w-12 h-6 bg-[#1a2a6c] rounded-full cursor-pointer relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Logout Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaCog className="text-[#1a2a6c]" /> Account Actions
          </h2>
          <button 
            onClick={logout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};