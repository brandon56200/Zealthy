'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, AdminConfig } from '@/types/schema';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  adminConfig: AdminConfig | null;
  updateAdminConfig: (newConfig: AdminConfig) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminConfig, setAdminConfig] = useState<AdminConfig | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          if (userData.adminConfig) {
            setAdminConfig(userData.adminConfig);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const updateAdminConfig = useCallback((newConfig: AdminConfig) => {
    setAdminConfig(newConfig);
    if (user) {
      setUser({
        ...user,
        adminConfig: newConfig
      });
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, adminConfig, updateAdminConfig }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Function to get current user without subscribing to changes
export function getCurrentUser() {
  const { user } = useAuth();
  return user;
}

// Optional: Create a hook for components that only need to read the user data
export function useUser() {
  const { user } = useAuth();
  return user;
} 