'use client'

import { cn } from '@/lib/utils';

// Placeholder data - replace with actual data fetching logic
interface Holding {
  symbol: string;
  marketValue: number;
  aumPercent: number;
  clients: number;
  unrealizedGL: number;
}

const holdingsData: Holding[] = [
  { symbol: 'AAPL', marketValue: 10500000, aumPercent: 20, clients: 150, unrealizedGL: 1200000 },
  { symbol: 'MSFT', marketValue: 8000000, aumPercent: 15, clients: 140, unrealizedGL: 950000 },
  { symbol: 'AMZN', marketValue: 6800000, aumPercent: 13, clients: 135, unrealizedGL: 800000 },
  { symbol: 'GOOG', marketValue: 5500000, aumPercent: 11, clients: 120, unrealizedGL: 700000 },
  { symbol: 'TSLA', marketValue: 4200000, aumPercent: 8, clients: 110, unrealizedGL: 550000 },
  { symbol: 'JNJ', marketValue: 3700000, aumPercent: 7, clients: 100, unrealizedGL: 480000 },
  { symbol: 'BRK.B', marketValue: 3400000, aumPercent: 6.5, clients: 95, unrealizedGL: 450000 },
  { symbol: 'NVDA', marketValue: 3200000, aumPercent: 6.2, clients: 115, unrealizedGL: 750000 },
  { symbol: 'PG', marketValue: 2900000, aumPercent: 5.8, clients: 90, unrealizedGL: 380000 },
  { symbol: 'V', marketValue: 3100000, aumPercent: 6, clients: 132, unrealizedGL: 650230 }
];

// Removed unused lastUpdated variable

const formatValue = (value: number) => {
  const absValue = Math.abs(value);
  let formattedValue = '';

  if (absValue >= 1_000_000_000_000) {
    formattedValue = (value / 1_000_000_000_000).toFixed(1) + 'T';
  } else if (absValue >= 1_000_000_000) {
    formattedValue = (value / 1_000_000_000).toFixed(1) + 'B';
  } else if (absValue >= 1_000_000) {
    formattedValue = (value / 1_000_000).toFixed(1) + 'M';
  } else if (absValue >= 1_000) {
    formattedValue = (value / 1_000).toFixed(0) + 'K'; // No decimal for K
  } else {
    formattedValue = value.toFixed(0);
  }

  return `$${formattedValue}`;
};

const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
};

export function Top10HoldingsWidget() {
  // Use the local constant data directly
  const holdings = holdingsData;

  return (
    <div className="flex flex-col h-full">
      {/* Header - Removed title, handled by parent */}
      {/* <div className="flex justify-between items-center mb-3">...</div> */}

      {/* Table - Now takes full height */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-neutral-100 dark:bg-neutral-900">
            <tr className="border-b border-primary/10">
              <th className="py-2 pl-3 font-medium text-muted-foreground">Symbol</th>
              <th className="py-2 font-medium text-muted-foreground text-right">Market Value</th>
              <th className="py-2 font-medium text-muted-foreground text-right">% of AUM</th>
              <th className="py-2 font-medium text-muted-foreground text-right">Clients</th>
              <th className="py-2 pr-3 font-medium text-muted-foreground text-right">Unrealized G/L</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => (
              <tr key={holding.symbol} className="border-b border-primary/10 last:border-b-0 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md transition-colors duration-150">
                <td className="py-3 pl-3 font-semibold text-foreground">{holding.symbol}</td>
                <td className="py-4 text-right text-foreground">{formatValue(holding.marketValue)}</td>
                <td className="py-3 text-right text-foreground">{formatPercentage(holding.aumPercent)}</td>
                <td className="py-3 text-right text-foreground">{holding.clients}</td>
                <td className={cn(
                  "py-3 pr-3 text-right font-semibold",
                  holding.unrealizedGL >= 0 ? 'text-positive' : 'text-negative'
                )}>
                  {formatValue(holding.unrealizedGL)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer - Removed, handled by parent */}
      {/* <div className="flex items-center justify-between mt-4 pt-4 border-t">...</div> */}
    </div>
  );
} 