'use client'; 
 
// import { Sidebar } from '@/components/layout/Sidebar' // Commented out unused import
import { PageHeader } from '@/components/layout/PageHeader'
// import { PageTitle } from '@/components/layout/PageTitle'
import { NavigationProvider } from '@/contexts/NavigationContext'
import { AccountDataProvider } from '@/contexts/AccountDataContext'
import { ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'

export default function TradeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const accountIdFromQuery = searchParams.get('accountId');
  const accountId = accountIdFromQuery || '1PB10001';

  return (
    <NavigationProvider>
      <AccountDataProvider accountId={accountId}>
        <PageHeader>
          <div>
            {/* No title needed - handled in page content */}
          </div>
        </PageHeader>
        <div className="flex flex-1 min-h-screen pt-0 bg-white dark:bg-black">
          {/* Main content area for trade pages */}
          <main className="flex-1 min-w-0 px-6 py-4">
            {children}
          </main>
        </div>
      </AccountDataProvider>
    </NavigationProvider>
  )
} 