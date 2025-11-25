'use client';

export const dynamic = 'force-dynamic';

import { useMemo, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LastUpdated } from '@/components/ui/last-updated';
import { 
  Download, 
  Info,
  ChevronRight,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAccountData } from '@/contexts/AccountDataContext';
import { PageLoading } from '@/components/ui/page-loading';

function BalancesPageContent() {
  const { data: accountData, loading, error, refreshData } = useAccountData();

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

  // Hardcoded balance data with realistic uneven numbers
  const balanceData = useMemo(() => {
    return {
      cash: 44127.83,
      margin: 43892.15,
      buyingPower: 512847.32,
      totalValue: 158247.83,
      investedValue: 113127.68,
      unrealizedGL: 0,
      realizedGL: 0
    };
  }, []);

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex flex-col gap-4">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-9 w-24 bg-muted rounded animate-pulse"></div>
              <div className="h-9 w-32 bg-muted rounded animate-pulse"></div>
            </div>
          </div>

          {/* Total Account Value Card Skeleton */}
          <Card className="p-6 bg-card">
            <div className="h-5 w-40 bg-muted rounded animate-pulse mb-4"></div>
            <div className="h-10 w-48 bg-muted rounded animate-pulse mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                  <div className="h-5 w-32 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="h-4 w-48 bg-muted rounded animate-pulse mt-4"></div>
          </Card>

          {/* Main Content Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-6 w-48 bg-muted rounded animate-pulse"></div>
                  <div className="h-64 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Right Column Skeleton */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="h-6 w-40 bg-muted rounded animate-pulse"></div>
                <Card className="p-0">
                  <div className="h-32 bg-muted rounded animate-pulse"></div>
                </Card>
              </div>
              <div className="space-y-4">
                <div className="h-6 w-40 bg-muted rounded animate-pulse"></div>
                <Card className="p-6">
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !accountData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading balance data: {error || 'No data available'}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl text-slate-900 dark:text-slate-100" style={{ fontFamily: 'var(--font-display)' }}>Balances</h1>
          <div className="flex gap-2">
            <Button variant="secondary" className="h-9">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="secondary" className="h-9">
              View History
            </Button>
          </div>
        </div>

        {/* Total Account Value */}
        <Card className="p-6 bg-card">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-normal">Total account value</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-pointer">
                    <Info className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sum of available cash + FDIC Sweep + Margin Balance + Portfolio Market Value</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <h3 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>{formatAmount(balanceData.totalValue)}</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Available cash</div>
              <div className="font-medium">{formatAmount(balanceData.cash)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">FDIC Sweep</div>
              <div className="font-medium">$1,127.32</div>
            </div>
            <div>
              <div className="text-muted-foreground">Margin balance</div>
              <div className="font-medium">{formatAmount(balanceData.margin)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Portfolio market value</div>
              <div className="font-medium">{formatAmount(balanceData.investedValue)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Funds available</div>
              <div className="font-medium">{formatAmount(balanceData.buyingPower)}</div>
            </div>
          </div>
          <LastUpdated 
            timestamp={`Updated ${getCurrentTimestamp()}`} 
            onRefresh={refreshData}
            className="mt-4"
          />
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance & Market Value */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Balance & market value</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-b">
                      <th className="text-left py-2 font-medium text-muted-foreground">Type</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Balance</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Market value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-b">
                      <td className="py-2">Cash</td>
                      <td className="text-right font-medium">$15,000.00</td>
                      <td className="text-right font-medium">$45,000.00</td>
                    </tr>
                    <tr className="border-b border-b">
                      <td className="py-2">Long Margin</td>
                      <td className="text-right font-medium">$30,000.00</td>
                      <td className="text-right font-medium">$75,000.00</td>
                    </tr>
                    <tr className="border-b border-b">
                      <td className="py-2">Short Margin</td>
                      <td className="text-right">-</td>
                      <td className="text-right font-medium">-$15,000.00</td>
                    </tr>
                    <tr className="font-semibold">
                      <td className="py-2">Net Total</td>
                      <td className="text-right font-medium">$40,000.00</td>
                      <td className="text-right font-medium">$105,000.00</td>
                    </tr>
                  </tbody>
                </table>
                <LastUpdated 
                  timestamp={`Updated ${getCurrentTimestamp()}`} onRefresh={refreshData} 
                  className="mt-4"
                />
              </div>
            </Card>

            {/* Cashflow Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Cashflow summary</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-b">
                      <th className="text-left py-2 font-medium text-muted-foreground">Type</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Year to Date</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Rolling 12 Months</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-b">
                      <td className="py-2">Deposits</td>
                      <td className="text-right font-medium">$50,000.00</td>
                      <td className="text-right font-medium">$75,000.00</td>
                    </tr>
                    <tr className="border-b border-b">
                      <td className="py-2">Withdrawals</td>
                      <td className="text-right font-medium">-$15,000.00</td>
                      <td className="text-right">-$25,000.00</td>
                    </tr>
                    <tr className="border-b border-b">
                      <td className="py-2">Interest</td>
                      <td className="text-right">$1,200.00</td>
                      <td className="text-right">$2,400.00</td>
                    </tr>
                    <tr className="border-b border-b">
                      <td className="py-2">Dividends</td>
                      <td className="text-right">$3,500.00</td>
                      <td className="text-right">$7,000.00</td>
                    </tr>
                    <tr className="border-b border-b">
                      <td className="py-2">Other Income/Expense</td>
                      <td className="text-right">$500.00</td>
                      <td className="text-right">$800.00</td>
                    </tr>
                    <tr className="font-semibold">
                      <td className="py-2">Net Total</td>
                      <td className="text-right">$39,200.00</td>
                      <td className="text-right">$58,600.00</td>
                    </tr>
                  </tbody>
                </table>
                <LastUpdated 
                  timestamp={`Updated ${getCurrentTimestamp()}`} onRefresh={refreshData} 
                  className="mt-4"
                />
              </div>
            </Card>


            {/* Total Account Value History */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Total account value history</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-b">
                      <th className="text-left py-2 font-medium text-muted-foreground">Quarter</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Total account value</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">QoQ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-b">
                      <td className="py-2">Q1 2025 (3/31/2025)</td>
                      <td className="text-right">$158,000</td>
                      <td className="text-right text-green-600">+5.3%</td>
                    </tr>
                    <tr className="border-b border-b">
                      <td className="py-2">Q4 2024 (12/31/2024)</td>
                      <td className="text-right">$150,000</td>
                      <td className="text-right text-green-600">+3.4%</td>
                    </tr>
                    <tr className="border-b border-b">
                      <td className="py-2">Q3 2024 (9/30/2024)</td>
                      <td className="text-right">$145,000</td>
                      <td className="text-right text-green-600">+3.6%</td>
                    </tr>
                    <tr className="border-b border-b">
                      <td className="py-2">Q2 2024 (6/30/2024)</td>
                      <td className="text-right">$140,000</td>
                      <td className="text-right text-green-600">+3.7%</td>
                    </tr>
                    <tr className="border-b border-b">
                      <td className="py-2">Q1 2024 (3/31/2024)</td>
                      <td className="text-right">$135,000</td>
                      <td className="text-right text-green-600">+3.7%</td>
                    </tr>
                  </tbody>
                </table>
                <LastUpdated 
                  timestamp={`Updated ${getCurrentTimestamp()}`} onRefresh={refreshData} 
                  className="mt-4"
                />
              </div>
            </Card>

            {/* Interest */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Interest</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-b">
                      <th className="text-left py-2 font-medium text-muted-foreground">Type</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Credit interest</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Debit interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-b">
                      <td className="py-2">Rate Schedule</td>
                      <td className="text-right">FRM</td>
                      <td className="text-right">FRG</td>
                    </tr>
                    <tr className="border-b border-b">
                      <td className="py-2">Rate</td>
                      <td className="text-right">3%</td>
                      <td className="text-right">9%</td>
                    </tr>
                    <tr className="border-b border-b">
                      <td className="py-2">Daily Balance</td>
                      <td className="text-right">$4,728,401.13</td>
                      <td className="text-right">$5,190,704.00</td>
                    </tr>
                    <tr className="border-b border-b">
                      <td className="py-2">Daily Interest</td>
                      <td className="text-right">$388.64</td>
                      <td className="text-right">$1,279.90</td>
                    </tr>
                    <tr className="border-b border-b">
                      <td className="py-2">MTD Interest</td>
                      <td className="text-right">$2,046.75</td>
                      <td className="text-right">$2,781.96</td>
                    </tr>
                  </tbody>
                </table>
                <LastUpdated 
                  timestamp={`Updated ${getCurrentTimestamp()}`} onRefresh={refreshData} 
                  className="mt-4"
                />
              </div>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Income Overview */}
            <div>
              <h3 className="text-lg font-medium mb-4">Income overview</h3>
              <Card className="text-sm shadow-none p-0">
                <div>
                  <div className="flex items-center justify-between py-6 border-l-4 border-l-blue-600 px-4 border-b ">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Projected income</div>
                        <div className="text-xs text-gray-500">March 2025 - February 2026</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium ">$17,373.04</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-6 border-l-4 border-l-blue-600 px-4 ">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Pending income</div>
                        <div className="text-xs text-gray-500">Month of March</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">$2,072.42</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="px-2 pb-2 ">
                    
                    <LastUpdated 
                      timestamp={`Updated ${getCurrentTimestamp()}`} onRefresh={refreshData} 
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Equity & Buying Power */}
            <div>
              <h3 className="text-lg font-medium mb-4">Equity & buying power</h3>
              <Card className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fed Call</span>
                    <span className="font-medium">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">House Call</span>
                    <span className="font-medium">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Equity %</span>
                    <span className="font-medium">65.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Buying Power</span>
                    <span className="font-medium">$50,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SMA</span>
                    <span className="font-medium">$10,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Free Credit Balance</span>
                    <span className="font-medium">$35,000.00</span>
                  </div>
                  <LastUpdated 
                    timestamp={`Updated ${getCurrentTimestamp()}`} onRefresh={refreshData} 
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BalancesPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <BalancesPageContent />
    </Suspense>
  );
}
