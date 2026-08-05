'use client';

import {
  FaUniversity,
  FaGraduationCap,
  FaBook,
  FaUserGraduate,
  FaIdCard,
  FaPhone,
  FaMapMarkerAlt,
  FaSave,
  FaTimes,
} from 'react-icons/fa';
import { StudentProfile, School, Faculty, Department, Level } from '../../types/profile.types';

interface ProfileEditFormProps {
  profile: StudentProfile;
  schools: School[];
  faculties: Faculty[];
  departments: Department[];
  levels: Level[];
  selectedSchool: string;
  selectedFaculty: string;
  selectedDepartment: string;
  onSchoolChange: (id: string) => void;
  onFacultyChange: (id: string) => void;
  onDepartmentChange: (id: string) => void;
  onFieldChange: (field: keyof StudentProfile, value: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  saving: boolean;
}

export const ProfileEditForm = ({
  profile,
  schools,
  faculties,
  departments,
  levels,
  selectedSchool,
  selectedFaculty,
  selectedDepartment,
  onSchoolChange,
  onFacultyChange,
  onDepartmentChange,
  onFieldChange,
  onSubmit,
  onCancel,
  saving,
}: ProfileEditFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FaIdCard className="inline mr-2 text-gray-400" /> Student ID
          </label>
          <input
            type="text"
            value={profile.student_id || ''}
            onChange={(e) => onFieldChange('student_id', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-[#1a2a6c] transition-all"
            placeholder="FE22A160"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FaPhone className="inline mr-2 text-gray-400" /> Phone Number
          </label>
          <input
            type="tel"
            value={profile.phone_number || ''}
            onChange={(e) => onFieldChange('phone_number', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-[#1a2a6c] transition-all"
            placeholder="+237 6XX XXX XXX"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FaUniversity className="inline mr-2 text-gray-400" /> School / University
          </label>
          <select
            value={selectedSchool}
            onChange={(e) => onSchoolChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-[#1a2a6c] transition-all"
          >
            <option value="">Select your school</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>{school.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FaGraduationCap className="inline mr-2 text-gray-400" /> Faculty
          </label>
          <select
            value={selectedFaculty}
            onChange={(e) => onFacultyChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-[#1a2a6c] transition-all"
            disabled={!selectedSchool}
          >
            <option value="">Select your faculty</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FaBook className="inline mr-2 text-gray-400" /> Department
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-[#1a2a6c] transition-all"
            disabled={!selectedFaculty}
          >
            <option value="">Select your department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FaUserGraduate className="inline mr-2 text-gray-400" /> Level
          </label>
          <select
            value={profile.level ?? ''}
            onChange={(e) => onFieldChange('level', parseInt(e.target.value, 10))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-[#1a2a6c] transition-all"
          >
            <option value="">Select your level</option>
            {levels.map((level) => (
              <option key={level.id} value={level.value}>{level.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FaMapMarkerAlt className="inline mr-2 text-gray-400" /> Address (Optional)
          </label>
          <input
            type="text"
            value={profile.address || ''}
            onChange={(e) => onFieldChange('address', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-[#1a2a6c] transition-all"
            placeholder="Your address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emergency Contact (Optional)
          </label>
          <input
            type="text"
            value={profile.emergency_contact || ''}
            onChange={(e) => onFieldChange('emergency_contact', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-[#1a2a6c] transition-all"
            placeholder="Emergency contact name & number"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Optional)</label>
        <textarea
          value={profile.bio || ''}
          onChange={(e) => onFieldChange('bio', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-[#1a2a6c] transition-all resize-none"
          rows={3}
          placeholder="Tell us a little about yourself..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          disabled={saving}
          className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <FaTimes /> Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={saving}
          className="flex-1 py-2.5 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};