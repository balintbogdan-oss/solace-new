'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { NavItem, topLevelNavItems, sidebarSections, getClientNavigation } from '@/lib/navigation';
import { useUserRole } from '@/contexts/UserRoleContext';

interface NavigationContextType {
  topLevelItems: NavItem[];
  currentSection: string | null;
  currentSectionItems: NavItem[] | null;
  currentSectionLabel: string | null;
  currentBaseHref: string;
}

const NavigationContext = createContext<NavigationContextType>({
  topLevelItems: topLevelNavItems,
  currentSection: null,
  currentSectionItems: null,
  currentSectionLabel: null,
  currentBaseHref: '',
});

export function NavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { role } = useUserRole();
  const isAdvisor = role === 'advisor';

  const { currentSection, currentSectionItems, currentSectionLabel, currentBaseHref } = useMemo(() => {
    let baseHref = '';
    let matchedSectionPath: string | null = null;
    let matchedSectionData: { label: string; items: NavItem[] } | null = null;

    // Priority 1: Client routes (already handled)
    const clientMatch = pathname?.match(/^(\/clients\/[^\/]+)/);
    if (clientMatch && !pathname?.startsWith('/clients/account-opening')) {
      const clientId = clientMatch[1].split('/')[2];
      baseHref = clientMatch[1]; // e.g., /clients/some-client-id
      matchedSectionPath = '/clients/[clientId]';
      matchedSectionData = { label: 'Client', items: getClientNavigation(clientId) };
    } else {
      // Priority 2: Find matching section (dynamic routes first)
      const sectionEntry = Object.entries(sidebarSections)
        // Sort to prioritize dynamic routes (containing '[')
        .sort(([pathA], [pathB]) => (pathA.includes('[') ? -1 : 1) - (pathB.includes('[') ? -1 : 1))
        .find(([path]) => {
          // Check for exact match
          if (pathname === path) {
            baseHref = path;
            return true;
          }
          
          // Check dynamic route match
          if (path.includes('[') && path.includes(']')) {
            // Regex to match the pattern and capture the base dynamic part
            // Example: /account/[accountId] -> /^(\/account\/[^\/]+)(?:\/.*)?$/
            const dynamicBasePattern = path.replace(/\[.*?\]/g, '[^\/]+'); // Converts [accountId] to [^/]+
            const regex = new RegExp(`^(${dynamicBasePattern})(?:\/.*)?$`); // Match base + optional slash and any sub-path
            const match = pathname?.match(regex);
            if (match) {
              baseHref = match[1]; // Capture the full base path like /account/1PB10001
              return true;
            }
          }
          
          // Check static path prefix match (only if not dynamic)
          if (!path.includes('[') && pathname?.startsWith(`${path}/`)) {
            baseHref = path;
            return true;
          }
          
          return false;
        });

      if (sectionEntry) {
        matchedSectionPath = sectionEntry[0];
        matchedSectionData = sectionEntry[1];
        // Ensure baseHref is set if only the root dynamic path matched exactly
        if (matchedSectionPath.includes('[') && pathname === baseHref) {
            // This case is handled by the regex match now
        } else if (!baseHref && pathname === matchedSectionPath) {
            // Handles exact match for static paths if missed somehow (should be caught by pathname === path)
            baseHref = matchedSectionPath;
        }
      }
    }

    if (!matchedSectionPath || !matchedSectionData) {
      return {
        currentSection: null,
        currentSectionItems: null,
        currentSectionLabel: null,
        currentBaseHref: '',
      };
    }

    // Clean up baseHref (remove trailing slash if any)
    baseHref = baseHref.replace(/\/+$/, '');

    // Filter out Commission for clients
    const filteredItems = matchedSectionData.items.map(item => {
      if (item.subItems) {
        const filteredSubItems = item.subItems.filter(subItem => {
          // Hide Commission for clients
          if (subItem.label === 'Commission' && !isAdvisor) {
            return false;
          }
          return true;
        });
        return { ...item, subItems: filteredSubItems };
      }
      return item;
    });

    return {
      currentSection: matchedSectionPath,
      currentSectionItems: filteredItems,
      currentSectionLabel: matchedSectionData.label,
      currentBaseHref: baseHref, // Provide the correctly determined base href
    };
  }, [pathname, isAdvisor]);

  const value = {
    topLevelItems: topLevelNavItems,
    currentSection,
    currentSectionItems,
    currentSectionLabel,
    currentBaseHref,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
} 