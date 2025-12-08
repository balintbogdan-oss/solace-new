'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { 
  TableCell,
} from '@/components/ui/table'
import { Search, SlidersHorizontal, RefreshCcw, MoreHorizontal, ChevronsUpDown, Info, ArrowUp, ArrowDown, TrendingUp, RotateCcw, BarChart3, GripVertical, Maximize2 } from 'lucide-react'
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { HoldingWithDetails } from '@/types/account';

type SortableColumn = keyof HoldingWithDetails | 'currentPrice' | 'sector' | 'description' | 'assetClass' | 'accountType' | 'longShort' | 'closingPrice' | 'priceChange' | 'investedValue' | 'callPut' | 'maturityDate' | 'yield' | 'todaysGL';

interface ColumnDefinition {
  id: string;
  label: string;
  sortKey: SortableColumn | null;
  defaultVisible: boolean;
  alwaysVisible?: boolean; // For Actions and Symbol which are sticky
}

interface HoldingsTableProps {
  onStockClick?: (symbol: string) => void;
  onTradeClick?: (symbol: string) => void;
  holdingsWithDetails: HoldingWithDetails[];
  accountId?: string;
}

// Column definitions - default order as specified
const COLUMN_DEFINITIONS: ColumnDefinition[] = [
  { id: 'actions', label: 'Actions', sortKey: null, defaultVisible: true, alwaysVisible: true },
  { id: 'symbol', label: 'Symbol/CUSIP', sortKey: 'symbol', defaultVisible: true, alwaysVisible: true },
  { id: 'description', label: 'Description', sortKey: 'description', defaultVisible: true },
  { id: 'assetClass', label: 'Asset class', sortKey: 'assetClass', defaultVisible: true },
  { id: 'quantity', label: 'Quantity', sortKey: 'quantity', defaultVisible: true },
  { id: 'accountType', label: 'Account type', sortKey: 'accountType', defaultVisible: true },
  { id: 'longShort', label: 'L/S', sortKey: 'longShort', defaultVisible: true },
  { id: 'currentPrice', label: 'LTP', sortKey: 'currentPrice', defaultVisible: true },
  { id: 'closingPrice', label: 'Closing price', sortKey: 'closingPrice', defaultVisible: true },
  { id: 'avgPrice', label: 'Avg buy price', sortKey: 'avgPrice', defaultVisible: true },
  { id: 'priceChange', label: 'Price change', sortKey: 'priceChange', defaultVisible: true },
  { id: 'marketValue', label: 'Market Value', sortKey: 'marketValue', defaultVisible: true },
  { id: 'investedValue', label: 'Invested Value', sortKey: 'investedValue', defaultVisible: true },
  { id: 'callPut', label: 'Call/Put', sortKey: 'callPut', defaultVisible: true },
  { id: 'maturityDate', label: 'Maturity Date', sortKey: 'maturityDate', defaultVisible: true },
  { id: 'yield', label: '% Yield', sortKey: 'yield', defaultVisible: true },
  { id: 'unrealizedGL', label: 'Total Unrealized G/L', sortKey: 'unrealizedGL', defaultVisible: true },
  { id: 'todaysGL', label: "Today's G/L", sortKey: 'todaysGL', defaultVisible: true },
];

const STORAGE_KEY = 'holdings-table-columns';

function loadColumnPreferences(): { order: string[]; visibility: Record<string, boolean> } {
  if (typeof window === 'undefined') {
    return {
      order: COLUMN_DEFINITIONS.map(col => col.id),
      visibility: Object.fromEntries(COLUMN_DEFINITIONS.map(col => [col.id, col.defaultVisible])),
    };
  }
  
  // For now, always use default order to ensure consistency
  // Users can still customize via the UI, but we start with the correct default
  return {
    order: COLUMN_DEFINITIONS.map(col => col.id),
    visibility: Object.fromEntries(COLUMN_DEFINITIONS.map(col => [col.id, col.defaultVisible])),
  };
  
  // Commented out localStorage loading to ensure default order is always used
  // try {
  //   const stored = localStorage.getItem(STORAGE_KEY);
  //   if (stored) {
  //     return JSON.parse(stored);
  //   }
  // } catch {
  //   // Ignore errors
  // }
}

function saveColumnPreferences(order: string[], visibility: Record<string, boolean>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ order, visibility }));
  } catch {
    // Ignore errors
  }
}

