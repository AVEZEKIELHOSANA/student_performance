'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  FaTachometerAlt, 
  FaChartLine, 
  FaHistory, 
  FaLightbulb, 
  FaCog,
  FaSignOutAlt,
  FaChevronRight
} from 'react-icons/fa';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { id: 'predict', label: 'Run Prediction', icon: FaChartLine },
    { id: 'history', label: 'View All Predictions', icon: FaHistory },
    { id: 'recommendations', label: 'Recommendations', icon: FaLightbulb },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-[#1a2a6c] min-h-screen flex flex-col fixed left-0 top-0 bottom-0">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold text-white">🎓 Student Portal</h1>
        <p className="text-sm text-white/70 mt-1">Welcome back, {user?.username}</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive 
                  ? 'bg-white/20 text-white font-medium' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {isActive && <FaChevronRight className="ml-auto text-sm" />}
            </button>
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
  );
};