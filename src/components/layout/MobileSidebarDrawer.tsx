'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavItem } from '@/lib/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';

interface MobileSidebarDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebarDrawer({ 
  isOpen, 
  onOpenChange
}: MobileSidebarDrawerProps) {
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const { currentSectionItems, currentBaseHref, currentSectionLabel } = useNavigation();
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
    };
    
    const pathBasedExpanded = findExpanded(currentSectionItems, pathname, currentBaseHref);
    return [...new Set([...defaultExpanded, ...pathBasedExpanded])];
  });

  const toggleExpand = (key: string) => {
    setExpanded((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const renderNavItem = (item: NavItem, parentHref: string): JSX.Element => {
    const fullHref = item.href.startsWith('/')
      ? item.href
      : item.href === ''
        ? parentHref.replace(/\/[^\/]+$/, '')
        : `${currentBaseHref}/${item.href}`.replace(/\/+$/, '');
    const isActive = pathname === fullHref;
    const isExpanded = expanded.includes(item.href);
    const hasSub = !!item.subItems?.length;
    const Icon = item.icon;

    if (hasSub) {
      return (
        <div key={item.href}>
          <button
            onClick={() => toggleExpand(item.href)}
            className={cn(
              'flex items-center justify-between w-full rounded-md px-4 py-3 text-sm transition-colors',
              isActive
                ? 'text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <div className="flex items-center gap-3">
              {Icon && <Icon className="w-5 h-5" />}
              <span>{item.label}</span>
            </div>
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform',
                isExpanded && 'rotate-180'
              )}
            />
          </button>
          {isExpanded && (
            <ul className="pl-12 mt-1 space-y-1">
              {item.subItems!.map((sub) => renderNavItem(sub, fullHref))}
            </ul>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.href}
        onClick={() => {
          router.push(fullHref);
          onOpenChange(false);
        }}
        className={cn(
          'flex items-center w-full rounded-md px-4 py-3 text-sm transition-colors',
          isActive
            ? 'text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        )}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5" />}
          <span>{item.label}</span>
        </div>
      </button>
    );
  };

  if (!currentSectionItems) {
    return null;
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[80vh] bg-white dark:bg-gray-900">
        <DrawerHeader className="border-b bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-lg font-semibold">
              {currentSectionLabel || 'Navigation'}
            </DrawerTitle>
            <DrawerClose asChild>
              <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="h-5 w-5" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="overflow-y-auto p-4 bg-white dark:bg-gray-900">
          <ul className="space-y-1">
            {currentSectionItems.map((item) => renderNavItem(item, currentBaseHref))}
          </ul>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

