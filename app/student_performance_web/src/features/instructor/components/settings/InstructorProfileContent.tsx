'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  FaUser,
  FaEnvelope,
  FaUniversity,
  FaBook,
  FaUserGraduate,
  FaBriefcase,
  FaCalendarAlt,
  FaClock,
  FaSave,
  FaEdit,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaSignOutAlt,
  FaArrowLeft,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { apiClient } from '@/lib/axios';

interface InstructorProfileData {
  id?: string;
  user_id?: string;
  faculty: string;
  department: string;
  role: 'hod' | 'lecturer' | 'senior_lecturer' | 'associate_professor' | 'professor';
  hire_date?: string;
  office_hours?: string;
  phone_number?: string;
  office_location?: string;
  bio?: string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

const roleOptions = [
  { value: 'lecturer', label: 'Lecturer' },
  { value: 'senior_lecturer', label: 'Senior Lecturer' },
  { value: 'associate_professor', label: 'Associate Professor' },
  { value: 'professor', label: 'Professor' },
  { value: 'hod', label: 'Head of Department' },
];

const facultyOptions = [
  'Faculty of Engineering and Technology',
  'Faculty of Arts and Social Sciences',
  'Faculty of Science',
  'Faculty of Health Sciences',
  'Faculty of Law',
  'Faculty of Business and Management',
];

const departmentOptions: Record<string, string[]> = {
  'Faculty of Engineering and Technology': [
    'Computer Engineering',
    'Electrical and Electronic Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
  ],
  'Faculty of Science': [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
  ],
  'Faculty of Arts and Social Sciences': [
    'English',
    'History',
    'Geography',
    'Sociology',
    'Political Science',
  ],
  'Faculty of Health Sciences': [
    'Nursing',
    'Medical Laboratory Science',
    'Public Health',
    'Pharmacy',
  ],
  'Faculty of Law': ['Law', 'Business Law'],
  'Faculty of Business and Management': ['Accounting', 'Management', 'Marketing', 'Finance'],
};

export const InstructorProfileContent = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<InstructorProfileData>({
    faculty: '',
    department: '',
    role: 'lecturer',
    office_hours: '',
    phone_number: '',
    office_location: '',
    bio: '',
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  });
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/instructors/profile');
        const data = response.data;

        setProfile({
          ...data,
          username: user?.username || '',
          email: user?.email || '',
          first_name: user?.first_name || '',
          last_name: user?.last_name || '',
        });

        if (data.faculty) {
          setAvailableDepartments(departmentOptions[data.faculty] || []);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleFacultyChange = (faculty: string) => {
    setProfile({ ...profile, faculty, department: '' });
    setAvailableDepartments(departmentOptions[faculty] || []);
  };

  const handleChange = (field: keyof InstructorProfileData, value: any) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    if (!profile.faculty || !profile.department || !profile.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      await apiClient.put('/instructors/profile', {
        faculty: profile.faculty,
        department: profile.department,
        role: profile.role,
        hire_date: profile.hire_date,
        office_hours: profile.office_hours,
        phone_number: profile.phone_number,
        office_location: profile.office_location,
        bio: profile.bio,
      });

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2a6c]"></div>
      </div>
    );
  }

  const completionPercent = Math.round(
    ([profile.faculty, profile.department, profile.role, profile.phone_number, profile.office_hours].filter(Boolean).length / 5) * 100
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/instructor')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaArrowLeft size={18} />
            </button>
            <h1 className="text-2xl font-bold text-[#1a2a6c] flex items-center gap-2">
              <FaUser /> Profile Settings
            </h1>
          </div>
          <p className="text-[#4a5568] text-sm ml-10">Manage your instructor profile information</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all text-sm flex items-center gap-2"
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaUser className="inline mr-2 text-gray-400" /> First Name
                </label>
                <input
                  type="text"
                  value={profile.first_name || ''}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaUser className="inline mr-2 text-gray-400" /> Last Name
                </label>
                <input
                  type="text"
                  value={profile.last_name || ''}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent"
                  placeholder="Smith"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaEnvelope className="inline mr-2 text-gray-400" /> Email
                </label>
                <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
                  {profile.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaPhone className="inline mr-2 text-gray-400" /> Phone Number
                </label>
                <input
                  type="tel"
                  value={profile.phone_number || ''}
                  onChange={(e) => handleChange('phone_number', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent"
                  placeholder="+237 6XX XXX XXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaUniversity className="inline mr-2 text-gray-400" /> Faculty <span className="text-red-500">*</span>
                </label>
                <select
                  value={profile.faculty}
                  onChange={(e) => handleFacultyChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent"
                >
                  <option value="">Select Faculty</option>
                  {facultyOptions.map((faculty) => (
                    <option key={faculty} value={faculty}>
                      {faculty}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaBook className="inline mr-2 text-gray-400" /> Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={profile.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent"
                  disabled={!profile.faculty}
                >
                  <option value="">Select Department</option>
                  {availableDepartments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaUserGraduate className="inline mr-2 text-gray-400" /> Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={profile.role}
                  onChange={(e) => handleChange('role', e.target.value as InstructorProfileData['role'])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaCalendarAlt className="inline mr-2 text-gray-400" /> Hire Date
                </label>
                <input
                  type="date"
                  value={profile.hire_date || ''}
                  onChange={(e) => handleChange('hire_date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaClock className="inline mr-2 text-gray-400" /> Office Hours
                </label>
                <input
                  type="text"
                  value={profile.office_hours || ''}
                  onChange={(e) => handleChange('office_hours', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent"
                  placeholder="Mon-Fri 9:00 AM - 4:00 PM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaMapMarkerAlt className="inline mr-2 text-gray-400" /> Office Location
                </label>
                <input
                  type="text"
                  value={profile.office_location || ''}
                  onChange={(e) => handleChange('office_location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent"
                  placeholder="Room 302, FET Building"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={profile.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-transparent resize-none"
                rows={3}
                placeholder="Tell students about your academic background, research interests, and teaching philosophy..."
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Profile Completion</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1a2a6c] rounded-full transition-all duration-500"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-[#1a2a6c]">{completionPercent}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
              <div className="w-20 h-20 bg-[#1a2a6c]/10 rounded-full flex items-center justify-center text-3xl text-[#1a2a6c]">
                {profile.first_name?.[0] || 'I'}{profile.last_name?.[0] || 'P'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-[#4a5568]">{profile.role?.replace('_', ' ').toUpperCase()}</p>
                <p className="text-sm text-gray-500">{profile.faculty} - {profile.department}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">{profile.phone_number || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Faculty</p>
                <p className="font-medium text-gray-800">{profile.faculty}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium text-gray-800">{profile.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium text-gray-800 capitalize">{profile.role?.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hire Date</p>
                <p className="font-medium text-gray-800">{profile.hire_date ? new Date(profile.hire_date).toLocaleDateString() : 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Office Hours</p>
                <p className="font-medium text-gray-800">{profile.office_hours || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Office Location</p>
                <p className="font-medium text-gray-800">{profile.office_location || 'Not set'}</p>
              </div>
            </div>

            {profile.bio && (
              <div>
                <p className="text-sm text-gray-500">Bio</p>
                <p className="text-gray-700 mt-1">{profile.bio}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Profile Completion</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1a2a6c] rounded-full transition-all duration-500"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-[#1a2a6c]">{completionPercent}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
        <h2 className="text-lg font-semibold text-[#1a2a6c] mb-4 flex items-center gap-2">
          <FaIdCard /> Account
        </h2>
        <button
          onClick={logout}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};
