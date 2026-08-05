'use client';

import { ReactNode } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/context/AuthContext';

const queryClient = new QueryClient();
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  throw new Error(
    'Missing required NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable for Google OAuth.'
  );
}

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <ToastContainer />
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};