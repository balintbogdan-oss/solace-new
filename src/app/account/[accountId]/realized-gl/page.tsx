'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Download,
  Info,
  ChevronsUpDown,
  ArrowUp,
  ArrowDown,
  Maximize,
  SlidersHorizontal,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LastUpdated } from '@/components/ui/last-updated';
import { useAccountData } from '@/contexts/AccountDataContext';
import { RealizedTrade } from '@/types/account';

// Local extension type to support additional display-only fields used by this page
type RealizedTradeExt = RealizedTrade & { adjInvestedValue: number };

export default function RealizedGLPage() {
  const { data: accountData, loading, error, refreshData } = useAccountData();
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('2025');
  
  // State for sorting
  const [sortColumn, setSortColumn] = useState<keyof RealizedTradeExt | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Hardcoded positive realized trades data matching the image
  const processedTrades = useMemo<RealizedTradeExt[]>(() => {
    return [
      {
        id: 'realized-1',
        symbol: 'AAPL',
        cusip: '037833100',
        description: 'Apple Inc. - T...',
        openDate: '2025-01-01',
        closeDate: '2023-01-15',
        quantity: 100,
        avgBuyPrice: 150.25,
        sellPrice: 187.50,
        adjInvestedValue: 150.25,
        investedValue: 15025.00,
        totalSellValue: 18750.00,
        realizedGL: 3725.00,
        realizedGLPercent: 24.79,
        longShort: 'Long'
      },
      {
        id: 'realized-2',
        symbol: 'MSFT',
        cusip: '037833102',
        description: 'Amazon.com...',
        openDate: '2025-01-01',
        closeDate: '2024-01-15',
        quantity: 75,
        avgBuyPrice: 220.75,
        sellPrice: 260.00,
        adjInvestedValue: 220.75,
        investedValue: 16556.25,
        totalSellValue: 19500.00,
        realizedGL: 2943.75,
        realizedGLPercent: 17.78,
        longShort: 'Long'
      },
      {
        id: 'realized-3',
        symbol: 'TSLA',
        cusip: '037833100',
        description: 'Vanguard To...',
        openDate: '2025-01-01',
        closeDate: '2024-02-01',
        quantity: 50,
        avgBuyPrice: 180.50,
        sellPrice: 225.00,
        adjInvestedValue: 180.50,
        investedValue: 9025.00,
        totalSellValue: 11250.00,
        realizedGL: 2225.00,
        realizedGLPercent: 24.66,
        longShort: 'Long'
      }
    ];
  }, []);

  // Handle Sorting
  const handleSort = (column: keyof RealizedTradeExt) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filtering and Sorting Logic
  const filteredTrades = processedTrades
    .filter(trade =>
      trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.cusip.includes(searchTerm) ||
      trade.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortColumn) return 0;
      
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      let comparison = 0;
      
      // Handle different data types
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // Hardcoded positive summary data
  const summaryData = useMemo(() => {
    return {
      totalRealizedGL: 12450.75,
      realizedLongTerm: 9960.60,
      realizedShortTerm: 2490.15,
      investedValue: 87500.25,
      totalSellValue: 99950.00,
      totalGLPercent: 14.23
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex flex-col gap-4">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-8 w-40 bg-muted rounded animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-9 w-20 bg-muted rounded animate-pulse"></div>
              <div className="h-9 w-24 bg-muted rounded animate-pulse"></div>
            </div>
          </div>

          {/* Summary Card Skeleton */}
          <Card className="p-6 bg-card">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                  <div className="h-7 w-40 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="h-4 w-48 bg-muted rounded animate-pulse mt-4"></div>
          </Card>

          {/* Closed Trades Card Skeleton */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-40 bg-muted rounded animate-pulse"></div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="h-10 w-64 bg-muted rounded animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
                <div className="h-10 w-40 bg-muted rounded animate-pulse"></div>
              </div>
            </div>

            {/* Table Skeleton */}
            <div className="overflow-x-auto">
              <div className="w-full min-w-[1500px]">
                {/* Table Header Skeleton */}
                <div className="flex border-b mb-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                    <div key={i} className="flex-1 px-6 py-3">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
                {/* Table Rows Skeleton */}
                {[1, 2, 3].map((row) => (
                  <div key={row} className="flex border-b py-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((col) => (
                      <div key={col} className="flex-1 px-6">
                        <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !accountData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading realized G/L data: {error || 'No data available'}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="w-full">
        <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium text-slate-900 dark:text-slate-100" style={{ fontFamily: 'var(--font-display)' }}>Realized G/L</h1>
          <div className="flex gap-2">
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-20 h-9 bg-white dark:bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-9 bg-white dark:bg-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Section */}
        <Card className="p-6 bg-card">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Total realized G/L</div>
              <h3 className={`text-xl font-medium ${summaryData.totalRealizedGL >= 0 ? 'text-[hsl(var(--positive))]' : 'text-[hsl(var(--negative))]'}`} style={{ fontFamily: 'var(--font-display)' }}>
                {summaryData.totalRealizedGL >= 0 ? '+' : '-'}${Math.abs(summaryData.totalRealizedGL).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
              <div className={`text-sm ${summaryData.totalRealizedGL >= 0 ? 'text-[hsl(var(--positive))]' : 'text-[hsl(var(--negative))]'}`}>
                {summaryData.totalRealizedGL >= 0 ? '+' : ''}{summaryData.totalGLPercent.toFixed(2)}%
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Realized long term G/L</div>
              <h3 className={`text-xl font-medium ${summaryData.realizedLongTerm >= 0 ? 'text-[hsl(var(--positive))]' : 'text-[hsl(var(--negative))]'}`} style={{ fontFamily: 'var(--font-display)' }}>
                {summaryData.realizedLongTerm >= 0 ? '+' : '-'}${Math.abs(summaryData.realizedLongTerm).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Realized short term G/L</div>
              <h3 className={`text-xl font-medium ${summaryData.realizedShortTerm >= 0 ? 'text-[hsl(var(--positive))]' : 'text-[hsl(var(--negative))]'}`} style={{ fontFamily: 'var(--font-display)' }}>
                {summaryData.realizedShortTerm >= 0 ? '+' : '-'}${Math.abs(summaryData.realizedShortTerm).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Invested value</div>
              <h3 className="text-xl font-medium" style={{ fontFamily: 'var(--font-display)' }}>${summaryData.investedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Total sell value</div>
              <h3 className="text-xl font-medium" style={{ fontFamily: 'var(--font-display)' }}>${summaryData.totalSellValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
          <LastUpdated 
            timestamp="Updated 01/15/25 2:30 PM ET"
            onRefresh={refreshData}
            className="mt-4"
          />
        </Card>

        {/* Closed Trades Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-sans font-medium">Closed trades</h2>
            <div className="text-xs text-muted-foreground">
              Updated {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} ET
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by Symbol or CUSIP"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 border"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-sm px-4 py-4 bg-white dark:bg-white">
                <Maximize className="w-4 h-4 mr-2" />
                Expand
              </Button>
              <Button variant="outline" size="sm" className="text-sm px-4 py-4 bg-white dark:bg-white">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Customize columns
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1500px]">
              <thead>
                <tr className="border-b">
                  <th className={`text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r ${sortColumn === 'symbol' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center gap-1 w-full" onClick={() => handleSort('symbol')}>
                      <span className="text-xs">Symbol/CUSIP</span>
                      {sortColumn === 'symbol' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-left px-6 py-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/50 border-r max-w-[200px] ${sortColumn === 'description' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center gap-1 w-full" onClick={() => handleSort('description')}>
                      <span className="text-xs">Description</span>
                      {sortColumn === 'description' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r ${sortColumn === 'openDate' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center gap-1 w-full" onClick={() => handleSort('openDate')}>
                      <span className="text-xs">Open date</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3 h-3 flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>If you have multiple tax lots, Open date represents the first purchased date.</p>
                        </TooltipContent>
                      </Tooltip>
                      {sortColumn === 'openDate' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r ${sortColumn === 'closeDate' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center gap-1 w-full" onClick={() => handleSort('closeDate')}>
                      <span className="text-xs">Close date</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3 h-3 flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>If you have multiple tax lots, Close date represents the last closed date.</p>
                        </TooltipContent>
                      </Tooltip>
                      {sortColumn === 'closeDate' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r ${sortColumn === 'realizedGL' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-end gap-1 w-full" onClick={() => handleSort('realizedGL')}>
                      <span className="text-xs">Total realized G/L</span>
                      {sortColumn === 'realizedGL' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r ${sortColumn === 'realizedGLPercent' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-end gap-1 w-full" onClick={() => handleSort('realizedGLPercent')}>
                      <span className="text-xs">Total realized G/L %</span>
                      {sortColumn === 'realizedGLPercent' ? (
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
                  <th className={`text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r ${sortColumn === 'adjInvestedValue' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-end gap-1 w-full" onClick={() => handleSort('adjInvestedValue')}>
                      <span className="text-xs">Adj. Invested Value</span>
                      {sortColumn === 'adjInvestedValue' ? (
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
                  <th className={`text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 ${sortColumn === 'totalSellValue' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-end gap-1 w-full" onClick={() => handleSort('totalSellValue')}>
                      <span className="text-xs">Total sell value</span>
                      {sortColumn === 'totalSellValue' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-8 text-muted-foreground">
                      No realized trades found
                    </td>
                  </tr>
                ) : (
                  filteredTrades.map((trade, index) => (
                    <tr key={trade.id} className={`border-b ${index % 2 === 1 ? 'bg-card' : ''}`}>
                      <td className="px-6 py-3">
                        <div>
                          <div className="font-medium text-foreground">{trade.symbol}</div>
                          <div className="text-xs text-muted-foreground">{trade.cusip}</div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-foreground max-w-[200px] truncate">{trade.description}</td>
                      <td className="px-6 py-3 text-foreground">{trade.openDate}</td>
                      <td className="px-6 py-3 text-foreground">{trade.closeDate}</td>
                      <td className={`px-6 py-3 text-right font-medium ${trade.realizedGL >= 0 ? 'text-[hsl(var(--positive))]' : 'text-[hsl(var(--negative))]'}`}>
                        {trade.realizedGL >= 0 ? '+' : '-'}${Math.abs(trade.realizedGL).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`px-6 py-3 text-right font-medium ${trade.realizedGLPercent >= 0 ? 'text-[hsl(var(--positive))]' : 'text-[hsl(var(--negative))]'}`}>
                        {trade.realizedGLPercent >= 0 ? '+' : '-'}{Math.abs(trade.realizedGLPercent).toFixed(2)}%
                      </td>
                      <td className="px-6 py-3 text-right text-foreground">
                        ${trade.avgBuyPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-3 text-right text-foreground">
                        ${trade.adjInvestedValue.toFixed(2)}
                      </td>
                      <td className="px-6 py-3 text-right text-foreground">
                        {trade.quantity}
                      </td>
                      <td className="px-6 py-3 text-right text-foreground">
                        ${trade.investedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-3 text-right text-foreground">
                        ${trade.totalSellValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
