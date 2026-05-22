import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { registerLogoutHandler } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve user session data from HTTP cookie
  const checkSession = async () => {
    try {
      const response = await api.get('/api/auth/me');
      if (response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log('No active session found.');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Perform initial session recovery
  useEffect(() => {
    checkSession();
    
    // Register global auto-logout handler for session timeouts
    registerLogoutHandler(() => {
      setUser(null);
    });
  }, []);

  // Login handler
  const login = async (email, password, rememberMe) => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password, rememberMe });
      if (response.data && response.data.user) {
        setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An unexpected connection error occurred.' };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setUser(null);
    }
  };

  // Register handler
  const signup = async (name, email, password) => {
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An unexpected connection error occurred.' };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    checkSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
