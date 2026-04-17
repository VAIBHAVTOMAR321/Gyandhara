import React, { createContext, useContext, useState, useMemo } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [role, setRole] = useState(null);
  const [uniqueId, setUniqueId] = useState(null);

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
  }), [user, accessToken, refreshToken, role, uniqueId]);

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