'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Divider } from '@/components/ui/Divider';
import { apiClient } from '@/lib/axios';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'instructor';
  acceptTerms: boolean;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: yup.string().oneOf(['student', 'instructor']).required('Role is required'),
  acceptTerms: yup.boolean().oneOf([true], 'You must accept the terms'),
});

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const router = useRouter();

  const isDev = process.env.NODE_ENV === 'development';
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      role: 'student',
    },
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await apiClient.post('/auth/google', {
          access_token: tokenResponse.access_token,
        });
        toast.success('Google login successful!');
        router.push('/dashboard');
      } catch (error: any) {
        toast.error(error.response?.data?.detail || 'Google login failed');
      }
    },
    onError: () => {
      toast.error('Google login failed');
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    // Validate reCAPTCHA
    if (!captchaValue) {
      toast.error('Please complete the reCAPTCHA');
      return;
    }

    setLoading(true);
    try {
      const username = data.name.toLowerCase().replace(/\s+/g, '');
      
      const response = await apiClient.post('/auth/register', {
        username: username,
        email: data.email,
        password: data.password,
        role: data.role.toUpperCase(),
      });

      toast.success('Account created successfully! Please login.');
      router.push('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    toast.info('Facebook login coming soon');
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Student Signup</h1>
          <p className="text-gray-500 mt-1">Hey enter your details to create your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Enter your Name"
            placeholder="John Doe"
            icon={<FaUser className="text-gray-400" />}
            {...register('name')}
            error={errors.name?.message}
          />

          <Input
            label="Enter your Email"
            type="email"
            placeholder="john@example.com"
            icon={<FaEnvelope className="text-gray-400" />}
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Create Password"
            type="password"
            placeholder="••••••••"
            icon={<FaLock className="text-gray-400" />}
            {...register('password')}
            error={errors.password?.message}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <select
              {...register('role')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Checkbox
              {...register('acceptTerms')}
              error={errors.acceptTerms?.message}
            />
            <label className="text-sm text-gray-600">
              I agree to the Terms and Conditions
            </label>
          </div>

          {/* reCAPTCHA */}
          <div className="mt-4 flex justify-center">
            <ReCAPTCHA
              sitekey={siteKey}
              onChange={(value) => setCaptchaValue(value)}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="mt-6"
            loading={loading}
          >
            Sign up
          </Button>
        </form>

        <Divider text="Or Signup with" />

        <div className="flex gap-3">
          <Button
            variant="google"
            fullWidth
            onClick={() => googleLogin()}
          >
            <FaGoogle className="mr-2" /> Google
          </Button>
          <Button
            variant="facebook"
            fullWidth
            onClick={handleFacebookLogin}
          >
            <FaFacebook className="mr-2" /> Facebook
          </Button>
        </div>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-900 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}