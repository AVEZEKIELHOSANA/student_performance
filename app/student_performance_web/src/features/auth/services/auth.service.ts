import { apiClient } from '@/lib/axios';
import { LoginRequest, RegisterRequest, RefreshTokenRequest, AuthResponse, User } from '@/types/user.types';

export const authService = {
  register: (payload: RegisterRequest) => apiClient.post('/auth/register', payload),
  login: (payload: LoginRequest) => apiClient.post<AuthResponse>('/auth/login', payload),
  refreshToken: (payload: RefreshTokenRequest) => apiClient.post('/auth/refresh', payload),
  getCurrentUser: () => apiClient.get<User>('/auth/me'),
};
