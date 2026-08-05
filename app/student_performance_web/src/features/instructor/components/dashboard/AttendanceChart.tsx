'use client';

import { Student } from './StaticData';
import { FaCalendarCheck, FaUserClock } from 'react-icons/fa';

interface AttendanceChartProps {
  students: Student[];
}

export const AttendanceChart = ({ students }: AttendanceChartProps) => {
  const sortedByAttendance = [...students].sort((a, b) => b.attendanceRate - a.attendanceRate);
  const avgAttendance = students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length;

  const attendanceLevels = {
    excellent: students.filter(s => s.attendanceRate >= 95).length,
    good: students.filter(s => s.attendanceRate >= 85 && s.attendanceRate < 95).length,
    fair: students.filter(s => s.attendanceRate >= 75 && s.attendanceRate < 85).length,
    poor: students.filter(s => s.attendanceRate < 75).length,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6">
      <h3 className="text-lg font-semibold text-[#1a2a6c] flex items-center gap-2 mb-4">
        <FaCalendarCheck className="text-green-500" />
        Attendance Overview
        <span className="text-sm font-normal text-gray-500 ml-auto">
          Avg: {avgAttendance.toFixed(1)}%
        </span>
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-green-600">{attendanceLevels.excellent}</p>
          <p className="text-xs text-gray-500">Excellent (95%+)</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-blue-600">{attendanceLevels.good}</p>
          <p className="text-xs text-gray-500">Good (85-94%)</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-yellow-600">{attendanceLevels.fair}</p>
          <p className="text-xs text-gray-500">Fair (75-84%)</p>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-red-600">{attendanceLevels.poor}</p>
          <p className="text-xs text-gray-500">Poor (&lt;75%)</p>
        </div>
      </div>

      <div className="space-y-3">
        {sortedByAttendance.slice(0, 10).map((student) => (
          <div key={student.id}>
            <div className="flex justify-between text-xs mb-0.5">
              <span className="text-gray-600">{student.name}</span>
              <span className="font-medium">{student.attendanceRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  student.attendanceRate >= 95 ? 'bg-green-500' :
                  student.attendanceRate >= 85 ? 'bg-blue-500' :
                  student.attendanceRate >= 75 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${student.attendanceRate}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};