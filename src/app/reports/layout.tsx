'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { usePathname } from 'next/navigation'
import { NavigationProvider } from '@/contexts/NavigationContext'
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext'
import { ReactNode } from 'react'
import { FullSizePageHeader } from '@/components/layout/PageHeader'
import { RepOfficeSwitcher } from '@/components/reports/RepOfficeSwitcher'

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

  const segments = pathname?.split('/').filter(Boolean) || [];
  if (segments.length > 1) {
    const reportName = segments[1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    breadcrumbItems.push({ label: reportName, href: `/reports/${segments[1]}` });
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <FullSizePageHeader>
        <div className="flex flex-col gap-2">
          {/* Rep/Office codes switcher */}
          <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <RepOfficeSwitcher />
          </div>
        </div>
      </FullSizePageHeader>
      <div className="flex flex-1 min-h-screen pt-0">
        <div className={`sticky h-[calc(100vh-theme(spacing.20))] flex-shrink-0 transition-all duration-300 pt-2 ${
          isMinimized ? 'w-[60px]' : 'w-[260px]'
        }`}>
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