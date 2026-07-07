'use client';

import { FaUserPlus } from 'react-icons/fa';
import { AdminStudent } from '../../types/admin.types';

interface StudentsAssignmentTableProps {
  students: AdminStudent[];
  onAssign: (student: AdminStudent) => void;
}

export const StudentsAssignmentTable = ({ students, onAssign }: StudentsAssignmentTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-[#e2e8f0]">
              <th className="px-4 py-3 font-medium">Student</th>
              <th className="px-4 py-3 font-medium">School</th>
              <th className="px-4 py-3 font-medium">Faculty</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium">Instructor</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{student.username}</td>
                <td className="px-4 py-3 text-gray-600">{student.school_name || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{student.faculty_name || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{student.department_name || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{student.level ?? '—'}</td>
                <td className="px-4 py-3">
                  {student.assigned_instructor_name ? (
                    <span className="text-green-700 bg-green-50 px-2 py-1 rounded-full text-xs">
                      {student.assigned_instructor_name}
                    </span>
                  ) : (
                    <span className="text-amber-700 bg-amber-50 px-2 py-1 rounded-full text-xs">
                      Unassigned
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onAssign(student)}
                    className="text-[#1a2a6c] hover:text-[#2d4373] flex items-center gap-1 ml-auto text-xs"
                  >
                    <FaUserPlus /> {student.assigned_instructor_name ? 'Reassign' : 'Assign'}
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
