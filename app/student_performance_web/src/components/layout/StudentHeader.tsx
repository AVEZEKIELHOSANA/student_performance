'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  FaSearch, 
  FaBell, 
  FaUserCircle, 
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaHistory,
  FaLightbulb,
  FaChartLine,
  FaChevronDown
} from 'react-icons/fa';
import Link from 'next/link';

interface StudentHeaderProps {
  onSearch?: (query: string) => void;
}

export const StudentHeader = ({ onSearch }: StudentHeaderProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const dropdownItems = [
    { label: 'Profile', icon: FaUser, href: '/student/settings' },
    { label: 'Dashboard', icon: FaChartLine, href: '/student/dashboard' },
    { label: 'History', icon: FaHistory, href: '/student/history' },
    { label: 'Recommendations', icon: FaLightbulb, href: '/student/recommendation' },
    { label: 'Settings', icon: FaCog, href: '/student/settings' },
  ];

  return (
    <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <Link href="/student" className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#1a2a6c]">🎓 Student Portal</span>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent transition-all bg-gray-50 hover:bg-white"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </form>
          </div>

          {/* Right: User Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => {
                  const searchInput = document.querySelector<HTMLInputElement>('input[type="text"]');
                  if (searchInput) {
                    searchInput.focus();
                  }
                }}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <FaSearch size={18} />
            </button>

            {/* Notifications */}
            <Link
              href="/student/settings?tab=notifications"
              className="relative text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaBell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                3
              </span>
            </Link>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:bg-gray-50 rounded-full px-3 py-1.5 transition-all"
              >
                <FaUserCircle className="text-[#1a2a6c]" size={32} />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.username || 'Student'}
                </span>
                <FaChevronDown 
                  className={`text-gray-400 text-xs transition-transform ${
                    showDropdown ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  {/* Click outside to close */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />
                  
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#e2e8f0] overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-[#e2e8f0]">
                      <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    
                    <div className="py-1">
                      {dropdownItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Icon size={16} className="text-gray-400" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                    
                    <div className="border-t border-[#e2e8f0] py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                      >
                        <FaSignOutAlt size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};