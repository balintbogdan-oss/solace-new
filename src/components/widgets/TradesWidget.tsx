import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Trade {
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  time: string;
}

const recentTrades: Trade[] = [
  { symbol: 'AAPL', type: 'buy', quantity: 100, price: 182.52, time: '10:30 AM' },
  { symbol: 'MSFT', type: 'sell', quantity: 50, price: 404.35, time: '10:15 AM' },
  { symbol: 'GOOGL', type: 'buy', quantity: 25, price: 142.56, time: '10:00 AM' },
  { symbol: 'AMZN', type: 'sell', quantity: 30, price: 174.42, time: '9:45 AM' },
];

export function TradesWidget() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        {recentTrades.map((trade, index) => (
          <div 
            key={index}
            className="mb-4 p-3  border-b"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {trade.type === 'buy' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className="font-medium">{trade.symbol}</span>
              </div>
              <span className="text-xs text-gray-500">{trade.time}</span>
            </div>
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {trade.type.toUpperCase()} {trade.quantity} @ ${trade.price.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 