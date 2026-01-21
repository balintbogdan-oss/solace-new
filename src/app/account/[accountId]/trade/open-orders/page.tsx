'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { LastUpdated } from '@/components/ui/last-updated';

type OrderType = 'Equity' | 'Option' | 'Mutual Fund';
type OrderStatusOpen = 'Pending' | 'Partially filled';
type OrderStatusHistory = 'Filled' | 'Cancelled' | 'Rejected' | 'Expired';
type OrderStatus = OrderStatusOpen | OrderStatusHistory;
type OrderAction = 'Buy' | 'Sell';

interface OptionOrderDetails {
  underlying: string;
  strike: number;
  optionType: 'Call' | 'Put';
  expirationDate: string;
}

interface Order {
  id: string;
  orderId: string;
  symbol: string;
  description: string;
  cusip?: string;
  type: OrderType;
  action: OrderAction;
  quantity: number;
  price: number;
  amount: number;
  cost: number;
  created: string; // ISO datetime
  expiry: string; // Day, GTC, etc.
  status: OrderStatus;
  // History-only fields
  executedPrice?: number;
  filledAt?: string;
  // Options-only
  optionDetails?: OptionOrderDetails;
}

type SortColumn =
  | 'symbol'
  | 'description'
  | 'type'
  | 'action'
  | 'amount'
  | 'quantity'
  | 'price'
  | 'cost'
  | 'created'
  | 'expiry'
  | 'status';

type SortDirection = 'asc' | 'desc';

const PAGE_SIZE = 10;

function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
}

function formatDatetime(value: string): string {
  const date = new Date(value);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// AAPL 150C Jan17 style
function buildCondensedOptionSymbol(
  details: OptionOrderDetails | undefined
): string | null {
  if (!details) return null;
  const date = new Date(details.expirationDate);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const monthDay = `${month}${day}`;
  const strike = details.strike.toString().replace(/\.0+$/, '');
  const side = details.optionType === 'Call' ? 'C' : 'P';
  return `${details.underlying} ${strike}${side} ${monthDay}`;
}

function getStatusVariant(
  status: OrderStatus
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'Pending':
    case 'Partially filled':
      return 'secondary';
    case 'Filled':
      return 'default';
    case 'Cancelled':
    case 'Expired':
    case 'Rejected':
      return 'outline';
    default:
      return 'secondary';
  }
}

