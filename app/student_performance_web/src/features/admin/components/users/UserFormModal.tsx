'use client';

import { useState, useEffect } from 'react';
import { AdminUser, AdminUserCreatePayload, AdminUserUpdatePayload, UserRole } from '../../types/admin.types';

interface UserFormModalProps {
  isOpen: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onCreate: (payload: AdminUserCreatePayload) => Promise<void>;
  onUpdate: (userId: string, payload: AdminUserUpdatePayload) => Promise<void>;
  saving: boolean;
}

const ROLE_OPTIONS: UserRole[] = ['student', 'instructor', 'admin'];

export const UserFormModal = ({
  isOpen,
  user,
  onClose,
  onCreate,
  onUpdate,
  saving,
}: UserFormModalProps) => {
  const isEdit = Boolean(user);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setRole(user.role);
      setIsActive(user.is_active);
      setPassword('');
    } else {
      setUsername('');
      setEmail('');
      setRole('student');
      setIsActive(true);
      setPassword('');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!username || !email) return;

    if (isEdit && user) {
      const payload: AdminUserUpdatePayload = { username, email, role, is_active: isActive };
      if (password) payload.password = password;
      await onUpdate(user.id, payload);
    } else {
      if (!password) {
        return;
      }
      await onCreate({ username, email, password, role });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-[#1a2a6c] mb-4">
          {isEdit ? 'Edit User' : 'Create User'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-[#1a2a6c]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-[#1a2a6c]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isEdit ? 'New Password (optional)' : 'Password *'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEdit ? 'Leave blank to keep current password' : ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-[#1a2a6c]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2a6c] focus:border-[#1a2a6c] capitalize"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r} className="capitalize">
                  {r}
                </option>
              ))}
            </select>
          </div>

          {isEdit && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Account active
            </label>
          )}
        </div>

        <div className="flex gap-3 pt-6">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !username || !email || (!isEdit && !password)}
            className="flex-1 py-2.5 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
}
