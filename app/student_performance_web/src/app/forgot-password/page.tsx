'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { FaEnvelope } from 'react-icons/fa';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/axios';

interface ForgotPasswordFormData {
  email: string;
}

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      await apiClient.post('/auth/forgot-password', { email: data.email });
      setSubmitted(true);
      toast.success('Password reset link sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-gray-500 mt-1">
            Enter your email and we'll send you a reset code
          </p>
        </div>

        {submitted ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
              <p className="font-medium">✅ Check your email</p>
              <p className="text-sm mt-1">We've sent a password reset link to your email address.</p>
            </div>
            <Link href="/login" className="text-blue-900 hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              icon={<FaEnvelope className="text-gray-400" />}
              {...register('email')}
              error={errors.email?.message}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="mt-4"
              loading={loading}
            >
              Send Reset Code
            </Button>
          </form>
        )}

        <p className="text-center mt-6 text-sm text-gray-600">
          <Link href="/login" className="text-blue-900 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}