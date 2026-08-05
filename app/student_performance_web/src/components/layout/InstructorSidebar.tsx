'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  FaTachometerAlt,
  FaUsers,
  FaUpload,
  FaExclamationTriangle,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUser,
  FaBell,
  FaUniversity,
} from 'react-icons/fa';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const menuItems: MenuItem[] = [
  { id: 'overview', label: 'Overview', icon: FaTachometerAlt, href: '/instructor' },
  { id: 'students', label: 'All Students', icon: FaUsers, href: '/instructor/students' },
  { id: 'cohorts', label: 'My Cohorts', icon: FaUniversity, href: '/instructor/cohorts' },
  { id: 'at-risk', label: 'At-Risk Students', icon: FaExclamationTriangle, href: '/instructor/at-risk' },
  { id: 'batch', label: 'Batch Prediction', icon: FaUpload, href: '/instructor/batch' },
  { id: 'reports', label: 'Reports', icon: FaFileAlt, href: '/instructor/reports' },
  {
    id: 'settings',
    label: 'Settings',
    icon: FaCog,
    href: '/instructor/settings',
    subItems: [
      { id: 'profile', label: 'Profile', icon: FaUser, href: '/instructor/settings/profile' },
      { id: 'notifications', label: 'Notifications', icon: FaBell, href: '/instructor/settings/notifications' },
    ],
  },
];

export const InstructorSidebar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['settings']);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1a2a6c] text-white rounded-lg shadow-lg"
      >
        {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={closeMobile} />
      )}

      <aside
        className={`
          w-64 bg-[#1a2a6c] min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-40
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-white">👨‍🏫 Instructor Portal</h1>
          <p className="text-sm text-white/70 mt-1 truncate">Welcome, {user?.username}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActiveItem = isActive(item.href);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenus.includes(item.id);

            if (hasSubItems) {
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() =>
                      setExpandedMenus((prev) =>
                        prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                      )
                    }
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                      ${isActiveItem ? 'bg-white/20 text-white font-medium' : 'text-white/70 hover:bg-white/10 hover:text-white'}
                    `}
                  >
                    <Icon size={18} />
                    <span className="flex-1 text-left">{item.label}</span>
                    <FaChevronDown className={`text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="ml-6 space-y-1">
                      {item.subItems!.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = isActive(subItem.href);
                        return (
                          <Link
                            key={subItem.id}
                            href={subItem.href}
                            onClick={closeMobile}
                            className={`
                              flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm
                              ${isSubActive
                                ? 'bg-white/20 text-white font-medium'
                                : 'text-white/60 hover:bg-white/10 hover:text-white'
                              }
                            `}
                          >
                            <SubIcon size={14} />
                            <span>{subItem.label}</span>
                            {isSubActive && <FaChevronRight className="ml-auto text-xs" />}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={closeMobile}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActiveItem ? 'bg-white/20 text-white font-medium' : 'text-white/70 hover:bg-white/10 hover:text-white'}
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {isActiveItem && <FaChevronRight className="ml-auto text-xs" />}
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
