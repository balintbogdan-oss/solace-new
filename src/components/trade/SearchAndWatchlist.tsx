'use client'

import { useState } from 'react'
import { Search, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SearchModal } from './SearchModal'

// Mock data for watchlist
const WATCHLIST_DATA = [
  { symbol: 'AAPL', cusip: '037833100', name: 'Apple Inc.', price: 380.47, change: 2.54, changePercent: 1.45, volume: 438100.00 },
  { symbol: 'VFIAX', cusip: '037833100', name: 'Vanguard 500 Index Fund', price: 503.56, change: 43.76, changePercent: 9.52, volume: 262695.00 },
  { symbol: 'TSLA', cusip: '037833100', name: 'Tesla Inc.', price: 550.35, change: 2.49, changePercent: 1.45, volume: 81408.80 },
  { symbol: 'META', cusip: '037833100', name: 'Meta Platforms Inc.', price: 350.20, change: 28.32, changePercent: 8.09, volume: 105060.00 },
  { symbol: 'MSFT', cusip: '037833100', name: 'Microsoft Corporation', price: 410.18, change: -2.51, changePercent: -0.61, volume: 175310.00 },
  { symbol: 'AMZN', cusip: '037833100', name: 'Amazon.com Inc.', price: 165.45, change: 7.53, changePercent: 4.55, volume: 132360.00 },
  { symbol: 'GOOGL', cusip: '037833100', name: 'Alphabet Inc.', price: 97.85, change: 0.90, changePercent: 1.45, volume: 146775.00 },
  { symbol: 'JPM', cusip: '037833100', name: 'JPMorgan Chase & Co.', price: 120.00, change: -1.15, changePercent: -0.95, volume: 96000.00 }
]


// Mock order data (Moved here) - Ordered by status priority: Pending, Cancelled/Partially Filled, Filled
const mockOrders = [
  // Pending orders (at top)
  { id: 'ORD-4D5E6F', symbol: 'MSFT', type: 'Sell', quantity: 50, orderType: 'Limit @ $410.00', status: 'Pending', timestamp: '2024-04-26 11:15:45 ET', cost: null, isClosed: false },
  { id: 'ORD-M4N5O6', symbol: 'NVDA', type: 'Sell', quantity: 20, orderType: 'Stop @ $850.00', status: 'Working', timestamp: '2024-04-26 09:45:10 ET', cost: null, isClosed: false },
  { id: 'ORD-9P0Q1R', symbol: 'AMZN', type: 'Buy', quantity: 15, orderType: 'Limit @ $165.00', status: 'Pending', timestamp: '2024-04-26 13:20:30 ET', cost: null, isClosed: false },
  
  // Cancelled/Partially Filled orders (middle)
  { id: 'ORD-J1K2L3', symbol: 'TSLA', type: 'Buy', quantity: 10, orderType: 'Market', status: 'Partially Filled (5/10)', timestamp: '2024-04-26 14:00:00 ET', cost: 900.50, isClosed: false },
  { id: 'ORD-7G8H9I', symbol: 'GOOGL', type: 'Buy', quantity: 25, orderType: 'Market', status: 'Cancelled', timestamp: '2024-04-25 15:05:00 ET', cost: null, isClosed: true },
  
  // Filled orders (at bottom)
  { id: 'ORD-1A2B3C', symbol: 'AAPL', type: 'Buy', quantity: 100, orderType: 'Market', status: 'Filled', timestamp: '2024-04-26 10:30:15 ET', cost: 18845.00, isClosed: true },
  { id: 'ORD-2S3T4U', symbol: 'META', type: 'Sell', quantity: 30, orderType: 'Market', status: 'Filled', timestamp: '2024-04-25 16:45:20 ET', cost: 10506.00, isClosed: true },
  { id: 'ORD-5V6W7X', symbol: 'JPM', type: 'Buy', quantity: 75, orderType: 'Limit @ $120.50', status: 'Filled', timestamp: '2024-04-25 11:30:45 ET', cost: 9037.50, isClosed: true },
];


