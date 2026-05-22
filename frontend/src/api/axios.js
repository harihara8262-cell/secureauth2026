import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', // Dynamic URL for mobile app vs web same-origin
  withCredentials: true, // Crucial for HTTP-only cookie session handling
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
  },
});

// Response interceptor to catch session expirations (401 status)
let logoutHandler = null;

export const registerLogoutHandler = (handler) => {
  logoutHandler = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returns a 401 Unauthorized, it means the session is expired
    if (error.response && error.response.status === 401) {
      const isLoginRequest = error.config.url.includes('/auth/login');
      const isMeRequest = error.config.url.includes('/auth/me');
      
      // Don't auto-logout or alert if the error comes from trying to login,
      // or from checking the initial profile session.
      if (!isLoginRequest && !isMeRequest && logoutHandler) {
        logoutHandler();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
