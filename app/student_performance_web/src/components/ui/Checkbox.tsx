'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            "mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-900 focus:ring-blue-500",
            className
          )}
          {...props}
        />
        {label && (
          <label className="text-sm text-gray-700">
            {label}
          </label>
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';