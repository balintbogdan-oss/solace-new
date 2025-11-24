'use client';

import { usePathname } from 'next/navigation';
import { HeaderAdvisor } from './HeaderAdvisor';
import { HeaderClient } from './HeaderClient';
import { useUserRole } from '@/contexts/UserRoleContext';

export function HeaderWrapper() {
  const pathname = usePathname();
  const { role, isHydrated } = useUserRole();

  // Don't render header on login page
  if (pathname === '/login') {
    return null;
  }

  // Don't render until hydrated to avoid hydration mismatch
  if (!isHydrated) {
    return <HeaderAdvisor />; // Default to advisor during SSR
  }

  return role === 'client' ? <HeaderClient /> : <HeaderAdvisor />;
}

