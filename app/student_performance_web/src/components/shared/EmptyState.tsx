'use client';

import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-[#e2e8f0]">
    <div className="mx-auto text-4xl text-[#cbd5e1] mb-4">{icon}</div>
    <p className="text-[#4a5568] font-medium">{title}</p>
    <p className="text-sm text-[#4a5568] mt-1">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);
