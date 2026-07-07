'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { instructorService } from '../../services/instructor.service';
import { StudentInfo } from '../../types/instructor.types';
import { FaUsers, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

export const StudentsList = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'flagged'>('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await instructorService.getStudents();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const searchValue = searchTerm.trim().toLowerCase();

  const filteredStudents = students
    .filter((s) => {
      if (filter === 'flagged') return s.is_flagged;
      return true;
    })
    .filter((s) => {
      if (!searchValue) return true;
      const username = s.username?.toString().toLowerCase() || '';
      const email = s.email?.toString().toLowerCase() || '';
      return username.includes(searchValue) || email.includes(searchValue);
    });

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
            <FaUsers /> All Students
          </h1>
          <p className="text-[#4a5568] text-sm">View all students in your department</p>
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
            onClick={() => setFilter('flagged')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === 'flagged' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🔴 Flagged
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{student.username}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Level {student.level}</td>
                    <td className="px-6 py-4">
                      {student.is_flagged ? (
                        <span className="text-red-600 flex items-center gap-1">
                          <FaExclamationTriangle className="text-xs" /> Flagged
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
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
