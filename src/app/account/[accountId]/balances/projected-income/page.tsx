'use client';

import { useState, useEffect } from 'react';
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
import { Download, Info } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useAccountData } from '@/contexts/AccountDataContext';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { AccountBreadcrumb } from '@/components/layout/AccountBreadcrumb';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

// Mock projected income data matching the screenshot
const projectedIncomeData2025 = [
  { month: 'Mar', totalMaturities: 200.00, interestIncome: 1200.00, dividendIncome: 1800.00, totalIncome: 3200.00 },
  { month: 'Apr', totalMaturities: 800.00, interestIncome: 1100.00, dividendIncome: 2000.00, totalIncome: 3900.00 },
  { month: 'May', totalMaturities: 1150.00, interestIncome: 1150.00, dividendIncome: 1900.00, totalIncome: 4200.00 },
  { month: 'Jun', totalMaturities: 1180.00, interestIncome: 1180.00, dividendIncome: 2100.00, totalIncome: 4460.00 },
  { month: 'Jul', totalMaturities: 520.00, interestIncome: 1220.00, dividendIncome: 1950.00, totalIncome: 3690.00 },
  { month: 'Aug', totalMaturities: 250.00, interestIncome: 1250.00, dividendIncome: 2050.00, totalIncome: 3550.00 },
  { month: 'Sept', totalMaturities: 280.00, interestIncome: 1280.00, dividendIncome: 2150.00, totalIncome: 3710.00 },
  { month: 'Oct', totalMaturities: 300.00, interestIncome: 1300.00, dividendIncome: 2200.00, totalIncome: 3800.00 },
  { month: 'Nov', totalMaturities: 320.00, interestIncome: 1320.00, dividendIncome: 2250.00, totalIncome: 3890.00 },
  { month: 'Dec', totalMaturities: 350.00, interestIncome: 1350.00, dividendIncome: 2300.00, totalIncome: 4000.00 },
];

const projectedIncomeData2026 = [
  { month: 'Jan', totalMaturities: 200.00, interestIncome: 1200.00, dividendIncome: 1800.00, totalIncome: 3200.00 },
  { month: 'Feb', totalMaturities: 800.00, interestIncome: 1100.00, dividendIncome: 2000.00, totalIncome: 3900.00 },
];

const totalProjected = 170373.04;
const totalDividendIncome = 150000.00;
const totalInterestIncome = 18000.00;
const totalMaturities = 2373.04;

