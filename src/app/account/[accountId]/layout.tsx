'use client'; 

import { Sidebar } from '@/components/layout/Sidebar'
import { NavigationProvider } from '@/contexts/NavigationContext'
import { AccountDataProvider } from '@/contexts/AccountDataContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { AccountAccessGuard } from '@/components/account/AccountAccessGuard'
import { ReactNode, useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { DynamicPageTitle } from '@/components/layout/DynamicPageTitle'
import { useSidebar } from '@/contexts/SidebarContext'
import { cn } from '@/lib/utils'
import { MobileSidebarDrawer } from '@/components/layout/MobileSidebarDrawer'
import { MobileSidebarProvider } from '@/contexts/MobileSidebarContext'

function AccountLayoutContent({
  children,
  accountId,
  isDropdownOpen,
  setIsDropdownOpen,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
}: {
  children: ReactNode;
  accountId: string;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
}) {
  const { isMinimized } = useSidebar();
  const sidebarWidth = isMinimized ? '60px' : '260px';
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <>
      <DynamicPageTitle
        accountId={accountId}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />
      <div className="flex flex-1 overflow-hidden pt-[54px] h-[calc(100vh-3.5rem-54px)] sm:h-[calc(100vh-4rem-54px)] bg-background">
          <div 
            className={cn(
              "flex flex-col fixed top-[110px] sm:top-[118px] left-0 h-[calc(100vh-110px)] sm:h-[calc(100vh-118px)] flex-shrink-0 z-10 transition-all duration-300",
              "hidden lg:flex"
            )}
            style={{ width: sidebarWidth }}
          >
            <Sidebar />
          </div>
          <main 
            className={cn(
              "flex-1 min-w-0 overflow-y-auto h-full",
              "px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
            )}
            style={{ marginLeft: isLargeScreen ? sidebarWidth : '0px' }}
          >
            {children}
          </main>
      </div>
      <MobileSidebarDrawer 
        isOpen={isMobileSidebarOpen} 
        onOpenChange={setIsMobileSidebarOpen}
      />
    </>
  );
}

export default function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams(); 
  const accountId = params?.accountId as string;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <NavigationProvider>
      <AccountAccessGuard accountId={accountId || 'unknown'}>
        <AccountDataProvider accountId={accountId || 'unknown'}>
          <SidebarProvider>
            <MobileSidebarProvider
              isMobileSidebarOpen={isMobileSidebarOpen}
              setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            >
              <AccountLayoutContent
                accountId={accountId}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                isMobileSidebarOpen={isMobileSidebarOpen}
                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
              >
                {children}
              </AccountLayoutContent>
            </MobileSidebarProvider>
          </SidebarProvider>
        </AccountDataProvider>
      </AccountAccessGuard>
    </NavigationProvider>
  )
}