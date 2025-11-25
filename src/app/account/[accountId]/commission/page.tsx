'use client';

export const dynamic = 'force-dynamic';

import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Rectangle } from 'recharts';
import { TooltipProps } from 'recharts';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { LastUpdated } from '@/components/ui/last-updated';
import { useAccountData } from '@/contexts/AccountDataContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useUserRole } from '@/contexts/UserRoleContext';

// Custom Tooltip Component
const CustomCommissionTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium text-foreground">{label} {data.year}</p>
        <p className="text-sm text-muted-foreground">
          Commission: <span className="font-medium text-foreground">${data.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Custom Bar Shape Component - same as CommissionWidget
interface CommissionBarShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  payload?: { bonus?: number };
}

const renderCommissionBarShape = (props: CommissionBarShapeProps) => {
  // Round the top corners for all bars
  const radius: [number, number, number, number] = [4, 4, 0, 0];
  return <Rectangle {...props} radius={radius} />;
};

export default function CommissionPage() {
  const router = useRouter();
  const { role, isHydrated } = useUserRole();
  const { data: accountData, loading, error, refreshData } = useAccountData();
  const { theme } = useTheme();
  const { appearanceSettings } = useSettings();

  // Use the same color logic as CommissionWidget
  const chartColor = useMemo(() => {
    return appearanceSettings.chartPrimaryColor || '#BEA36F';
  }, [appearanceSettings.chartPrimaryColor]);

  // 2025 data - August to January (most recent first)
  const data2025 = [
    { id: '8', month: 'Aug', year: 2025, totalCommission: 5547.30, averagePerTrade: 13.25, equityTrades: 51, optionTrades: 33, otherTrades: 10, date: '2025-08-01' },
    { id: '7', month: 'Jul', year: 2025, totalCommission: 6345.78, averagePerTrade: 15.50, equityTrades: 57, optionTrades: 22, otherTrades: 11, date: '2025-07-01' },
    { id: '6', month: 'Jun', year: 2025, totalCommission: 4987.65, averagePerTrade: 11.80, equityTrades: 18, optionTrades: 22, otherTrades: 9, date: '2025-06-01' },
    { id: '5', month: 'May', year: 2025, totalCommission: 7125.43, averagePerTrade: 16.50, equityTrades: 48, optionTrades: 24, otherTrades: 7, date: '2025-05-01' },
    { id: '4', month: 'Apr', year: 2025, totalCommission: 5834.19, averagePerTrade: 14.20, equityTrades: 53, optionTrades: 15, otherTrades: 4, date: '2025-04-01' },
    { id: '3', month: 'Mar', year: 2025, totalCommission: 7689.12, averagePerTrade: 18.75, equityTrades: 18, optionTrades: 21, otherTrades: 9, date: '2025-03-01' },
    { id: '2', month: 'Feb', year: 2025, totalCommission: 5123.45, averagePerTrade: 12.30, equityTrades: 30, optionTrades: 28, otherTrades: 9, date: '2025-02-01' },
    { id: '1', month: 'Jan', year: 2025, totalCommission: 6543.21, averagePerTrade: 15.25, equityTrades: 41, optionTrades: 34, otherTrades: 6, date: '2025-01-01' }
  ];

  const data2024 = [
    { id: '24', month: 'Dec', year: 2024, totalCommission: 7892.67, averagePerTrade: 18.75, equityTrades: 40, optionTrades: 0, otherTrades: 0, date: '2024-12-01' },
    { id: '23', month: 'Nov', year: 2024, totalCommission: 7125.43, averagePerTrade: 16.90, equityTrades: 35, optionTrades: 0, otherTrades: 0, date: '2024-11-01' },
    { id: '22', month: 'Oct', year: 2024, totalCommission: 5834.19, averagePerTrade: 13.75, equityTrades: 28, optionTrades: 0, otherTrades: 0, date: '2024-10-01' },
    { id: '21', month: 'Sep', year: 2024, totalCommission: 6254.52, averagePerTrade: 15.60, equityTrades: 30, optionTrades: 0, otherTrades: 0, date: '2024-09-01' },
    { id: '20', month: 'Aug', year: 2024, totalCommission: 5000.00, averagePerTrade: 12.50, equityTrades: 15, optionTrades: 0, otherTrades: 0, date: '2024-08-01' },
    { id: '19', month: 'Jul', year: 2024, totalCommission: 6000.00, averagePerTrade: 14.40, equityTrades: 15, optionTrades: 0, otherTrades: 0, date: '2024-07-01' },
    { id: '18', month: 'Jun', year: 2024, totalCommission: 5500.00, averagePerTrade: 13.20, equityTrades: 18, optionTrades: 3, otherTrades: 0, date: '2024-06-01' },
    { id: '17', month: 'May', year: 2024, totalCommission: 6800.00, averagePerTrade: 16.25, equityTrades: 21, optionTrades: 0, otherTrades: 1, date: '2024-05-01' },
    { id: '16', month: 'Apr', year: 2024, totalCommission: 4800.00, averagePerTrade: 12.50, equityTrades: 18, optionTrades: 0, otherTrades: 0, date: '2024-04-01' },
    { id: '15', month: 'Mar', year: 2024, totalCommission: 6200.00, averagePerTrade: 15.00, equityTrades: 22, optionTrades: 0, otherTrades: 0, date: '2024-03-01' },
    { id: '14', month: 'Feb', year: 2024, totalCommission: 4500.00, averagePerTrade: 10.60, equityTrades: 17, optionTrades: 1, otherTrades: 2, date: '2024-02-01' },
    { id: '13', month: 'Jan', year: 2024, totalCommission: 5800.00, averagePerTrade: 13.75, equityTrades: 25, optionTrades: 0, otherTrades: 0, date: '2024-01-01' }
  ];

  // Chart data - last 12 months ending with August 2025 (total: $75,102.34)
  const chartData = useMemo(() => [
    { month: 'Sep', value: 6254.52, year: 2024 }, // September 2024
    { month: 'Oct', value: 5834.19, year: 2024 }, // October 2024
    { month: 'Nov', value: 7125.43, year: 2024 }, // November 2024
    { month: 'Dec', value: 7892.67, year: 2024 }, // December 2024
    { month: 'Jan', value: 6543.21, year: 2025 }, // January 2025
    { month: 'Feb', value: 5123.45, year: 2025 }, // February 2025
    { month: 'Mar', value: 7689.12, year: 2025 }, // March 2025
    { month: 'Apr', value: 5834.19, year: 2025 }, // April 2025
    { month: 'May', value: 7125.43, year: 2025 }, // May 2025
    { month: 'Jun', value: 4987.65, year: 2025 }, // June 2025
    { month: 'Jul', value: 6345.78, year: 2025 }, // July 2025
    { month: 'Aug', value: 5547.30, year: 2025 } // August 2025 (most recent)
  ], []);

  // Calculate totals from chart data
  const summaryData = useMemo(() => {
    const totalCommission = chartData.reduce((sum, item) => sum + item.value, 0);
    const totalTrades = 281; // Estimated total trades for the period
    const averagePerTrade = totalTrades > 0 ? totalCommission / totalTrades : 0;

    return {
      totalCommission,
      totalTrades,
      averagePerTrade
    };
  }, [chartData]);

  // Redirect clients away from commission page
  useEffect(() => {
    if (isHydrated && role === 'client') {
      // Redirect to holdings page instead
      if (accountData?.accountId) {
        router.push(`/account/${accountData.accountId}/financials/holdings`);
      }
    }
  }, [role, isHydrated, router, accountData?.accountId]);

  // Don't render for clients
  if (isHydrated && role === 'client') {
    return null;
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex flex-col gap-4">
          {/* Header Skeleton */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2">
              <div>
                <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="h-9 w-24 bg-muted rounded animate-pulse"></div>
            </div>
          </div>

          {/* Summary and Chart Card Skeleton */}
          <Card className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Summary Section Skeleton */}
              <div className="space-y-4">
                <div className="h-4 w-40 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-56 bg-muted rounded animate-pulse"></div>
                <div className="h-10 w-48 bg-muted rounded animate-pulse"></div>
                <div className="space-y-2 mt-6">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                  <div className="h-6 w-36 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                  <div className="h-6 w-36 bg-muted rounded animate-pulse"></div>
                </div>
              </div>
              {/* Chart Section Skeleton */}
              <div className="h-[300px] bg-muted rounded animate-pulse"></div>
            </div>
          </Card>

          {/* Commission Table Card Skeleton */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
              <div className="h-9 w-20 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !accountData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading commission data: {error || 'No data available'}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium text-slate-900 dark:text-slate-100" style={{ fontFamily: 'var(--font-display)' }}>Commission Summary</h1>
            <p className="text-sm text-muted-foreground mt-1">Values as of the end of the prior business day</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Combined Summary and Chart Section */}
        <Card className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Summary Section */}
            <div className="flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Total commission earned</div>
                <div className="text-sm text-muted-foreground mb-2">From September 2024 to August 2025</div>
                <h3 className="text-3xl font-medium text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                  ${summaryData.totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </h3>
                <div className="text-xs text-muted-foreground mt-1">Figures shown represent gross values</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">No. of trades</div>
                  <div className="text-lg font-medium text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{summaryData.totalTrades}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Avg per trade</div>
                  <div className="text-lg font-medium text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                    ${summaryData.averagePerTrade.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <LastUpdated 
                timestamp="Updated 09/22/2025 3:35 PM ET" 
                onRefresh={refreshData}
              />
            </div>

            {/* Chart Section */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient id="commissionGradientLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartColor} />
                      <stop offset="100%" stopColor={chartColor} stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="commissionGradientDark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartColor} />
                      <stop offset="100%" stopColor={chartColor} stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    tickFormatter={(value) => `$${value / 1000}k`}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={<CustomCommissionTooltip />}
                  />
                  <Bar 
                    dataKey="value" 
                    fill={theme === 'dark' ? "url(#commissionGradientDark)" : "url(#commissionGradientLight)"}
                    shape={renderCommissionBarShape}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Monthly Breakdown Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-normal">Monthly breakdown</h2>
            <LastUpdated 
              timestamp="Updated 01/08/2025 8:05 AM ET" 
              className=""
            />
          </div>

          {/* 2025 Table */}
          <Card className="mb-8">
            <div className="p-6">
              <h3 className="text-md font-medium text-foreground mb-4">2025</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap border-r">
                        <span className="text-xs">Month</span>
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground whitespace-nowrap border-r">
                        <span className="text-xs">Total commission</span>
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground whitespace-nowrap border-r">
                        <span className="text-xs">Average per trade</span>
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground whitespace-nowrap border-r">
                        <span className="text-xs">Equity trades</span>
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground whitespace-nowrap border-r">
                        <span className="text-xs">Option trades</span>
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                        <span className="text-xs">Other trades</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data2025.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-muted-foreground">
                          No commission data for 2025
                        </td>
                      </tr>
                    ) : (
                      data2025.map((item, index) => (
                        <tr key={item.id} className={`border-b cursor-pointer hover:bg-accent transition-colors ${index % 2 === 1 ? 'bg-card' : ''}`}>
                          <td className="px-4 py-3 text-foreground">{item.month}</td>
                          <td className="px-4 py-3 text-right text-foreground">
                            ${item.totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 text-right text-foreground">
                            ${(item.totalCommission / (item.equityTrades + item.optionTrades + item.otherTrades)).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-foreground">{item.equityTrades === 0 ? '-' : item.equityTrades}</td>
                          <td className="px-4 py-3 text-right text-foreground">{item.optionTrades === 0 ? '-' : item.optionTrades}</td>
                          <td className="px-4 py-3 text-right text-foreground">{item.otherTrades === 0 ? '-' : item.otherTrades}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* 2024 Table */}
          <Card>
            <div className="p-6">
              <h3 className="text-md font-medium text-foreground mb-4">2024</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap border-r">
                        <span className="text-xs">Month</span>
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground whitespace-nowrap border-r">
                        <span className="text-xs">Total commission</span>
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground whitespace-nowrap border-r">
                        <span className="text-xs">Average per trade</span>
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground whitespace-nowrap border-r">
                        <span className="text-xs">Equity trades</span>
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground whitespace-nowrap border-r">
                        <span className="text-xs">Option trades</span>
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                        <span className="text-xs">Other trades</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data2024.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-muted-foreground">
                          No commission data for 2024
                        </td>
                      </tr>
                    ) : (
                      data2024.map((item, index) => (
                        <tr key={item.id} className={`border-b cursor-pointer hover:bg-accent transition-colors ${index % 2 === 1 ? 'bg-card' : ''}`}>
                          <td className="px-4 py-3 text-foreground">{item.month}</td>
                          <td className="px-4 py-3 text-right text-foreground">
                            ${item.totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 text-right text-foreground">
                            ${(item.totalCommission / (item.equityTrades + item.optionTrades + item.otherTrades)).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-foreground">{item.equityTrades === 0 ? '-' : item.equityTrades}</td>
                          <td className="px-4 py-3 text-right text-foreground">{item.optionTrades === 0 ? '-' : item.optionTrades}</td>
                          <td className="px-4 py-3 text-right text-foreground">{item.otherTrades === 0 ? '-' : item.otherTrades}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
