'use client';

import { useState, useMemo } from 'react';
import {
  FaUserGraduate,
  FaExclamationTriangle,
  FaChartLine,
  FaBell,
  FaFilter,
  FaDownload,
  FaSearch,
  FaUserCheck,
  FaUserTimes,
  FaCalendarAlt,
  FaBookOpen,
  FaClock,
  FaSchool,
} from 'react-icons/fa';
import { StaticData } from './StaticData';
import { StatsCard } from './StatsCard';
import { StudentTable } from './StudentTable';
import { GradeDistribution } from './GradeDistribution';
import { SubjectPerformance } from './SubjectPerformance';
import { RiskOverview } from './RiskOverview';
import { AttendanceChart } from './AttendanceChart';
import { RecentActivity } from './RecentActivity';

export const InstructorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Get static data
  const { students, stats, subjects, activities, gradeDistribution } = StaticData;

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.studentId.includes(searchTerm);
      const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
      const matchesRisk = selectedRisk === 'all' || student.riskLevel === selectedRisk;
      return matchesSearch && matchesGrade && matchesRisk;
    });
  }, [students, searchTerm, selectedGrade, selectedRisk]);

  // Get unique grades for filter
  const grades = ['all', ...new Set(students.map(s => s.grade))];

  // Risk level options
  const riskOptions = ['all', 'critical', 'high', 'medium', 'low'];

  // Subject options
  const subjectOptions = ['all', ...subjects.map(s => s.name)];

  // Count at-risk students
  const atRiskStudents = students.filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high');

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2a6c]">
            Instructor Dashboard
          </h1>
          <p className="text-[#4a5568] text-sm">
            Welcome back! Here's an overview of your students' performance.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all text-sm">
            <FaDownload /> Export Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] rounded-lg hover:bg-gray-50 transition-all text-sm">
            <FaBell /> Notifications
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
              {stats.unreadNotifications}
            </span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          label="Total Students"
          value={stats.totalStudents}
          icon={FaUserGraduate}
          color="text-blue-600 bg-blue-50"
          change="+2 this month"
        />
        <StatsCard
          label="At Risk Students"
          value={stats.atRiskStudents}
          icon={FaExclamationTriangle}
          color="text-red-600 bg-red-50"
          change={`${stats.riskPercentage}% of total`}
        />
        <StatsCard
          label="Avg GPA"
          value={stats.avgGPA}
          icon={FaChartLine}
          color="text-green-600 bg-green-50"
          change="+0.2 from last month"
        />
        <StatsCard
          label="Attendance Rate"
          value={stats.avgAttendance}
          icon={FaClock}
          color="text-purple-600 bg-purple-50"
          change="92.5% average"
        />
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RiskOverview students={students} />
        </div>
        <div>
          <RecentActivity activities={activities} />
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a2a6c]"
            >
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade === 'all' ? 'All Grades' : `Grade ${grade}`}
                </option>
              ))}
            </select>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a2a6c]"
            >
              {riskOptions.map((risk) => (
                <option key={risk} value={risk}>
                  {risk === 'all' ? 'All Risk Levels' : 
                   risk.charAt(0).toUpperCase() + risk.slice(1) + ' Risk'}
                </option>
              ))}
            </select>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a2a6c]"
            >
              {subjectOptions.map((subject) => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
        <div className="p-4 border-b border-[#e2e8f0] flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#1a2a6c]">
            Student List
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredStudents.length} students)
            </span>
          </h2>
          <div className="flex gap-2">
            <button className="text-sm text-[#1a2a6c] hover:underline flex items-center gap-1">
              <FaDownload size={12} /> Export
            </button>
          </div>
        </div>
        <StudentTable students={filteredStudents} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GradeDistribution data={gradeDistribution} />
        <SubjectPerformance subjects={subjects} students={students} />
      </div>

      {/* Attendance Chart */}
      <div className="grid grid-cols-1 gap-6">
        <AttendanceChart students={students} />
      </div>
    </div>
  );
};