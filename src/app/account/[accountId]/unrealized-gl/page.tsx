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
import { PageHeading } from '@/components/layout/PageHeading';
import { TableCell } from '@/components/ui/table';
// Import kept solely for type reference in comments; avoid unused var error
// import type { UnrealizedPosition } from '@/types/account';

export default function UnrealizedGLPage() {
  const { refreshData } = useAccountData(); // Only need refreshData for LastUpdated component
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

  // This page uses hardcoded data, so we don't need to wait for account data
  // Only show error if there's a critical error (but we don't check for it since we use hardcoded data)

  return (
    <TooltipProvider>
      <div className="w-full">
        <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-auto">
            <PageHeading className="text-slate-900 dark:text-slate-100">Unrealized G/L</PageHeading>
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Invested value</div>
              <h3>${summaryData.investedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Portfolio market value</div>
              <h3>${summaryData.portfolioMarketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Unrealized long term G/L</div>
              <h3>
                {summaryData.unrealizedLongTerm >= 0 ? '+' : '-'}${Math.abs(summaryData.unrealizedLongTerm).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Unrealized short term G/L</div>
              <h3>
                {summaryData.unrealizedShortTerm >= 0 ? '+' : '-'}${Math.abs(summaryData.unrealizedShortTerm).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Total unrealized G/L</div>
              <h3>
                {summaryData.totalUnrealizedGL >= 0 ? '+' : '-'}${Math.abs(summaryData.totalUnrealizedGL).toLocaleString('en-US', { minimumFractionDigits: 2 })} ({summaryData.totalUnrealizedGL >= 0 ? '+' : ''}{summaryData.totalUnrealizedGLPercent.toFixed(2)}%)
              </h3>
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
          <div className="overflow-x-auto bg-card rounded-md shadow-sm">
            <table className="w-full text-sm text-left border-separate border-spacing-0 rounded-md min-w-[1600px]">
              <thead className="sticky top-0 border-t border-b bg-muted text-muted-foreground z-10">
                <tr>
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-left w-40">
                    <button className="flex items-center gap-1 w-full font-medium" onClick={() => handleSort('lastUpdated')}>
                      <span>Date</span>
                      {sortColumn === 'lastUpdated' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 flex-shrink-0" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-right">
                    <button className="flex items-center justify-end gap-1 w-full font-medium" onClick={() => handleSort('quantity')}>
                      <span>Quantity</span>
                      {sortColumn === 'quantity' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 flex-shrink-0" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-left max-w-[200px]">
                    <button className="flex items-center gap-1 w-full font-medium" onClick={() => handleSort('symbol')}>
                      <span className="truncate">Symbol/CUSIP</span>
                      {sortColumn === 'symbol' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 flex-shrink-0" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-left max-w-[200px]">
                    <button className="flex items-center gap-1 w-full font-medium" onClick={() => handleSort('description')}>
                      <span className="truncate">Description</span>
                      {sortColumn === 'description' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 flex-shrink-0" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-center">
                    <button className="flex items-center justify-center gap-1 w-full font-medium" onClick={() => handleSort('longShort')}>
                      <span>L/S</span>
                      {sortColumn === 'longShort' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 flex-shrink-0" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-right">
                    <button className="flex items-center justify-end gap-1 w-full font-medium" onClick={() => handleSort('unrealizedGL')}>
                      <span>Total Unrealized G/L</span>
                      {sortColumn === 'unrealizedGL' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 flex-shrink-0" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-right">
                    <button className="flex items-center justify-end gap-1 w-full font-medium" onClick={() => handleSort('unrealizedGLPercent')}>
                      <span>Total Unrealized G/L %</span>
                      {sortColumn === 'unrealizedGLPercent' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 flex-shrink-0" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-right">
                    <button className="flex items-center justify-end gap-1 w-full font-medium" onClick={() => handleSort('avgPrice')}>
                      <span>Buy Price</span>
                      {sortColumn === 'avgPrice' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 flex-shrink-0" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-right">
                    <button className="flex items-center justify-end gap-1 w-full font-medium" onClick={() => handleSort('investedValue')}>
                      <span>Invested Value</span>
                      {sortColumn === 'investedValue' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 flex-shrink-0" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-right">
                    <button className="flex items-center justify-end gap-1 w-full font-medium" onClick={() => handleSort('currentPrice')}>
                      <span>LTP</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Values as of the end of the prior business day.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {sortColumn === 'currentPrice' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 flex-shrink-0" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-right">
                    <button className="flex items-center justify-end gap-1 w-full font-medium" onClick={() => handleSort('marketValue')}>
                      <span>Market Value</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Values as of the end of the prior business day.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {sortColumn === 'marketValue' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 flex-shrink-0" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPositions.length === 0 ? (
                  <tr>
                    <TableCell colSpan={11} className="py-8 text-muted-foreground text-center">
                      No unrealized positions found
                    </TableCell>
                  </tr>
                ) : (
                  filteredPositions.map((position) => (
                    <tr key={position.id} className="hover:bg-muted dark:hover:bg-accent cursor-pointer relative group bg-card">
                      <TableCell className="px-4 py-2 dark:text-white whitespace-nowrap w-40 border-b">{new Date(position.lastUpdated).toISOString().split('T')[0]}</TableCell>
                      <TableCell className="px-4 py-2 dark:text-white whitespace-nowrap text-right border-b">{position.quantity.toLocaleString()}</TableCell>
                      <TableCell className="px-4 py-2 dark:text-white whitespace-nowrap border-b">
                        <div>
                          <div className="font-medium text-foreground">{position.symbol}</div>
                          <div className="text-xs text-muted-foreground">{position.cusip}</div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-2 dark:text-white max-w-[200px] truncate border-b">{position.description}</TableCell>
                      <TableCell className="px-4 py-2 dark:text-white whitespace-nowrap text-center border-b">
                        {position.longShort}
                      </TableCell>
                      <TableCell className={`px-4 py-2 dark:text-white whitespace-nowrap text-right font-medium border-b ${position.unrealizedGL >= 0 ? 'text-positive' : 'text-negative'}`}>
                        {position.unrealizedGL >= 0 ? '+' : '-'}${Math.abs(position.unrealizedGL).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className={`px-4 py-2 dark:text-white whitespace-nowrap text-right font-medium border-b ${position.unrealizedGLPercent >= 0 ? 'text-positive' : 'text-negative'}`}>
                        {position.unrealizedGLPercent >= 0 ? '+' : '-'}{Math.abs(position.unrealizedGLPercent).toFixed(2)}%
                      </TableCell>
                      <TableCell className="px-4 py-2 dark:text-white whitespace-nowrap text-right border-b">
                        ${position.avgPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="px-4 py-2 dark:text-white whitespace-nowrap text-right border-b">
                        ${position.investedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="px-4 py-2 dark:text-white whitespace-nowrap text-right border-b">
                        ${position.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="px-4 py-2 dark:text-white whitespace-nowrap text-right border-b">
                        ${position.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
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
