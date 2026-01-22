'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NavItem } from '@/lib/navigation'
import { useNavigation } from '@/contexts/NavigationContext'
import { useSidebar } from '@/contexts/SidebarContext'
import React from 'react'

// 🔽 Removed all specific icon imports as they are unused according to linter

// Keep iconMap removed (it was correctly identified as unused)

export function Sidebar() { // Removed props
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const { currentSectionItems, currentBaseHref, currentSectionLabel } = useNavigation(); // Get base href and label from context
  const { isMinimized, toggleSidebar, setMinimized, resetManualSetting, isHydrated } = useSidebar();
  // Initialize expanded state based on current path belonging to a section
  const [expanded, setExpanded] = useState<string[]>(() => {
    if (!currentSectionItems || !currentBaseHref) return [];
    
    // Always expand "financials" when on account pages
    const isAccountPage = pathname.startsWith('/account/');
    const defaultExpanded = isAccountPage ? ['financials'] : [];
    
    const findExpanded = (items: NavItem[], currentPath: string, basePath: string): string[] => {
      for (const item of items) {
        const fullItemHref = item.href.startsWith('/') ? item.href : `${basePath}/${item.href}`.replace(/\/+$/, '');
        if (currentPath.startsWith(fullItemHref) && item.subItems) {
          return [item.href, ...findExpanded(item.subItems, currentPath, fullItemHref)];
        }
      }
      return [];
    }
    
    const pathBasedExpanded = findExpanded(currentSectionItems, pathname, currentBaseHref);
    return [...new Set([...defaultExpanded, ...pathBasedExpanded])]; // Combine and deduplicate
  });

  const toggleExpand = (key: string) => {
    setExpanded((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const renderNavItem = (item: NavItem, parentHref: string, previousGroupTitle?: string): { element: JSX.Element, groupTitle?: string } => { // Removed default value for parentHref
    // Use parentHref passed from the recursive call or the context baseHref for top-level items
    // For sub-items, if href is empty, use the account root path
    // For sub-items with relative paths, use account root + href (not parent + href)
    const fullHref = item.href.startsWith('/')
      ? item.href
      : item.href === ''
        ? parentHref.replace(/\/[^\/]+$/, '') // Remove the last segment to get account root
        : `${currentBaseHref}/${item.href}`.replace(/\/+$/, ''); // Use currentBaseHref (account root) instead of parentHref
    const isActive = pathname === fullHref;
    const isExpanded = expanded.includes(item.href);
    const hasSub = !!item.subItems?.length;
    // Restore direct usage of item.icon
    const Icon = item.icon;

    const groupTitleElement = item.groupTitle && item.groupTitle !== previousGroupTitle && !isMinimized ? (
      <div className="pt-6 pb-2 px-3 text-xs uppercase text-muted-foreground tracking-wider font-medium tracking-widest">
        {item.groupTitle}
      </div>
    ) : null;

    if (hasSub) {
      // Check if any child route is active (for showing active state when minimized)
      // Since sub-item URLs may be flat (e.g., /account/[id]/activity instead of /account/[id]/financials/activity),
      // we need to check each sub-item's actual path using the same logic as fullHref calculation
      const hasActiveChild = item.subItems!.some(sub => {
        const subFullHref = sub.href.startsWith('/')
          ? sub.href
          : sub.href === ''
            ? fullHref.replace(/\/[^\/]+$/, '') // Same logic as line 56 - removes last segment
            : `${currentBaseHref}/${sub.href}`.replace(/\/+$/, '');
        // For empty href sub-items (like Holdings), only match exact pathname to avoid matching all account pages
        return pathname === subFullHref || (sub.href !== '' && pathname.startsWith(subFullHref + '/'));
      }) || (pathname.startsWith(fullHref) && pathname !== fullHref);
      // Show active styling when minimized and either this item or any child is active
      const showActiveState = isMinimized && (isActive || hasActiveChild);

      return {
        element: (
          <React.Fragment key={item.href}>
            {groupTitleElement}
            <li>
              <button
                onClick={() => {
                  if (isMinimized) {
                    // Just expand the sidebar when minimized
                    toggleSidebar();
                  } else {
                    // Toggle expand/collapse when sidebar is expanded
                    toggleExpand(item.href);
                  }
                }}
                className={cn(
                  'flex items-center text-sm transition-colors',
                  isMinimized ? 'justify-center items-center w-10 h-10 rounded-lg' : 'justify-between w-full rounded-md px-3 py-3',
                  showActiveState
                    ? 'bg-white dark:bg-white/10 text-amber-800 dark:text-amber-600 shadow-[0px_1px_2px_1px_rgba(0,0,0,0.06)]'
                    : isActive
                      ? 'text-foreground dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/30 dark:hover:bg-muted/50',
                  // Keep parent expanded if child is active (when not minimized)
                  !isMinimized && pathname.startsWith(fullHref) && !isActive && 'text-gray-700 dark:text-gray-300' 
                )}
                title={isMinimized ? item.label : undefined}
              >
                <div className={cn("flex items-center", isMinimized ? "gap-0" : "gap-3")}>
                  {Icon && <Icon className="w-4 h-4" />}
                  {!isMinimized && <span>{item.label}</span>}
                </div>
                {!isMinimized && (
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform',
                      isExpanded && 'rotate-180'
                    )}
                  />
                )}
              </button>
              {isExpanded && !isMinimized && (
                <ul className="pl-7 mt-1 space-y-1">
                  {/* Pass the calculated fullHref as the parentHref for sub-items */}
                  {item.subItems!.reduce((acc, sub) => {
                    const result = renderNavItem(sub, fullHref, acc.lastGroupTitle);
                    acc.elements.push(result.element);
                    acc.lastGroupTitle = result.groupTitle || acc.lastGroupTitle;
                    return acc;
                  }, { elements: [] as JSX.Element[], lastGroupTitle: item.groupTitle }).elements}
                </ul>
              )}
            </li>
          </React.Fragment>
        ),
        groupTitle: item.groupTitle
      };
    }

    return {
      element: (
        <React.Fragment key={item.href}>
          {groupTitleElement}
          <li>
            <button
              onClick={() => {
                if (isMinimized) {
                  // Expand the sidebar when minimized
                  toggleSidebar();
                } else {
                  // If clicking Trade, minimize the sidebar AND navigate
                  if (item.label === 'Trade') {
                    console.log('Trade clicked: setting minimized to true, navigating to:', fullHref);
                    setMinimized(true);
                    router.push(fullHref);
                  } else {
                    // Navigate to other pages when sidebar is expanded
                    // Reset manual setting when leaving trade pages
                    if (pathname.includes('/trade/') && !fullHref.includes('/trade/')) {
                      resetManualSetting();
                    }
                    router.push(fullHref);
                  }
                }
              }}
              className={cn(
                'flex items-center text-sm transition-colors',
                isMinimized ? 'justify-center items-center w-10 h-10 rounded-lg' : 'justify-between w-full rounded-md px-3 py-3',
                isActive
                  ? 'bg-white dark:bg-white/10 text-amber-800 dark:text-amber-600 shadow-[0px_1px_2px_1px_rgba(0,0,0,0.06)]'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/30 dark:hover:bg-muted/50'
              )}
              title={isMinimized ? item.label : undefined}
            >
              <div className={cn("flex items-center", isMinimized ? "gap-0" : "gap-3")}>
                {Icon && <Icon className="w-4 h-4" />}
                {!isMinimized && <span>{item.label}</span>}
              </div>
            </button>
          </li>
        </React.Fragment>
      ),
      groupTitle: item.groupTitle
    };
  };

  if (!currentSectionItems) {
    return null;
  }

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated) {
    return (
      <nav className={cn(
        "px-4 hidden md:block flex-shrink-0 min-h-[calc(100vh-116px)] rounded-md transition-all duration-300",
        "w-[260px] bg-background"
      )}>
        <div className="flex flex-col h-full">
          <div className={cn("flex items-center", "justify-between", "pt-6 pb-1")}>
            <div className="w-16 h-4 bg-muted rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="flex-1">
            <ul className="space-y-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i}>
                  <div className="flex items-center justify-between w-full rounded-md px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-muted rounded animate-pulse"></div>
                      <div className="w-20 h-4 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={cn(
      "px-4 hidden md:block flex-shrink-0 min-h-[calc(100vh-116px)] rounded-md transition-all duration-300",
      isMinimized ? "w-[60px]" : "w-[260px]"
    )}>
      <div className={cn("flex flex-col h-full", isMinimized && "items-center justify-start")}>
        {/* Sidebar Header */}
        <div className={cn("flex items-center", isMinimized ? "justify-center" : "justify-between", "pt-6 pb-1")}>
          {!isMinimized && currentSectionLabel && (
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {currentSectionLabel}
            </span>
          )}
          <button
            onClick={toggleSidebar}
            className={cn(
              "flex items-center text-sm transition-colors",
              isMinimized ? "justify-center items-center w-10 h-10 rounded-lg hover:bg-gray-200/30 dark:hover:bg-gray-200/10" : "p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
            title={isMinimized ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isMinimized ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
        
        {/* Navigation Items */}
        <div className="flex-1">
          <ul className="space-y-1">
            {/* Use currentBaseHref from context for top-level items */}
            {currentSectionItems.reduce((acc, item) => {
              const result = renderNavItem(item, currentBaseHref, acc.lastGroupTitle);
              acc.elements.push(result.element);
              acc.lastGroupTitle = result.groupTitle || acc.lastGroupTitle;
              return acc;
            }, { elements: [] as JSX.Element[], lastGroupTitle: undefined as (string | undefined) }).elements}
          </ul>
        </div>
      </div>
    </nav>
  );
}