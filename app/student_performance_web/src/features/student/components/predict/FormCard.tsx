'use client';

import { ReactNode } from 'react';

interface FormCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

export const FormCard = ({ title, icon, children }: FormCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e2e8f0] hover:shadow-md transition-shadow">
      <h2 className="text-lg font-semibold text-[#1a2a6c] mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};