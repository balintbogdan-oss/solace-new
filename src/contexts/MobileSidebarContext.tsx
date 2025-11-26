'use client';

import { createContext, useContext, ReactNode } from 'react';

interface MobileSidebarContextType {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
}

const MobileSidebarContext = createContext<MobileSidebarContextType | undefined>(undefined);

export function MobileSidebarProvider({ 
  children,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen
}: { 
  children: ReactNode;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
}) {
  return (
    <MobileSidebarContext.Provider value={{ isMobileSidebarOpen, setIsMobileSidebarOpen }}>
      {children}
    </MobileSidebarContext.Provider>
  );
}

export function useMobileSidebar() {
  const context = useContext(MobileSidebarContext);
  if (context === undefined) {
    // Return a no-op function if not in provider (for pages outside account layout)
    return {
      isMobileSidebarOpen: false,
      setIsMobileSidebarOpen: () => {},
    };
  }
  return context;
}