// Sortable column item component
function SortableColumnItem({ 
  id, 
  label, 
  visible, 
  onToggle,
  alwaysVisible 
}: { 
  id: string; 
  label: string; 
  visible: boolean; 
  onToggle: (id: string) => void;
  alwaysVisible?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled: alwaysVisible, // Disable dragging for required columns
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 px-3 py-1.5 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
    >
      {!alwaysVisible && (
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground flex-shrink-0"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      )}
      {alwaysVisible && (
        <div className="w-4 h-4 flex-shrink-0" /> // Spacer for alignment when no drag handle
      )}
      <span className={`flex-1 text-sm ${alwaysVisible ? 'text-muted-foreground' : 'text-foreground'}`}>
        {label}
      </span>
      <Switch
        checked={visible}
        onCheckedChange={() => onToggle(id)}
        disabled={alwaysVisible}
        className="flex-shrink-0"
      />
    </div>
  );
}

export function HoldingsTable({ onStockClick, onTradeClick, holdingsWithDetails, accountId }: HoldingsTableProps) {
  const router = useRouter();
  
  // Load column preferences from localStorage
  const initialPrefs = loadColumnPreferences();
  const [columnOrder, setColumnOrder] = useState<string[]>(initialPrefs.order);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(initialPrefs.visibility);
  const [isCustomizeDialogOpen, setIsCustomizeDialogOpen] = useState(false);
  
  // State for sorting
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState('All');
  const [assetClassFilter, setAssetClassFilter] = useState('All');

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Save preferences when they change
  useEffect(() => {
    saveColumnPreferences(columnOrder, columnVisibility);
  }, [columnOrder, columnVisibility]);

  // Get visible columns in order
  const visibleColumns = useMemo(() => {
    return columnOrder.filter(id => columnVisibility[id] || COLUMN_DEFINITIONS.find(col => col.id === id)?.alwaysVisible);
  }, [columnOrder, columnVisibility]);

  // Get column definition by ID
  const getColumnDef = (id: string) => COLUMN_DEFINITIONS.find(col => col.id === id);

  // Handle column toggle
  const handleToggleColumn = (id: string) => {
    const col = getColumnDef(id);
    if (col?.alwaysVisible) return;
    
    setColumnVisibility(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Prevent moving required columns (actions and symbol)
    const activeCol = getColumnDef(activeId);
    const overCol = getColumnDef(overId);
    
    if (activeCol?.alwaysVisible || overCol?.alwaysVisible) {
      return; // Don't allow moving required columns
    }
    
    setColumnOrder(items => {
      // Keep required columns in their fixed positions
      const requiredColumns = items.filter(id => getColumnDef(id)?.alwaysVisible);
      const movableColumns = items.filter(id => !getColumnDef(id)?.alwaysVisible);
      
      const oldIndex = movableColumns.indexOf(activeId);
      const newIndex = movableColumns.indexOf(overId);
      
      if (oldIndex === -1 || newIndex === -1) return items;
      
      const reorderedMovable = arrayMove(movableColumns, oldIndex, newIndex);
      
      // Reconstruct: required columns first, then movable columns
      return [...requiredColumns, ...reorderedMovable];
    });
  };

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

  const handleAccountTypeChange = (value: string) => {
    setAccountTypeFilter(value);
  };

  const handleAssetClassChange = (value: string) => {
    setAssetClassFilter(value);
  };

  // Get unique options for filters
  const accountTypes = ['All', 'Cash', 'Margin']; // Static for now
  const assetClasses = ['All', 'Annuities', 'Equities', 'Fixed Income', 'Mutual Funds', 'Options', 'Others'];

  // Function to determine asset class based on security
  const getAssetClass = (holding: HoldingWithDetails): string => {
    const symbol = holding.symbol?.toUpperCase() || '';
    const description = (holding.security?.description || '').toLowerCase();
    const securityType = (holding.security as { type?: string })?.type?.toLowerCase() || '';
    const sector = (holding.security?.sector || '').toLowerCase();
    
    // First check the security type field if available
    if (securityType === 'mutual_fund' || sector === 'mutual fund') {
      return 'Mutual Funds';
    }
    if (securityType === 'option' || sector === 'options') {
      return 'Options';
    }
    if (securityType === 'fixed_income' || sector === 'fixed income') {
      return 'Fixed Income';
    }
    
    // Check for mutual funds - specific fund symbols or explicit fund names
    if (symbol === 'VTSAX' || symbol === 'VFIAX' || symbol === 'VTSMX' ||
        symbol === 'FXAIX' || symbol === 'SWTSX' ||
        description.includes('index fund') || description.includes('mutual fund') ||
        description.includes('vanguard total') || description.includes('fidelity 500')) {
      return 'Mutual Funds';
    }
    
    // Check for options - symbol patterns with date and C/P for call/put
    if (symbol.length > 8 && /\d{6}[CP]\d+/.test(symbol)) {
      return 'Options';
    }
    
    // Check for fixed income - bonds, treasuries, CDs
    if (description.includes('bond') || description.includes('treasury') || 
        description.includes(' note ') || description.includes('certificate of deposit')) {
      return 'Fixed Income';
    }
    
    // Check for annuities
    if (description.includes('annuity')) {
      return 'Annuities';
    }
    
    // Default to Equities for stocks - most common case
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
        } else if (sortColumn === 'closingPrice') {
          aValue = a.marketData?.previousClose || a.marketData?.currentPrice || 0;
          bValue = b.marketData?.previousClose || b.marketData?.currentPrice || 0;
        } else if (sortColumn === 'priceChange') {
          aValue = a.marketData?.dayChange || 0;
          bValue = b.marketData?.dayChange || 0;
        } else if (sortColumn === 'investedValue') {
          aValue = (a.avgPrice || 0) * a.quantity;
          bValue = (b.avgPrice || 0) * b.quantity;
        } else if (sortColumn === 'todaysGL') {
          aValue = (a.marketData?.dayChange || 0) * a.quantity;
          bValue = (b.marketData?.dayChange || 0) * b.quantity;
        } else if (sortColumn === 'accountType') {
          aValue = 'Cash'; // Default account type
          bValue = 'Cash';
        } else if (sortColumn === 'longShort') {
          aValue = 'Long'; // Default to Long
          bValue = 'Long';
        } else if (sortColumn === 'callPut' || sortColumn === 'maturityDate' || sortColumn === 'yield') {
          aValue = '-';
          bValue = '-';
        } else {
          aValue = a[sortColumn as keyof HoldingWithDetails] as string | number;
          bValue = b[sortColumn as keyof HoldingWithDetails] as string | number;
        }

        let comparison = 0;

        // Handle different data types
        if (['marketValue', 'unrealizedGL', 'unrealizedGLPercent', 'quantity', 'currentPrice', 'avgPrice', 'closingPrice', 'priceChange', 'investedValue', 'todaysGL'].includes(sortColumn)) {
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
    <Card className="p-6">
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between ">
          <h2>Details</h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            Updated 09/22/2025 3:35 PM ET
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
            className="w-[250px] border bg-card text-sm placeholder:text-muted-foreground pl-10 pr-4 py-2 rounded-md focus:outline-none"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <Select value={accountTypeFilter} onValueChange={handleAccountTypeChange}>
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="Account Type" />
          </SelectTrigger>
          <SelectContent>
            {accountTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type === 'All' ? 'Account Type' : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={assetClassFilter} onValueChange={handleAssetClassChange}>
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="Asset Class" />
          </SelectTrigger>
          <SelectContent>
            {assetClasses.map(assetClass => (
              <SelectItem key={assetClass} value={assetClass}>
                {assetClass === 'All' ? 'Asset Class' : assetClass}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex gap-2">
          <Button variant="outline">
            <Maximize2 className="w-4 h-4" />
            Expand
          </Button>
          <Popover open={isCustomizeDialogOpen} onOpenChange={setIsCustomizeDialogOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="w-4 h-4" />
                Customize columns
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-0.5 max-h-[400px] overflow-y-auto">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={columnOrder.filter(id => !getColumnDef(id)?.alwaysVisible)}
                      strategy={verticalListSortingStrategy}
                    >
                      {columnOrder.map((columnId) => {
                        const col = getColumnDef(columnId);
                        if (!col) return null;
                        return (
                          <SortableColumnItem
                            key={columnId}
                            id={columnId}
                            label={col.label}
                            visible={columnVisibility[columnId] ?? col.defaultVisible}
                            onToggle={handleToggleColumn}
                            alwaysVisible={col.alwaysVisible}
                          />
                        );
                      })}
                    </SortableContext>
                  </DndContext>
                </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="overflow-x-auto bg-card rounded-md shadow-sm">
        <table className="w-full text-sm text-left border-separate border-spacing-0 rounded-md">
          <thead className="sticky top-0 border-t border-b bg-muted text-muted-foreground z-10">
            <tr>
              {visibleColumns.map((columnId) => {
                const col = getColumnDef(columnId);
                if (!col) return null;

                // Render header cell based on column type
                if (columnId === 'actions') {
                  return (
                    <th key={columnId} className="py-2 dark:text-white border-b whitespace-nowrap sticky left-0 z-50 bg-muted px-4 text-left font-medium w-16 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]">
                      Actions
                    </th>
                  );
                }

                if (columnId === 'symbol') {
                  return (
                    <th
                      key={columnId}
                      className="px-4 py-2 dark:text-white border-b border-r cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap sticky z-50 bg-muted text-left font-medium shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]"
                      style={{ left: '64px' }}
                    >
                      <button className="flex items-center gap-1 bg-transparent w-full font-medium" onClick={() => handleSort('symbol')}>
                        <span>Symbol/CUSIP</span>
                        {sortColumn === 'symbol' ? (
                          sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                        )}
                      </button>
                    </th>
                  );
                }

                const isSorted = sortColumn === col.sortKey;

                return (
                  <th
                    key={columnId}
                    className={`px-4 py-2 dark:text-white border-b cursor-pointer hover:bg-muted/50 dark:hover:bg-accent/30 whitespace-nowrap bg-muted font-medium text-left ${col.id === 'description' ? 'max-w-[280px]' : ''}`}
                  >
                    <button className="flex items-center gap-1 w-full font-medium" onClick={() => col.sortKey && handleSort(col.sortKey)}>
                      <span className={col.id === 'description' ? 'truncate' : ''}>{col.label}</span>
                      {col.id === 'currentPrice' || col.id === 'avgPrice' ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{col.id === 'currentPrice' ? 'Current Market Price' : 'Average Purchase Price'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : null}
                      {isSorted ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 flex-shrink-0" /> : <ArrowDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {processedHoldings.map((row, index) => (
              <tr
                key={`${row.symbol}-${row.security.cusip}-${index}`}
                className={'hover:bg-muted dark:hover:bg-accent border-b border cursor-pointer relative group bg-card'}
              >
                {visibleColumns.map((columnId) => {
                  const col = getColumnDef(columnId);
                  if (!col) return null;

                  // Render cell based on column type
                  if (columnId === 'actions') {
                    return (
                      <TableCell key={columnId} className="py-2 dark:text-white whitespace-nowrap sticky left-0 z-50 border-b px-4 bg-card group-hover:bg-muted/50 dark:group-hover:bg-accent/30 w-16 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" aria-label="Actions">
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
                      </TableCell>
                    );
                  }

                  if (columnId === 'symbol') {
                    return (
                      <TableCell
                        key={columnId}
                        className="px-4 py-2 font-semibold cursor-pointer hover:text-primary dark:text-white whitespace-nowrap sticky z-50 border-b border-r bg-card group-hover:bg-muted/50 dark:group-hover:bg-accent/30 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]"
                        style={{ left: '64px' }}
                        onClick={() => onStockClick?.(row.symbol)}
                      >
                        {row.symbol}
                        <div className="text-xs text-muted-foreground whitespace-nowrap">{row.security.cusip}</div>
                      </TableCell>
                    );
                  }

                  let cellContent: React.ReactNode;
                  switch (columnId) {
                    case 'assetClass':
                      cellContent = getAssetClass(row);
                      break;
                    case 'quantity':
                      cellContent = row.quantity;
                      break;
                    case 'marketValue':
                      cellContent = `$${(row.marketValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                      break;
                    case 'description':
                      cellContent = <span className="block truncate max-w-full">{row.security.description}</span>;
                      break;
                    case 'unrealizedGL':
                      cellContent = (
                        <span className={`${(row.unrealizedGL || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                          {(row.unrealizedGL || 0) >= 0 ? '+' : '-'}${Math.abs(row.unrealizedGL || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      );
                      break;
                    case 'currentPrice':
                      cellContent = `$${(row.marketData?.currentPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                      break;
                    case 'avgPrice':
                      cellContent = `$${(row.avgPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                      break;
                    case 'accountType':
                      cellContent = 'Cash'; // Default account type
                      break;
                    case 'longShort':
                      cellContent = 'Long'; // Default to Long
                      break;
                    case 'closingPrice':
                      cellContent = `$${(row.marketData?.previousClose || row.marketData?.currentPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                      break;
                    case 'priceChange':
                      const change = row.marketData?.dayChange || 0;
                      cellContent = (
                        <span className={`${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                          {change >= 0 ? '+' : '-'}${Math.abs(change).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      );
                      break;
                    case 'investedValue':
                      cellContent = `$${((row.avgPrice || 0) * row.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                      break;
                    case 'callPut':
                      cellContent = '-';
                      break;
                    case 'maturityDate':
                      cellContent = '-';
                      break;
                    case 'yield':
                      cellContent = '-';
                      break;
                    case 'todaysGL':
                      const todayGL = (row.marketData?.dayChange || 0) * row.quantity;
                      cellContent = (
                        <span className={`${todayGL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                          {todayGL >= 0 ? '+' : '-'}${Math.abs(todayGL).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      );
                      break;
                    default:
                      cellContent = null;
                  }

                  return (
                    <TableCell
                      key={columnId}
                      className={`px-4 py-2 dark:text-white border-b bg-card group-hover:bg-muted/50 dark:group-hover:bg-accent/30 relative z-0 ${columnId === 'description' ? 'max-w-[280px] overflow-hidden' : 'whitespace-nowrap'}`}
                    >
                      {cellContent}
                    </TableCell>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </Card>
  )
}