'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaUsers, FaChartBar, FaLink, FaChalkboardTeacher } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { adminService } from '../services/admin.service';
import { AdminUser, AdminStudent, AdminInstructor, AdminDashboardStats } from '../types/admin.types';
import { UsersTable } from './users/UsersTable';
import { UserFormModal } from './users/UserFormModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { StudentsAssignmentTable } from './assignments/StudentsAssignmentTable';
import { AssignInstructorModal } from './assignments/AssignInstructorModal';
import { InstructorsTable } from './instructors/InstructorsTable';
import { AdminStatsCards } from './dashboard/AdminStatsCards';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

type AdminTab = 'overview' | 'users' | 'assignments' | 'instructors';

interface School {
  id: string;
  name: string;
}

interface Faculty {
  id: string;
  name: string;
  school_id: string;
}

interface Department {
  id: string;
  name: string;
  faculty_id: string;
}

export const AdminDashboardContent = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [instructors, setInstructors] = useState<AdminInstructor[]>([]);

  const [schools, setSchools] = useState<School[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filterSchool, setFilterSchool] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [unassignedOnly, setUnassignedOnly] = useState(false);

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [savingUser, setSavingUser] = useState(false);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const [assigningStudent, setAssigningStudent] = useState<AdminStudent | null>(null);

  const loadCore = useCallback(async () => {
    try {
      const statsData = await adminService.getDashboardStats();
      setStats(statsData);
      setSchools([
        { id: '1', name: 'University of Buea' },
        { id: '2', name: 'University of Yaoundé I' },
      ]);
    } catch (error) {
      console.error('Error loading core data:', error);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    }
  }, []);

  const loadStudents = useCallback(async () => {
    try {
      const data = await adminService.getStudents({
        school_id: filterSchool || undefined,
        faculty_id: filterFaculty || undefined,
        department_id: filterDepartment || undefined,
        unassigned_only: unassignedOnly || undefined,
      });
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Failed to load students');
    }
  }, [filterSchool, filterFaculty, filterDepartment, unassignedOnly]);

  const loadInstructors = useCallback(async () => {
    try {
      const data = await adminService.getInstructors({
        school_id: filterSchool || undefined,
        faculty_id: filterFaculty || undefined,
        department_id: filterDepartment || undefined,
      });
      setInstructors(data);
    } catch (error) {
      console.error('Error loading instructors:', error);
      toast.error('Failed to load instructors');
    }
  }, [filterSchool, filterFaculty, filterDepartment]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await Promise.all([loadCore(), loadUsers(), loadStudents(), loadInstructors()]);
      } catch (error) {
        console.error('Error initializing admin dashboard:', error);
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [loadCore, loadUsers, loadStudents, loadInstructors]);

  useEffect(() => {
    if (!loading) {
      loadStudents();
      loadInstructors();
    }
  }, [filterSchool, filterFaculty, filterDepartment, unassignedOnly, loadStudents, loadInstructors, loading]);

  const handleSchoolFilterChange = async (schoolId: string) => {
    setFilterSchool(schoolId);
    setFilterFaculty('');
    setFilterDepartment('');
    setFaculties([]);
    setDepartments([]);

    if (schoolId) {
      setFaculties([
        { id: '1', name: 'Faculty of Engineering', school_id: schoolId },
        { id: '2', name: 'Faculty of Science', school_id: schoolId },
      ]);
    }
  };

  const handleFacultyFilterChange = async (facultyId: string) => {
    setFilterFaculty(facultyId);
    setFilterDepartment('');
    setDepartments([]);

    if (facultyId) {
      setDepartments([
        { id: '1', name: 'Computer Engineering', faculty_id: facultyId },
        { id: '2', name: 'Electrical Engineering', faculty_id: facultyId },
      ]);
    }
  };

  const handleCreateUser = async (payload: any) => {
    setSavingUser(true);
    try {
      await adminService.createUser(payload);
      toast.success('User created successfully');
      setUserModalOpen(false);
      await Promise.all([loadUsers(), loadCore(), loadStudents(), loadInstructors()]);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Failed to create user');
    } finally {
      setSavingUser(false);
    }
  };

  const handleUpdateUser = async (userId: string, payload: any) => {
    setSavingUser(true);
    try {
      await adminService.updateUser(userId, payload);
      toast.success('User updated successfully');
      setUserModalOpen(false);
      setEditingUser(null);
      await loadUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Failed to update user');
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setDeletingLoading(true);
    try {
      await adminService.deleteUser(deletingUser.id);
      toast.success('User deleted successfully');
      setDeletingUser(null);
      await Promise.all([loadUsers(), loadCore(), loadStudents(), loadInstructors()]);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Failed to delete user');
    } finally {
      setDeletingLoading(false);
    }
  };

  const handleAssignmentComplete = async () => {
    await Promise.all([loadStudents(), loadInstructors(), loadCore()]);
  };

  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: FaChartBar },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'assignments', label: 'Assignments', icon: FaLink },
    { id: 'instructors', label: 'Instructors', icon: FaChalkboardTeacher },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a2a6c]">Admin Panel</h1>
        <p className="text-[#4a5568] text-sm">Manage users, students, instructors, and assignments</p>
      </div>

      <div className="flex border-b border-[#e2e8f0] overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-[#1a2a6c] text-[#1a2a6c]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' && stats && <AdminStatsCards stats={stats} />}

      {activeTab === 'users' && (
        <UsersTable
          users={users}
          onCreate={() => {
            setEditingUser(null);
            setUserModalOpen(true);
          }}
          onEdit={(user) => {
            setEditingUser(user);
            setUserModalOpen(true);
          }}
          onDelete={(user) => setDeletingUser(user)}
        />
      )}

      {(activeTab === 'assignments' || activeTab === 'instructors') && (
        <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border border-[#e2e8f0]">
          <select
            value={filterSchool}
            onChange={(e) => handleSchoolFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All schools</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={filterFaculty}
            onChange={(e) => handleFacultyFilterChange(e.target.value)}
            disabled={!filterSchool}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
          >
            <option value="">All faculties</option>
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>

          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            disabled={!filterFaculty}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
          >
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {activeTab === 'assignments' && (
            <label className="flex items-center gap-2 text-sm text-gray-600 ml-auto">
              <input
                type="checkbox"
                checked={unassignedOnly}
                onChange={(e) => setUnassignedOnly(e.target.checked)}
              />
              Unassigned only
            </label>
          )}
        </div>
      )}

      {activeTab === 'assignments' && (
        <StudentsAssignmentTable
          students={students}
          onAssign={setAssigningStudent}
        />
      )}

      {activeTab === 'instructors' && <InstructorsTable instructors={instructors} />}

      <UserFormModal
        isOpen={userModalOpen}
        user={editingUser}
        onClose={() => {
          setUserModalOpen(false);
          setEditingUser(null);
        }}
        onCreate={handleCreateUser}
        onUpdate={handleUpdateUser}
        saving={savingUser}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingUser)}
        title="Delete User"
        message={`Are you sure you want to permanently delete ${deletingUser?.username}? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deletingLoading}
        onConfirm={handleDeleteUser}
        onCancel={() => setDeletingUser(null)}
      />

      <AssignInstructorModal
        isOpen={Boolean(assigningStudent)}
        student={assigningStudent}
        onClose={() => setAssigningStudent(null)}
        onAssigned={handleAssignmentComplete}
      />
    </div>
  );
};
