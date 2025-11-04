// TODO: Implement authentication API service
import api from './api';
import { setAccessToken } from './api';

// Lightweight wrapper around apiService.auth to normalize backend response shape
export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    const payload = response.data?.data || response.data;
    if (payload?.accessToken) {
      setAccessToken(payload.accessToken);
    }
    return payload;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    const payload = response.data?.data || response.data;
    if (payload?.accessToken) {
      setAccessToken(payload.accessToken);
    }
    return payload;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
    }
  }
};

export default authService;