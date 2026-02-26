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

// Helper to get role synchronously from cookie/localStorage
function getRoleSync(): UserRole {
  if (typeof window === 'undefined') return 'advisor';
  
  // Try cookie first
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };
  
  const cookieRole = getCookie('user-role') as UserRole;
  if (cookieRole === 'advisor' || cookieRole === 'client') {
    return cookieRole;
  }
  
  // Fallback to localStorage
  try {
    const savedRole = localStorage.getItem('user-role') as UserRole;
    if (savedRole === 'advisor' || savedRole === 'client') {
      return savedRole;
    }
  } catch {
    // localStorage not available
  }
  
  return 'advisor'; // Default
}

export function UserRoleProvider({ children }: { children: ReactNode }) {
  // Initialize role synchronously on client side
  const [role, setRoleState] = useState<UserRole>(() => getRoleSync());
  const [isHydrated, setIsHydrated] = useState(false);

  // Sync and verify role on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentRole = getRoleSync();
      if (currentRole !== role) {
        setRoleState(currentRole);
      }
      // Sync cookie and localStorage
      if (currentRole === 'advisor' || currentRole === 'client') {
        localStorage.setItem('user-role', currentRole);
        document.cookie = `user-role=${currentRole}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
      }
      setIsHydrated(true);
    }
  }, [role]);

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

