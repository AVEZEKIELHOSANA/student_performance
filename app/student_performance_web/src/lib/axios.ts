import axios from 'axios';
import { config } from '@/config';
import Cookies from 'js-cookie';

export const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
apiClient.interceptors.request.use(
  (request) => {
    const token = Cookies.get('access_token');
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🚀 API Request: ${request.method?.toUpperCase()} ${request.url}`);
    return request;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout');
    } else if (error.response) {
      console.error(`❌ API Error: ${error.response.status}`, error.response.data);
    } else if (error.request) {
      console.error('❌ No response from server. Is the backend running?');
      console.error('   Make sure: uvicorn app.main:app --reload --port 8000');
    } else {
      console.error('❌ Error:', error.message);
    }
    return Promise.reject(error);
  }
);