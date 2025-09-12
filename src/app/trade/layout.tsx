'use client'; 

// import { Sidebar } from '@/components/layout/Sidebar' // Commented out unused import
import { PageHeader } from '@/components/layout/PageHeader'
import { PageTitle } from '@/components/layout/PageTitle'
import { NavigationProvider } from '@/contexts/NavigationContext'
import { SupabaseAccountDataProvider } from '@/contexts/SupabaseAccountDataContext'
import { ReactNode } from 'react'

export default function TradeLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Removed unused breadcrumbItems variable
  /*
  const breadcrumbItems = [
    { label: "Trade", href: "/trade" }
  ];
  */

  return (
    <NavigationProvider>
      <SupabaseAccountDataProvider accountId="1PB10001">
        <PageHeader>
          {/* Static title for the main trade page */}
          <PageTitle title="Trade" />
        </PageHeader>
        <div className="flex flex-1 min-h-screen pt-0">
       
            {/* Main content area for trade pages */}
            <main className="flex-1 min-w-0 px-6 py-4">
              {children}
            </main>
        </div>
      </SupabaseAccountDataProvider>
    </NavigationProvider>
  )
} 