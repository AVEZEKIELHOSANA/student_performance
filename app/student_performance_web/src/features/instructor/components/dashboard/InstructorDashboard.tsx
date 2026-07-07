'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { instructorService } from '../../services/instructor.service';
import { InstructorStats, AtRiskStudent } from '../../types/instructor.types';
import { FaUsers, FaExclamationTriangle, FaChartLine, FaUniversity, FaBook, FaEye, FaFlag } from 'react-icons/fa';

export const InstructorDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [atRiskStudents, setAtRiskStudents] = useState<AtRiskStudent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, atRiskData] = await Promise.all([
          instructorService.getStats(),
          instructorService.getAtRiskStudents(),
        ]);
        setStats(statsData);
        setAtRiskStudents(atRiskData.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2a6c]"></div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Students',
      value: stats?.total_students || 0,
      icon: FaUsers,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'At-Risk Students',
      value: stats?.at_risk_students || 0,
      icon: FaExclamationTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      title: 'Predicted Pass Rate',
      value: `${stats?.predicted_pass_rate || 0}%`,
      icon: FaChartLine,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Cohorts Created',
      value: stats?.cohorts_created || 0,
      icon: FaUniversity,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#1a2a6c] to-[#2d4373] rounded-xl p-6 text-white">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.username}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <FaUniversity className="text-xs" /> {stats?.faculty || 'N/A'}
              </span>
              <span className="flex items-center gap-1">
                <FaBook className="text-xs" /> {stats?.department || 'N/A'}
              </span>
              <span className="flex items-center gap-1">
                <FaBook className="text-xs" /> {stats?.role || 'Instructor'}
              </span>
            </div>
          </div>
          <div className="text-right text-sm text-white/80">
            <p>{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[#4a5568]">{card.title}</p>
                  <p className="text-2xl font-bold text-[#1a2a6c] mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.bg}`}>
                  <Icon className={`${card.color} text-xl`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <FaExclamationTriangle className="text-red-600" /> Recent At-Risk Students
          </h2>
          <a href="/instructor/at-risk" className="text-sm text-[#1a2a6c] hover:underline flex items-center gap-1">
            View all <FaEye className="text-xs" />
          </a>
        </div>
        {atRiskStudents.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <FaExclamationTriangle className="mx-auto text-3xl text-gray-300 mb-2" />
            <p>No at-risk students found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {atRiskStudents.map((student) => (
              <div key={student.id} className="px-6 py-4 hover:bg-gray-50 transition-all">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{student.student_name}</p>
                      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                        {student.grade_label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{student.student_email}</p>
                    <p className="text-xs text-gray-400">{student.cohort_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#1a2a6c]">{student.gpa_range}</p>
                    <p className="text-xs text-gray-500">{student.probability}% probability</p>
                    {student.is_flagged && (
                      <span className="text-xs text-red-600 flex items-center gap-1 justify-end">
                        <FaFlag className="text-xs" /> Flagged
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
