'use client';

import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LastUpdated } from '@/components/ui/last-updated';
import { PageHeading } from '@/components/layout/PageHeading';
import { Download, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock projected income data
const projectedIncomeData = [
  { month: 'March 2025', dividends: 1245.50, interest: 892.15, total: 2137.65 },
  { month: 'April 2025', dividends: 1312.00, interest: 845.30, total: 2157.30 },
  { month: 'May 2025', dividends: 1198.75, interest: 912.45, total: 2111.20 },
  { month: 'June 2025', dividends: 1456.25, interest: 878.90, total: 2335.15 },
  { month: 'July 2025', dividends: 1289.00, interest: 901.20, total: 2190.20 },
  { month: 'August 2025', dividends: 1367.80, interest: 856.75, total: 2224.55 },
  { month: 'September 2025', dividends: 1234.50, interest: 923.40, total: 2157.90 },
  { month: 'October 2025', dividends: 1412.25, interest: 889.60, total: 2301.85 },
  { month: 'November 2025', dividends: 1278.90, interest: 867.35, total: 2146.25 },
  { month: 'December 2025', dividends: 1523.00, interest: 945.80, total: 2468.80 },
  { month: 'January 2026', dividends: 1189.45, interest: 912.25, total: 2101.70 },
  { month: 'February 2026', dividends: 1345.60, interest: 894.55, total: 2240.15 },
];

const totalProjected = projectedIncomeData.reduce((sum, item) => sum + item.total, 0);

function ProjectedIncomeContent() {
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
          <span className="text-foreground">Projected income</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-auto">
            <PageHeading className="text-slate-900 dark:text-slate-100">Projected income</PageHeading>
            <p className="text-sm text-muted-foreground mt-1">March 2025 - February 2026</p>
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
            <span className="text-sm font-normal">Total projected income (12 months)</span>
          </div>
          <h3 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>{formatAmount(totalProjected)}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Projected dividends</div>
              <div className="font-medium">{formatAmount(projectedIncomeData.reduce((sum, item) => sum + item.dividends, 0))}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Projected interest</div>
              <div className="font-medium">{formatAmount(projectedIncomeData.reduce((sum, item) => sum + item.interest, 0))}</div>
            </div>
          </div>
          <LastUpdated 
            timestamp={`Updated ${getCurrentTimestamp()}`} 
            className="mt-4"
          />
        </Card>

        {/* Monthly Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Monthly breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-medium text-muted-foreground">Month</th>
                  <th className="text-right py-2 text-sm font-medium text-muted-foreground">Dividends</th>
                  <th className="text-right py-2 text-sm font-medium text-muted-foreground">Interest</th>
                  <th className="text-right py-2 text-sm font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {projectedIncomeData.map((item, index) => (
                  <tr key={item.month} className={index < projectedIncomeData.length - 1 ? 'border-b' : ''}>
                    <td className="py-2">{item.month}</td>
                    <td className="text-right font-medium text-green-600">{formatAmount(item.dividends)}</td>
                    <td className="text-right font-medium text-green-600">{formatAmount(item.interest)}</td>
                    <td className="text-right font-medium">{formatAmount(item.total)}</td>
                  </tr>
                ))}
                <tr className="font-semibold border-t">
                  <td className="py-2">Total</td>
                  <td className="text-right font-medium text-green-600">{formatAmount(projectedIncomeData.reduce((sum, item) => sum + item.dividends, 0))}</td>
                  <td className="text-right font-medium text-green-600">{formatAmount(projectedIncomeData.reduce((sum, item) => sum + item.interest, 0))}</td>
                  <td className="text-right font-medium">{formatAmount(totalProjected)}</td>
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

export default function ProjectedIncomePage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <ProjectedIncomeContent />
    </Suspense>
  );
}

