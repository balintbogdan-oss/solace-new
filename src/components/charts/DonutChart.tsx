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
  size?: 'default' | 'large'
}

export function DonutChart({ data, portfolioValue, size = 'default' }: DonutChartProps) {
  const formatPortfolioValue = (value?: number, fullFormat = false) => {
    if (!value) return '$0.0K';
    
    if (fullFormat) {
      // Full format for large chart: $23,100,000.18
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value.toFixed(1)}`;
    }
  };

  const isLarge = size === 'large';
  const containerSize = isLarge ? 'w-[200px] h-[200px]' : 'w-48 h-48';
  const innerRadius = isLarge ? 80 : 65;
  const outerRadius = isLarge ? 100 : 90;
  const valueTextSize = isLarge ? 'text-base' : 'text-2xl';
  const valueLeading = isLarge ? 'leading-6' : 'leading-10';
  const labelTextSize = isLarge ? 'text-xs' : 'text-xs';
  const labelLeading = isLarge ? 'leading-5' : 'leading-5';

  // Create a key from data to force re-animation when data changes
  const dataKey = JSON.stringify(data.map(d => ({ name: d.name, value: d.value })));

  return (
    <div className={`relative ${containerSize}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Base Pie */}
          <Pie
            key={dataKey}
            data={data}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
            startAngle={90}
            endAngle={-270}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-base-${index}`} fill={entry.color} />
            ))}
          </Pie>
         
        </PieChart>
      </ResponsiveContainer>

      {/* Centered label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        {isLarge ? (
          <>
            <div className={`${labelTextSize} font-medium ${labelLeading} text-muted-foreground`}>Portfolio value</div>
            <h3 className={`${valueTextSize} font-medium ${valueLeading} text-foreground`}>{formatPortfolioValue(portfolioValue, true)}</h3>
          </>
        ) : (
          <>
            <h3 className={`${valueTextSize} font-medium ${valueLeading} text-foreground`}>{formatPortfolioValue(portfolioValue)}</h3>
            <div className={`${labelTextSize} font-medium ${labelLeading} text-card-foreground`}>Portfolio value</div>
          </>
        )}
      </div>
    </div>
  )
}