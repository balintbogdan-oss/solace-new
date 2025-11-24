'use client'

import { SearchAndWatchlist } from '@/components/trade/SearchAndWatchlist'
// Remove Table imports if no longer used directly on this page
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Remove mockOrders - it's now in SearchAndWatchlist
// const mockOrders = [...];

// Remove OrderTable component - it's now in SearchAndWatchlist
// function OrderTable({ orders }: { orders: typeof mockOrders }) { ... }

export default function AccountTradePage() {


  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-normal font-serif">Trade</h1>
      </div>
      <SearchAndWatchlist showVolumeColumn={false} />
      {/* OrderTable is now rendered inside SearchAndWatchlist */}
    </div>
  )
} 