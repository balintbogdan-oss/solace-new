'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Download,
  Info,
  ChevronsUpDown,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
} from 'lucide-react';
import { LastUpdated } from '@/components/ui/last-updated';
import { useAccountData } from '@/contexts/AccountDataContext';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
// Import kept solely for type reference in comments; avoid unused var error
// import type { UnrealizedPosition } from '@/types/account';

export default function UnrealizedGLPage() {
  const { data: accountData, loading, error, refreshData } = useAccountData();
  const [searchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('2025');
  
  // State for sorting
  type SortableUnrealizedKeys = 'lastUpdated' | 'quantity' | 'symbol' | 'description' | 'longShort' | 'unrealizedGL' | 'unrealizedGLPercent' | 'avgPrice' | 'investedValue' | 'currentPrice' | 'marketValue';
  const [sortColumn, setSortColumn] = useState<SortableUnrealizedKeys | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Hardcoded unrealized positions data matching the image
  const processedPositions = useMemo(() => {
    return [
      {
        id: 'position-1',
        symbol: 'AAPL',
        cusip: '037833100',
        description: 'Apple Inc. - T...',
        quantity: 1100,
        avgPrice: 156.32,
        currentPrice: 340.93,
        marketValue: 375023.00,
        unrealizedGL: 203071.00,
        unrealizedGLPercent: 118.13,
        longShort: 'Long' as const,
        lastUpdated: '2023-12-15',
        investedValue: 171952.00
      },
      {
        id: 'position-2',
        symbol: 'MSFT',
        cusip: '037833102',
        description: 'Amazon.com...',
        quantity: 850,
        avgPrice: 285.40,
        currentPrice: 340.93,
        marketValue: 289790.50,
        unrealizedGL: 47230.50,
        unrealizedGLPercent: 19.46,
        longShort: 'Long' as const,
        lastUpdated: '2023-11-22',
        investedValue: 242560.00
      },
      {
        id: 'position-3',
        symbol: 'GOOGL',
        cusip: '02079K305',
        description: 'Vanguard To...',
        quantity: 320,
        avgPrice: 95.25,
        currentPrice: 340.93,
        marketValue: 109097.60,
        unrealizedGL: 78617.60,
        unrealizedGLPercent: 257.89,
        longShort: 'Long' as const,
        lastUpdated: '2023-10-08',
        investedValue: 30480.00
      },
      {
        id: 'position-4',
        symbol: 'NVDA',
        cusip: '67066G104',
        description: 'NVIDIA Corp...',
        quantity: 180,
        avgPrice: 320.15,
        currentPrice: 340.93,
        marketValue: 61367.40,
        unrealizedGL: 3737.40,
        unrealizedGLPercent: 6.48,
        longShort: 'Long' as const,
        lastUpdated: '2023-09-15',
        investedValue: 57627.00
      },
      {
        id: 'position-5',
        symbol: 'TSLA',
        cusip: '037833100',
        description: 'Vanguard To...',
        quantity: 185,
        avgPrice: 340.93,
        currentPrice: 340.93,
        marketValue: 63072.05,
        unrealizedGL: -43294.00,
        unrealizedGLPercent: -72.46,
        longShort: 'Short' as const,
        lastUpdated: '2023-08-30',
        investedValue: 28919.20
      }
    ];
  }, []);

  // Handle Sorting
  const handleSort = (column: SortableUnrealizedKeys) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filtering and Sorting Logic
  const filteredPositions = processedPositions
    .filter(position =>
      position.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.cusip.includes(searchTerm) ||
      position.description.toLowerCase().includes(searchTerm.toLowerCase())
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
      investedValue: 143100.53,
      portfolioMarketValue: 151556.05,
      unrealizedLongTerm: 6764.41,
      unrealizedShortTerm: 1691.10,
      totalUnrealizedGL: 8455.51,
      totalUnrealizedGLPercent: 5.91
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
                  {i === 5 && <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>}
                </div>
              ))}
            </div>
            <div className="h-4 w-48 bg-muted rounded animate-pulse mt-4"></div>
          </Card>

          {/* All Tax Lots Section Skeleton */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
              <div className="h-10 w-40 bg-muted rounded animate-pulse"></div>
            </div>

            {/* Table Skeleton */}
            <div className="overflow-x-auto">
              <div className="w-full min-w-[1600px]">
                {/* Table Header Skeleton */}
                <div className="flex border-b mb-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                    <div key={i} className="flex-1 px-6 py-3">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
                {/* Table Rows Skeleton */}
                {[1, 2, 3, 4, 5].map((row) => (
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
        Error loading unrealized G/L data: {error || 'No data available'}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="w-full">
        <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium text-slate-900 dark:text-slate-100" style={{ fontFamily: 'var(--font-display)' }}>Unrealized G/L</h1>
          <div className="flex gap-2">
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-20 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-9">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Section */}
        <Card className="p-6 bg-card">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Invested value</div>
              <h3 className="text-xl font-medium" style={{ fontFamily: 'var(--font-display)' }}>${summaryData.investedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Portfolio market value</div>
              <h3 className="text-xl font-medium" style={{ fontFamily: 'var(--font-display)' }}>${summaryData.portfolioMarketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Unrealized long term G/L</div>
              <h3 className={`text-xl font-medium ${summaryData.unrealizedLongTerm >= 0 ? 'text-[hsl(var(--positive))]' : 'text-[hsl(var(--negative))]'}`} style={{ fontFamily: 'var(--font-display)' }}>
                {summaryData.unrealizedLongTerm >= 0 ? '+' : '-'}${Math.abs(summaryData.unrealizedLongTerm).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Unrealized short term G/L</div>
              <h3 className="text-xl font-medium text-red-500" style={{ fontFamily: 'var(--font-display)' }}>
                {summaryData.unrealizedShortTerm >= 0 ? '+' : '-'}${Math.abs(summaryData.unrealizedShortTerm).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Total unrealized G/L</div>
              <h3 className={`text-xl font-medium ${summaryData.totalUnrealizedGL >= 0 ? 'text-[hsl(var(--positive))]' : 'text-[hsl(var(--negative))]'}`} style={{ fontFamily: 'var(--font-display)' }}>
                {summaryData.totalUnrealizedGL >= 0 ? '+' : '-'}${Math.abs(summaryData.totalUnrealizedGL).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
              <div className={`text-sm ${summaryData.totalUnrealizedGL >= 0 ? 'text-[hsl(var(--positive))]' : 'text-[hsl(var(--negative))]'}`}>
                {summaryData.totalUnrealizedGL >= 0 ? '+' : ''}{summaryData.totalUnrealizedGLPercent.toFixed(2)}%
              </div>
            </div>
          </div>
          <LastUpdated 
            timestamp={`Updated ${new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} ET`}
            onRefresh={refreshData}
            className="mt-4"
          />
        </Card>

        {/* All Tax Lots Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-normal">All tax lots</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-sm px-4 py-4">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Customize columns
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1600px]">
              <thead>
                <tr className="border-b">
                  <th className={`text-left px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r bg-muted ${sortColumn === 'lastUpdated' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center gap-1 w-full" onClick={() => handleSort('lastUpdated')}>
                      <span className="text-xs">Date</span>
                      {sortColumn === 'lastUpdated' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r bg-muted ${sortColumn === 'quantity' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-end gap-1 w-full" onClick={() => handleSort('quantity')}>
                      <span className="text-xs">Quantity</span>
                      {sortColumn === 'quantity' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-left px-6 py-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/50 border-r max-w-[200px] bg-muted ${sortColumn === 'symbol' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center gap-1 w-full" onClick={() => handleSort('symbol')}>
                      <span className="text-xs">Symbol/CUSIP</span>
                      {sortColumn === 'symbol' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-left px-6 py-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/50 border-r max-w-[200px] bg-muted ${sortColumn === 'description' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center gap-1 w-full" onClick={() => handleSort('description')}>
                      <span className="text-xs">Description</span>
                      {sortColumn === 'description' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-center px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r bg-muted ${sortColumn === 'longShort' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-center gap-1 w-full" onClick={() => handleSort('longShort')}>
                      <span className="text-xs">L/S</span>
                      {sortColumn === 'longShort' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r bg-muted ${sortColumn === 'unrealizedGL' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-end gap-1 w-full" onClick={() => handleSort('unrealizedGL')}>
                      <span className="text-xs">Total Unrealized G/L</span>
                      {sortColumn === 'unrealizedGL' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r bg-muted ${sortColumn === 'unrealizedGLPercent' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-end gap-1 w-full" onClick={() => handleSort('unrealizedGLPercent')}>
                      <span className="text-xs">Total Unrealized G/L %</span>
                      {sortColumn === 'unrealizedGLPercent' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r bg-muted ${sortColumn === 'avgPrice' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-end gap-1 w-full" onClick={() => handleSort('avgPrice')}>
                      <span className="text-xs">Buy Price</span>
                      {sortColumn === 'avgPrice' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r bg-muted ${sortColumn === 'investedValue' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-end gap-1 w-full" onClick={() => handleSort('investedValue')}>
                      <span className="text-xs">Invested Value</span>
                      {sortColumn === 'investedValue' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 border-r bg-muted ${sortColumn === 'currentPrice' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-end gap-1 w-full" onClick={() => handleSort('currentPrice')}>
                      <span className="text-xs">LTP</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3 h-3 flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Values as of the end of the prior business day.</p>
                        </TooltipContent>
                      </Tooltip>
                      {sortColumn === 'currentPrice' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </button>
                  </th>
                  <th className={`text-right px-6 py-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-muted/50 bg-muted ${sortColumn === 'marketValue' ? 'border-b-2 border-b-primary' : ''}`}>
                    <button className="flex items-center justify-end gap-1 w-full" onClick={() => handleSort('marketValue')}>
                      <span className="text-xs">Market Value</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3 h-3 flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Values as of the end of the prior business day.</p>
                        </TooltipContent>
                      </Tooltip>
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
                {filteredPositions.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-8 text-muted-foreground">
                      No unrealized positions found
                    </td>
                  </tr>
                ) : (
                  filteredPositions.map((position, index) => (
                    <tr key={position.id} className={`border-b ${index % 2 === 1 ? 'bg-card' : 'bg-card'}`}>
                      <td className="px-6 py-3 text-foreground bg-card">{new Date(position.lastUpdated).toISOString().split('T')[0]}</td>
                      <td className="px-6 py-3 text-right text-foreground bg-card">{position.quantity.toLocaleString()}</td>
                      <td className="px-6 py-3 bg-card">
                        <div>
                          <div className="font-medium text-foreground">{position.symbol}</div>
                          <div className="text-xs text-muted-foreground">{position.cusip}</div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-foreground max-w-[200px] truncate bg-card">{position.description}</td>
                      <td className="px-6 py-3 text-center text-foreground bg-card">
                        {position.longShort}
                      </td>
                      <td className={`px-6 py-3 text-right font-medium bg-card ${position.unrealizedGL >= 0 ? 'text-positive' : 'text-negative'}`}>
                        {position.unrealizedGL >= 0 ? '+' : '-'}${Math.abs(position.unrealizedGL).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`px-6 py-3 text-right font-medium bg-card ${position.unrealizedGLPercent >= 0 ? 'text-positive' : 'text-negative'}`}>
                        {position.unrealizedGLPercent >= 0 ? '+' : '-'}{Math.abs(position.unrealizedGLPercent).toFixed(2)}%
                      </td>
                      <td className="px-6 py-3 text-right text-foreground bg-card">
                        ${position.avgPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-3 text-right text-foreground bg-card">
                        ${position.investedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-3 text-right text-foreground bg-card">
                        ${position.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-3 text-right text-foreground bg-card">
                        ${position.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
