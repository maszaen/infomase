'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserSubscription } from '@/types/auth';
import {
  authApi,
  getToken,
  getStoredUser,
  clearAuthStorage,
} from './api';

export const SUBSCRIPTION_STORAGE_KEY = 'infomase_user_subscription';

export const DEFAULT_SUBSCRIPTION: UserSubscription = {
  plan: 'pro',
  planName: 'Paket Pro Wedding',
  status: 'active',
  expiresAt: '2026-11-26',
  daysRemaining: 30,
  maxInvitations: 5,
  canPublish: true,
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  subscription: UserSubscription;
  isSubscriptionActive: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  loginDemo: () => void;
  register: (payload: { name: string; email: string; password: string; phoneNumber?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  toggleSubscriptionSimulation: (status?: 'active' | 'expired') => void;
  renewSubscription: (plan?: 'pro' | 'vip') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscriptionState] = useState<UserSubscription>(DEFAULT_SUBSCRIPTION);

  // Initialize from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      const storedUser = getStoredUser();

      // Load subscription
      try {
        const storedSub = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
        if (storedSub) {
          setSubscriptionState(JSON.parse(storedSub));
        }
      } catch (e) {
        console.warn('Failed to load subscription from localStorage', e);
      }

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

  const saveSubscription = useCallback((sub: UserSubscription) => {
    setSubscriptionState(sub);
    try {
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(sub));
    } catch (e) {
      console.warn('Failed to save subscription to localStorage', e);
    }
  }, []);

  const toggleSubscriptionSimulation = useCallback((forcedStatus?: 'active' | 'expired') => {
    setSubscriptionState((prev) => {
      const nextStatus = forcedStatus || (prev.status === 'active' ? 'expired' : 'active');
      const updated: UserSubscription = {
        ...prev,
        status: nextStatus,
        canPublish: nextStatus === 'active',
        daysRemaining: nextStatus === 'active' ? 30 : 0,
      };
      try {
        localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const renewSubscription = useCallback((plan: 'pro' | 'vip' = 'pro') => {
    const days = plan === 'vip' ? 365 : 30;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const renewed: UserSubscription = {
      plan,
      planName: plan === 'vip' ? 'Paket VIP Exclusive (1 Tahun)' : 'Paket Pro Wedding (30 Hari)',
      status: 'active',
      expiresAt: futureDate.toISOString().split('T')[0],
      daysRemaining: days,
      maxInvitations: plan === 'vip' ? 20 : 5,
      canPublish: true,
    };
    saveSubscription(renewed);
  }, [saveSubscription]);

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

  const loginDemo = useCallback(() => {
    const demoUser: User = {
      id: 'usr-demo-24',
      name: 'Budi Santoso (Demo)',
      email: 'budi@example.com',
      phoneNumber: '081234567890',
      role: 'USER',
      totalInvitations: 3,
    };
    setUser(demoUser);
    setTokenState('demo-token-active');
    if (typeof window !== 'undefined') {
      localStorage.setItem('infomase_token', 'demo-token-active');
      localStorage.setItem('infomase_user', JSON.stringify(demoUser));
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

  const isSubscriptionActive = subscription.status === 'active' && subscription.canPublish;

  return (
    <AuthContext.Provider
      value={{
        user: user ? { ...user, subscription } : null,
        token,
        isAuthenticated: !!token,
        isLoading,
        subscription,
        isSubscriptionActive,
        login,
        loginDemo,
        register,
        logout,
        refreshProfile,
        toggleSubscriptionSimulation,
        renewSubscription,
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
