'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/axios';
import Link from 'next/link';
import { 
  FaTachometerAlt, 
  FaChartLine, 
  FaHistory, 
  FaLightbulb, 
  FaCog,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaStar,
  FaChevronRight,
  FaUser,
  FaBell,
  FaSignOutAlt,
  FaGraduationCap,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ── Types ──────────────────────────────────────────────────────
interface Prediction {
  id: string;
  grade_label: string;
  gpa_range: string;
  academic_status: string;
  probability: number;
  created_at: string;
}

interface DashboardStats {
  top_features: {
    best: { feature: string; value: number; icon: string };
    second: { feature: string; value: number; icon: string };
    third: { feature: string; value: number; icon: string };
    worst: { feature: string; value: number; icon: string };
  };
  predictions: Prediction[];
  latest_prediction: Prediction | null;
  total_predictions: number;
  average_grade: string;
  risk_level: 'Low' | 'Medium' | 'High';
}

// ── Sidebar Component ─────────────────────────────────────────
const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  const { user, logout } = useAuth();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { id: 'predict', label: 'Run Prediction', icon: FaChartLine },
    { id: 'history', label: 'View All Predictions', icon: FaHistory },
    { id: 'recommendations', label: 'Recommendations', icon: FaLightbulb },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-[#1a2a6c] to-[#2d4373] min-h-screen flex flex-col fixed left-0 top-0 bottom-0">
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
          onClick={logout}
          className="w-full text-left text-sm text-white/70 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all"
        >
          <FaSignOutAlt className="inline mr-2" size={14} />
          Logout
        </button>
      </div>
    </aside>
  );
};

