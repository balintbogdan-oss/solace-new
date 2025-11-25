'use client';

import { usePathname } from 'next/navigation';
import { HeaderAdvisor } from './HeaderAdvisor';
import { HeaderClient } from './HeaderClient';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useState, useEffect } from 'react';

// Helper to get role synchronously from data attribute (set by blocking script)
function getRoleFromDataAttribute(): 'advisor' | 'client' {
  if (typeof window === 'undefined') return 'advisor';
  
  // Read from data-role attribute set by blocking script
  const roleAttr = document.documentElement.getAttribute('data-role');
  if (roleAttr === 'advisor' || roleAttr === 'client') {
    return roleAttr;
  }
  
  // Fallback: try cookie/localStorage if data attribute not set
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };
  
  const cookieRole = getCookie('user-role');
  if (cookieRole === 'advisor' || cookieRole === 'client') {
    return cookieRole;
  }
  
  try {
    const savedRole = localStorage.getItem('user-role');
    if (savedRole === 'advisor' || savedRole === 'client') {
      return savedRole;
    }
  } catch {
    // localStorage not available
  }
  
  return 'advisor'; // Default
}

export function HeaderWrapper() {
  const pathname = usePathname();
  const { role, isHydrated } = useUserRole();
  
  // Determine role synchronously on client, but default to advisor for SSR
  // This ensures server and initial client render match (both advisor)
  // Then we'll update after mount to the correct role
  const [currentRole, setCurrentRole] = useState<'advisor' | 'client'>(() => {
    // Server always renders advisor
    if (typeof window === 'undefined') return 'advisor';
    // Client: start with advisor to match server, then update immediately
    return 'advisor';
  });
  
  const [hasUpdated, setHasUpdated] = useState(false);

  // Immediately after mount, update to correct role from data attribute
  useEffect(() => {
    if (!hasUpdated) {
      const correctRole = getRoleFromDataAttribute();
      setCurrentRole(correctRole);
      setHasUpdated(true);
    }
  }, [hasUpdated]);

  // Also listen to role changes from context (e.g., when switching roles)
  useEffect(() => {
    if (isHydrated && role) {
      setCurrentRole(role);
    }
  }, [isHydrated, role]);

  // Don't render header on login page
  if (pathname === '/login') {
    return null;
  }

  // Both server and client initially render advisor to avoid hydration mismatch
  // After mount, we update to the correct header
  // The header components have suppressHydrationWarning to handle any remaining mismatches
  return (
    <>
      {currentRole === 'client' ? <HeaderClient /> : <HeaderAdvisor />}
    </>
  );
}

