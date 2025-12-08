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
import { PageHeading } from '@/components/layout/PageHeading';
import { TableCell } from '@/components/ui/table';

// Local extension type to support additional display-only fields used by this page
type RealizedTradeExt = RealizedTrade & { adjInvestedValue: number };

export default function RealizedGLPage() {
  // Don't wait for account data - this page uses hardcoded data
  const { refreshData } = useAccountData();
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
        cusip: '594918104',
        description: 'Microsoft Corp...',
        openDate: '2024-06-15',
        closeDate: '2024-11-20',
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
        cusip: '88160R101',
        description: 'Tesla Inc...',
        openDate: '2024-03-10',
        closeDate: '2024-08-22',
        quantity: 50,
        avgBuyPrice: 180.50,
        sellPrice: 225.00,
        adjInvestedValue: 180.50,
        investedValue: 9025.00,
        totalSellValue: 11250.00,
        realizedGL: 2225.00,
        realizedGLPercent: 24.66,
        longShort: 'Long'
      },
      {
        id: 'realized-4',
        symbol: 'GOOGL',
        cusip: '02079K305',
        description: 'Alphabet Inc C...',
        openDate: '2024-02-05',
        closeDate: '2024-09-15',
        quantity: 60,
        avgBuyPrice: 135.80,
        sellPrice: 172.50,
        adjInvestedValue: 135.80,
        investedValue: 8148.00,
        totalSellValue: 10350.00,
        realizedGL: 2202.00,
        realizedGLPercent: 27.02,
        longShort: 'Long'
      },
      {
        id: 'realized-5',
        symbol: 'NVDA',
        cusip: '67066G104',
        description: 'NVIDIA Corp...',
        openDate: '2024-01-20',
        closeDate: '2024-07-30',
        quantity: 25,
        avgBuyPrice: 485.20,
        sellPrice: 620.00,
        adjInvestedValue: 485.20,
        investedValue: 12130.00,
        totalSellValue: 15500.00,
        realizedGL: 3370.00,
        realizedGLPercent: 27.78,
        longShort: 'Long'
      },
      {
        id: 'realized-6',
        symbol: 'AMZN',
        cusip: '023135106',
        description: 'Amazon.com Inc...',
        openDate: '2024-04-12',
        closeDate: '2024-10-05',
        quantity: 40,
        avgBuyPrice: 178.25,
        sellPrice: 195.80,
        adjInvestedValue: 178.25,
        investedValue: 7130.00,
        totalSellValue: 7832.00,
        realizedGL: 702.00,
        realizedGLPercent: 9.85,
        longShort: 'Long'
      },
      {
        id: 'realized-7',
        symbol: 'META',
        cusip: '30303M102',
        description: 'Meta Platforms...',
        openDate: '2024-05-08',
        closeDate: '2024-12-01',
        quantity: 30,
        avgBuyPrice: 425.50,
        sellPrice: 520.00,
        adjInvestedValue: 425.50,
        investedValue: 12765.00,
        totalSellValue: 15600.00,
        realizedGL: 2835.00,
        realizedGLPercent: 22.21,
        longShort: 'Long'
      },
      {
        id: 'realized-8',
        symbol: 'JPM',
        cusip: '46625H100',
        description: 'JPMorgan Chase...',
        openDate: '2024-03-25',
        closeDate: '2024-09-28',
        quantity: 45,
        avgBuyPrice: 185.40,
        sellPrice: 210.25,
        adjInvestedValue: 185.40,
        investedValue: 8343.00,
        totalSellValue: 9461.25,
        realizedGL: 1118.25,
        realizedGLPercent: 13.40,
        longShort: 'Long'
      },
      {
        id: 'realized-9',
        symbol: 'V',
        cusip: '92826C839',
        description: 'Visa Inc Class A...',
        openDate: '2024-02-18',
        closeDate: '2024-08-10',
        quantity: 35,
        avgBuyPrice: 275.60,
        sellPrice: 290.15,
        adjInvestedValue: 275.60,
        investedValue: 9646.00,
        totalSellValue: 10155.25,
        realizedGL: 509.25,
        realizedGLPercent: 5.28,
        longShort: 'Long'
      },
      {
        id: 'realized-10',
        symbol: 'DIS',
        cusip: '254687106',
        description: 'Walt Disney Co...',
        openDate: '2024-01-05',
        closeDate: '2024-06-20',
        quantity: 55,
        avgBuyPrice: 92.30,
        sellPrice: 78.50,
        adjInvestedValue: 92.30,
        investedValue: 5076.50,
        totalSellValue: 4317.50,
        realizedGL: -759.00,
        realizedGLPercent: -14.95,
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

  // This page uses hardcoded data, so no need to wait for account data

  return (
    <TooltipProvider>
      <div className="w-full">
        <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-auto">
            <PageHeading className="text-slate-900 dark:text-slate-100">Realized G/L</PageHeading>
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Total realized G/L</div>
              <h3>
                {summaryData.totalRealizedGL >= 0 ? '+' : '-'}${Math.abs(summaryData.totalRealizedGL).toLocaleString('en-US', { minimumFractionDigits: 2 })} ({summaryData.totalRealizedGL >= 0 ? '+' : ''}{summaryData.totalGLPercent.toFixed(2)}%)
              </h3>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Realized long term G/L</div>
              <h3>
                {summaryData.realizedLongTerm >= 0 ? '+' : '-'}${Math.abs(summaryData.realizedLongTerm).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Realized short term G/L</div>
              <h3>
                {summaryData.realizedShortTerm >= 0 ? '+' : '-'}${Math.abs(summaryData.realizedShortTerm).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Invested value</div>
              <h3>${summaryData.investedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Total sell value</div>
              <h3>${summaryData.totalSellValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
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
          <div className="overflow-x-auto bg-card rounded-md shadow-sm">
            <table className="w-full text-sm text-left border-separate border-spacing-0 rounded-md min-w-[1500px]">
              <thead className="sticky top-0 border-t border-b bg-muted text-muted-foreground z-10">
                <tr>
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-left">
                    <button className="flex items-center gap-1 w-full font-medium" onClick={() => handleSort('symbol')}>
                      <span>Symbol/CUSIP</span>
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
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-left">
                    <button className="flex items-center gap-1 w-full font-medium" onClick={() => handleSort('openDate')}>
                      <span>Open date</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>If you have multiple tax lots, Open date represents the first purchased date.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {sortColumn === 'openDate' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 flex-shrink-0" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-left">
                    <button className="flex items-center gap-1 w-full font-medium" onClick={() => handleSort('closeDate')}>
                      <span>Close date</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>If you have multiple tax lots, Close date represents the last closed date.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {sortColumn === 'closeDate' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 flex-shrink-0" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-right">
                    <button className="flex items-center justify-end gap-1 w-full font-medium" onClick={() => handleSort('realizedGL')}>
                      <span>Total realized G/L</span>
                      {sortColumn === 'realizedGL' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 flex-shrink-0" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-right">
                    <button className="flex items-center justify-end gap-1 w-full font-medium" onClick={() => handleSort('realizedGLPercent')}>
                      <span>Total realized G/L %</span>
                      {sortColumn === 'realizedGLPercent' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 flex-shrink-0" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-right">
                    <button className="flex items-center justify-end gap-1 w-full font-medium" onClick={() => handleSort('avgBuyPrice')}>
                      <span>Avg Buy Price</span>
                      {sortColumn === 'avgBuyPrice' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 flex-shrink-0" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-right">
                    <button className="flex items-center justify-end gap-1 w-full font-medium" onClick={() => handleSort('adjInvestedValue')}>
                      <span>Adj. Invested Value</span>
                      {sortColumn === 'adjInvestedValue' ? (
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
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-right">
                    <button className="flex items-center justify-end gap-1 w-full font-medium" onClick={() => handleSort('investedValue')}>
                      <span>Invested value</span>
                      {sortColumn === 'investedValue' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 flex-shrink-0" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-right">
                    <button className="flex items-center justify-end gap-1 w-full font-medium" onClick={() => handleSort('totalSellValue')}>
                      <span>Total sell value</span>
                      {sortColumn === 'totalSellValue' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 flex-shrink-0" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.length === 0 ? (
                  <tr>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                      No realized trades found
                    </TableCell>
                  </tr>
                ) : (
                  filteredTrades.map((trade) => (
                    <tr key={trade.id} className="hover:bg-muted dark:hover:bg-accent cursor-pointer relative group bg-card">
                      <TableCell className="px-4 py-2 dark:text-white whitespace-nowrap border-b">
                        <div>
                          <div className="font-medium text-foreground">{trade.symbol}</div>
                          <div className="text-xs text-muted-foreground">{trade.cusip}</div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-2 dark:text-white max-w-[200px] truncate border-b">{trade.description}</TableCell>
                      <TableCell className="px-4 py-2 dark:text-white whitespace-nowrap border-b">{trade.openDate}</TableCell>
                      <TableCell className="px-4 py-2 dark:text-white whitespace-nowrap border-b">{trade.closeDate}</TableCell>
                      <TableCell className={`px-4 py-2 dark:text-white whitespace-nowrap text-right font-medium border-b ${trade.realizedGL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                        {trade.realizedGL >= 0 ? '+' : '-'}${Math.abs(trade.realizedGL).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className={`px-4 py-2 dark:text-white whitespace-nowrap text-right font-medium border-b ${trade.realizedGLPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                        {trade.realizedGLPercent >= 0 ? '+' : '-'}{Math.abs(trade.realizedGLPercent).toFixed(2)}%
                      </TableCell>
                      <TableCell className="px-4 py-2 dark:text-white whitespace-nowrap text-right border-b">
                        ${trade.avgBuyPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="px-4 py-2 dark:text-white whitespace-nowrap text-right border-b">
                        ${trade.adjInvestedValue.toFixed(2)}
                      </TableCell>
                      <TableCell className="px-4 py-2 dark:text-white whitespace-nowrap text-right border-b">
                        {trade.quantity}
                      </TableCell>
                      <TableCell className="px-4 py-2 dark:text-white whitespace-nowrap text-right border-b">
                        ${trade.investedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="px-4 py-2 dark:text-white whitespace-nowrap text-right border-b">
                        ${trade.totalSellValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
