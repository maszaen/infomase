'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types/auth';
import {
  authApi,
  getToken,
  getStoredUser,
  clearAuthStorage,
} from './api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; phoneNumber?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      const storedUser = getStoredUser();

      if (storedToken) {
        setTokenState(storedToken);
        if (storedUser) {
          setUser(storedUser);
        }

        // Verify token with backend
        try {
          const profile = await authApi.getMe();
          if (profile) {
            setUser(profile);
          }
        } catch {
          // If token expired or network fails, keep stored user if offline or clear if 401
          console.warn('Backend session verification failed or offline');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(credentials);
      if (res?.user) {
        setUser(res.user);
      }
      const activeToken = getToken();
      setTokenState(activeToken);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (payload: { name: string; email: string; password: string; phoneNumber?: string }) => {
      setIsLoading(true);
      try {
        const res = await authApi.register(payload);
        if (res?.user) {
          setUser(res.user);
        }
        const activeToken = getToken();
        setTokenState(activeToken);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuthStorage();
      setUser(null);
      setTokenState(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await authApi.getMe();
      if (profile) setUser(profile);
    } catch (err) {
      console.warn('Gagal memperbarui profil user', err);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
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
