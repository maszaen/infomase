'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { User } from '@/types/auth';
import { authApi, getToken, getStoredUser, clearAuthStorage, setStoredUser } from './api';

/**
 * Auth only. Nothing about billing lives here anymore: the old
 * `UserSubscription` + "simulate expired" toggle let a visitor unlock
 * publishing from the sidebar, which is exactly the kind of coupling that
 * makes a real product untrustworthy.
 */
interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login(credentials: { email: string; password: string }): Promise<void>;
  register(payload: {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }): Promise<void>;
  loginDemo(): void;
  logout(): Promise<void>;
  refreshProfile(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const storedToken = getToken();
      const storedUser = getStoredUser();

      if (storedToken) {
        if (!cancelled) {
          setToken(storedToken);
          if (storedUser) setUser(storedUser);
        }
        try {
          const profile = await authApi.getMe();
          if (!cancelled && profile) {
            setUser(profile);
            setStoredUser(profile);
          }
        } catch {
          /* offline or expired — keep the cached identity, the API layer retries */
        }
      }
      if (!cancelled) setIsLoading(false);
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(credentials);
      if (res?.user) {
        setUser(res.user);
        setStoredUser(res.user);
      }
      setToken(getToken());
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
          setStoredUser(res.user);
        }
        setToken(getToken());
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /** Local-only sandbox identity so the console can be explored before signup. */
  const loginDemo = useCallback(() => {
    const demoUser: User = {
      id: 'demo-user',
      name: 'Mode Demo',
      email: 'demo@infomase.id',
      role: 'USER',
    };
    setUser(demoUser);
    setToken('demo-token');
    if (typeof window !== 'undefined') {
      localStorage.setItem('infomase_token', 'demo-token');
      setStoredUser(demoUser);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuthStorage();
      setUser(null);
      setToken(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await authApi.getMe();
      if (profile) {
        setUser(profile);
        setStoredUser(profile);
      }
    } catch {
      /* non-fatal */
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        isLoading,
        login,
        register,
        loginDemo,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};
