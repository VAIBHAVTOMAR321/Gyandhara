import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'gyandhara_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [role, setRole] = useState(null);
  const [uniqueId, setUniqueId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEY);
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setUser(parsed.user || null);
        setAccessToken(parsed.access || null);
        setRefreshToken(parsed.refresh || null);
        setRole(parsed.role || null);
        setUniqueId(parsed.unique_id || null);
      } catch (err) {
        console.error('Failed to parse auth data:', err);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsReady(true);
  }, []);

  // Persist auth state to localStorage on changes
  useEffect(() => {
    if (accessToken) {
      const authData = {
        user,
        access: accessToken,
        refresh: refreshToken,
        role,
        unique_id: uniqueId,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, accessToken, refreshToken, role, uniqueId]);

  const login = (data) => {
    setUser(data.user);
    setAccessToken(data.access);
    setRefreshToken(data.refresh);
    setRole(data.role);
    setUniqueId(data.unique_id);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setRole(null);
    setUniqueId(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(() => ({
    user,
    accessToken,
    refreshToken,
    role,
    uniqueId,
    login,
    logout,
    isAuthenticated: !!accessToken,
    isReady,
  }), [user, accessToken, refreshToken, role, uniqueId, isReady]);

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