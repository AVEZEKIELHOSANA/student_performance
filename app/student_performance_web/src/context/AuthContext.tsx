'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/axios';
import { useRouter } from 'next/navigation';

type UserRole = 'student' | 'instructor' | 'admin';

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  student_id?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  // Accept either (username, password) OR an auth response object for backward compatibility
  login: (usernameOrResponse: any, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            const response = await apiClient.get('/auth/me');
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (usernameOrResponse: any, password?: string) => {
    // If caller passed an auth response object (legacy usage), handle it
    if (password === undefined && usernameOrResponse && usernameOrResponse.access_token) {
      const { access_token, refresh_token, user: respUser } = usernameOrResponse;
      localStorage.setItem('access_token', access_token);
      if (refresh_token) localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(respUser));
      setUser(respUser);
      const roleRoutes: Record<UserRole, string> = {
        student: '/student',
        instructor: '/instructor',
        admin: '/admin',
      };
      router.push(roleRoutes[(respUser.role as UserRole)] || '/');
      return;
    }

    if (typeof usernameOrResponse === 'string' && typeof password === 'string') {
      const formData = new URLSearchParams();
      formData.append('username', usernameOrResponse);
      formData.append('password', password);

      const response = await apiClient.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { access_token, refresh_token, user: respUser } = response.data;
      localStorage.setItem('access_token', access_token);
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token);
      }
      localStorage.setItem('user', JSON.stringify(respUser));
      setUser(respUser);

      const roleRoutes: Record<UserRole, string> = {
        student: '/student',
        instructor: '/instructor',
        admin: '/admin',
      };
      router.push(roleRoutes[(respUser.role as UserRole)] || '/');
      return;
    }

    throw new Error('Invalid arguments to login()');
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setUser(null);
      router.push('/login');
    }
  };

  const register = async (data: RegisterData) => {
    const response = await apiClient.post('/auth/register', data);
    router.push('/login');
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};