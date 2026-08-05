'use client';

import { Student } from './StaticData';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useState } from 'react';

interface StudentTableProps {
  students: Student[];
}

export const StudentTable = ({ students }: StudentTableProps) => {
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  const getRiskBadge = (risk: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700',
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[risk as keyof typeof colors]}`;
  };

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-[#e2e8f0]">
            <th className="px-4 py-3 font-medium w-10"></th>
            <th className="px-4 py-3 font-medium">Student</th>
            <th className="px-4 py-3 font-medium">ID</th>
            <th className="px-4 py-3 font-medium">Grade</th>
            <th className="px-4 py-3 font-medium">Avg Score</th>
            <th className="px-4 py-3 font-medium">GPA</th>
            <th className="px-4 py-3 font-medium">Attendance</th>
            <th className="px-4 py-3 font-medium">Risk Level</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e2e8f0]">
          {students.map((student) => (
            <>
              <tr key={student.id} className="hover:bg-gray-50 transition-all">
                <td className="px-4 py-3">
                  <button
                    onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {expandedStudent === student.id ? <FaChevronDown /> : <FaChevronRight />}
                  </button>
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {student.name}
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">{student.studentId}</td>
                <td className="px-4 py-3 text-gray-600">{student.grade}</td>
                <td className={`px-4 py-3 font-medium ${getGradeColor(student.averageScore)}`}>
                  {student.averageScore}%
                </td>
                <td className="px-4 py-3 text-gray-600">{student.gpa.toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-600">{student.attendanceRate}%</td>
                <td className="px-4 py-3">
                  <span className={getRiskBadge(student.riskLevel)}>
                    {student.riskLevel.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-[#1a2a6c] hover:text-[#2d4373] text-xs">
                    View Details
                  </button>
                </td>
              </tr>
              {expandedStudent === student.id && (
                <tr>
                  <td colSpan={9} className="px-4 py-4 bg-gray-50">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {student.subjects.map((subject) => (
                          <div key={subject.name} className="bg-white rounded-lg p-3 border border-[#e2e8f0]">
                            <p className="text-xs text-gray-500">{subject.name}</p>
                            <p className={`text-lg font-bold ${getGradeColor(subject.score)}`}>
                              {subject.score}%
                            </p>
                            <p className="text-xs text-gray-400">{subject.grade}</p>
                          </div>
                        ))}
                      </div>
                      {student.flags && student.flags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {student.flags.map((flag, index) => (
                            <span key={index} className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full border border-yellow-200">
                              ⚠️ {flag}
                            </span>
                          ))}
                        </div>
                      )}
                      {student.notes && student.notes.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <p className="text-xs text-blue-600 font-medium">Notes:</p>
                          {student.notes.map((note, index) => (
                            <p key={index} className="text-sm text-blue-700">{note}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                No students found matching the filters
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};