'use client';

import { AdminInstructor } from '../../types/admin.types';

interface InstructorsTableProps {
  instructors: AdminInstructor[];
}

export const InstructorsTable = ({ instructors }: InstructorsTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-[#e2e8f0]">
              <th className="px-4 py-3 font-medium">Instructor</th>
              <th className="px-4 py-3 font-medium">School</th>
              <th className="px-4 py-3 font-medium">Faculty</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Students</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
            {instructors.map((instructor) => (
              <tr key={instructor.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{instructor.username}</td>
                <td className="px-4 py-3 text-gray-600">{instructor.school_name || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{instructor.faculty_name || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{instructor.department_name || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{instructor.assigned_student_count}</td>
              </tr>
            ))}
            {instructors.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No instructors found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
