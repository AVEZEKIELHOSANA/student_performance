'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { instructorService } from '../../services/instructor.service';
import { AtRiskStudent } from '../../types/instructor.types';
import { FaExclamationTriangle, FaFlag, FaStickyNote, FaTimes, FaSave, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

export const AtRiskStudents = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<AtRiskStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'fail' | 'd'>('all');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await instructorService.getAtRiskStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching at-risk students:', error);
      toast.error('Failed to load at-risk students');
    } finally {
      setLoading(false);
    }
  };

  const handleFlag = async (studentId: string, currentFlag: boolean) => {
    try {
      await instructorService.flagStudent(studentId, { is_flagged: !currentFlag });
      setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, is_flagged: !currentFlag } : s)));
      toast.success(currentFlag ? 'Student unflagged' : 'Student flagged');
    } catch (error) {
      toast.error('Failed to update flag status');
    }
  };

  const handleSaveNote = async (studentId: string) => {
    try {
      await instructorService.updateStudentNote(studentId, { instructor_note: noteText });
      setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, instructor_note: noteText } : s)));
      setEditingNote(null);
      setNoteText('');
      toast.success('Note saved successfully');
    } catch (error) {
      toast.error('Failed to save note');
    }
  };

  const filteredStudents = students
    .filter((s) => {
      if (filter === 'fail') return s.grade_label === 'Fail';
      if (filter === 'd') return s.grade_label === 'D';
      return true;
    })
    .filter((s) =>
      s.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.student_email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2a6c]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2a6c] flex items-center gap-2">
            <FaExclamationTriangle /> At-Risk Students
          </h1>
          <p className="text-[#4a5568] text-sm">Students predicted to get D or Fail grades</p>
        </div>
        <div className="text-sm font-medium text-[#4a5568]">{filteredStudents.length} students</div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-white p-4 rounded-xl shadow-sm border border-[#e2e8f0]">
        <div className="flex-1 min-w-[200px] relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'all' ? 'bg-[#1a2a6c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('fail')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'fail' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🔴 Fail
          </button>
          <button
            onClick={() => setFilter('d')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'd' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🟠 D
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cohort</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Predicted GPA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flagged</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No at-risk students found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{student.student_name}</p>
                        <p className="text-xs text-gray-500">{student.student_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.cohort_name}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-red-600">{student.gpa_range}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.grade_label === 'Fail' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {student.grade_label === 'Fail' ? 'High' : 'Medium'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {student.is_flagged ? (
                        <span className="text-red-600 flex items-center gap-1">
                          <FaFlag className="text-xs" /> Flagged
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <button
                          onClick={() => handleFlag(student.id, student.is_flagged)}
                          className={`px-3 py-1 text-xs rounded-full transition-all flex items-center gap-1 ${
                            student.is_flagged
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                        >
                          <FaFlag className="text-xs" />
                          {student.is_flagged ? 'Unflag' : 'Flag'}
                        </button>

                        {editingNote === student.id ? (
                          <div className="flex items-center gap-1 flex-wrap">
                            <input
                              type="text"
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              placeholder="Add note..."
                              className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#1a2a6c]"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveNote(student.id)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                            >
                              <FaSave className="text-xs" />
                            </button>
                            <button
                              onClick={() => setEditingNote(null)}
                              className="p-1 text-gray-400 hover:bg-gray-50 rounded"
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingNote(student.id);
                              setNoteText(student.instructor_note || '');
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded"
                            title={student.instructor_note || 'Add note'}
                          >
                            <FaStickyNote className={`text-sm ${student.instructor_note ? 'text-purple-600' : ''}`} />
                          </button>
                        )}
                      </div>
                      {student.instructor_note && editingNote !== student.id && (
                        <p className="text-xs text-gray-400 mt-1 max-w-xs truncate">📝 {student.instructor_note}</p>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
