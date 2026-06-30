'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useDashboard } from '../../hooks/useDashboard';
import { FeatureCard } from './FeatureCard';
import { ActivityChart } from './ActivityChart';
import { PerformanceCard } from './PerformanceCard';
import { RiskDistribution } from './RiskDistribution';
import { QuickStats } from './QuickStats';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const activityChartData = {
  labels: months,
  datasets: [
    {
      label: 'Study Hours',
      data: [4, 5, 7, 6, 8, 10, 9, 11, 12, 10, 8, 9],
      borderColor: '#1a2a6c',
      backgroundColor: 'rgba(26, 42, 108, 0.1)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Attendance %',
      data: [70, 75, 80, 78, 85, 90, 88, 92, 95, 93, 90, 92],
      borderColor: '#2e86ab',
      backgroundColor: 'rgba(46, 134, 171, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};

const riskChartData = {
  labels: ['Low Risk', 'Medium Risk', 'High Risk'],
  datasets: [
    {
      data: [60, 25, 15],
      backgroundColor: ['#27ae60', '#f39c12', '#e74c3c'],
      borderWidth: 0,
    },
  ],
};

export const DashboardContent = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { loading, stats } = useDashboard();

  const handleRunPrediction = () => {
    router.push('/student/predict');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2a6c] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const features = [
    { 
      id: 'best', 
      title: 'Best Performing', 
      feature: stats?.top_features.best.feature || 'N/A',
      value: stats?.top_features.best.value || 0,
      icon: stats?.top_features.best.icon || '📚',
      color: 'green' as const,
      description: 'Your strongest academic factor'
    },
    { 
      id: 'second', 
      title: 'Second Best', 
      feature: stats?.top_features.second.feature || 'N/A',
      value: stats?.top_features.second.value || 0,
      icon: stats?.top_features.second.icon || '👨‍🏫',
      color: 'blue' as const,
      description: 'Keep this up'
    },
    { 
      id: 'third', 
      title: 'Third Best', 
      feature: stats?.top_features.third.feature || 'N/A',
      value: stats?.top_features.third.value || 0,
      icon: stats?.top_features.third.icon || '📊',
      color: 'yellow' as const,
      description: 'Needs improvement'
    },
    { 
      id: 'worst', 
      title: 'Needs Improvement', 
      feature: stats?.top_features.worst.feature || 'N/A',
      value: stats?.top_features.worst.value || 0,
      icon: stats?.top_features.worst.icon || '😰',
      color: 'red' as const,
      description: 'Focus on improving this'
    },
  ];

  return (
    <div>
      {/* Header */}
      {/* Header */}
<div className="flex justify-between items-center mb-8">
  <div>
    <h1 className="text-2xl font-bold text-[#1a2a6c]">Welcome back, {user?.username}</h1>
    <p className="text-[#4a5568] text-sm">Here's your academic performance summary</p>
  </div>
  <div className="flex items-center gap-3">
    <span className="text-sm text-[#4a5568]">Last updated: Today</span>
    <button className="px-4 py-2 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all text-sm font-medium">
      Export Report
    </button>
  </div>
</div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {features.map((f) => (
          <FeatureCard key={f.id} {...f} />
        ))}
      </div>

      {/* Activity Chart & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart data={activityChartData} />
        </div>
        <PerformanceCard 
          latestPrediction={stats?.latest_prediction || null}
          totalPredictions={stats?.total_predictions || 0}
          averageGrade={stats?.average_grade || 'N/A'}
          riskLevel={stats?.risk_level || 'Low'}
          onRunPrediction={handleRunPrediction}
        />
      </div>

      {/* Risk & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <RiskDistribution data={riskChartData} />
        <QuickStats 
          totalPredictions={stats?.total_predictions || 0}
          riskLevel={stats?.risk_level || 'N/A'}
        />
      </div>
    </div>
  );
};