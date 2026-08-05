'use client';

import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { AdminUser } from '../../types/admin.types';
import { RoleBadge } from '@/components/shared/RoleBadge';

interface UsersTableProps {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
  onCreate: () => void;
}

export const UsersTable = ({ users, onEdit, onDelete, onCreate }: UsersTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-[#e2e8f0]">
        <h2 className="text-lg font-semibold text-[#1a2a6c]">All Users</h2>
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-[#1a2a6c] text-white rounded-lg hover:bg-[#2d4373] transition-all flex items-center gap-2 text-sm"
        >
          <FaPlus size={12} /> New User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-[#e2e8f0]">
              <th className="px-4 py-3 font-medium">Username</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{user.username}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      user.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {user.is_active ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => onEdit(user)} className="text-[#1a2a6c] hover:text-[#2d4373]">
                      <FaEdit />
                    </button>
                    <button onClick={() => onDelete(user)} className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
