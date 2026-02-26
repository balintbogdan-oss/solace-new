'use client'; 

import { Sidebar } from '@/components/layout/Sidebar'
import { NavigationProvider } from '@/contexts/NavigationContext'
import { AccountDataProvider } from '@/contexts/AccountDataContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { AccountAccessGuard } from '@/components/account/AccountAccessGuard'
import { ReactNode, useState } from 'react'
import { useParams } from 'next/navigation'
import { FullSizePageHeader } from '@/components/layout/PageHeader'
import { DynamicPageTitle } from '@/components/layout/DynamicPageTitle'
import { useSidebar } from '@/contexts/SidebarContext'

function AccountLayoutContent({
  children,
  accountId,
  isDropdownOpen,
  setIsDropdownOpen,
}: {
  children: ReactNode;
  accountId: string;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
}) {
  const { isMinimized } = useSidebar();
  const sidebarWidth = isMinimized ? '60px' : '260px';

  return (
    <>
      <FullSizePageHeader>
        <div className="flex flex-col gap-2">
          <DynamicPageTitle
            accountId={accountId}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />
        </div>
      </FullSizePageHeader>
      <div className="flex flex-1 pt-0 overflow-hidden h-[calc(100vh-3.5rem)] bg-background">
          <div 
            className="flex flex-col fixed top-[120px] left-0 h-[calc(100vh-120px)] flex-shrink-0 z-10 transition-all duration-300 bg-background"
            style={{ width: sidebarWidth }}
          >
            <Sidebar />
          </div>
          <main 
            className="flex-1 min-w-0 px-8 py-8 overflow-y-auto transition-all duration-300"
            style={{ marginLeft: sidebarWidth }}
          >
            {children}
          </main>
      </div>
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/15" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
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

  return (
    <NavigationProvider>
      <AccountAccessGuard accountId={accountId || 'unknown'}>
        <AccountDataProvider accountId={accountId || 'unknown'}>
          <SidebarProvider>
            <AccountLayoutContent
              accountId={accountId}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
            >
              {children}
            </AccountLayoutContent>
          </SidebarProvider>
        </AccountDataProvider>
      </AccountAccessGuard>
    </NavigationProvider>
  )
}