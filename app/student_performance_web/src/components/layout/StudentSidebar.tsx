'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  FaTachometerAlt, 
  FaChartLine, 
  FaHistory, 
  FaLightbulb, 
  FaCog,
  FaSignOutAlt,
  FaChevronRight,
  FaBars,
  FaTimes
} from 'react-icons/fa';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt, href: '/student' },
  { id: 'predict', label: 'Predict', icon: FaChartLine, href: '/student/predict' },
  { id: 'history', label: 'Prediction History', icon: FaHistory, href: '/student/history' },
  { id: 'recommendations', label: 'Recommendations', icon: FaLightbulb, href: '/student/recommendations' },
  { id: 'settings', label: 'Settings', icon: FaCog, href: '/student/settings' },
];

export const StudentSidebar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getActiveTab = () => {
    const match = menuItems.find(item => pathname === item.href || pathname?.startsWith(item.href + '/'));
    return match?.id || 'dashboard';
  };

  const activeTab = getActiveTab();

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1a2a6c] text-white rounded-lg shadow-lg"
      >
        {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-[#1a2a6c] min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-40
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-white">🎓 Student Portal</h1>
          <p className="text-sm text-white/70 mt-1 truncate">Welcome, {user?.username}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={closeMobile}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-white/20 text-white font-medium' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <Icon size={18} />
                <span className="truncate">{item.label}</span>
                {isActive && <FaChevronRight className="ml-auto text-sm flex-shrink-0" />}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-white/70 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all"
          >
            <FaSignOutAlt className="inline mr-2" size={14} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};