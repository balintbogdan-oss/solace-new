'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Search, SlidersHorizontal, RefreshCcw, MoreHorizontal, ChevronsUpDown, Info, ArrowUp, ArrowDown, TrendingUp, RotateCcw, BarChart3 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { HoldingWithDetails } from '@/types/account';

type SortableColumn = keyof HoldingWithDetails | 'currentPrice' | 'sector' | 'description' | 'assetClass';

interface HoldingsTableProps {
  onStockClick?: (symbol: string) => void;
  onTradeClick?: (symbol: string) => void;
  holdingsWithDetails: HoldingWithDetails[];
  accountId?: string;
}

export function HoldingsTable({ onStockClick, onTradeClick, holdingsWithDetails, accountId }: HoldingsTableProps) {
  const router = useRouter();
  
  // State for sorting
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState('All');
  const [assetClassFilter, setAssetClassFilter] = useState('All');

  // Handler functions for dropdown menu
  const handleTradeClick = (symbol: string) => {
    if (onTradeClick) {
      onTradeClick(symbol);
    } else if (accountId) {
      router.push(`/account/${accountId}/trade/${symbol}`);
    }
  };

  const handleViewUnrealizedGL = (symbol: string) => {
    if (accountId) {
      router.push(`/account/${accountId}/holdings/${symbol}/unrealized-gl`);
    }
  };

  const handleStockDetails = (symbol: string) => {
    if (accountId) {
      router.push(`/account/${accountId}/trade/${symbol}`);
    }
  };


  // Event Handlers
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAccountTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAccountTypeFilter(event.target.value);
  };

  const handleAssetClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAssetClassFilter(event.target.value);
  };

  // Get unique options for filters
  const accountTypes = ['All', 'Cash', 'Margin']; // Static for now
  const assetClasses = ['All', 'Annuities', 'Equities', 'Fixed Income', 'Mutual Funds', 'Options', 'Others'];

  // Function to determine asset class based on security
  const getAssetClass = (holding: HoldingWithDetails): string => {
    const symbol = holding.symbol?.toUpperCase() || '';
    const description = holding.security?.description?.toLowerCase() || '';
    
    // Check for mutual funds
    if (description.includes('mutual fund') || description.includes('fund') || 
        symbol.includes('MF') || description.includes('vanguard') || 
        description.includes('fidelity') || description.includes('t rowe')) {
      return 'Mutual Funds';
    }
    
    // Check for options
    if (description.includes('call') || description.includes('put') || 
        description.includes('option') || symbol.includes('C') || symbol.includes('P')) {
      return 'Options';
    }
    
    // Check for fixed income
    if (description.includes('bond') || description.includes('treasury') || 
        description.includes('note') || description.includes('cd') || 
        description.includes('fixed income') || symbol.includes('T')) {
      return 'Fixed Income';
    }
    
    // Check for annuities
    if (description.includes('annuity') || description.includes('pension')) {
      return 'Annuities';
    }
    
    // Default to Equities for stocks
    return 'Equities';
  };

  // Handle Sorting
  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };


  // Filtering and Sorting Logic
  const processedHoldings = useMemo(() => {
    // Apply sorting
    const sortedHoldings = [...holdingsWithDetails];

    if (sortColumn) {
      sortedHoldings.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        // Handle nested properties
        if (sortColumn === 'currentPrice') {
          aValue = a.marketData?.currentPrice || 0;
          bValue = b.marketData?.currentPrice || 0;
        } else if (sortColumn === 'sector') {
          aValue = a.security?.sector || '';
          bValue = b.security?.sector || '';
        } else if (sortColumn === 'description') {
          aValue = a.security?.description || '';
          bValue = b.security?.description || '';
        } else if (sortColumn === 'assetClass') {
          aValue = getAssetClass(a);
          bValue = getAssetClass(b);
        } else {
          aValue = a[sortColumn as keyof HoldingWithDetails] as string | number;
          bValue = b[sortColumn as keyof HoldingWithDetails] as string | number;
        }

        let comparison = 0;

        // Handle different data types
        if (['marketValue', 'unrealizedGL', 'unrealizedGLPercent', 'quantity', 'currentPrice', 'avgPrice'].includes(sortColumn)) {
          comparison = (aValue as number) - (bValue as number);
        } else {
          // Default to string comparison
          comparison = (aValue as string).localeCompare(bValue as string);
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    // Apply filtering (after sorting, or before if preferred)
    return sortedHoldings.filter(holding => {
        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearch = 
          holding.symbol.toLowerCase().includes(searchTermLower) ||
          holding.security.cusip.toLowerCase().includes(searchTermLower) ||
          holding.security.description.toLowerCase().includes(searchTermLower);
          
        const matchesAccountType = 
          accountTypeFilter === 'All'; // For now, all holdings are treated the same
          
        const matchesAssetClass = 
          assetClassFilter === 'All' || getAssetClass(holding) === assetClassFilter;
          
        return matchesSearch && matchesAccountType && matchesAssetClass;
      });

  }, [holdingsWithDetails, sortColumn, sortDirection, searchTerm, accountTypeFilter, assetClassFilter]);

  return (
    <div className="w-full space-y-4  rounded-md">
      <div className="flex items-center justify-between ">
        <h2>Holdings details</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          Updated 01/08/2025 8:05 AM ET
          <button className="p-1.5 rounded-md hover:bg-white/10 transition">
            <RefreshCcw className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className=" relative rounded-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Symbol or CUSIP"
            className="w-[250px] border  bg-white dark:bg-black   text-sm placeholder:text-muted-foreground pl-10 pr-4 py-2 rounded-md focus:outline-none"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <select 
          className=" border bg-white dark:bg-black border-input text-sm bg-transparent px-3 py-2 rounded-md focus:outline-none"
          value={accountTypeFilter}
          onChange={handleAccountTypeChange}
        >
          {accountTypes.map(type => (
            <option key={type} value={type}>{
              type === 'All' ? 'Account Type' : type
            }</option>
          ))}
        </select>

        <select 
          className=" border border-input text-sm bg-transparent px-3 py-2 rounded-md focus:outline-none"
          value={assetClassFilter}
          onChange={handleAssetClassChange}
        >
          {assetClasses.map(assetClass => (
            <option key={assetClass} value={assetClass}>{
              assetClass === 'All' ? 'Asset Class' : assetClass
            }</option>
          ))}
        </select>

        <div className="bg-white dark:bg-black ml-auto flex gap-2">
          <Button variant="outline">
            <SlidersHorizontal className="w-4 h-4" />
            Customize columns
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-black rounded-md shadow-sm rounded-md">
        <table className="min-w-full text-sm text-left border-collapse rounded-md">
          <thead className="sticky top-0 border-t border-b bg-background dark:border-white/10 text-muted-foreground z-10">
            <tr>
              <th className="px-4 py-2 dark:text-white border-r w-14 whitespace-nowrap">Actions</th>
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'symbol' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 bg-white dark:bg-black w-full" onClick={() => handleSort('symbol')}>
                  <span>Symbol/CUSIP</span>
                  {sortColumn === 'symbol' ? (
                    sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                  )}
                </button>
              </th>
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'assetClass' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="bg-white dark:bg-black  flex items-center gap-1 w-full" onClick={() => handleSort('assetClass')}>
                  <span>Asset class</span>
                  {sortColumn === 'assetClass' ? (
                    sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                  )}
                </button>
              </th>
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'quantity' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('quantity')}>
                  <span>Quantity</span>
                  {sortColumn === 'quantity' ? (
                    sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                  )}
                </button>
              </th>
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'marketValue' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('marketValue')}>
                  <span>Market Value</span>
                  {sortColumn === 'marketValue' ? (
                    sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                  )}
                </button>
              </th>
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'description' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('description')}>
                  <span>Description</span>
                  {sortColumn === 'description' ? (
                    sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                  )}
                </button>
              </th>
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'unrealizedGL' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('unrealizedGL')}>
                  <span>Unrealized G/L</span>
                  {sortColumn === 'unrealizedGL' ? (
                    sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                  )}
                </button>
              </th>
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'unrealizedGLPercent' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('unrealizedGLPercent')}>
                  <span>Unrealized G/L %</span>
                  {sortColumn === 'unrealizedGLPercent' ? (
                    sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                  )}
                </button>
              </th>
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'currentPrice' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('currentPrice')}>
                  <span>Current Price</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Current Market Price</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {sortColumn === 'currentPrice' ? (
                    sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                  )}
                </button>
              </th>
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'avgPrice' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('avgPrice')}>
                  <span>Avg Price</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Average Purchase Price</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {sortColumn === 'avgPrice' ? (
                    sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                  )}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {processedHoldings.map((row) => (
              <tr
                key={row.security.cusip}
                className={'bg-white/5 hover:bg-gray-100 border-b dark:hover:bg-white/10 cursor-pointer'}
              >
                <td className="px-4 py-2 dark:text-white w-14 whitespace-nowrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleTradeClick(row.symbol)}>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Trade
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewUnrealizedGL(row.symbol)}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        View Unrealized G/L
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStockDetails(row.symbol)}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Stock details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
                <td 
                  className="px-4 py-2 font-semibold cursor-pointer hover:text-primary dark:text-white whitespace-nowrap"
                  onClick={() => onStockClick?.(row.symbol)}
                >
                  {row.symbol}
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{row.security.cusip}</div>
                </td>
                <td className="px-4 py-2 dark:text-white whitespace-nowrap">{getAssetClass(row)}</td>
                <td className="px-4 py-2 dark:text-white whitespace-nowrap">{row.quantity}</td>
                <td className="px-4 py-2 dark:text-white text-right whitespace-nowrap">${(row.marketValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-2 truncate max-w-[160px] dark:text-white whitespace-nowrap">{row.security.description}</td>
                <td className={`px-4 py-2 font-semibold text-right whitespace-nowrap ${(row.unrealizedGL || 0) >= 0 ? 'text-positive' : 'text-negative'}`}>
                  ${(row.unrealizedGL || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className={`px-4 py-2 font-semibold text-right whitespace-nowrap ${(row.unrealizedGLPercent || 0) >= 0 ? 'text-positive' : 'text-negative'}`}>
                  {(row.unrealizedGLPercent || 0).toFixed(2)}%
                </td>
                <td className="px-4 py-2 dark:text-white text-right whitespace-nowrap">${(row.marketData?.currentPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-2 dark:text-white text-right whitespace-nowrap">${(row.avgPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}