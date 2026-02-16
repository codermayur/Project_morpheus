import { api } from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  login: (data) => api.post('/auth/login', data),
  logout: (refreshToken) =>
    api.post('/auth/logout', { refreshToken }),
  refreshToken: (refreshToken) =>
    api.post('/auth/refresh-token', { refreshToken }),
};
