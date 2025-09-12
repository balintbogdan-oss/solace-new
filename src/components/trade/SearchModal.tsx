'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

// Mock data for recent searches - we can move this to a shared constants file later if needed
const RECENT_SEARCHES = [
  { symbol: 'AAPL', name: 'Apple Inc.', accountId: '1PB10001', price: 132.45, changePercent: 3.46 },
  { symbol: 'VFIAX', name: 'Vanguard 500 Index Fund', accountId: '1PB10001', price: 503.56, changePercent: 11.46 },
  { symbol: 'AMZN', name: 'Amazon', accountId: '1PB10001', price: 167.21, changePercent: -8.02 },
  { symbol: 'MSFT', name: 'Microsoft', accountId: '1PB10001', price: 348.22, changePercent: 8.46 },
  { symbol: 'META', name: 'Meta Platforms, Inc.', accountId: '1PB10001', price: 585.77, changePercent: 8.46 },
  { symbol: 'INTC', name: 'Intel Corporation', accountId: '1PB10001', price: 21.53, changePercent: 2.84 }
]

const WATCHLIST_DATA = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 380.47, change: 2.54, changePercent: 1.45, volume: 438100.00 },
  { symbol: 'VFIAX', name: 'Vanguard 500 Index Fund', price: 503.56, change: 43.76, changePercent: 9.52, volume: 262695.00 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 550.35, change: 2.49, changePercent: 1.45, volume: 81408.80 },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 350.20, change: 28.32, changePercent: 8.09, volume: 105060.00 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 410.18, change: 2.51, changePercent: 1.45, volume: 175310.00 }
]

interface SearchModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSelectSymbol: (symbol: string) => void
}

export function SearchModal({ isOpen, onOpenChange, onSelectSymbol }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'recent' | 'watchlist'>('recent')

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[600px] max-h-[400px] overflow-y-auto p-6 border backdrop-blur-xl bg-white/20 dark:bg-black/20">
        <DialogTitle></DialogTitle>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute  left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search stocks, options, funds by symbol or name..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg  bg-input border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex gap-2 border-b">
            <button
              className={`px-4 py-2 ${activeTab === 'recent' ? 'border-b-2 border-primary font-medium' : ''}`}
              onClick={() => setActiveTab('recent')}
            >
              Recent
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'watchlist' ? 'border-b-2 border-primary font-medium' : ''}`}
              onClick={() => setActiveTab('watchlist')}
            >
              Watchlist
            </button>
          </div>

          <div className="space-y-2">
            {activeTab === 'recent' && RECENT_SEARCHES.map((item) => (
              <div
                key={item.symbol}
                className="flex items-center justify-between p-3 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg cursor-pointer"
                onClick={() => {
                  onSelectSymbol(item.symbol)
                  onOpenChange(false)
                }}
              >
                <div>
                  <div className="font-medium">{item.symbol} • {item.name}</div>
                  <div className="text-sm text-muted-foreground">{item.accountId}</div>
                </div>
                <div className="text-right">
                  <div>${item.price}</div>
                  <div className={item.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {item.changePercent >= 0 ? '+' : ''}{item.changePercent}%
                  </div>
                </div>
              </div>
            ))}

            {activeTab === 'watchlist' && WATCHLIST_DATA.map((item) => (
              <div
                key={item.symbol}
                className="flex items-center justify-between p-3 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg cursor-pointer"
                onClick={() => {
                  onSelectSymbol(item.symbol)
                  onOpenChange(false)
                }}
              >
                <div>
                  <div className="font-medium">{item.symbol} • {item.name}</div>
                  <div className="text-sm text-muted-foreground">Volume: ${item.volume.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div>${item.price.toFixed(2)}</div>
                  <div className={item.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 