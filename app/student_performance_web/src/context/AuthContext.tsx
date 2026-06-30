'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { User, AuthResponse } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isStudent: boolean;
  isInstructor: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('access_token');
    const userData = Cookies.get('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (data: AuthResponse) => {
    Cookies.set('access_token', data.access_token, { expires: 7 });
    Cookies.set('refresh_token', data.refresh_token, { expires: 7 });
    Cookies.set('user', JSON.stringify(data.user), { expires: 7 });
    setUser(data.user);
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('user');
    setUser(null);
    router.push('/login');
  };

  const isAuthenticated = !!user;
  const isStudent = user?.role === 'student';
  const isInstructor = user?.role === 'instructor';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        isStudent,
        isInstructor,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};