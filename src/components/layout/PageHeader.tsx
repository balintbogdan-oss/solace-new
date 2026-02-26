'use client'; // Required for hooks like useState, useEffect, useRef

import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { PageHeaderProvider } from '@/contexts/PageHeaderContext'; // Import the provider

interface PageHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function PageHeader({ 
  children, 
  className 
}: PageHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  // Effect to handle scroll and update sticky state
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        // Check if scrolled past the top of the header (or slightly below)
        // Using 0 might trigger too early, use a small threshold if needed
        setIsSticky(window.scrollY > 0); 
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check in case the page loads already scrolled
    handleScroll(); 

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    // Provide the context value
    <PageHeaderProvider value={{ isSticky }}>
      <div 
        ref={headerRef}
        className={cn(
          "sticky transition-all duration-200 ease-in-out px-3 ", 
          // Apply different background based on sticky? Optional.
          isSticky ? '' : '', 
          className
        )}
      >
        {/* Main content area (Title + Actions passed as children) */}
        <div className={cn(
            "flex items-center justify-between transition-all duration-200 ease-in-out  ",
             // Conditionally change padding
             isSticky ? 'py-1' : 'py-1' 
           )}>
          <div className="w-full">{children}</div> {/* Render children (PageTitle + potentially other actions) */}
        </div>
      </div>
    </PageHeaderProvider>
  );
}

// Duplicate of PageHeader as FullSizePageHeader
export function FullSizePageHeader({ 
  children, 
  className 
}: PageHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        setIsSticky(window.scrollY > 0); 
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <PageHeaderProvider value={{ isSticky }}>
      <div 
        ref={headerRef}
        className={cn(
          "sticky top-14 z-10 transition-all duration-200 ease-in-out border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80",
          isSticky ? "shadow-sm" : "",
          className
        )}
      >
        <div className={cn(
          "mx-auto w-full ",
          isSticky ? "" : ""
        )}>
          {children}
        </div>
      </div>
    </PageHeaderProvider>
  );
} 