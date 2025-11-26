'use client';

import { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { useMobileSidebar } from '@/contexts/MobileSidebarContext';
import { cn } from '@/lib/utils';

interface PageHeadingProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export function PageHeading({ 
  children, 
  className,
  as: Component = 'h1'
}: PageHeadingProps) {
  const { setIsMobileSidebarOpen, isMobileSidebarOpen } = useMobileSidebar();
  const hasMobileSidebar = isMobileSidebarOpen !== false || setIsMobileSidebarOpen.toString() !== '() => {}';

  const baseClasses = "text-2xl font-serif text-foreground";
  const mobileClasses = "text-base md:text-lg font-serif text-foreground";
  
  // If no mobile sidebar context (outside account pages), just render regular heading
  if (!hasMobileSidebar) {
    return (
      <Component className={cn(baseClasses, className)}>
        {children}
      </Component>
    );
  }
  
  return (
    <>
      {/* Mobile: Clickable with chevron */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className={cn("lg:hidden flex items-center gap-2 text-left w-full", className)}
      >
        <Component className={mobileClasses}>{children}</Component>
        <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
      </button>
      
      {/* Desktop: Regular heading */}
      <Component className={cn("hidden lg:block", baseClasses, className)}>
        {children}
      </Component>
    </>
  );
}

