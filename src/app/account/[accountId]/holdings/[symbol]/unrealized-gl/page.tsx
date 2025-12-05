'use client'

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAccountData } from '@/contexts/AccountDataContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LastUpdated } from '@/components/ui/last-updated'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { ArrowUpRight, Info, SlidersHorizontal, ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react'
import { AccountBreadcrumb } from '@/components/layout/AccountBreadcrumb'

export default function SecurityUnrealizedGLPage() {
  const params = useParams()
  const router = useRouter()
  const { loading, error, refreshData } = useAccountData()
  
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
    <TooltipProvider>
      <div className="w-full">
        <div className="flex flex-col gap-4">
          {/* Breadcrumbs */}
          <AccountBreadcrumb 
            items={[
              { label: 'Holdings', href: `/account/${accountId}` },
              { label: 'Unrealized G/L' }
            ]}
          />

          {/* Security Header and Summary in One Card */}
          <Card className="p-6 bg-card">
            {/* Security Header */}
            <div className="flex items-center justify-between mb-6">
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
                onClick={() => router.push(`/account/${accountId}/trade/${symbol}`)}
              >
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Trade
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Total unrealized G/L</div>
                <div className={`text-sm font-medium ${mockData.totalUnrealizedGL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                  {mockData.totalUnrealizedGL >= 0 ? '+' : '-'}${Math.abs(mockData.totalUnrealizedGL).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className={`text-sm ${mockData.totalUnrealizedGLPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                  ({mockData.totalUnrealizedGLPercent >= 0 ? '+' : ''}{mockData.totalUnrealizedGLPercent.toFixed(2)}%)
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Today&apos;s unrealized G/L</div>
                <div className={`text-sm font-medium ${mockData.todaysGL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                  {mockData.todaysGL >= 0 ? '+' : '-'}${Math.abs(mockData.todaysGL).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className={`text-sm ${mockData.todaysGLPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                  ({mockData.todaysGLPercent >= 0 ? '+' : ''}{mockData.todaysGLPercent.toFixed(2)}%)
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Quantity</div>
                <div className="text-sm font-medium text-foreground">{mockData.totalQuantity.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Avg buy price</div>
                <div className="text-sm font-medium text-foreground">${mockData.avgBuyPrice.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Invested value</div>
                <div className="text-sm font-medium text-foreground">${mockData.totalInvestedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Adj. Invested value</div>
                <div className="text-sm font-medium text-foreground">${mockData.totalInvestedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              </div>
            </div>
            <LastUpdated 
              timestamp="Updated 01/08/2025 8:05 AM ET"
              onRefresh={refreshData}
              className="mt-4"
            />
          </Card>

          {/* Unrealized G/L Details Table */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-normal">Unrealized G/L</h2>
              <Button variant="outline" size="sm" className="text-sm px-4 py-4">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Customize columns
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table className="w-full text-sm min-w-[1400px]">
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead 
                      className="text-left px-6 py-3 whitespace-nowrap border-r w-40 cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-sm">Date</span>
                        {sortColumn === 'date' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-left px-6 py-3 whitespace-nowrap border-r cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('quantity')}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-sm">Quantity</span>
                        {sortColumn === 'quantity' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-left px-6 py-3 whitespace-nowrap border-r cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('totalUnrealizedGL')}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-sm">Total Unrealized G/L</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3 h-3 flex-shrink-0" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Total unrealized gain or loss for this tax lot.</p>
                          </TooltipContent>
                        </Tooltip>
                        {sortColumn === 'totalUnrealizedGL' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-left px-6 py-3 whitespace-nowrap border-r cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('totalUnrealizedGLPercent')}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-sm">Total Unrealized G/L %</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3 h-3 flex-shrink-0" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Percentage gain or loss for this tax lot.</p>
                          </TooltipContent>
                        </Tooltip>
                        {sortColumn === 'totalUnrealizedGLPercent' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-left px-6 py-3 whitespace-nowrap border-r cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('avgBuyPrice')}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-sm">Buy price</span>
                        {sortColumn === 'avgBuyPrice' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-left px-6 py-3 whitespace-nowrap border-r cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('investedValue')}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-sm">Invested value</span>
                        {sortColumn === 'investedValue' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-left px-6 py-3 whitespace-nowrap border-r cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('adjInvestedValue')}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-sm">Adj. Invested value</span>
                        {sortColumn === 'adjInvestedValue' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-left px-6 py-3 whitespace-nowrap border-r cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('ltp')}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-sm">LTP</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3 h-3 flex-shrink-0" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Last traded price.</p>
                          </TooltipContent>
                        </Tooltip>
                        {sortColumn === 'ltp' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-left px-6 py-3 whitespace-nowrap cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('marketValue')}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-sm">Market value</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3 h-3 flex-shrink-0" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Current market value of this tax lot.</p>
                          </TooltipContent>
                        </Tooltip>
                        {sortColumn === 'marketValue' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((row, index) => (
                    <TableRow key={row.id} className={`border-b ${index % 2 === 1 ? 'bg-card' : ''}`}>
                      <TableCell className="px-6 py-3 text-foreground bg-card w-40">{row.date}</TableCell>
                      <TableCell className="px-6 py-3 text-foreground bg-card">{row.quantity.toLocaleString()}</TableCell>
                      <TableCell className={`px-6 py-3 font-medium bg-card ${row.totalUnrealizedGL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                        {row.totalUnrealizedGL >= 0 ? '+' : '-'}${Math.abs(row.totalUnrealizedGL).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className={`px-6 py-3 font-medium bg-card ${row.totalUnrealizedGLPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                        {row.totalUnrealizedGLPercent >= 0 ? '+' : ''}{row.totalUnrealizedGLPercent.toFixed(2)}%
                      </TableCell>
                      <TableCell className="px-6 py-3 text-foreground bg-card">${row.avgBuyPrice.toFixed(2)}</TableCell>
                      <TableCell className="px-6 py-3 text-foreground bg-card">${row.investedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="px-6 py-3 text-foreground bg-card">${row.adjInvestedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="px-6 py-3 text-muted-foreground bg-card">${row.ltp.toFixed(2)}</TableCell>
                      <TableCell className="px-6 py-3 text-foreground bg-card">${row.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
