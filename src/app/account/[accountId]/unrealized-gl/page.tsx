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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
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
              <h3 className="text-sm font-medium" style={{ fontFamily: 'var(--font-display)' }}>${summaryData.investedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Portfolio market value</div>
              <h3 className="text-sm font-medium" style={{ fontFamily: 'var(--font-display)' }}>${summaryData.portfolioMarketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Unrealized long term G/L</div>
              <h3 className={`text-sm font-medium ${summaryData.unrealizedLongTerm >= 0 ? 'text-positive' : 'text-negative'}`} style={{ fontFamily: 'var(--font-display)' }}>
                {summaryData.unrealizedLongTerm >= 0 ? '+' : '-'}${Math.abs(summaryData.unrealizedLongTerm).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Unrealized short term G/L</div>
              <h3 className={`text-sm font-medium ${summaryData.unrealizedShortTerm >= 0 ? 'text-positive' : 'text-negative'}`} style={{ fontFamily: 'var(--font-display)' }}>
                {summaryData.unrealizedShortTerm >= 0 ? '+' : '-'}${Math.abs(summaryData.unrealizedShortTerm).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Total unrealized G/L</div>
              <h3 className={`text-sm font-medium ${summaryData.totalUnrealizedGL >= 0 ? 'text-positive' : 'text-negative'}`} style={{ fontFamily: 'var(--font-display)' }}>
                {summaryData.totalUnrealizedGL >= 0 ? '+' : '-'}${Math.abs(summaryData.totalUnrealizedGL).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
              <div className={`text-sm ${summaryData.totalUnrealizedGL >= 0 ? 'text-positive' : 'text-negative'}`}>
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
            <Table className="w-full text-sm min-w-[1600px]">
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead 
                    className="text-left px-6 py-3 whitespace-nowrap border-r w-40 cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('lastUpdated')}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-sm">Date</span>
                      {sortColumn === 'lastUpdated' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right px-6 py-3 whitespace-nowrap border-r cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-sm">Quantity</span>
                      {sortColumn === 'quantity' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-left px-6 py-3 border-r max-w-[200px] cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('symbol')}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-sm">Symbol/CUSIP</span>
                      {sortColumn === 'symbol' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-left px-6 py-3 border-r max-w-[200px] cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('description')}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-sm">Description</span>
                      {sortColumn === 'description' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-center px-6 py-3 whitespace-nowrap border-r cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('longShort')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm">L/S</span>
                      {sortColumn === 'longShort' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right px-6 py-3 whitespace-nowrap border-r cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('unrealizedGL')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-sm">Total Unrealized G/L</span>
                      {sortColumn === 'unrealizedGL' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right px-6 py-3 whitespace-nowrap border-r cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('unrealizedGLPercent')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-sm">Total Unrealized G/L %</span>
                      {sortColumn === 'unrealizedGLPercent' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right px-6 py-3 whitespace-nowrap border-r cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('avgPrice')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-sm">Buy Price</span>
                      {sortColumn === 'avgPrice' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right px-6 py-3 whitespace-nowrap border-r cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('investedValue')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-sm">Invested Value</span>
                      {sortColumn === 'investedValue' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right px-6 py-3 whitespace-nowrap border-r cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('currentPrice')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-sm">LTP</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3 h-3 flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Values as of the end of the prior business day.</p>
                        </TooltipContent>
                      </Tooltip>
                      {sortColumn === 'currentPrice' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right px-6 py-3 whitespace-nowrap cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('marketValue')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-sm">Market Value</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3 h-3 flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Values as of the end of the prior business day.</p>
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
                {filteredPositions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="py-8 text-muted-foreground">
                      No unrealized positions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPositions.map((position, index) => (
                    <TableRow key={position.id} className={`border-b ${index % 2 === 1 ? 'bg-card' : 'bg-card'}`}>
                      <TableCell className="px-6 py-3 text-foreground bg-card w-40">{new Date(position.lastUpdated).toISOString().split('T')[0]}</TableCell>
                      <TableCell className="px-6 py-3 text-foreground bg-card">{position.quantity.toLocaleString()}</TableCell>
                      <TableCell className="px-6 py-3 bg-card">
                        <div>
                          <div className="font-medium text-foreground">{position.symbol}</div>
                          <div className="text-xs text-muted-foreground">{position.cusip}</div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-3 text-foreground max-w-[200px] truncate bg-card">{position.description}</TableCell>
                      <TableCell className="px-6 py-3 text-foreground bg-card">
                        {position.longShort}
                      </TableCell>
                      <TableCell className={`px-6 py-3 font-medium bg-card ${position.unrealizedGL >= 0 ? 'text-positive' : 'text-negative'}`}>
                        {position.unrealizedGL >= 0 ? '+' : '-'}${Math.abs(position.unrealizedGL).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className={`px-6 py-3 font-medium bg-card ${position.unrealizedGLPercent >= 0 ? 'text-positive' : 'text-negative'}`}>
                        {position.unrealizedGLPercent >= 0 ? '+' : '-'}{Math.abs(position.unrealizedGLPercent).toFixed(2)}%
                      </TableCell>
                      <TableCell className="px-6 py-3 text-foreground bg-card">
                        ${position.avgPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-foreground bg-card">
                        ${position.investedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-foreground bg-card">
                        ${position.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-foreground bg-card">
                        ${position.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
