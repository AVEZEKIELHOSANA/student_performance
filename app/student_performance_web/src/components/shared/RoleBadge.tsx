'use client';

import { UserRole } from '@/features/admin/types/admin.types';

const ROLE_STYLES: Record<UserRole, string> = {
  admin: 'bg-purple-100 text-purple-700',
  instructor: 'bg-blue-100 text-blue-700',
  student: 'bg-green-100 text-green-700',
};

export const RoleBadge = ({ role }: { role: UserRole }) => (
  <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${ROLE_STYLES[role]}`}>
    {role}
  </span>
);
