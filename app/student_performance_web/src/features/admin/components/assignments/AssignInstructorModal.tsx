'use client';

import { useState, useEffect } from 'react';
import { AdminStudent, AdminInstructor } from '../../types/admin.types';
import { adminService } from '../../services/admin.service';
import { toast } from 'react-toastify';

interface AssignInstructorModalProps {
  isOpen: boolean;
  student: AdminStudent | null;
  onClose: () => void;
  onAssigned: () => void;
}

export const AssignInstructorModal = ({
  isOpen,
  student,
  onClose,
  onAssigned,
}: AssignInstructorModalProps) => {
  const [eligible, setEligible] = useState<AdminInstructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && student) {
      setSelectedInstructor(student.assigned_instructor_id || '');
      setLoading(true);
      adminService
        .getEligibleInstructors(student.id)
        .then(setEligible)
        .catch(() => toast.error('Failed to load eligible instructors'))
        .finally(() => setLoading(false));
    }
  }, [isOpen, student]);

  if (!isOpen || !student) return null;

  const handleAssign = async () => {
    if (!selectedInstructor) {
      toast.error('Please select an instructor');
      return;
    }
    setSaving(true);
    try {
      await adminService.assignInstructor(student.id, selectedInstructor);
      toast.success('Instructor assigned successfully');
      onAssigned();
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Failed to assign instructor');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-[#1a2a6c] mb-1">Assign Instructor</h3>
        <p className="text-sm text-gray-500 mb-4">
          {student.username} · {student.department_name || 'No department set'}
        </p>

        {!student.department_id ? (
          <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
            This student hasn't completed their profile yet, so no instructor can be matched.
          </div>
        ) : loading ? (
          <p className="text-sm text-gray-500">Loading eligible instructors...</p>
        ) : eligible.length === 0 ? (
          <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
            No instructors found in {student.department_name}. Instructors can only be assigned within
            the same department as the student.
          </div>
        ) : (
          <select
            value={selectedInstructor}
            onChange={(e) => setSelectedInstructor(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-[#1a2a6c]"
          >
            <option value="">Select an instructor</option>
            {eligible.map((i) => (
              <option key={i.id} value={i.id}>
                {i.username} ({i.assigned_student_count} students)
              </option>
            ))}
          </select>
        )}

        <div className="flex gap-3 pt-6">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={saving || !selectedInstructor || eligible.length === 0}
            className="flex-1 py-2.5 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] disabled:opacity-50"
          >
            {saving ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  );
}
