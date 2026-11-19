import React, { createContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await loginService(credentials);
    setUser(data.data);
    return data;
  };

  const register = async (userData) => {
    const data = await registerService(userData);
    setUser(data.data);
    return data;
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};