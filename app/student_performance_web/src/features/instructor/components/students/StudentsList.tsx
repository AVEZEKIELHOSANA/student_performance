'use client';

import { useState } from 'react';
import { 
  FaUsers, 
  FaSearch, 
  FaExclamationTriangle, 
  FaChevronDown, 
  FaChevronRight,
  FaFlag,
  FaHandsHelping,
  FaEnvelope,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUserGraduate,
  FaCalendarAlt,
  FaFileAlt,
  FaPlus,
  FaFilter
} from 'react-icons/fa';
import { StudentData, Student, Subject } from './StaticData';
import { InterventionModal } from './InterventionModal';

// Re-export Student type for use in other components
export type { Student, Subject } from './StaticData';

export const StudentsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [students, setStudents] = useState<Student[]>(StudentData);

  // Get unique grades and risk levels
  const grades = ['all', ...new Set(students.map(s => s.grade))];
  const riskOptions = ['all', 'critical', 'high', 'medium', 'low'];

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    const matchesRisk = selectedRisk === 'all' || student.riskLevel === selectedRisk;
    const matchesFlagged = !showFlaggedOnly || (student.flags && student.flags.length > 0);
    return matchesSearch && matchesGrade && matchesRisk && matchesFlagged;
  });

  // Statistics
  const stats = {
    total: students.length,
    flagged: students.filter(s => s.flags && s.flags.length > 0).length,
    atRisk: students.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical').length,
    lowRisk: students.filter(s => s.riskLevel === 'low').length,
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200',
    };
    return `px-2 py-1 rounded-full text-xs font-medium border ${colors[risk as keyof typeof colors]}`;
  };

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleFlagStudent = (student: Student) => {
    // Toggle flag
    const updatedStudents = students.map(s => {
      if (s.id === student.id) {
        const hasFlag = s.flags && s.flags.length > 0;
        return {
          ...s,
          flags: hasFlag ? [] : ['Needs attention'],
          isFlagged: !hasFlag
        };
      }
      return s;
    });
    setStudents(updatedStudents);
  };

  const handleStartIntervention = (student: Student) => {
    setSelectedStudent(student);
    setShowInterventionModal(true);
  };

  const handleInterventionSubmit = (data: any) => {
    // Update student with intervention
    const updatedStudents = students.map(s => {
      if (s.id === selectedStudent?.id) {
        const interventions = s.interventions || [];
        return {
          ...s,
          interventions: [...interventions, {
            id: `int-${Date.now()}`,
            ...data,
            date: new Date().toISOString(),
            status: 'pending'
          }],
          flags: [...(s.flags || []), 'Intervention in progress']
        };
      }
      return s;
    });
    setStudents(updatedStudents);
    setShowInterventionModal(false);
    setSelectedStudent(null);
  };

  const toggleExpand = (studentId: string) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const getInterventionStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
    };
    return `px-2 py-0.5 rounded-full text-xs font-medium border ${colors[status as keyof typeof colors]}`;
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2a6c] flex items-center gap-2">
            <FaUsers className="text-blue-500" />
            My Students
          </h1>
          <p className="text-[#4a5568] text-sm">
            Manage and monitor your assigned students
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] rounded-lg hover:bg-gray-50 transition-all text-sm">
            <FaFileAlt /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-[#1a2a6c]">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <FaUserGraduate />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Flagged Students</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.flagged}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
              <FaFlag />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">At Risk Students</p>
              <p className="text-2xl font-bold text-red-600">{stats.atRisk}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <FaExclamationTriangle />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Risk</p>
              <p className="text-2xl font-bold text-green-600">{stats.lowRisk}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <FaCheckCircle />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or ID..."
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
            <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50 transition-all">
              <input
                type="checkbox"
                checked={showFlaggedOnly}
                onChange={(e) => setShowFlaggedOnly(e.target.checked)}
                className="w-4 h-4 accent-[#1a2a6c]"
              />
              <FaFlag className="text-yellow-500" />
              Flagged Only
            </label>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-[#e2e8f0] bg-gray-50">
                <th className="px-4 py-3 font-medium w-10"></th>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Grade</th>
                <th className="px-4 py-3 font-medium">Avg Score</th>
                <th className="px-4 py-3 font-medium">GPA</th>
                <th className="px-4 py-3 font-medium">Attendance</th>
                <th className="px-4 py-3 font-medium">Risk Level</th>
                <th className="px-4 py-3 font-medium">Flags</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {filteredStudents.map((student) => (
                <>
                  <tr key={student.id} className="hover:bg-gray-50 transition-all">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleExpand(student.id)}
                        className="text-gray-400 hover:text-gray-600 transition-all"
                      >
                        {expandedStudent === student.id ? <FaChevronDown /> : <FaChevronRight />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-800">{student.name}</p>
                        <p className="text-xs text-gray-400">{student.gender} · Age {student.age}</p>
                      </div>
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
                    <td className="px-4 py-3">
                      {student.flags && student.flags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {student.flags.slice(0, 2).map((flag, index) => (
                            <span key={index} className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                              <FaFlag className="text-yellow-500" size={10} />
                              {flag.length > 15 ? flag.substring(0, 15) + '...' : flag}
                            </span>
                          ))}
                          {student.flags.length > 2 && (
                            <span className="text-xs text-gray-400">+{student.flags.length - 2}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleFlagStudent(student)}
                          className={`p-1.5 rounded-lg transition-all text-xs ${
                            student.flags && student.flags.length > 0
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title={student.flags && student.flags.length > 0 ? 'Remove flag' : 'Flag student'}
                        >
                          <FaFlag size={14} />
                        </button>
                        <button
                          onClick={() => handleStartIntervention(student)}
                          className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all text-xs"
                          title="Start intervention"
                        >
                          <FaHandsHelping size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedStudent === student.id && (
                    <tr>
                      <td colSpan={10} className="px-4 py-4 bg-gray-50">
                        <div className="space-y-4">
                          {/* Subject Performance */}
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Subject Performance</p>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
                          </div>

                          {/* Flags */}
                          {student.flags && student.flags.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold text-yellow-700 mb-1 flex items-center gap-2">
                                <FaFlag /> Flags:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {student.flags.map((flag, index) => (
                                  <span key={index} className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full border border-yellow-200">
                                    {flag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {student.notes && student.notes.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold text-blue-700 mb-1">Notes:</p>
                              <ul className="list-disc list-inside space-y-1">
                                {student.notes.map((note, index) => (
                                  <li key={index} className="text-sm text-gray-600">{note}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Interventions */}
                          {student.interventions && student.interventions.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-2">
                                <FaHandsHelping /> Interventions:
                              </p>
                              <div className="space-y-2">
                                {student.interventions.map((intervention, index) => (
                                  <div key={index} className="bg-white rounded-lg p-3 border border-[#e2e8f0]">
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                      <div>
                                        <p className="font-medium text-gray-800">{intervention.title}</p>
                                        <p className="text-sm text-gray-600">{intervention.description}</p>
                                        <p className="text-xs text-gray-400">
                                          <FaCalendarAlt className="inline mr-1" />
                                          {new Date(intervention.date).toLocaleDateString()}
                                        </p>
                                      </div>
                                      <span className={getInterventionStatusBadge(intervention.status)}>
                                        {intervention.status.replace('_', ' ').toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-400">
                    No students found matching the filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-[#e2e8f0] flex justify-between items-center text-sm text-gray-500">
          <span>Showing {filteredStudents.length} of {students.length} students</span>
          <span>Page 1 of 1</span>
        </div>
      </div>

      {/* Intervention Modal */}
      {selectedStudent && (
        <InterventionModal
          isOpen={showInterventionModal}
          student={selectedStudent}
          onClose={() => {
            setShowInterventionModal(false);
            setSelectedStudent(null);
          }}
          onSubmit={handleInterventionSubmit}
        />
      )}
    </div>
  );
};