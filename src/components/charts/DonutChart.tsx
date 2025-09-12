'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts'

interface DonutChartProps {
  data: Array<{
    name: string
    value: number
    color: string
  }>
  portfolioValue?: number
}

export function DonutChart({ data, portfolioValue }: DonutChartProps) {
  const formatPortfolioValue = (value?: number) => {
    if (!value) return '$0.0K';
    
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value.toFixed(1)}`;
    }
  };

  return (
    <div className="relative w-48 h-48 sm:w-48 sm:h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* SVG filter definition for the shadow */}
          <defs>
            <filter id="donut-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.2)" />
            </filter>
          </defs>

          {/* Base Pie with shadow */}
          <Pie
            data={data}
            innerRadius={65}
            outerRadius={90}
            paddingAngle={1}
            dataKey="value"
            stroke="none"
            startAngle={90}
            endAngle={-270}
            filter="url(#donut-shadow)"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-base-${index}`} fill={entry.color} />
            ))}
          </Pie>
         
        </PieChart>
      </ResponsiveContainer>

      {/* Centered label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <div className="text-xl font-serif sm:text-2xl">{formatPortfolioValue(portfolioValue)}</div>
        <div className="text-xs text-muted-foreground">Portfolio Value</div>
      </div>
    </div>
  )
}