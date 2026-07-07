'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/features/auth/services/auth.service';
import { apiClient } from '@/lib/axios';

interface LoginFormData {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  // ✅ Role-based redirect function
  const redirectToDashboard = (role: string) => {
    const roleRoutes: Record<string, string> = {
      student: '/student/dashboard',
      instructor: '/instructor/dashboard',
      admin: '/admin/dashboard',
    };
    const route = roleRoutes[role] || '/';
    router.push(route);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await apiClient.post('/auth/google', {
          access_token: tokenResponse.access_token,
        });
        login(response.data);
        toast.success('Login successful!');
        
        const userRole = response.data.user.role;
        redirectToDashboard(userRole);
      } catch (error: any) {
        toast.error(error.response?.data?.detail || 'Google login failed');
      }
    },
    onError: () => {
      toast.error('Google login failed');
    },
  });

  const handleFacebookLogin = () => {
    toast.info('Facebook login coming soon');
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      login(response.data);
      toast.success('Login successful!');
      
      const userRole = response.data.user.role;
      redirectToDashboard(userRole);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-1">Sign in to continue to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            icon={<FaEnvelope className="text-gray-400" />}
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<FaLock className="text-gray-400" />}
            {...register('password')}
            error={errors.password?.message}
          />

          <div className="flex justify-end mb-6">
            <Link href="/forgot-password" className="text-sm text-blue-900 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            Sign In
          </Button>
        </form>

        <Divider text="Or continue with" />

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
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-900 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}