function ProjectedIncomeContent() {
  const params = useParams();
  const accountId = params?.accountId as string;
  const { refreshData } = useAccountData();
  const [primaryColor, setPrimaryColor] = useState<string>('rgb(142, 85, 4)');

  // Get computed primary color for SVG
  useEffect(() => {
    const updatePrimaryColor = () => {
      const root = document.documentElement;
      const primaryRgb = getComputedStyle(root).getPropertyValue('--primary').trim();
      if (primaryRgb) {
        const [r, g, b] = primaryRgb.split(' ').map(Number);
        setPrimaryColor(`rgb(${r}, ${g}, ${b})`);
      }
    };
    
    updatePrimaryColor();
    const observer = new MutationObserver(updatePrimaryColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    return () => observer.disconnect();
  }, []);

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
    <TooltipProvider>
      <div className="w-full">
        <div className="flex flex-col gap-4">
          {/* Breadcrumb */}
          <AccountBreadcrumb 
            items={[
              { label: 'Balances', href: `/account/${accountId}/balances` },
              { label: 'Projected income' }
            ]}
          />

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="w-full md:w-auto">
              <PageHeading className="text-slate-900 dark:text-slate-100">Projected income</PageHeading>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Summary Card with Chart */}
          <Card className="p-6 bg-card">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-muted-foreground">Total projected March 2025 - February 2026</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Projected income for the next 12 months.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <h3 className="text-2xl font-medium mb-4" style={{ fontFamily: 'var(--font-display)' }}>{formatAmount(totalProjected)}</h3>
                <div className="border-t mb-4"></div>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Dividend income</span>
                    <span className="font-medium">{formatAmount(totalDividendIncome)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Interest income</span>
                    <span className="font-medium">{formatAmount(totalInterestIncome)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total maturities</span>
                    <span className="font-medium">{formatAmount(totalMaturities)}</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="lg:col-span-3 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[...projectedIncomeData2025, ...projectedIncomeData2026]} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="projectedIncomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={primaryColor} />
                        <stop offset="100%" stopColor={primaryColor} stopOpacity="0.1" />
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
                      tickFormatter={(value) => `$${value / 1000}K`}
                      className="text-muted-foreground"
                    />
                    <RechartsTooltip
                      cursor={{ fill: 'transparent' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card border border-border rounded-lg shadow-lg p-3">
                              <p className="font-medium text-foreground">{data.month}</p>
                              <p className="text-sm text-muted-foreground">
                                Total: <span className="font-medium text-foreground">{formatAmount(data.totalIncome)}</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="totalIncome" 
                      fill={primaryColor}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-6">
              <LastUpdated 
                timestamp={`Updated ${getCurrentTimestamp()}`} 
                onRefresh={refreshData}
              />
            </div>
          </Card>

          {/* Monthly Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-normal">Monthly breakdown</h3>
            </div>
            <LastUpdated 
              timestamp={`Updated ${getCurrentTimestamp()}`} 
              onRefresh={refreshData}
              className="mb-4"
            />
            
            {/* 2025 Card */}
            <Card className="p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-medium text-foreground">2025</h4>
              </div>
              <div className="overflow-x-auto">
                <Table className="w-full text-sm">
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="text-left px-6 py-3 whitespace-nowrap">
                        <span className="text-sm">Month</span>
                      </TableHead>
                      <TableHead className="text-left px-6 py-3 whitespace-nowrap">
                        <span className="text-sm">Total maturities</span>
                      </TableHead>
                      <TableHead className="text-left px-6 py-3 whitespace-nowrap">
                        <span className="text-sm">Interest income</span>
                      </TableHead>
                      <TableHead className="text-left px-6 py-3 whitespace-nowrap">
                        <span className="text-sm">Dividend income</span>
                      </TableHead>
                      <TableHead className="text-left px-6 py-3 whitespace-nowrap">
                        <span className="text-sm">Total income</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectedIncomeData2025.map((item, index) => {
                      const monthNames: Record<string, string> = {
                        'Mar': 'March',
                        'Apr': 'April',
                        'May': 'May',
                        'Jun': 'June',
                        'Jul': 'July',
                        'Aug': 'August',
                        'Sept': 'September',
                        'Oct': 'October',
                        'Nov': 'November',
                        'Dec': 'December',
                      };
                      return (
                        <TableRow key={`2025-${item.month}`} className={`border-b ${index % 2 === 1 ? 'bg-card' : ''}`}>
                          <TableCell className="px-6 py-3 text-foreground bg-card">{monthNames[item.month] || item.month}</TableCell>
                          <TableCell className="px-6 py-3 text-foreground bg-card">{formatAmount(item.totalMaturities)}</TableCell>
                          <TableCell className="px-6 py-3 text-foreground bg-card">{formatAmount(item.interestIncome)}</TableCell>
                          <TableCell className="px-6 py-3 text-foreground bg-card">{formatAmount(item.dividendIncome)}</TableCell>
                          <TableCell className="px-6 py-3 text-foreground bg-card">{formatAmount(item.totalIncome)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* 2026 Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-medium text-foreground">2026</h4>
              </div>
              <div className="overflow-x-auto">
                <Table className="w-full text-sm">
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="text-left px-6 py-3 whitespace-nowrap">
                        <span className="text-sm">Month</span>
                      </TableHead>
                      <TableHead className="text-left px-6 py-3 whitespace-nowrap">
                        <span className="text-sm">Total maturities</span>
                      </TableHead>
                      <TableHead className="text-left px-6 py-3 whitespace-nowrap">
                        <span className="text-sm">Interest income</span>
                      </TableHead>
                      <TableHead className="text-left px-6 py-3 whitespace-nowrap">
                        <span className="text-sm">Dividend income</span>
                      </TableHead>
                      <TableHead className="text-left px-6 py-3 whitespace-nowrap">
                        <span className="text-sm">Total income</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectedIncomeData2026.map((item, index) => {
                      const monthNames: Record<string, string> = {
                        'Jan': 'January',
                        'Feb': 'February',
                      };
                      return (
                        <TableRow key={`2026-${item.month}`} className={`border-b ${index % 2 === 1 ? 'bg-card' : ''}`}>
                          <TableCell className="px-6 py-3 text-foreground bg-card">{monthNames[item.month] || item.month}</TableCell>
                          <TableCell className="px-6 py-3 text-foreground bg-card">{formatAmount(item.totalMaturities)}</TableCell>
                          <TableCell className="px-6 py-3 text-foreground bg-card">{formatAmount(item.interestIncome)}</TableCell>
                          <TableCell className="px-6 py-3 text-foreground bg-card">{formatAmount(item.dividendIncome)}</TableCell>
                          <TableCell className="px-6 py-3 text-foreground bg-card">{formatAmount(item.totalIncome)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default function ProjectedIncomePage() {
  return <ProjectedIncomeContent />;
}

