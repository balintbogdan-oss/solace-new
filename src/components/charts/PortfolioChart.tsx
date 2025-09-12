'use client'

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { Button } from '@/components/ui/button'
import { TooltipProps } from 'recharts'

const TIME_PERIODS = ['1D', '1W', '1M', '6M', 'YTD', '1Y'] as const

interface PortfolioChartProps {
  data: Array<{ name: string; value: number }>
}

// Updated function to format currency with abbreviation
function formatAbbreviatedCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

// Keep the original for tooltip or other uses if needed
function formatFullCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Custom Tooltip Component
const CustomPortfolioTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    // Use full format for tooltip clarity
    const formattedValue = value ? formatFullCurrency(value) : 'N/A'; 

    return (
      <div className="rounded-lg border bg-background/30 backdrop-blur-lg p-2 shadow-sm">
        <div className="grid grid-cols-1 gap-1.5">
          <div className="flex flex-col space-y-1.5">
            <span className="text-[0.7rem] uppercase text-muted-foreground">{label}</span>
            <span className="font-mono text-sm font-semibold text-foreground">
              {formattedValue}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export function PortfolioChart({ data }: PortfolioChartProps) {
  return (
    <div>
      <div className="flex items-center gap-1">
        {TIME_PERIODS.map((period) => (
          <Button
            key={period}
            variant={period === '1Y' ? 'outline' : 'ghost'}
            size="sm"
            className="px-2.5"
          >
            {period}
          </Button>
        ))}
      </div>

      <div className="h-[200px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="hsl(var(--chart-primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888888', fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={formatAbbreviatedCurrency}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888888', fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ stroke: 'hsl(var(--foreground))', strokeWidth: 1, strokeDasharray: '3 3' }}
              content={<CustomPortfolioTooltip />}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--chart-primary))"
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 