function seedMockOrders(accountId: string): { open: Order[]; history: Order[] } {
  const now = new Date();

  const open: Order[] = [
    {
      id: `open-${accountId}-1`,
      orderId: `O-${accountId}-1001`,
      symbol: 'AAPL',
      description: 'Apple Inc.',
      cusip: '037833100',
      type: 'Equity',
      action: 'Buy',
      quantity: 200,
      price: 185.5,
      amount: 37100,
      cost: 37100,
      created: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
      expiry: 'Day',
      status: 'Pending',
    },
    {
      id: `open-${accountId}-2`,
      orderId: `O-${accountId}-1002`,
      symbol: 'AAPL 150C Jan17',
      description: 'Apple Inc. $150 Call Jan 17',
      cusip: '037833100',
      type: 'Option',
      action: 'Sell',
      quantity: 10,
      price: 7.25,
      amount: 7250,
      cost: 7250,
      created: new Date(now.getTime() - 25 * 60 * 1000).toISOString(),
      expiry: 'Day',
      status: 'Partially filled',
      optionDetails: {
        underlying: 'AAPL',
        strike: 150,
        optionType: 'Call',
        expirationDate: new Date(
          now.getTime() + 150 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    },
    {
      id: `open-${accountId}-3`,
      orderId: `O-${accountId}-1003`,
      symbol: 'SWPPX',
      description: 'Schwab S&P 500 Index Fund',
      cusip: '808509102',
      type: 'Mutual Fund',
      action: 'Buy',
      quantity: 500,
      price: 75.3,
      amount: 37650,
      cost: 37650,
      created: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
      expiry: 'GTC',
      status: 'Pending',
    },
  ];

  const history: Order[] = [
    {
      id: `hist-${accountId}-1`,
      orderId: `H-${accountId}-2001`,
      symbol: 'MSFT',
      description: 'Microsoft Corp.',
      cusip: '594918104',
      type: 'Equity',
      action: 'Buy',
      quantity: 150,
      price: 420.15,
      amount: 63022.5,
      cost: 63022.5,
      created: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      expiry: 'Day',
      status: 'Filled',
      executedPrice: 420.1,
      filledAt: new Date(now.getTime() - 90 * 60 * 1000).toISOString(),
    },
    {
      id: `hist-${accountId}-2`,
      orderId: `H-${accountId}-2002`,
      symbol: 'AAPL 140P Jan17',
      description: 'Apple Inc. $140 Put Jan 17',
      cusip: '037833100',
      type: 'Option',
      action: 'Buy',
      quantity: 5,
      price: 6.5,
      amount: 3250,
      cost: 3250,
      created: new Date(now.getTime() - 26 * 60 * 60 * 1000).toISOString(),
      expiry: 'Day',
      status: 'Cancelled',
      optionDetails: {
        underlying: 'AAPL',
        strike: 140,
        optionType: 'Put',
        expirationDate: new Date(
          now.getTime() + 120 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    },
    {
      id: `hist-${accountId}-3`,
      orderId: `H-${accountId}-2003`,
      symbol: 'VTI',
      description: 'Vanguard Total Stock Market ETF',
      cusip: '922908769',
      type: 'Equity',
      action: 'Sell',
      quantity: 80,
      price: 260.2,
      amount: 20816,
      cost: 20816,
      created: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      expiry: 'Day',
      status: 'Rejected',
    },
    {
      id: `hist-${accountId}-4`,
      orderId: `H-${accountId}-2004`,
      symbol: 'SWPPX',
      description: 'Schwab S&P 500 Index Fund',
      cusip: '808509102',
      type: 'Mutual Fund',
      action: 'Buy',
      quantity: 300,
      price: 74.8,
      amount: 22440,
      cost: 22440,
      created: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      expiry: 'Day',
      status: 'Expired',
    },
  ];

  return { open, history };
}

export default function AccountOpenOrdersPage() {
  const params = useParams();
  const accountId = (params?.accountId as string) ?? 'unknown';

  const { open: seededOpen, history: seededHistory } = useMemo(
    () => seedMockOrders(accountId),
    [accountId]
  );

  const [openOrders, setOpenOrders] = useState<Order[]>(seededOpen);
  const [historyOrders, setHistoryOrders] = useState<Order[]>(seededHistory);
  const [activeTab, setActiveTab] = useState<'open' | 'history'>('open');
  const [sortColumn, setSortColumn] = useState<SortColumn>('created');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const currentOrders = activeTab === 'open' ? openOrders : historyOrders;

  const sortedOrders = useMemo(() => {
    const rows = [...currentOrders];
    const dir = sortDirection === 'asc' ? 1 : -1;
    rows.sort((a, b) => {
      if (sortColumn === 'created') {
        return (
          (new Date(a.created).getTime() - new Date(b.created).getTime()) * dir
        );
      }
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * dir;
      }
      const aStr = String(aVal ?? '');
      const bStr = String(bVal ?? '');
      return aStr.localeCompare(bStr) * dir;
    });
    return rows;
  }, [currentOrders, sortColumn, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / PAGE_SIZE));
  const pagedOrders = sortedOrders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection(column === 'created' ? 'desc' : 'asc');
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const handleCancelOrder = () => {
    if (!selectedOrder) return;
    setIsCancelDialogOpen(true);
  };

  const confirmCancelOrder = () => {
    if (!selectedOrder) return;

    // Remove from open and push into history as Cancelled
    setOpenOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
    setHistoryOrders(prev => [
      {
        ...selectedOrder,
        status: 'Cancelled',
        filledAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    setIsCancelDialogOpen(false);
    setIsDrawerOpen(false);
  };

  const resetPaginationOnTabChange = (value: string) => {
    setPage(1);
    setActiveTab(value === 'history' ? 'history' : 'open');
  };

  const getCurrentTimestamp = () => {
    return new Date().toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'
    });
  };

  const handleRefresh = () => {
    // Refresh logic can be added here if needed
  };

  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return (
        <span className="inline-flex flex-col text-muted-foreground/60">
          <ChevronUp className="h-3 w-3 -mb-1 opacity-40" />
          <ChevronDown className="h-3 w-3 opacity-40" />
        </span>
      );
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    );
  };

  const renderTable = (orders: Order[], isOpenTab: boolean) => (
    <>
      <div className="rounded-lg min-h-[400px]">
        <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => handleSort('symbol')}
                className="cursor-pointer px-4"
              >
                <div className="flex items-center gap-1">
                  <span>Symbol / CUSIP</span>
                  {renderSortIcon('symbol')}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort('description')}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <span>Description</span>
                  {renderSortIcon('description')}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort('type')}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <span>Type</span>
                  {renderSortIcon('type')}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort('action')}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <span>Action</span>
                  {renderSortIcon('action')}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort('amount')}
                className="cursor-pointer text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Amount</span>
                  {renderSortIcon('amount')}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort('quantity')}
                className="cursor-pointer text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Quantity</span>
                  {renderSortIcon('quantity')}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort('price')}
                className="cursor-pointer text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Price</span>
                  {renderSortIcon('price')}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort('cost')}
                className="cursor-pointer text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Cost</span>
                  {renderSortIcon('cost')}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort('created')}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <span>Created</span>
                  {renderSortIcon('created')}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort('expiry')}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <span>Expiry</span>
                  {renderSortIcon('expiry')}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort('status')}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <span>Status</span>
                  {renderSortIcon('status')}
                </div>
              </TableHead>
              <TableHead className="text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => {
              const condensed = buildCondensedOptionSymbol(order.optionDetails);
              const isLastRow = index === orders.length - 1;
              return (
                <TableRow 
                  key={order.id} 
                  className="cursor-pointer group"
                  onClick={() => handleViewOrder(order)}
                >
                  <TableCell className={`px-4 py-2 font-semibold dark:text-white whitespace-nowrap ${isLastRow ? "" : "border-b"} bg-card group-hover:bg-muted/50 dark:group-hover:bg-accent/30`}>
                    {order.type === 'Option' && condensed
                      ? condensed
                      : order.symbol}
                    {order.cusip && (
                      <div className="text-xs text-muted-foreground whitespace-nowrap">{order.cusip}</div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[240px] truncate group-hover:bg-muted/50 dark:group-hover:bg-accent/30">
                    {order.description}
                  </TableCell>
                  <TableCell className="group-hover:bg-muted/50 dark:group-hover:bg-accent/30">{order.type}</TableCell>
                  <TableCell className="group-hover:bg-muted/50 dark:group-hover:bg-accent/30">{order.action}</TableCell>
                  <TableCell className="text-right group-hover:bg-muted/50 dark:group-hover:bg-accent/30">
                    {formatCurrency(order.amount)}
                  </TableCell>
                  <TableCell className="text-right group-hover:bg-muted/50 dark:group-hover:bg-accent/30">
                    {order.quantity.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right group-hover:bg-muted/50 dark:group-hover:bg-accent/30">
                    {formatCurrency(order.price)}
                  </TableCell>
                  <TableCell className="text-right group-hover:bg-muted/50 dark:group-hover:bg-accent/30">
                    {formatCurrency(order.cost)}
                  </TableCell>
                  <TableCell className="group-hover:bg-muted/50 dark:group-hover:bg-accent/30">{formatDatetime(order.created)}</TableCell>
                  <TableCell className="group-hover:bg-muted/50 dark:group-hover:bg-accent/30">{order.expiry}</TableCell>
                  <TableCell className="group-hover:bg-muted/50 dark:group-hover:bg-accent/30">
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right group-hover:bg-muted/50 dark:group-hover:bg-accent/30">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewOrder(order);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing{' '}
          <span className="font-medium text-foreground">
            {sortedOrders.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-
            {Math.min(page * PAGE_SIZE, sortedOrders.length)}
          </span>{' '}
          of{' '}
          <span className="font-medium text-foreground">
            {sortedOrders.length}
          </span>{' '}
          {isOpenTab ? 'open orders' : 'orders'}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span>
            Page{' '}
            <span className="font-medium text-foreground">{page}</span> of{' '}
            <span className="font-medium text-foreground">{totalPages}</span>
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );

  if (!selectedOrder && isCancelDialogOpen) {
    setIsCancelDialogOpen(false);
  }

  return (
    <div className="min-h-screen rounded-md space-y-4 md:space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-normal font-serif">Order status</h1>
      </div>

      <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex justify-between items-end border-b mb-4 pb-2">
          <div className="flex space-x-8">
            <button
              onClick={() => resetPaginationOnTabChange('open')}
              className={`pb-2 font-medium transition-colors ${
                activeTab === 'open'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Open orders
              {openOrders.length > 0 && (
                <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/10 px-1 text-[10px] font-medium text-primary">
                  {openOrders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => resetPaginationOnTabChange('history')}
              className={`pb-2 font-medium transition-colors ${
                activeTab === 'history'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Order history
            </button>
          </div>
          <LastUpdated 
            timestamp={`Updated ${getCurrentTimestamp()}`} 
            onRefresh={handleRefresh}
            className="pb-2"
            showBorder={false}
          />
        </div>

        {activeTab === 'open' && (
          <div className="mt-4">
            {openOrders.length === 0 ? (
              <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
                There are no open orders for this account.
              </div>
            ) : (
              renderTable(pagedOrders, true)
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="mt-4">
            {historyOrders.length === 0 ? (
              <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
                There is no order history for this account.
              </div>
            ) : (
              renderTable(pagedOrders, false)
            )}
          </div>
        )}
      </div>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right">
          {selectedOrder && (
            <>
              <SheetHeader>
                <SheetTitle>
                  {selectedOrder.symbol}{' '}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({selectedOrder.type})
                  </span>
                </SheetTitle>
                <SheetDescription>{selectedOrder.description}</SheetDescription>
              </SheetHeader>
              {activeTab === 'open' &&
                (selectedOrder.status === 'Pending' ||
                  selectedOrder.status === 'Partially filled') && (
                  <div className="px-4">
                    <Button
                      className="w-full mb-3"
                      onClick={handleCancelOrder}
                    >
                      Cancel order
                    </Button>
                  </div>
                )}
              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b py-2">
                    <div className="text-xs text-muted-foreground">Type</div>
                    <div className="font-medium">{selectedOrder.type}</div>
                  </div>
                  <div className="flex items-center justify-between border-b py-2">
                    <div className="text-xs text-muted-foreground">Action</div>
                    <div className="font-medium">{selectedOrder.action}</div>
                  </div>
                  <div className="flex items-center justify-between border-b py-2">
                    <div className="text-xs text-muted-foreground">Quantity</div>
                    <div className="font-medium">
                      {selectedOrder.quantity.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b py-2">
                    <div className="text-xs text-muted-foreground">Price</div>
                    <div className="font-medium">
                      {formatCurrency(selectedOrder.price)}{' '}
                      <span className="text-xs text-muted-foreground">
                        Limit
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b py-2">
                    <div className="text-xs text-muted-foreground">Amount</div>
                    <div className="font-medium">
                      {formatCurrency(selectedOrder.amount)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b py-2">
                    <div className="text-xs text-muted-foreground">Cost</div>
                    <div className="font-medium">
                      {formatCurrency(selectedOrder.cost)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b py-2">
                    <div className="text-xs text-muted-foreground">Status</div>
                    <div className="mt-0.5">
                      <Badge variant={getStatusVariant(selectedOrder.status)}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b py-2">
                    <div className="text-xs text-muted-foreground">Created</div>
                    <div className="font-medium">
                      {formatDatetime(selectedOrder.created)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b py-2">
                    <div className="text-xs text-muted-foreground">Expiry</div>
                    <div className="font-medium">{selectedOrder.expiry}</div>
                  </div>
                  <div className="flex items-center justify-between border-b py-2">
                    <div className="text-xs text-muted-foreground">
                      Order ID
                    </div>
                    <div className="font-mono text-xs">
                      {selectedOrder.orderId}
                    </div>
                  </div>
                  {selectedOrder.executedPrice && (
                    <div className="flex items-center justify-between border-b py-2">
                      <div className="text-xs text-muted-foreground">
                        Executed price
                      </div>
                      <div className="font-medium">
                        {formatCurrency(selectedOrder.executedPrice)}
                      </div>
                    </div>
                  )}
                  {selectedOrder.filledAt && (
                    <div className="flex items-center justify-between border-b py-2">
                      <div className="text-xs text-muted-foreground">
                        Filled at
                      </div>
                      <div className="font-medium">
                        {formatDatetime(selectedOrder.filledAt)}
                      </div>
                    </div>
                  )}
                </div>

                {selectedOrder.type === 'Option' &&
                  selectedOrder.optionDetails && (
                    <div className="pt-4 border-t space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">
                        Option details
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-1">
                          <div className="text-xs text-muted-foreground">
                            Underlying
                          </div>
                          <div className="font-medium">
                            {selectedOrder.optionDetails.underlying}
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <div className="text-xs text-muted-foreground">
                            Strike
                          </div>
                          <div className="font-medium">
                            {formatCurrency(
                              selectedOrder.optionDetails.strike
                            ).replace('.00', '')}
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <div className="text-xs text-muted-foreground">
                            Call / Put
                          </div>
                          <div className="font-medium">
                            {selectedOrder.optionDetails.optionType}
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <div className="text-xs text-muted-foreground">
                            Expiration date
                          </div>
                          <div className="font-medium">
                            {new Date(
                              selectedOrder.optionDetails.expirationDate
                            ).toLocaleDateString('en-US', {
                              month: 'short',
                              day: '2-digit',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this order?</DialogTitle>
            <DialogDescription>
              This will submit a best-effort cancellation request. In this mock
              environment the order will be moved to history as Cancelled.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Keep order</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmCancelOrder}>
              Cancel order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
