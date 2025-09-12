'use client'

import { PageTitle } from "@/components/layout/PageTitle";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import { NavigationProvider } from '@/contexts/NavigationContext';
import { SidebarProvider } from '@/contexts/SidebarContext';

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segment = useSelectedLayoutSegment();

  // Only skip the layout for client-specific routes
  if (segment && !pathname?.includes('/account-opening')) {
    return <>{children}</>;
  }

  const isAccountOpening = pathname?.includes('/account-opening');
  const pageHeadingTitle = isAccountOpening ? "Account Opening" : "Clients";

  return (
    <NavigationProvider>
      <SidebarProvider>
        <div className="flex-1 flex flex-col">
         
          <div className="flex flex-1 min-h-screen pt-0">
            <div className="pt-4 bg-white dark:bg-black sticky border-r top-12 h-[calc(100vh-theme(spacing.20))] w-[260px] flex-shrink-0">
              <PageHeader>
                <PageTitle 
                  title={pageHeadingTitle} 
                  clientId={undefined}
                  clientName={undefined}
                  clientAccounts={[]}
                />
              </PageHeader>
              <Sidebar />
            </div>
            <main className="flex-1 min-w-0 px-6 py-4 rounded-md">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </NavigationProvider>
  );
}