'use client';

import {
  FaUserCircle,
  FaEnvelope,
  FaIdCard,
  FaPhone,
  FaUniversity,
  FaGraduationCap,
  FaBook,
  FaUserGraduate,
  FaMapMarkerAlt,
  FaEdit,
} from 'react-icons/fa';
import { ReactNode } from 'react';
import { StudentProfile, School, Faculty, Department, Level } from '../../types/profile.types';

interface ProfileViewProps {
  username?: string;
  email?: string;
  profile: StudentProfile;
  school?: School;
  faculty?: Faculty;
  department?: Department;
  level?: Level;
  onEdit: () => void;
}

const InfoRow = ({ icon, label, value }: { icon: ReactNode; label: string; value?: string | number }) => (
  <div className="flex items-start gap-3 py-2">
    <div className="text-gray-400 mt-1">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value || '—'}</p>
    </div>
  </div>
);

export const ProfileView = ({
  username,
  email,
  profile,
  school,
  faculty,
  department,
  level,
  onEdit,
}: ProfileViewProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#1a2a6c] flex items-center gap-2">
          <FaUserCircle className="text-[#1a2a6c]" /> My Profile
        </h2>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all flex items-center gap-2 text-sm"
        >
          <FaEdit /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <InfoRow icon={<FaUserCircle />} label="Full Name" value={username} />
        <InfoRow icon={<FaEnvelope />} label="Email" value={email} />
        <InfoRow icon={<FaIdCard />} label="Student ID" value={profile.student_id} />
        <InfoRow icon={<FaPhone />} label="Phone Number" value={profile.phone_number} />
        <InfoRow icon={<FaUniversity />} label="School / University" value={school?.name} />
        <InfoRow icon={<FaGraduationCap />} label="Faculty" value={faculty?.name} />
        <InfoRow icon={<FaBook />} label="Department" value={department?.name} />
        <InfoRow icon={<FaUserGraduate />} label="Level" value={level?.name} />
        <InfoRow icon={<FaMapMarkerAlt />} label="Address" value={profile.address} />
        <InfoRow icon={<FaIdCard />} label="Emergency Contact" value={profile.emergency_contact} />
      </div>

      {profile.bio && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Bio</p>
          <p className="text-sm text-gray-700">{profile.bio}</p>
        </div>
      )}
    </div>
  );
};