'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Search, SlidersHorizontal, RefreshCcw, MoreHorizontal, ChevronsUpDown, Info, TrendingUp, RotateCcw, BarChart3 } from 'lucide-react'
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
import { useSidebar } from '@/contexts/SidebarContext';

const getCurrentTimestamp = () => {
    // Use a fixed timestamp to prevent hydration mismatches
    // In a real app, this would come from server-side data
    return '01/15/25 2:30 PM EST';
};

type SortableColumn = keyof HoldingWithDetails | 'currentPrice' | 'sector' | 'description' | 'assetClass' | 'accountType' | 'longShort' | 'dayChange' | 'investedValue' | 'optionType' | 'maturityDate' | 'yield' | 'todaysUnrealizedGL' | 'previousClose';

interface HoldingsTableProps {
  onStockClick?: (symbol: string) => void;
  onTradeClick?: (symbol: string) => void;
  holdingsWithDetails: (HoldingWithDetails & { 
      accountType: string;
      investedValue: number;
      todaysUnrealizedGL: number;
      longShort: 'L' | 'S';
  })[];
  accountId?: string;
}

export function HoldingsTableHardcoded({ onStockClick, onTradeClick, holdingsWithDetails, accountId }: HoldingsTableProps) {
  const router = useRouter();
  const { collapseForTrading } = useSidebar();
  const timestamp = getCurrentTimestamp();
  
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState('All');
  const [assetClassFilter, setAssetClassFilter] = useState('All');

  const handleTradeClick = (symbol: string) => {
    if (onTradeClick) {
      onTradeClick(symbol);
    } else if (accountId) {
      collapseForTrading();
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
      collapseForTrading();
      router.push(`/account/${accountId}/trade/${symbol}`);
    }
  };


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAccountTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAccountTypeFilter(event.target.value);
  };

  const handleAssetClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAssetClassFilter(event.target.value);
  };

  const accountTypes = ['All', 'Cash', 'Margin'];
  const assetClasses = ['All', 'Annuities', 'Equities', 'Fixed Income', 'Mutual Funds', 'Options', 'Others'];

  const getAssetClass = (holding: HoldingWithDetails): string => {
    switch (holding.security.type) {
      case 'option':
        return 'Options';
      case 'mutual_fund':
        return 'Mutual Funds';
      case 'bond':
        return 'Fixed Income';
      case 'etf':
      case 'equity':
        return 'Equities';
      default:
        const description = holding.security?.description?.toLowerCase() || '';
        if (description.includes('etf')) return 'Equities';
        if (description.includes('mutual fund')) return 'Mutual Funds';
        if (description.includes('bond')) return 'Fixed Income';
        if (description.includes('call') || description.includes('put')) return 'Options';
        return 'Equities';
    }
  };

  const formatSymbol = (holding: HoldingWithDetails): string => {
    if (holding.security.type === 'option' && holding.security.underlying && holding.security.expirationDate && holding.security.strikePrice && holding.security.optionType) {
        const date = new Date(holding.security.expirationDate);
        const formattedDate = `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
        const optionType = holding.security.optionType.charAt(0).toUpperCase() + holding.security.optionType.slice(1);
        return `${holding.security.underlying} ${formattedDate} $${holding.security.strikePrice} ${optionType}`;
    }
    return holding.symbol;
  };

  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };


  const processedHoldings = useMemo(() => {
    const sortedHoldings = [...holdingsWithDetails];

    if (sortColumn) {
      sortedHoldings.sort((a, b) => {
        let aValue: string | number | undefined;
        let bValue: string | number | undefined;

        const getNestedValue = (obj: HoldingWithDetails, path: string): string | number | undefined => {
          const keys = path.split('.');
          let current: unknown = obj;
          for (const key of keys) {
            if (current && typeof current === 'object' && current !== null && key in current) {
              current = (current as Record<string, unknown>)[key];
            } else {
              return undefined;
            }
          }
          return current as string | number | undefined;
        };
        
        const columnMap: { [key in SortableColumn]?: string } = {
            currentPrice: 'marketData.currentPrice',
            previousClose: 'marketData.previousClose',
            dayChange: 'marketData.dayChange',
            sector: 'security.sector',
            description: 'security.description',
            optionType: 'security.optionType',
            maturityDate: 'security.maturityDate',
            yield: 'security.yield',
        };

        if (columnMap[sortColumn]) {
            aValue = getNestedValue(a, columnMap[sortColumn]!);
            bValue = getNestedValue(b, columnMap[sortColumn]!);
        } else if (sortColumn === 'assetClass') {
          aValue = getAssetClass(a);
          bValue = getAssetClass(b);
        } else {
          const aVal = a[sortColumn as keyof typeof a];
          const bVal = b[sortColumn as keyof typeof b];
          aValue = typeof aVal === 'string' || typeof aVal === 'number' ? aVal : undefined;
          bValue = typeof bVal === 'string' || typeof bVal === 'number' ? bVal : undefined;
        }

        aValue = aValue ?? 0;
        bValue = bValue ?? 0;

        let comparison = 0;
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else {
          comparison = String(aValue).localeCompare(String(bValue));
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return sortedHoldings.filter(holding => {
        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearch = 
          holding.symbol.toLowerCase().includes(searchTermLower) ||
          holding.security.cusip.toLowerCase().includes(searchTermLower) ||
          holding.security.description.toLowerCase().includes(searchTermLower);
          
        const matchesAccountType = 
          accountTypeFilter === 'All' || holding.accountType === accountTypeFilter;
          
        const matchesAssetClass = 
          assetClassFilter === 'All' || getAssetClass(holding) === assetClassFilter;
          
        return matchesSearch && matchesAccountType && matchesAssetClass;
      });

  }, [holdingsWithDetails, sortColumn, sortDirection, searchTerm, accountTypeFilter, assetClassFilter]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`;
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4 rounded-md">
      <div className="flex items-center justify-between ">
        <h2>Holdings details</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          Updated {timestamp}
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

      <div className="flex-grow overflow-x-auto overflow-y-visible bg-white dark:bg-black rounded-md shadow-sm">
        <table className="min-w-full text-sm text-left border-collapse rounded-md">
          <thead className="sticky top-0 border-t border-b bg-muted dark:border-white/10 text-muted-foreground z-10 text-xs">
            <tr>
              <th className="px-4 py-2 dark:text-white border-r w-14 whitespace-nowrap">Actions</th>
              {/* 1. Symbol/CUSIP */}
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'symbol' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('symbol')}>
                  <span>Symbol/CUSIP</span>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                </button>
              </th>
              {/* 2. Asset class */}
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'assetClass' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('assetClass')}>
                  <span>Asset class</span>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                </button>
              </th>
              {/* 3. Quantity */}
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'quantity' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('quantity')}>
                  <span>Quantity</span>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                </button>
              </th>
              {/* 4. Account type */}
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'accountType' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('accountType')}>
                  <span>Account type</span>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                </button>
              </th>
              {/* 5. Description */}
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'description' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('description')}>
                  <span>Description</span>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                </button>
              </th>
              {/* 6. L/S */}
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'longShort' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('longShort')}>
                  <span>L/S</span>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                </button>
              </th>
              {/* 7. LTP */}
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'currentPrice' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('currentPrice')}>
                  <span>LTP</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Last Traded Price. Values as of the end of the prior business day.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                </button>
              </th>
              {/* 8. Closing price */}
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'previousClose' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('previousClose')}>
                  <span>Closing price</span>
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
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                </button>
              </th>
              {/* 9. Buy price */}
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'avgPrice' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('avgPrice')}>
                  <span>Buy price</span>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                </button>
              </th>
              {/* 10. Price change */}
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'dayChange' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('dayChange')}>
                  <span>Price change</span>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                </button>
              </th>
              {/* 11. Market value */}
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'marketValue' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('marketValue')}>
                  <span>Market value</span>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                </button>
              </th>
              {/* 12. Invested value */}
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'investedValue' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('investedValue')}>
                  <span>Invested value</span>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                </button>
              </th>
              {/* 13. Call/Put */}
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'optionType' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('optionType')}>
                  <span>Call/Put</span>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                </button>
              </th>
              {/* 14. Maturity date */}
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'maturityDate' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('maturityDate')}>
                  <span>Maturity date</span>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                </button>
              </th>
              {/* 15. % Yield */}
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'yield' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('yield')}>
                  <span>% Yield</span>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                </button>
              </th>
              {/* 16. Total Unrealized G/L */}
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'unrealizedGL' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('unrealizedGL')}>
                  <span>Total Unrealized G/L</span>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                </button>
              </th>
              {/* 17. Today's Unrealized G/L */}
              <th className={`px-4 py-2 dark:text-white border-r cursor-pointer hover:bg-muted/50 whitespace-nowrap ${sortColumn === 'todaysUnrealizedGL' ? 'border-b-2 border-b-primary' : ''}`}>
                <button className="flex items-center gap-1 w-full" onClick={() => handleSort('todaysUnrealizedGL')}>
                  <span>Today&apos;s Unrealized G/L</span>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
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
                {/* 1. Symbol/CUSIP */}
                <td 
                  className="px-4 py-2 font-semibold cursor-pointer hover:text-primary dark:text-white whitespace-nowrap"
                  onClick={() => onStockClick?.(row.symbol)}
                >
                  {formatSymbol(row)}
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{row.security.cusip}</div>
                </td>
                {/* 2. Asset class */}
                <td className="px-4 py-2 dark:text-white whitespace-nowrap">{getAssetClass(row)}</td>
                {/* 3. Quantity */}
                <td className="px-4 py-2 dark:text-white whitespace-nowrap">{row.quantity}</td>
                {/* 4. Account type */}
                <td className="px-4 py-2 dark:text-white whitespace-nowrap">{row.accountType}</td>
                {/* 5. Description */}
                <td className="px-4 py-2 truncate max-w-[160px] dark:text-white whitespace-nowrap">{row.security.description}</td>
                {/* 6. L/S */}
                <td className="px-4 py-2 dark:text-white whitespace-nowrap">{row.longShort}</td>
                {/* 7. LTP */}
                <td className="px-4 py-2 dark:text-white text-right whitespace-nowrap">${(row.marketData?.currentPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                {/* 8. Closing price */}
                <td className="px-4 py-2 dark:text-white text-right whitespace-nowrap">${(row.marketData?.previousClose || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                {/* 9. Buy price */}
                <td className="px-4 py-2 dark:text-white text-right whitespace-nowrap">${(row.avgPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                {/* 10. Price change */}
                <td className={`px-4 py-2 font-semibold text-right whitespace-nowrap ${(row.marketData?.dayChange || 0) >= 0 ? 'text-positive' : 'text-negative'}`}>
                  {`${(row.marketData?.dayChange || 0) >= 0 ? '+' : '-'}$${Math.abs(row.marketData?.dayChange || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                </td>
                {/* 11. Market value */}
                <td className="px-4 py-2 dark:text-white text-right whitespace-nowrap">${(row.marketValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                {/* 12. Invested value */}
                <td className="px-4 py-2 dark:text-white text-right whitespace-nowrap">${(row.investedValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                {/* 13. Call/Put */}
                <td className="px-4 py-2 dark:text-white whitespace-nowrap">{row.security.optionType ? (row.security.optionType.charAt(0).toUpperCase() + row.security.optionType.slice(1)) : <span className="text-muted-foreground">-</span>}</td>
                {/* 14. Maturity date */}
                <td className="px-4 py-2 dark:text-white whitespace-nowrap">{(() => {
                    const security = row.security as HoldingWithDetails['security'] & { maturityDate?: string; yield?: number };
                    const maturity = formatDate(row.security.type === 'option' ? row.security.expirationDate : security.maturityDate);
                    return maturity === 'N/A' ? <span className="text-muted-foreground">-</span> : maturity;
                })()}</td>
                {/* 15. % Yield */}
                <td className="px-4 py-2 dark:text-white text-right whitespace-nowrap">{row.security.type === 'bond' ? `${((row.security as HoldingWithDetails['security'] & { yield?: number }).yield || 0).toFixed(2)}%` : <span className="text-muted-foreground">-</span>}</td>
                {/* 16. Total Unrealized G/L */}
                <td className={`px-4 py-2 font-semibold text-right whitespace-nowrap ${(row.unrealizedGL || 0) >= 0 ? 'text-positive' : 'text-negative'}`}>
                  {`${(row.unrealizedGL || 0) >= 0 ? '+' : '-'}$${Math.abs(row.unrealizedGL || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} (${(row.unrealizedGLPercent || 0) >= 0 ? '+' : ''}${(row.unrealizedGLPercent || 0).toFixed(2)}%)`}
                </td>
                {/* 17. Today's Unrealized G/L */}
                <td className={`px-4 py-2 font-semibold text-right whitespace-nowrap ${(row.todaysUnrealizedGL || 0) >= 0 ? 'text-positive' : 'text-negative'}`}>
                  {`${(row.todaysUnrealizedGL || 0) >= 0 ? '+' : '-'}$${Math.abs(row.todaysUnrealizedGL || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} (${(row.marketData?.dayChangePercent || 0) >= 0 ? '+' : ''}${(row.marketData?.dayChangePercent || 0).toFixed(2)}%)`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
