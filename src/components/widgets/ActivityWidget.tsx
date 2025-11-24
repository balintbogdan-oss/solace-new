'use client'

import {ArrowDown, ArrowUp } from 'lucide-react';

// Define TimePeriod type again locally if needed
// const TIME_PERIODS = ['1D', '1W', '1M', '6M', 'YTD', '1Y'] as const;
// type TimePeriod = typeof TIME_PERIODS[number];

// Placeholder data - replace with actual data fetching
const activityData = {
  trades: {
    total: 64,
    buy: 34,
    sell: 34,
    accounts: 12
  },
  deposits: {
    net: 20500.00,
    in: 28500.00,
    out: 48500.00
  },
  lastUpdated: '04/29/2025 10:30 PM'
};

export function ActivityWidget() {
  // Removed unused selectedPeriod state
  // const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1D');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  return (
    <div className="rounded-lg h-full flex flex-col">

      {/* Content Area - Added padding top to compensate for removed header */} 
      <div className="flex-grow space-y-4 pt-2">
        {/* Trades Section */}
        <div>
          <div className="text-sm text-muted-foreground mb-1">Trades</div>
          <h2 className="text-4xl font-medium mb-1">{activityData.trades.total}</h2>
          <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
            <span>Buy <span className="font-medium text-foreground">{activityData.trades.buy}</span></span>
            <span className="border-l  h-3"></span>
            <span>Sell <span className="font-medium text-foreground">{activityData.trades.sell}</span></span>
            <span className="border-l r h-3"></span>
            <span>Across {activityData.trades.accounts} accounts</span>
          </div>
        </div>


        {/* Net Deposits Section - Updated Styling */}
        <div>
          <div className="text-sm text-muted-foreground mb-1" >Net deposits</div>
          <h3 className="text-2xl font-medium mb-3">{formatCurrency(activityData.deposits.net)}</h3>
          <div className="text-sm flex items-center gap-3 flex-wrap">
            {/* In Section - Primary icon, primary/30 background */}
            <span className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-primary/10 text-primary">
                 <ArrowDown className="h-3 w-3" />
               </div>
              <span>In {formatCurrency(activityData.deposits.in)}</span>
            </span>
            
            {/* Divider */}
            <div className="border-l h-4 self-center"></div>

            {/* Out Section - Primary icon, primary/30 background */}
            <span className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-primary/10 text-primary">
                <ArrowUp className="h-3 w-3" />
              </div>
              <span>Out {formatCurrency(activityData.deposits.out)}</span>
            </span>
          </div>
        </div>
      </div>

     
    </div>
  );
} 