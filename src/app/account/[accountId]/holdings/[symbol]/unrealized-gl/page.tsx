'use client'

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAccountData } from '@/contexts/AccountDataContext'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, RefreshCcw, Info, SlidersHorizontal, ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react'
import { useSidebar } from '@/contexts/SidebarContext'

export default function SecurityUnrealizedGLPage() {
  const params = useParams()
  const router = useRouter()
  const { loading, error } = useAccountData()
  const { collapseForTrading } = useSidebar()
  
  const accountId = params?.accountId as string
  const symbol = params?.symbol as string

  // State for sorting
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Mock data matching the exact layout from the image
  const mockData = useMemo(() => {
    const currentPrice = 340.93
    const avgBuyPrice = 156.32
    const totalQuantity = 1285
    const totalInvestedValue = 200871.20
    const totalMarketValue = 438100.00
    const totalUnrealizedGL = 83052.80
    const totalUnrealizedGLPercent = 23.41
    const todaysGL = -1562.87
    const todaysGLPercent = -0.28

    // Historical data matching the image
    const historicalData = [
      {
        id: 1,
        date: '12/15/2023',
        quantity: 1100,
        totalUnrealizedGL: 203071.00,
        totalUnrealizedGLPercent: 23.44,
        avgBuyPrice: 156.32,
        investedValue: 171952.00,
        adjInvestedValue: 171952.00,
        ltp: 340.93,
        marketValue: 375023.00
      },
      {
        id: 2,
        date: '11/28/2023',
        quantity: 142,
        totalUnrealizedGL: 26214.62,
        totalUnrealizedGLPercent: 13.21,
        avgBuyPrice: 156.32,
        investedValue: 22197.44,
        adjInvestedValue: 22197.44,
        ltp: 340.93,
        marketValue: 48412.06
      },
      {
        id: 3,
        date: '10/15/2023',
        quantity: 325,
        totalUnrealizedGL: 59998.25,
        totalUnrealizedGLPercent: 32.14,
        avgBuyPrice: 156.32,
        investedValue: 50804.00,
        adjInvestedValue: 50804.00,
        ltp: 340.93,
        marketValue: 110802.25
      },
      {
        id: 4,
        date: '9/22/2023',
        quantity: 275,
        totalUnrealizedGL: 50767.75,
        totalUnrealizedGLPercent: 21.44,
        avgBuyPrice: 156.32,
        investedValue: 42988.00,
        adjInvestedValue: 42988.00,
        ltp: 340.93,
        marketValue: 93755.75
      },
      {
        id: 5,
        date: '8/30/2023',
        quantity: 185,
        totalUnrealizedGL: 34152.85,
        totalUnrealizedGLPercent: 3.99,
        avgBuyPrice: 156.32,
        investedValue: 28919.20,
        adjInvestedValue: 28919.20,
        ltp: 340.93,
        marketValue: 63072.05
      },
      {
        id: 6,
        date: '7/15/2023',
        quantity: 150,
        totalUnrealizedGL: 27691.50,
        totalUnrealizedGLPercent: 2.93,
        avgBuyPrice: 156.32,
        investedValue: 23448.00,
        adjInvestedValue: 23448.00,
        ltp: 340.93,
        marketValue: 51139.50
      }
    ]

    return {
      currentPrice,
      avgBuyPrice,
      totalQuantity,
      totalInvestedValue,
      totalMarketValue,
      totalUnrealizedGL,
      totalUnrealizedGLPercent,
      todaysGL,
      todaysGLPercent,
      historicalData
    }
  }, [])

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // Sort the data
  const sortedData = useMemo(() => {
    if (!sortColumn) return mockData.historicalData

    return [...mockData.historicalData].sort((a, b) => {
      const aValue = a[sortColumn as keyof typeof a]
      const bValue = b[sortColumn as keyof typeof b] 

      let comparison = 0
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue)
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [mockData.historicalData, sortColumn, sortDirection])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading data</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        {/* Breadcrumbs */}
        <div className="text-sm text-muted-foreground">
          Holdings &gt; Unrealized G/L
        </div>

        {/* Security Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-medium text-slate-900 dark:text-slate-100">{symbol}</h1>
              <div className="text-sm text-muted-foreground">Apple Inc. • 037833100</div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="text-3xl text-slate-900 dark:text-slate-100">${mockData.totalMarketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div className="text-sm text-muted-foreground">LTP</div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">Long position</div>
          </div>
          <Button 
            onClick={() => {
              collapseForTrading();
              router.push(`/account/${accountId}/trade/${symbol}`);
            }}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Trade
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="p-6 bg-accent rounded-lg border">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Total G/L</div>
              <div className="text-lg font-medium text-[hsl(var(--positive))]">
                +${mockData.totalUnrealizedGL.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({mockData.totalUnrealizedGLPercent.toFixed(2)}%)
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Today&apos;s G/L</div>
              <div className="text-lg font-medium text-[hsl(var(--negative))]">
                ${mockData.todaysGL.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({mockData.todaysGLPercent.toFixed(2)}%)
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Quantity</div>
              <div className="text-lg font-medium text-foreground">{mockData.totalQuantity.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Avg Buy price</div>
              <div className="text-lg font-medium text-foreground">${mockData.avgBuyPrice.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Invested value</div>
              <div className="text-lg font-medium text-foreground">${mockData.totalInvestedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Adj. Invested value</div>
              <div className="text-lg font-medium text-foreground">${mockData.totalInvestedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
            Updated 09/22/2025 3:35 PM ET
            <button className="p-1.5 rounded-md hover:bg-muted/50 transition">
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Unrealized G/L Details Table */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Unrealized G/L</h2>
            <Button variant="outline" size="sm" className="text-sm px-4 py-4">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Customize columns
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1400px]">
              <thead>
                <tr className="border-b">
                  <th className={`text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r ${sortColumn === 'date' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center gap-1 w-full" onClick={() => handleSort('date')}>
                      <span className="text-xs">Date</span>
                      {sortColumn === 'date' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r ${sortColumn === 'quantity' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-end gap-1 w-full" onClick={() => handleSort('quantity')}>
                      <span className="text-xs">Quantity</span>
                      {sortColumn === 'quantity' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r ${sortColumn === 'totalUnrealizedGL' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-end gap-1 w-full" onClick={() => handleSort('totalUnrealizedGL')}>
                      <span className="text-xs">Total Unrealized G/L</span>
                      <Info className="w-3 h-3 flex-shrink-0" />
                      {sortColumn === 'totalUnrealizedGL' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r ${sortColumn === 'totalUnrealizedGLPercent' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-end gap-1 w-full" onClick={() => handleSort('totalUnrealizedGLPercent')}>
                      <span className="text-xs">Total Unrealized G/L %</span>
                      <Info className="w-3 h-3 flex-shrink-0" />
                      {sortColumn === 'totalUnrealizedGLPercent' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r ${sortColumn === 'avgBuyPrice' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-end gap-1 w-full" onClick={() => handleSort('avgBuyPrice')}>
                      <span className="text-xs">Avg Buy Price</span>
                      {sortColumn === 'avgBuyPrice' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r ${sortColumn === 'investedValue' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-end gap-1 w-full" onClick={() => handleSort('investedValue')}>
                      <span className="text-xs">Invested value</span>
                      {sortColumn === 'investedValue' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r ${sortColumn === 'adjInvestedValue' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-end gap-1 w-full" onClick={() => handleSort('adjInvestedValue')}>
                      <span className="text-xs">Adj. Invested value</span>
                      {sortColumn === 'adjInvestedValue' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r ${sortColumn === 'ltp' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-end gap-1 w-full" onClick={() => handleSort('ltp')}>
                      <span className="text-xs">LTP</span>
                      <Info className="w-3 h-3 flex-shrink-0" />
                      {sortColumn === 'ltp' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 ${sortColumn === 'marketValue' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-end gap-1 w-full" onClick={() => handleSort('marketValue')}>
                      <span className="text-xs">Market value</span>
                      <Info className="w-3 h-3 flex-shrink-0" />
                      {sortColumn === 'marketValue' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, index) => (
                  <tr key={row.id} className={`border-b h-[52px] ${index % 2 === 1 ? 'bg-card' : ''}`}>
                    <td className="px-6 text-foreground align-middle">{row.date}</td>
                    <td className="px-6 text-right text-foreground align-middle">{row.quantity.toLocaleString()}</td>
                    <td className="px-6 text-right font-medium text-[hsl(var(--positive))] align-middle">
                      +${row.totalUnrealizedGL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 text-right font-medium text-[hsl(var(--positive))] align-middle">
                      +{row.totalUnrealizedGLPercent.toFixed(2)}%
                    </td>
                    <td className="px-6 text-right text-foreground align-middle">${row.avgBuyPrice.toFixed(2)}</td>
                    <td className="px-6 text-right text-foreground align-middle">${row.investedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 text-right text-foreground align-middle">${row.adjInvestedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 text-right text-muted-foreground align-middle">${row.ltp.toFixed(2)}</td>
                    <td className="px-6 text-right text-foreground align-middle">${row.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
