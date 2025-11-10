// frontend/src/services/api.js
import axios from 'axios';

/**
 * API base URL is taken from REACT_APP_API_URL (should include /api).
 * Example: REACT_APP_API_URL=http://localhost:3001/api
 */
const BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Axios instance used throughout the app
const apiService = axios.create({
  baseURL: BASE,
  timeout: 15000,
  withCredentials: true, // so refresh cookie set by server is handled
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// --- in-memory token (preferred) + localStorage fallback ---
let inMemoryAccessToken = null;

function setAccessToken(token, persist = false) {
  inMemoryAccessToken = token || null;
  if (token && persist) {
    try { localStorage.setItem('skillwise_access_token', token); } catch (e) { /* ignore */ }
  } else if (!token) {
    try { localStorage.removeItem('skillwise_access_token'); } catch (e) { /* ignore */ }
  }

  if (token) {
    apiService.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiService.defaults.headers.common.Authorization;
  }
}

function getAccessToken() {
  if (inMemoryAccessToken) return inMemoryAccessToken;
  try {
    const stored = localStorage.getItem('skillwise_access_token');
    if (stored) {
      inMemoryAccessToken = stored;
      apiService.defaults.headers.common.Authorization = `Bearer ${stored}`;
      return stored;
    }
  } catch (e) { /* ignore */ }
  return null;
}

function clearTokens() {
  inMemoryAccessToken = null;
  try { localStorage.removeItem('skillwise_access_token'); } catch (e) { /* ignore */ }
  delete apiService.defaults.headers.common.Authorization;
}

/* Helper wrapper to unwrap axios errors into consistent shape */
async function requestWrapper(promise) {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    // Normalize error object
    if (err.response && err.response.data) {
      const { status, message, error } = err.response.data;
      const normalized = {
        ok: false,
        statusCode: err.response.status,
        body: err.response.data,
        message: message || (error && error.message) || err.message || 'Request failed'
      };
      // Wrap normalized info into an Error object to satisfy eslint/no-throw-literal
      const e = new Error(normalized.message);
      Object.assign(e, normalized);
      throw e;
    }
    const e = new Error(err.message || 'Network error');
    Object.assign(e, { ok: false, statusCode: 0 });
    throw e;
  }
}

// Generic helpers
function get(url, params = {}) {
  return requestWrapper(apiService.get(url, { params }));
}
function post(url, body = {}) {
  return requestWrapper(apiService.post(url, body));
}
function put(url, body = {}) {
  return requestWrapper(apiService.put(url, body));
}
function del(url) {
  return requestWrapper(apiService.delete(url));
}

// Auth helpers
async function registerUser(payload) {
  // Ensure camelCase keys expected by server
  const body = {
    email: payload.email,
    password: payload.password,
    confirmPassword: payload.confirmPassword || payload.confirm_password,
    firstName: payload.firstName || payload.first_name,
    lastName: payload.lastName || payload.last_name,
  };
  const data = await post('/auth/register', body);
  if (data && data.data && data.data.accessToken) {
    setAccessToken(data.data.accessToken, true);
  }
  return data;
}

async function loginUser({ email, password }) {
  const data = await post('/auth/login', { email, password });
  if (data && data.data && data.data.accessToken) {
    setAccessToken(data.data.accessToken, true);
  }
  return data;
}

// Exports: named + default (some files import default)
export {
  apiService, clearTokens, del, get, getAccessToken, loginUser, post,
  put, registerUser, setAccessToken
};

export default apiService;



