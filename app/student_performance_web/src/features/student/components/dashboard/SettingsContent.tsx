'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  FaUser,
  FaBell,
  FaSignOutAlt,
  FaCog,
  FaHistory,
  FaCheck,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { profileService } from '../../services/profile.service';
import { notificationService } from '../../services/notification.service';
import {
  StudentProfile,
  School,
  Faculty,
  Department,
  Level,
  isProfileComplete,
} from '../../types/profile.types';
import { Notification, NotificationPreferences as PrefType } from '../../types/notification.types';
import { NotificationItem } from '../notifications/NotificationItem';
import { NotificationPreferences } from '../notifications/NotificationPreferences';
import { Modal } from '../profile/Modal';
import { ProfileEditForm } from '../profile/ProfileEditForm';
import { ProfileView } from '../profile/ProfileView';
import { CompleteProfilePrompt } from '../profile/CompleteProfilePrompt';

type SettingsTab = 'profile' | 'notifications' | 'history';

const emptyProfile: StudentProfile = {
  student_id: '',
  phone_number: '',
  address: '',
  emergency_contact: '',
  bio: '',
  school_id: '',
  faculty_id: '',
  department_id: '',
  level: undefined,
};

export const SettingsContent = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Saved profile (source of truth for the read-only view)
  const [profile, setProfile] = useState<StudentProfile>(emptyProfile);
  // Working copy used only while the edit modal is open
  const [draftProfile, setDraftProfile] = useState<StudentProfile>(emptyProfile);

  // Dropdown data
  const [schools, setSchools] = useState<School[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);

  // Dropdown chain selection (drives faculties/departments fetch, used during edit)
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  // Modal visibility
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCompletePrompt, setShowCompletePrompt] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<PrefType>({
    email_notifications: true,
    push_notifications: false,
    weekly_reports: true,
    risk_alerts: true,
    prediction_alerts: true,
    intervention_alerts: true,
    reminder_notifications: true,
    marketing_emails: false,
  });
  const [notifLoading, setNotifLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // ── Helper: sync dropdown chain + option lists to a given profile ──
  const resetSelectionFromProfile = async (p: StudentProfile) => {
    setSelectedSchool(p.school_id || '');
    setSelectedFaculty(p.faculty_id || '');
    setSelectedDepartment(p.department_id || '');
    setFaculties([]);
    setDepartments([]);

    if (p.school_id) {
      try {
        const f = await profileService.getFaculties(p.school_id);
        setFaculties(f);
      } catch {
        // silently ignore — view will just show fewer names
      }
    }
    if (p.faculty_id) {
      try {
        const d = await profileService.getDepartments(p.faculty_id);
        setDepartments(d);
      } catch {
        // silently ignore
      }
    }
  };

  // ── Load Data ──────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [profileData, schoolsData, levelsData, prefsData, notifsData] = await Promise.all([
          profileService.getProfile().catch(() => null),
          profileService.getSchools(),
          profileService.getLevels(),
          notificationService.getPreferences().catch(() => null),
          notificationService.getNotifications().catch(() => []),
        ]);

        const resolvedProfile = profileData || emptyProfile;
        setProfile(resolvedProfile);
        setSchools(schoolsData);
        setLevels(levelsData);

        await resetSelectionFromProfile(resolvedProfile);

        // Show the onboarding prompt automatically if the profile is incomplete
        setShowCompletePrompt(!isProfileComplete(profileData));

        if (prefsData) setPreferences(prefsData);
        setNotifications(notifsData as Notification[]);

        try {
          const count = await notificationService.getUnreadCount();
          setUnreadCount(count);
        } catch {}
      } catch (error) {
        console.error('Error loading settings data:', error);
        toast.error('Failed to load settings data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ── Edit modal lifecycle ────────────────────────────────────
  const openEditModal = () => {
    setDraftProfile(profile);
    setSelectedSchool(profile.school_id || '');
    setSelectedFaculty(profile.faculty_id || '');
    setSelectedDepartment(profile.department_id || '');
    setShowCompletePrompt(false);
    setShowEditModal(true);
  };

  const handleCancelEdit = async () => {
    setShowEditModal(false);
    await resetSelectionFromProfile(profile);
  };

  // ── Dropdown chain handlers (operate on draftProfile while editing) ──
  const handleSchoolChange = async (schoolId: string) => {
    setSelectedSchool(schoolId);
    setSelectedFaculty('');
    setSelectedDepartment('');
    setFaculties([]);
    setDepartments([]);
    setDraftProfile((prev) => ({ ...prev, school_id: schoolId, faculty_id: '', department_id: '' }));

    if (schoolId) {
      try {
        const facultiesData = await profileService.getFaculties(schoolId);
        setFaculties(facultiesData);
      } catch {
        toast.error('Failed to load faculties');
      }
    }
  };

  const handleFacultyChange = async (facultyId: string) => {
    setSelectedFaculty(facultyId);
    setSelectedDepartment('');
    setDepartments([]);
    setDraftProfile((prev) => ({ ...prev, faculty_id: facultyId, department_id: '' }));

    if (facultyId) {
      try {
        const deptsData = await profileService.getDepartments(facultyId);
        setDepartments(deptsData);
      } catch {
        toast.error('Failed to load departments');
      }
    }
  };

  const handleDepartmentChange = (departmentId: string) => {
    setSelectedDepartment(departmentId);
    setDraftProfile((prev) => ({ ...prev, department_id: departmentId }));
  };

  const handleDraftFieldChange = (field: keyof StudentProfile, value: any) => {
    setDraftProfile((prev) => ({ ...prev, [field]: value }));
  };

  // ── Save Profile (used for both "edit" and "complete profile" flows) ──
  const handleSaveProfile = async () => {
    if (!draftProfile.school_id || !draftProfile.faculty_id || !draftProfile.department_id || !draftProfile.level) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const updated = await profileService.updateProfile(draftProfile);
      setProfile(updated);
      setShowEditModal(false);
      setShowCompletePrompt(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  // ── Notification Handlers ────────────────────────────────────
  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleUpdatePreferences = async (newPrefs: Partial<PrefType>) => {
    setNotifLoading(true);
    try {
      const updated = await notificationService.updatePreferences(newPrefs);
      setPreferences(updated);
      toast.success('Preferences updated');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setNotifLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'history', label: 'Notification History', icon: FaHistory },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2a6c] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your settings...</p>
        </div>
      </div>
    );
  }

  const complete = isProfileComplete(profile);
  const selectedSchoolObj = schools.find((s) => s.id === profile.school_id);
  const selectedFacultyObj = faculties.find((f) => f.id === profile.faculty_id);
  const selectedDepartmentObj = departments.find((d) => d.id === profile.department_id);
  const selectedLevelObj = levels.find((l) => l.value === profile.level);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2a6c] flex items-center gap-2">
            <FaCog /> Settings
          </h1>
          <p className="text-[#4a5568] text-sm">Manage your profile and preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e2e8f0] overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-[#1a2a6c] text-[#1a2a6c]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon size={16} />
              {tab.label}
              {tab.id === 'notifications' && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {complete ? (
              <ProfileView
                username={user?.username}
                email={user?.email}
                profile={profile}
                school={selectedSchoolObj}
                faculty={selectedFacultyObj}
                department={selectedDepartmentObj}
                level={selectedLevelObj}
                onEdit={openEditModal}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0] text-center">
                <h2 className="text-lg font-semibold text-[#1a2a6c] mb-2">Your profile isn't complete yet</h2>
                <p className="text-gray-500 text-sm mb-4">
                  Complete your profile so instructors can give you personalized advice.
                </p>
                <button
                  onClick={openEditModal}
                  className="px-6 py-2.5 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all"
                >
                  Complete Profile
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
              <h2 className="text-lg font-semibold text-[#1a2a6c] mb-4">Profile Status</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completion</span>
                  <span className="text-[#1a2a6c] font-medium">
                    {complete ? 'Complete ✅' : 'Incomplete ⚠️'}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1a2a6c] rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        ([
                          profile.school_id,
                          profile.faculty_id,
                          profile.department_id,
                          profile.level,
                          profile.student_id,
                          profile.phone_number,
                        ].filter(Boolean).length /
                          6) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Fill in your school, faculty, department, and level to help instructors find you.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0]">
              <h2 className="text-lg font-semibold text-[#1a2a6c] mb-4 flex items-center gap-2">
                <FaCog className="text-[#1a2a6c]" /> Account
              </h2>
              <button
                onClick={logout}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-[#e2e8f0]">
                <h2 className="text-lg font-semibold text-[#1a2a6c] flex items-center gap-2">
                  <FaBell /> Notifications
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                      {unreadCount} unread
                    </span>
                  )}
                </h2>
                {notifications.length > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-sm text-[#1a2a6c] hover:underline flex items-center gap-1"
                  >
                    <FaCheck size={12} /> Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FaBell className="mx-auto text-3xl text-gray-300 mb-2" />
                  <p>No notifications yet</p>
                  <p className="text-sm">When you receive notifications, they'll appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-[#e2e8f0]">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkRead={handleMarkRead}
                      onDelete={handleDeleteNotification}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <NotificationPreferences
              preferences={preferences}
              onUpdate={handleUpdatePreferences}
              loading={notifLoading}
            />
          </div>
        </div>
      )}

      {/* Notification History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
          <div className="p-4 border-b border-[#e2e8f0]">
            <h2 className="text-lg font-semibold text-[#1a2a6c] flex items-center gap-2">
              <FaHistory /> Notification History
            </h2>
            <p className="text-sm text-gray-500">All your past notifications</p>
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FaHistory className="mx-auto text-3xl text-gray-300 mb-2" />
              <p>No notification history</p>
            </div>
          ) : (
            <div className="divide-y divide-[#e2e8f0]">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDeleteNotification}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Onboarding prompt — shows automatically on load if profile is incomplete */}
      <CompleteProfilePrompt
        isOpen={showCompletePrompt}
        onClose={() => setShowCompletePrompt(false)}
        onComplete={openEditModal}
      />

      {/* Edit modal — used for both completing and editing the profile */}
      <Modal
        isOpen={showEditModal}
        onClose={handleCancelEdit}
        title={complete ? 'Edit Profile' : 'Complete Your Profile'}
      >
        <ProfileEditForm
          profile={draftProfile}
          schools={schools}
          faculties={faculties}
          departments={departments}
          levels={levels}
          selectedSchool={selectedSchool}
          selectedFaculty={selectedFaculty}
          selectedDepartment={selectedDepartment}
          onSchoolChange={handleSchoolChange}
          onFacultyChange={handleFacultyChange}
          onDepartmentChange={handleDepartmentChange}
          onFieldChange={handleDraftFieldChange}
          onSubmit={handleSaveProfile}
          onCancel={handleCancelEdit}
          saving={saving}
        />
      </Modal>
    </div>
  );
};