// ── Main Dashboard Component ──────────────────────────────────
export default function StudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  // ── Fetch Data ──────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get predictions
        const predRes = await apiClient.get('/students/predictions');
        const preds = predRes.data;
        setPredictions(preds);
        
        // Get latest prediction
        const latest = preds.length > 0 ? preds[0] : null;
        
        // Calculate stats
        const totalPreds = preds.length;
        let avgGrade = 'N/A';
        let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
        
        if (latest) {
          if (latest.probability >= 70) riskLevel = 'Low';
          else if (latest.probability >= 50) riskLevel = 'Medium';
          else riskLevel = 'High';
          
          const gradeMap: Record<string, string> = {
            'A': '3.50 – 4.00',
            'B': '3.00 – 3.49',
            'C': '2.50 – 2.99',
            'D': '2.00 – 2.49',
            'Fail': 'Below 2.00'
          };
          avgGrade = gradeMap[latest.grade_label] || 'N/A';
        }
        
        // Feature importance data (from ML model)
        // In production, this comes from the backend
        const topFeatures = {
          best: { feature: 'Hours Studied', value: 92, icon: '📚' },
          second: { feature: 'Tutoring Sessions', value: 78, icon: '👨‍🏫' },
          third: { feature: 'Attendance Rate', value: 65, icon: '📊' },
          worst: { feature: 'Exam Anxiety', value: 42, icon: '😰' },
        };
        
        setStats({
          top_features: topFeatures,
          predictions: preds,
          latest_prediction: latest,
          total_predictions: totalPreds,
          average_grade: avgGrade,
          risk_level: riskLevel,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // ── Chart Data ──────────────────────────────────────────────
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

  const activityChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { usePointStyle: true },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  // ── Settings Tab ────────────────────────────────────────────
  if (activeTab === 'settings') {
    return (
      <div className="flex min-h-screen bg-gray-50 ml-64">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-8">
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
                  <span className="text-gray-700">Email Notifications</span>
                  <div className="w-12 h-6 bg-[#1a2a6c] rounded-full cursor-pointer relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Push Notifications</span>
                  <div className="w-12 h-6 bg-gray-300 rounded-full cursor-pointer relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Weekly Reports</span>
                  <div className="w-12 h-6 bg-[#1a2a6c] rounded-full cursor-pointer relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Logout Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h2>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
                <FaSignOutAlt className="inline mr-2" /> Logout
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Predict Tab ─────────────────────────────────────────────
  if (activeTab === 'predict') {
    return (
      <div className="flex min-h-screen bg-gray-50 ml-64">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-[#1a2a6c] mb-6">Run Prediction</h1>
          <p className="text-gray-600 mb-8">Enter your academic details to get a performance prediction</p>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-gray-500 text-center py-12">Prediction form will be here</p>
          </div>
        </main>
      </div>
    );
  }

  // ── History Tab ─────────────────────────────────────────────
  if (activeTab === 'history') {
    return (
      <div className="flex min-h-screen bg-gray-50 ml-64">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-[#1a2a6c] mb-6">Prediction History</h1>
          <p className="text-gray-600 mb-8">Your past performance predictions</p>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-gray-500 text-center py-12">History list will be here</p>
          </div>
        </main>
      </div>
    );
  }

  // ── Recommendations Tab ─────────────────────────────────────
  if (activeTab === 'recommendations') {
    return (
      <div className="flex min-h-screen bg-gray-50 ml-64">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-[#1a2a6c] mb-6">Recommendations</h1>
          <p className="text-gray-600 mb-8">Personalized recommendations to improve your performance</p>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-gray-500 text-center py-12">Recommendations will be here</p>
          </div>
        </main>
      </div>
    );
  }

  // ── Dashboard Tab (Main) ─────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 ml-64">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2a6c] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  // ── Main Dashboard ──────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-gray-50 ml-64">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1a2a6c]">Welcome back, {user?.username}</h1>
            <p className="text-gray-500 text-sm">Here's your academic performance summary</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Last updated: Today</span>
            <button className="px-4 py-2 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all text-sm">
              Export Report
            </button>
          </div>
        </div>

        {/* ── Top 4 Feature Cards ────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Best Feature - Calendar Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-80">Best Performing</p>
                <p className="text-lg font-bold mt-1">{stats?.top_features.best.feature}</p>
                <p className="text-3xl font-bold mt-2">{stats?.top_features.best.value}%</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                {stats?.top_features.best.icon}
              </div>
            </div>
            <p className="text-xs opacity-70 mt-3">Your strongest academic factor</p>
          </div>

          {/* Second Feature - Total Income */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-80">Second Best</p>
                <p className="text-lg font-bold mt-1">{stats?.top_features.second.feature}</p>
                <p className="text-3xl font-bold mt-2">{stats?.top_features.second.value}%</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                {stats?.top_features.second.icon}
              </div>
            </div>
            <p className="text-xs opacity-70 mt-3">Keep this up</p>
          </div>

          {/* Third Feature - Total Subscription */}
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-80">Third Best</p>
                <p className="text-lg font-bold mt-1">{stats?.top_features.third.feature}</p>
                <p className="text-3xl font-bold mt-2">{stats?.top_features.third.value}%</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                {stats?.top_features.third.icon}
              </div>
            </div>
            <p className="text-xs opacity-70 mt-3">Needs improvement</p>
          </div>

          {/* Worst Feature - Skill Earned */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-80">Needs Improvement</p>
                <p className="text-lg font-bold mt-1">{stats?.top_features.worst.feature}</p>
                <p className="text-3xl font-bold mt-2">{stats?.top_features.worst.value}%</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                {stats?.top_features.worst.icon}
              </div>
            </div>
            <p className="text-xs opacity-70 mt-3">Focus on improving this</p>
          </div>
        </div>

        {/* ── Activity Chart & Performance Prediction ────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Chart - Year Activity Card */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Year Activity</h2>
              <button className="text-sm text-[#1a2a6c] hover:underline">More →</button>
            </div>
            <Line data={activityChartData} options={activityChartOptions} height={250} />
            <div className="flex justify-between mt-4 text-sm text-gray-500">
              <span>⬆ Study Hours: 12h (peak)</span>
              <span>⬇ Attendance: 70% (lowest)</span>
            </div>
          </div>

          {/* Performance Prediction Card - Current Revenue */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Prediction</h2>
            
            {stats?.latest_prediction ? (
              <>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">Predicted GPA Range</p>
                  <p className="text-2xl font-bold text-[#1a2a6c]">{stats.average_grade}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Risk Level</span>
                    <span className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${stats.risk_level === 'Low' ? 'bg-green-100 text-green-700' : ''}
                      ${stats.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${stats.risk_level === 'High' ? 'bg-red-100 text-red-700' : ''}
                    `}>
                      {stats.risk_level}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Probability</span>
                    <span className="font-medium">{stats.latest_prediction.probability}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="font-medium">{stats.latest_prediction.academic_status}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Predictions</span>
                    <span className="font-medium">{stats.total_predictions}</span>
                  </div>
                </div>

                <button className="w-full mt-4 py-2 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all text-sm">
                  View Full Report
                </button>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaChartLine className="mx-auto text-3xl mb-2 text-gray-300" />
                <p>No predictions yet</p>
                <button className="mt-3 px-4 py-2 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all text-sm">
                  Run Your First Prediction
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Risk Distribution & Quick Stats ────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Risk Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Risk Distribution</h2>
            <div className="flex items-center gap-8">
              <div className="w-32 h-32">
                <Doughnut data={riskChartData} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-gray-600">Low Risk: 60%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                  <span className="text-sm text-gray-600">Medium Risk: 25%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="text-sm text-gray-600">High Risk: 15%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <FaGraduationCap className="text-[#1a2a6c] mx-auto text-xl mb-1" />
                <p className="text-2xl font-bold text-[#1a2a6c]">{stats?.total_predictions || 0}</p>
                <p className="text-xs text-gray-500">Total Predictions</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <FaCheckCircle className="text-green-600 mx-auto text-xl mb-1" />
                <p className="text-2xl font-bold text-green-600">74%</p>
                <p className="text-xs text-gray-500">Avg. Accuracy</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <FaClock className="text-yellow-600 mx-auto text-xl mb-1" />
                <p className="text-2xl font-bold text-yellow-600">12</p>
                <p className="text-xs text-gray-500">Study Hours/Week</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <FaExclamationTriangle className="text-red-600 mx-auto text-xl mb-1" />
                <p className="text-2xl font-bold text-red-600">{stats?.risk_level || 'N/A'}</p>
                <p className="text-xs text-gray-500">Risk Level</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}