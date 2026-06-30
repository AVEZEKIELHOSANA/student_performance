export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'EduPredict',
  },
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
};