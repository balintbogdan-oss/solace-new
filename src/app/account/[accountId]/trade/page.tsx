'use client'

import { useRouter, useParams } from 'next/navigation'
import { SearchAndWatchlist } from '@/components/trade/SearchAndWatchlist'
// Remove Table imports if no longer used directly on this page
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Remove mockOrders - it's now in SearchAndWatchlist
// const mockOrders = [...];

// Remove OrderTable component - it's now in SearchAndWatchlist
// function OrderTable({ orders }: { orders: typeof mockOrders }) { ... }

export default function AccountTradePage() {
  const router = useRouter();
  const params = useParams();
  const accountId = params?.accountId as string;

  const handleSymbolSelect = (symbol: string) => {
    router.push(`/account/${accountId}/trade/${symbol}`); 
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-normal font-serif">Trade</h1>
      </div>
      <SearchAndWatchlist showVolumeColumn={false} onSelectSymbol={handleSymbolSelect} />
      {/* OrderTable is now rendered inside SearchAndWatchlist */}
    </div>
  )
} 