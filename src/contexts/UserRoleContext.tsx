'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserRole = 'advisor' | 'client';

interface UserRoleContextType {
  role: UserRole;
  switchRole: () => void;
  setRole: (role: UserRole) => void;
  isHydrated: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('advisor');
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize from cookie or localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // First try to get role from cookie (set by login)
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };
      
      const cookieRole = getCookie('user-role') as UserRole;
      if (cookieRole === 'advisor' || cookieRole === 'client') {
        setRoleState(cookieRole);
        // Also save to localStorage for consistency
        localStorage.setItem('user-role', cookieRole);
      } else {
        // Fallback to localStorage
        const savedRole = localStorage.getItem('user-role') as UserRole;
        if (savedRole === 'advisor' || savedRole === 'client') {
          setRoleState(savedRole);
          // Sync cookie with localStorage
          document.cookie = `user-role=${savedRole}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
        }
      }
      setIsHydrated(true);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user-role', newRole);
      // Also update the cookie to keep it in sync
      document.cookie = `user-role=${newRole}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
    }
  };

  const switchRole = () => {
    const newRole = role === 'advisor' ? 'client' : 'advisor';
    setRole(newRole);
  };

  return (
    <UserRoleContext.Provider value={{ role, switchRole, setRole, isHydrated }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}

