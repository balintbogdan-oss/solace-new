'use client';

import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LastUpdated } from '@/components/ui/last-updated';
import { PageHeading } from '@/components/layout/PageHeading';
import { Download, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock pending income data
const pendingIncomeData = [
  { payDate: '03/15/2025', symbol: 'AAPL', description: 'Apple Inc. Dividend', type: 'Dividend', quantity: 100, rate: 0.24, amount: 24.00 },
  { payDate: '03/18/2025', symbol: 'MSFT', description: 'Microsoft Corp. Dividend', type: 'Dividend', quantity: 50, rate: 0.75, amount: 37.50 },
  { payDate: '03/20/2025', symbol: 'VTI', description: 'Vanguard Total Stock Market ETF', type: 'Dividend', quantity: 200, rate: 0.89, amount: 178.00 },
  { payDate: '03/22/2025', symbol: 'BND', description: 'Vanguard Total Bond Market ETF', type: 'Interest', quantity: 150, rate: 0.28, amount: 42.00 },
  { payDate: '03/25/2025', symbol: 'JNJ', description: 'Johnson & Johnson Dividend', type: 'Dividend', quantity: 75, rate: 1.24, amount: 93.00 },
  { payDate: '03/28/2025', symbol: 'PG', description: 'Procter & Gamble Dividend', type: 'Dividend', quantity: 60, rate: 1.01, amount: 60.60 },
  { payDate: '03/30/2025', symbol: 'T-BILL', description: 'Treasury Bill Interest', type: 'Interest', quantity: 1, rate: 1637.32, amount: 1637.32 },
];

const totalPending = pendingIncomeData.reduce((sum, item) => sum + item.amount, 0);

function PendingIncomeContent() {
  const params = useParams();
  const accountId = params?.accountId as string;

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

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/account/${accountId}/balances`} className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Home className="h-4 w-4" />
            Balances
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Pending income</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-auto">
            <PageHeading className="text-slate-900 dark:text-slate-100">Pending income</PageHeading>
            <p className="text-sm text-muted-foreground mt-1">Month of March 2025</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="p-6 bg-card">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-normal">Total pending income</span>
          </div>
          <h3 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>{formatAmount(totalPending)}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Pending dividends</div>
              <div className="font-medium">{formatAmount(pendingIncomeData.filter(i => i.type === 'Dividend').reduce((sum, item) => sum + item.amount, 0))}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Pending interest</div>
              <div className="font-medium">{formatAmount(pendingIncomeData.filter(i => i.type === 'Interest').reduce((sum, item) => sum + item.amount, 0))}</div>
            </div>
          </div>
          <LastUpdated 
            timestamp={`Updated ${getCurrentTimestamp()}`} 
            className="mt-4"
          />
        </Card>

        {/* Pending Income Details */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Pending payments</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-medium text-muted-foreground">Pay date</th>
                  <th className="text-left py-2 text-sm font-medium text-muted-foreground">Symbol</th>
                  <th className="text-left py-2 text-sm font-medium text-muted-foreground">Description</th>
                  <th className="text-left py-2 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-right py-2 text-sm font-medium text-muted-foreground">Quantity</th>
                  <th className="text-right py-2 text-sm font-medium text-muted-foreground">Rate</th>
                  <th className="text-right py-2 text-sm font-medium text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {pendingIncomeData.map((item, index) => (
                  <tr key={`${item.symbol}-${item.payDate}`} className={index < pendingIncomeData.length - 1 ? 'border-b' : ''}>
                    <td className="py-2">{item.payDate}</td>
                    <td className="py-2 font-medium">{item.symbol}</td>
                    <td className="py-2 text-muted-foreground">{item.description}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.type === 'Dividend' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="text-right py-2">{item.quantity.toLocaleString()}</td>
                    <td className="text-right py-2">{formatAmount(item.rate)}</td>
                    <td className="text-right py-2 font-medium text-green-600">{formatAmount(item.amount)}</td>
                  </tr>
                ))}
                <tr className="font-semibold border-t">
                  <td colSpan={6} className="py-2">Total</td>
                  <td className="text-right py-2 font-medium text-green-600">{formatAmount(totalPending)}</td>
                </tr>
              </tbody>
            </table>
            <LastUpdated 
              timestamp={`Updated ${getCurrentTimestamp()}`} 
              className="mt-4"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function PendingIncomePage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <PendingIncomeContent />
    </Suspense>
  );
}

