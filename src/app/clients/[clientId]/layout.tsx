'use client';

import { Sidebar } from "@/components/layout/Sidebar";
import { NavigationProvider } from '@/contexts/NavigationContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { ReactNode, useState } from 'react';
import { useParams } from 'next/navigation';
import { FullSizePageHeader } from '@/components/layout/PageHeader';
import { FullSizePageTitle } from '@/components/layout/PageTitle';
import { useSidebar } from '@/contexts/SidebarContext';
import { ClientDataProvider, useClientData } from '@/contexts/ClientDataContext';

function ClientDetailContent({
  children,
  clientId,
}: {
  children: ReactNode;
  clientId: string;
}) {
  const { isMinimized } = useSidebar();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data } = useClientData();

  return (
    <div className="flex-1 flex flex-col">
      <FullSizePageHeader>
        <div className="flex flex-col gap-2">
          <FullSizePageTitle
            title={data?.client ? `${data.client.firstName} ${data.client.lastName}` : 'Loading...'}
            clientId={clientId}
            clientName={data?.client ? `${data.client.firstName} ${data.client.lastName}` : 'Loading...'}
            clientAccounts={data?.accounts?.map(acc => ({
              id: acc.accountId,
              name: acc.accountName,
              type: acc.accountType,
              investedValue: acc.balances?.investedValue?.toString() || '0',
              marketValue: acc.balances?.totalValue?.toString() || '0',
              fdicSweep: '0',
              availableMargin: acc.balances?.buyingPower?.toString() || '0'
            })) || []}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />
        </div>
      </FullSizePageHeader>
      <div className="flex flex-1 bg-background min-h-screen pt-0">
        <div className={`flex flex-col sticky top-12 h-[calc(100vh-theme(spacing.20))] transition-all duration-300 ${
          isMinimized ? 'w-16' : 'w-[260px]'
        } flex-shrink-0 pt-2`}>
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

  if (!clientId) {
    return <>{children}</>;
  }

  return (
    <ClientDataProvider clientId={clientId}>
      <NavigationProvider>
        <SidebarProvider defaultMinimized={false}>
          <ClientDetailContent clientId={clientId}>
            {children}
          </ClientDetailContent>
        </SidebarProvider>
      </NavigationProvider>
    </ClientDataProvider>
  );
}