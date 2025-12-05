'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LastUpdated } from '@/components/ui/last-updated';
import { PageHeading } from '@/components/layout/PageHeading';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Download, ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useAccountData } from '@/contexts/AccountDataContext';
import { AccountBreadcrumb } from '@/components/layout/AccountBreadcrumb';

// Mock pending income data matching the screenshot
const pendingIncomeData = [
  { payDate: '3/12/2025', recordDate: '3/12/2025', exDividendDate: '3/12/2025', symbol: 'AAPL', cusip: '037833100', description: 'Apple Inc. - Technology company...', quantity: 250000, frequency: 'Quarterly', incomeType: 'D' },
  { payDate: '3/10/2025', recordDate: '3/10/2025', exDividendDate: '3/10/2025', symbol: 'AAPL', cusip: '037833100', description: 'Apple Inc. - Technology company...', quantity: 300, frequency: 'Quarterly', incomeType: 'D' },
  { payDate: '3/8/2025', recordDate: '3/8/2025', exDividendDate: '3/8/2025', symbol: 'AAPL', cusip: '037833100', description: 'Apple Inc. - Technology company...', quantity: 300, frequency: 'Monthly', incomeType: 'In' },
];

const totalPending = 2072.42;

function PendingIncomeContent() {
  const params = useParams();
  const accountId = params?.accountId as string;
  const { refreshData } = useAccountData();
  
  const [sortColumn, setSortColumn] = useState<string | null>('payDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const getCurrentTimestamp = () => {
    return new Date().toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'
    }) + ' ET';
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn) return pendingIncomeData;
    return [...pendingIncomeData].sort((a, b) => {
      const aValue = a[sortColumn as keyof typeof a];
      const bValue = b[sortColumn as keyof typeof b];
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [sortColumn, sortDirection]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        {/* Breadcrumb */}
        <AccountBreadcrumb 
          items={[
            { label: 'Balances', href: `/account/${accountId}/balances` },
            { label: 'Pending income' }
          ]}
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-auto">
            <PageHeading className="text-slate-900 dark:text-slate-100">Pending income</PageHeading>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="p-6 bg-card">
          <div className="text-sm font-medium text-muted-foreground mb-1">Total pending income</div>
          <h3 className="text-sm font-medium mb-4" style={{ fontFamily: 'var(--font-display)' }}>{formatAmount(totalPending)}</h3>
          <LastUpdated 
            timestamp={`Updated ${getCurrentTimestamp()}`} 
            onRefresh={refreshData}
            className="mt-4"
          />
        </Card>

        {/* Pending Income Details */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-normal">Details</h3>
          </div>
          <LastUpdated 
            timestamp={`Updated ${getCurrentTimestamp()}`} 
            onRefresh={refreshData}
            className="mb-4"
          />
          <div className="overflow-x-auto">
            <Table className="w-full text-sm">
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead 
                    className="text-left px-6 py-3 whitespace-nowrap cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('payDate')}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-sm">Pay date</span>
                      {sortColumn === 'payDate' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-left px-6 py-3 whitespace-nowrap cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('recordDate')}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-sm">Record date</span>
                      {sortColumn === 'recordDate' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-left px-6 py-3 whitespace-nowrap cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('exDividendDate')}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-sm">Ex-dividend date</span>
                      {sortColumn === 'exDividendDate' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-left px-6 py-3 cursor-pointer hover:bg-muted/50"
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
                    className="text-left px-6 py-3 cursor-pointer hover:bg-muted/50"
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
                    className="text-left px-6 py-3 whitespace-nowrap cursor-pointer hover:bg-muted/50"
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
                    className="text-left px-6 py-3 whitespace-nowrap cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('frequency')}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-sm">Frequency</span>
                      {sortColumn === 'frequency' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-left px-6 py-3 whitespace-nowrap cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('incomeType')}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-sm">In</span>
                      {sortColumn === 'incomeType' ? (
                        sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((item, index) => (
                  <TableRow key={`${item.symbol}-${item.payDate}`} className={`border-b ${index % 2 === 1 ? 'bg-card' : ''}`}>
                    <TableCell className="px-6 py-3 text-foreground bg-card">{item.payDate}</TableCell>
                    <TableCell className="px-6 py-3 text-foreground bg-card">{item.recordDate}</TableCell>
                    <TableCell className="px-6 py-3 text-foreground bg-card">{item.exDividendDate}</TableCell>
                    <TableCell className="px-6 py-3 bg-card">
                      <div>
                        <div className="font-medium text-foreground">{item.symbol}</div>
                        <div className="text-xs text-muted-foreground">{item.cusip}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-3 text-foreground bg-card">{item.description}</TableCell>
                    <TableCell className="px-6 py-3 text-foreground bg-card">{item.quantity.toLocaleString()}</TableCell>
                    <TableCell className="px-6 py-3 text-foreground bg-card">{item.frequency}</TableCell>
                    <TableCell className="px-6 py-3 text-foreground bg-card">{item.incomeType}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-semibold border-t">
                  <TableCell colSpan={7} className="px-6 py-3 text-foreground">Total</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function PendingIncomePage() {
  return <PendingIncomeContent />;
}

