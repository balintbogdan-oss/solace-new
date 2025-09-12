'use client'

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const marketData: MarketData[] = [
  { symbol: 'S&P 500', price: 5915.64, change: 42.00, changePercent: 0.71 },
  { symbol: 'Dow Jones Industrial Average (DJIA)', price: 13221.90, change: -80.65, changePercent: -0.61 },
  { symbol: 'Nasdaq Comp', price: 19913.50, change: -215.07, changePercent: -1.08 },
  { symbol: 'Russell 2000', price: 21636.92, change: -361.44, changePercent: -1.67 },
  { symbol: 'Crude Oil Mar 25', price: 70.92, change: 0.79, changePercent: 1.11 },
  { symbol: 'Gold Apr 25', price: 2884.60, change: 32.02, changePercent: 1.11 },
];

export function MarketWidget() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b">
              <th className="pb-2 font-medium text-muted-foreground">Symbol</th>
              <th className="pb-2 font-medium text-muted-foreground text-right">1D % change</th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((item) => (
              <tr key={item.symbol} className="border-b last:border-b-0 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md transition-colors duration-150">
                <td className="py-2">
                  <div className="font-medium">{item.symbol}</div>
                  <div className="text-xs text-muted-foreground">{item.price.toLocaleString()}</div>
                </td>
                <td className={`py-2 text-right font-medium ${item.changePercent >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 