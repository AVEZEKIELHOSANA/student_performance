'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { instructorService } from '@/features/instructor/services/instructor.service';
import { Cohort, CohortStudent } from '@/features/instructor/types/instructor.types';
import { FaUsers, FaCalendarAlt, FaBullseye } from 'react-icons/fa';

export default function CohortDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const cohortId = params?.cohortId as string;
  const [loading, setLoading] = useState(true);
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [students, setStudents] = useState<CohortStudent[]>([]);

  const handleFlag = async (studentId: string, currentFlag?: boolean) => {
    try {
      await instructorService.flagStudent(studentId, { is_flagged: !currentFlag });
      setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, is_flagged: !currentFlag } : s)));
    } catch (error) {
      console.error('Failed to update flag status', error);
    }
  };

  useEffect(() => {
    const fetchCohort = async () => {
      if (!cohortId) return;
      setLoading(true);
      try {
        const data = await instructorService.getCohort(cohortId);
        setCohort(data.cohort);
        setStudents(data.students);
      } catch (error) {
        console.error('Error loading cohort:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCohort();
  }, [cohortId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2a6c]"></div>
      </div>
    );
  }

  if (!cohort) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>Cohort not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1a2a6c]">{cohort.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {cohort.faculty} - {cohort.department} | {cohort.academic_year} {cohort.semester}
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm"
          >
            Back to cohorts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-3xl font-bold text-[#1a2a6c]">{cohort.students.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
          <p className="text-sm text-gray-500">Performance Goal</p>
          <p className="text-3xl font-bold text-[#1a2a6c]">{cohort.performance_goal ?? '—'}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
          <p className="text-sm text-gray-500">Created</p>
          <p className="text-3xl font-bold text-[#1a2a6c]">{new Date(cohort.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
          <FaUsers className="text-[#1a2a6c]" />
          <h2 className="font-semibold text-gray-800">Students</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GPA Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flagged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-all">
                  <td className="px-6 py-4 text-sm text-gray-900">{student.student_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.student_email}</td>
                  <td className="px-6 py-4 text-sm text-red-600">{student.gpa_range}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{student.grade_label}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.is_flagged ? 'Yes' : 'No'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
