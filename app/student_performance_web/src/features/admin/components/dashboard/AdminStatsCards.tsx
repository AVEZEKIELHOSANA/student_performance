'use client';

import { FaUserGraduate, FaChalkboardTeacher, FaUserShield, FaLink } from 'react-icons/fa';
import { AdminDashboardStats } from '../../types/admin.types';

interface StatsCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

const StatsCard = ({ label, value, icon: Icon, color }: StatsCardProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-5">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
      <Icon />
    </div>
    <p className="text-2xl font-bold text-[#1a2a6c]">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

export const AdminStatsCards = ({ stats }: { stats: AdminDashboardStats }) => {
  const cards: StatsCardProps[] = [
    { label: 'Students', value: stats.total_students, icon: FaUserGraduate, color: 'text-green-600 bg-green-50' },
    { label: 'Instructors', value: stats.total_instructors, icon: FaChalkboardTeacher, color: 'text-blue-600 bg-blue-50' },
    { label: 'Admins', value: stats.total_admins, icon: FaUserShield, color: 'text-purple-600 bg-purple-50' },
    { label: 'Unassigned Students', value: stats.unassigned_students, icon: FaLink, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatsCard key={card.label} {...card} />
      ))}
    </div>
  );
};
