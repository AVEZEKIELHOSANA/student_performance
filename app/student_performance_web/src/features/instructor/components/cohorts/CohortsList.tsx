'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { instructorService } from '../../services/instructor.service';
import { Cohort } from '../../types/instructor.types';
import { FaUsers, FaCalendarAlt, FaEye } from 'react-icons/fa';

export const CohortsList = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await instructorService.getCohorts();
        setCohorts(data);
      } catch (error) {
        console.error('Error fetching cohorts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            <FaUsers /> My Cohorts
          </h1>
          <p className="text-[#4a5568] text-sm">Manage your class cohorts</p>
        </div>
        <button
          onClick={() => router.push('/instructor/batch')}
          className="px-4 py-2 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all text-sm flex items-center gap-2"
        >
          + Create New Cohort
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {cohorts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-[#e2e8f0]">
            <FaUsers className="mx-auto text-4xl text-[#cbd5e1] mb-4" />
            <p className="text-[#4a5568] font-medium">No cohorts created yet</p>
            <p className="text-sm text-[#4a5568] mt-1">Create your first cohort by running a batch prediction</p>
            <button
              onClick={() => router.push('/instructor/batch')}
              className="mt-4 px-6 py-2 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all text-sm"
            >
              Run Batch Prediction
            </button>
          </div>
        ) : (
          cohorts.map((cohort) => (
            <div
              key={cohort.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0] hover:shadow-md transition-all cursor-pointer"
              onClick={() => router.push(`/instructor/cohorts/${cohort.id}`)}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{cohort.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <FaCalendarAlt className="text-xs" />
                    Created {new Date(cohort.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {cohort.faculty} - {cohort.department} | {cohort.academic_year} {cohort.semester}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="text-center">
                    <p className="text-xl font-bold text-[#1a2a6c]">{cohort.students?.length || 0}</p>
                    <p className="text-xs text-gray-500">Students</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/instructor/cohorts/${cohort.id}`);
                    }}
                    className="px-4 py-2 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all text-sm flex items-center gap-2"
                  >
                    <FaEye /> View
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
