'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { SearchModal } from '@/components/trade/SearchModal'
import { WatchlistTable } from '@/components/trade/SearchAndWatchlist'
import { cn } from '@/lib/utils'

export default function GlobalTradePage() {
  const router = useRouter();

  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleSymbolSelect = (symbol: string) => {
    setShowSearchModal(false);
    router.push(`/trade/${symbol}`);
  };

  return (
    <div className="w-full bg-white dark:bg-black">
      <div className="flex flex-col gap-7">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2">
            <h1 className="text-3xl font-medium font-serif text-slate-900 dark:text-slate-100">Trade</h1>
          </div>
        </div>

        {/* Changed grid definition for fixed left col, flexible right col */}
        <div className="grid grid-cols-1 lg:grid-cols-[370px_1fr] gap-2">
        
        
        {/* L Column: Watchlist Section - Removed lg:col-span-1 */}
        <div className="p-4 rounded-lg border bg-card-blend dark:bg-card-blend-dark">
             <WatchlistTable 
                showVolumeColumn={false} 
                showPriceColumn={false}
             />
          </div>

        
         {/* R Column: Search Trigger - Removed lg:col-span-4 */}
          <div className="space-y-3 bg-card-blend dark:bg-card-blend-dark p-6 rounded-md border">
            <h2 className="text-xl font-semibold">Trade securities</h2>
            <p className="text-muted-foreground text-sm">
              Search for stocks, options, or funds you want to trade or research.
            </p>
            {/* Large Search Input Trigger */}
            <div
              onClick={() => setShowSearchModal(true)}
              className={cn(
                "flex items-center max-w-2xl cursor-pointer rounded-md border  bg-input dark:bg-card-blend-dark border border-input px-4 py-3 text-sm",
                "ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                "hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowSearchModal(true); }}
            >
              <Search className="h-4 w-4 mr-3 text-muted-foreground" />
              <span className="text-muted-foreground">
                Search stocks, options, funds by symbol or name...
              </span>
            </div>
             {/* TODO: Add Recent Orders table here if desired */}
          </div>
          
        </div>
      </div>

      {/* Modals */}
      <SearchModal
        isOpen={showSearchModal}
        onOpenChange={setShowSearchModal}
        onSelectSymbol={handleSymbolSelect}
      />
    </div>
  );
} 