'use client'

import { SearchAndWatchlist } from '@/components/trade/SearchAndWatchlist'

export default function AccountTradePage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-normal font-serif">Trade</h1>
      </div>
      <SearchAndWatchlist showVolumeColumn={false} />
    </div>
  )
} 