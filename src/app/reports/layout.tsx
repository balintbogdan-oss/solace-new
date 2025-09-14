'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { usePathname } from 'next/navigation'
import { NavigationProvider } from '@/contexts/NavigationContext'
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext'
import { ReactNode } from 'react'
import { FullSizePageHeader } from '@/components/layout/PageHeader'
import { FullSizePageTitle } from '@/components/layout/PageTitle'

function ReportsLayoutContent({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isMinimized } = useSidebar();

  const breadcrumbItems = [
    { label: "Reports", href: "/reports" },
  ];

  const pageHeadingTitle = "Reports";
  const segments = pathname?.split('/').filter(Boolean) || [];
  if (segments.length > 1) {
    const reportName = segments[1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    breadcrumbItems.push({ label: reportName, href: `/reports/${segments[1]}` });
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-black">
      <FullSizePageHeader>
        <div className="flex flex-col gap-2">
          <FullSizePageTitle
            title={pageHeadingTitle}
            clientId={undefined}
            clientName={undefined}
            clientAccounts={[]}
            accountId={undefined}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />
        </div>
      </FullSizePageHeader>
      <div className="flex flex-1 min-h-screen pt-0">
        <div className={`py-6 sticky border-r top-12 h-[calc(100vh-theme(spacing.20))] flex-shrink-0 transition-all duration-300 ${
          isMinimized ? 'w-[60px]' : 'w-[260px]'
        }`}>
          <div className="mt-4"></div>
          <Sidebar />
        </div>
        <main className="w-full p-6">
          {children}
        </main>
      </div>
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/15" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}

export default function ReportsLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <NavigationProvider>
      <SidebarProvider>
        <ReportsLayoutContent>
          {children}
        </ReportsLayoutContent>
      </SidebarProvider>
    </NavigationProvider>
  );
}