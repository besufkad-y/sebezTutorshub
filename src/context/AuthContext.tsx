import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, User } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (user: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });

  useEffect(() => {
    if (token && !user) {
      refreshUser();
    }
  }, [token]);

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
      }
    } catch {
      // Token might be invalid
    }
  };

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    if (res.success && res.user) {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      localStorage.setItem('auth_token', res.token);
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    const res = await api.register(data);
    if (res.success && res.user) {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      localStorage.setItem('auth_token', res.token);
      return { success: true };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
