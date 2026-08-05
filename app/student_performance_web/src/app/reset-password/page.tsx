'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { FaLock } from 'react-icons/fa';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/axios';

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const schema = yup.object().shape({
  newPassword: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link');
      router.push('/forgot-password');
    }
  }, [token, router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid reset link');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/reset-password', {
        token: token,
        new_password: data.newPassword,
      });
      setSubmitted(true);
      toast.success('Password reset successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-500 mt-1">Enter your new password below</p>
        </div>

        {submitted ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
              <p className="font-medium">✅ Password Reset Successful</p>
              <p className="text-sm mt-1">You can now login with your new password.</p>
            </div>
            <Link href="/login" className="text-blue-900 hover:underline">
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              icon={<FaLock className="text-gray-400" />}
              {...register('newPassword')}
              error={errors.newPassword?.message}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={<FaLock className="text-gray-400" />}
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="mt-4"
              loading={loading}
            >
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}