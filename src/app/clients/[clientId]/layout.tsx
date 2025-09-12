'use client';

import { Sidebar } from "@/components/layout/Sidebar";
import { MOCK_CLIENT } from "@/lib/mock-data";
import { NavigationProvider } from '@/contexts/NavigationContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { ReactNode, useState } from 'react';
import { useParams } from 'next/navigation';
import { FullSizePageHeader } from '@/components/layout/PageHeader';
import { FullSizePageTitle } from '@/components/layout/PageTitle';
import { useSidebar } from '@/contexts/SidebarContext';

function ClientDetailContent({
  children,
  clientId,
  clientData,
}: {
  children: ReactNode;
  clientId: string;
  clientData: typeof MOCK_CLIENT;
}) {
  const { isMinimized } = useSidebar();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col">
      <FullSizePageHeader>
        <div className="flex flex-col gap-2">
          <FullSizePageTitle
            title={clientData.name}
            clientId={clientId}
            clientName={clientData.name}
            clientAccounts={clientData.accounts}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />
        </div>
      </FullSizePageHeader>
      <div className="flex flex-1 bg-white dark:bg-black min-h-screen pt-0">
        <div className={`flex flex-col py-6 sticky border-r top-12 h-[calc(100vh-theme(spacing.20))] transition-all duration-300 ${
          isMinimized ? 'w-16' : 'w-[260px]'
        } flex-shrink-0`}>
          <div className="mt-4"></div>
          <Sidebar />
        </div>
        <main className="flex-1 min-w-0 rounded-md">
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

export default function ClientDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams();
  const clientId = params?.clientId as string;
  
  const [clientData, ] = useState(MOCK_CLIENT);

  if (!clientId || !clientData) {
    return <>{children}</>;
  }

  return (
    <NavigationProvider>
      <SidebarProvider defaultMinimized={false}>
        <ClientDetailContent clientId={clientId} clientData={clientData}>
          {children}
        </ClientDetailContent>
      </SidebarProvider>
    </NavigationProvider>
  );
}