import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  withCredentials: true, // Include cookies for httpOnly refresh token
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management utilities
const TOKEN_KEY = 'access_token';

const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  // Note: httpOnly refresh token will be cleared by server
  // Also clear any default Authorization header to avoid stale tokens
  if (api?.defaults?.headers?.Authorization) {
    delete api.defaults.headers.Authorization;
  }
};

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to add Bearer token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh logic
api.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url} - ${error.response?.status}`);
    }
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token using httpOnly refresh cookie
        const refreshResponse = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/auth/refresh`,
          {},
          {
            withCredentials: true, // Send httpOnly refresh cookie
            timeout: 5000,
          }
        );

        // Backend replies use { status, data: { user, accessToken } }
        const refreshPayload = refreshResponse.data?.data || refreshResponse.data || {};
        const accessToken = refreshPayload.accessToken;

        if (accessToken) {
          // Update stored access token
          setAccessToken(accessToken);
          
          // Update default authorization header
          api.defaults.headers.Authorization = `Bearer ${accessToken}`;
          
          // Process queued requests with new token
          processQueue(null, accessToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          console.log('✅ Token refreshed successfully');
          return api(originalRequest);
        } else {
          throw new Error('No access token received from refresh');
        }
        
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        
        // Clear tokens and redirect to login
        clearTokens();
        processQueue(refreshError, null);
        
        // Dispatch logout event for AuthContext to handle
        window.dispatchEvent(new CustomEvent('auth:logout', { 
          detail: { reason: 'token_refresh_failed' } 
        }));
        
        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle other error cases
    if (error.response?.status >= 500) {
      console.error('🚨 Server Error:', error.response.data);
      // Could dispatch global error event here
      window.dispatchEvent(new CustomEvent('api:server-error', { 
        detail: { error: error.response.data } 
      }));
    }
    
    // Network errors
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout');
      error.message = 'Request timeout. Please check your connection and try again.';
    } else if (!error.response) {
      console.error('🔌 Network Error:', error.message);
      error.message = 'Network error. Please check your connection and try again.';
    }
    
    return Promise.reject(error);
  }
);

// (Removed legacy named export of apiService to avoid duplicate declarations)

// Build a service wrapper so consumers can call api.<namespace>.*
const apiService = {
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    refreshToken: () => api.post('/auth/refresh'),
  },
  users: {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    deleteAccount: () => api.delete('/users/account'),
    changePassword: (data) => api.put('/users/change-password', data),
  },
  // Alias for backward compatibility
  user: {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    deleteAccount: () => api.delete('/users/account'),
    changePassword: (data) => api.put('/users/change-password', data),
  },
  goals: {
    getAll: () => api.get('/goals'),
    create: (goal) => api.post('/goals', goal),
    update: (id, goal) => api.put(`/goals/${id}`, goal),
    delete: (id) => api.delete(`/goals/${id}`),
    getById: (id) => api.get(`/goals/${id}`),
  },
  challenges: {
    getAll: (params) => api.get('/challenges', { params }),
    getById: (id) => api.get(`/challenges/${id}`),
    create: (challenge) => api.post('/challenges', challenge),
    delete: (id) => api.delete(`/challenges/${id}`),
    submit: (id, submission) => api.post(`/challenges/${id}/submit`, submission),
    getSubmissions: (id) => api.get(`/challenges/${id}/submissions`),
  },
  progress: {
    getOverview: () => api.get('/progress/overview'),
    getSkills: () => api.get('/progress/skills'),
    getActivity: (params) => api.get('/progress/activity', { params }),
    getStats: () => api.get('/progress/stats'),
  },
  leaderboard: {
    getGlobal: (params) => api.get('/leaderboard/', { params }),
    getUserRank: () => api.get('/leaderboard/user-rank'),
  },
  peerReview: {
    submit: (data) => api.post('/reviews/submit', data),
    getReviewQueue: (params) => api.get('/reviews/queue', { params }),
    getMySubmissions: () => api.get('/reviews/my-submissions'),
    submitReview: (submissionId, review) => api.post(`/reviews/submissions/${submissionId}/review`, review),
    getReviewDetails: (submissionId) => api.get(`/reviews/submissions/${submissionId}`),
  },
  notifications: {
    getAll: () => api.get('/notifications'),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
  },
  ai: {
    generateChallenge: (payload) => api.post('/ai/generateChallenge', payload),
    saveChallenge: (payload) => api.post('/ai/saveChallenge', payload),
    generateFeedback: (payload) => api.post('/ai/feedback', payload),
    getHints: (challengeId) => api.get(`/ai/hints/${challengeId}`),
    suggestChallenges: (params) => api.get('/ai/suggestions', { params }),
    analyzeProgress: (params) => api.get('/ai/analysis', { params }),
  },
  // expose raw axios instance for advanced use
  http: api,
};

// Export utilities for external use
export { getAccessToken, setAccessToken, clearTokens };

// Export the service wrapper by default
export default apiService;
// Also export named for backward compatibility
export { apiService };