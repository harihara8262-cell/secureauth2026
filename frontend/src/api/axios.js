import axios from 'axios';

const api = axios.create({
  baseURL: '', // Empty because we are proxying /api through Vite config
  withCredentials: true, // Crucial for HTTP-only cookie session handling
  headers: {
    'Content-Type': 'application/json',
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