// Simple search button component that opens the SearchModal
function SearchButton() {
  const [showSearchModal, setShowSearchModal] = useState(false);

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowSearchModal(true)}
          className="w-full p-4 pl-12 rounded-lg border bg-card-blend dark:bg-card-blend-dark focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
        >
          <Search className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 transform -translate-y-1/2" />
          <span className="text-muted-foreground">Search stocks, options, funds by symbol or name...</span>
        </button>
      </div>
      
      <SearchModal
        isOpen={showSearchModal}
        onOpenChange={setShowSearchModal}
        onSelectSymbol={() => {}}
      />
    </>
  );
}

interface WatchlistTableProps {
    showVolumeColumn?: boolean; 
    showPriceColumn?: boolean; // Add prop for price column
}

// The watchlist table component
export function WatchlistTable({ 
    showVolumeColumn = true,
    showPriceColumn = true // Default to true
}: WatchlistTableProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-normal">My Watchlist</h2>
        <Button variant="secondary" size="sm">
          <Edit2 className="w-4 h-4 mr-2" />
          Edit watchlist
        </Button>
      </div>

      <div className="overflow-x-auto font-medium">
        <Table>
          <TableHeader>
            <TableRow className="text-left text-sm border-b ">
              <TableHead className="py-2 pr-4">Symbol/Name</TableHead>
              {showPriceColumn && <TableHead className="py-2 px-4">Price</TableHead>}
              <TableHead className="py-2 px-4">Change</TableHead>
              {showVolumeColumn && <TableHead className="py-2 px-4">Volume</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {WATCHLIST_DATA.map((item) => (
              <TableRow 
                key={item.symbol}
                className="border-b hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer text-sm"
              >
                <TableCell className="py-2 pr-4">
                  <div>{item.symbol}</div>
                  <div className="text-muted-foreground">{item.name}</div>
                </TableCell>
                {showPriceColumn && <TableCell className="py-3 px-4">${item.price.toFixed(2)}</TableCell>}
                <TableCell className="py-3 px-4">
                  <span className={item.change >= 0 ? 'text-lime-600 dark:text-lime-300' : 'text-red-500'}>
                    {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
                  </span>
                </TableCell>
                {showVolumeColumn && <TableCell className="py-3 px-4">${item.volume.toLocaleString()}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Helper function to get status color
function getStatusColor(status: string) {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-500';
    case 'Working':
      return 'bg-blue-500';
    case 'Partially Filled (5/10)':
      return 'bg-orange-500';
    case 'Cancelled':
      return 'bg-red-500';
    case 'Filled':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
}

// OrderTable component (Moved here)
function OrderTable({ orders }: { orders: typeof mockOrders }) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-normal mb-4">Order Status</h2>
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Order Type</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No recent orders.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-accent transition-colors hover:bg-white/10 dark:hover:bg-white/10">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.symbol}</TableCell>
                  <TableCell className={order.type === 'Buy' ? 'text-lime-600 dark:text-lime-300' : 'text-red-500'}>{order.type}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.orderType}</TableCell>
                  <TableCell>{order.timestamp}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`}></div>
                      <span>{order.status}</span>
                    </div>
                  </TableCell> 
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// The main component that combines everything
interface SearchAndWatchlistProps {
  showVolumeColumn?: boolean; // Add prop
  showPriceColumn?: boolean;  // Add prop
}

export function SearchAndWatchlist({ 
  showVolumeColumn = true,  // Use prop
  showPriceColumn = true   // Use prop
}: SearchAndWatchlistProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left section: Search (wrapped in card) */}
        <Card className="md:col-span-2 p-6">
          <span className="text-muted-foreground mb-4 text-sm block">Search for anything you want to trade or research</span>
          <SearchButton />

          {/* Order Table below the search */}
          <OrderTable orders={mockOrders} />
        </Card>

        {/* Right card: Watchlist */}
        <div className="p-6 bg-card rounded-lg border">
          <WatchlistTable 
            showVolumeColumn={showVolumeColumn} // Pass prop down
            showPriceColumn={showPriceColumn}   // Pass prop down
          />
        </div>
      </div>
    </div>
  )
}