'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  ResponsiveContainer, 
  XAxis, YAxis, Tooltip, 
  AreaChart, Area
} from 'recharts'
import { cn } from '@/lib/utils'
import { TooltipProps } from 'recharts'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useAccountData } from '@/contexts/SupabaseAccountDataContext'
import { MarketData } from '@/types/account'
import { MutualFundInfo } from '@/types/account'
import { useTheme } from 'next-themes'

// Generate mock chart data for mutual funds
const generateMockChartData = (symbol: string, basePrice: number) => ({
  '1D': [
    { time: '10:00', nav: basePrice * 0.995 },
    { time: '11:00', nav: basePrice * 0.998 },
    { time: '12:00', nav: basePrice * 1.001 },
    { time: '13:00', nav: basePrice * 1.002 },
    { time: '14:00', nav: basePrice },
  ],
  '1W': [
    { time: 'Mon', nav: basePrice * 0.99 },
    { time: 'Tue', nav: basePrice * 0.995 },
    { time: 'Wed', nav: basePrice * 0.998 },
    { time: 'Thu', nav: basePrice * 1.001 },
    { time: 'Fri', nav: basePrice },
  ],
  '1M': Array.from({ length: 30 }, (_, i) => ({ 
    time: `Day ${i+1}`, 
    nav: basePrice * (0.95 + i * 0.02 + Math.random() * 0.06) 
  })),
  '6M': Array.from({ length: 26 }, (_, i) => ({ 
    time: `W ${i+1}`, 
    nav: basePrice * (0.9 + i * 0.04 + Math.random() * 0.12) 
  })),
  'YTD': Array.from({ length: 9 }, (_, i) => ({ 
    time: `M ${i+1}`, 
    nav: basePrice * (0.85 + i * 0.02 + Math.random() * 0.08) 
  })),
  '1Y': Array.from({ length: 12 }, (_, i) => ({
    time: new Date(new Date().getFullYear(), i, 1).toLocaleString('default', { month: 'short' }),
    nav: basePrice * (0.8 + i * 0.02 + Math.random() * 0.1)
  })),
  'MAX': Array.from({ length: 5 }, (_, i) => ({
    time: (new Date().getFullYear() - 4 + i).toString(),
    nav: basePrice * (0.6 + i * 0.1 + Math.random() * 0.15)
  }))
});

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const value = payload[0].value as number;
    return (
      <div className="backdrop-blur-xl border p-2 rounded-lg shadow-lg">
        <p className="text-sm text-muted-foreground">{`Time: ${label}`}</p>
        <p className="text-sm font-medium">{`NAV: $${value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

interface MutualFundDetailPanelProps {
  symbol: string;
  marketData?: MarketData;
  onTradeAction?: (symbol: string, action: 'buy' | 'sell') => void;
  className?: string;
  dataSource?: 'live' | 'mock';
}

type TimeFrame = '1D' | '1W' | '1M' | '6M' | 'YTD' | '1Y' | 'MAX';

const timeFrames: TimeFrame[] = ['1D', '1W', '1M', '6M', 'YTD', '1Y', 'MAX'];


// Function to generate realistic 1D NAV data for mutual funds
const generateRealistic1DNavData = (marketData: Record<string, unknown> | MarketData) => {
  const points = [];
  
  const currentNav = Number(marketData?.currentPrice) || 0;
  const dayChange = Number(marketData?.dayChange) || 0;
  const open = currentNav - dayChange;
  const high = Number(marketData?.high) || Math.max(open, currentNav) + Math.abs(dayChange) * 0.3;
  const low = Number(marketData?.low) || Math.min(open, currentNav) - Math.abs(dayChange) * 0.3;
  
  if (open > 0 && high > 0 && low > 0) {
    const navRange = high - low;
    const startTime = 9 * 60 + 30; // 9:30 AM
    const endTime = 16 * 60; // 4:00 PM
    const interval = 15; // 15 minutes
    
    for (let minutes = startTime; minutes <= endTime; minutes += interval) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      const progress = (minutes - startTime) / (endTime - startTime);
      
      // Mutual funds have less intraday volatility than stocks
      let nav;
      if (progress < 0.1) {
        nav = open + (Math.random() - 0.5) * (navRange * 0.02);
      } else if (progress < 0.3) {
        const trendFactor = Math.min(progress * 3, 1);
        if (dayChange > 0) {
          nav = open + (high - open) * trendFactor + (Math.random() - 0.5) * (navRange * 0.02);
        } else {
          const downwardTrend = (low - open) * trendFactor;
          nav = open + downwardTrend + (Math.random() - 0.5) * (navRange * 0.03);
        }
      } else if (progress < 0.7) {
        const midNav = (high + low) / 2;
        const volatility = navRange * 0.05; // Much lower volatility than stocks
        const trendBias = dayChange > 0 ? 0.1 : -0.1;
        nav = midNav + (Math.random() - 0.5 + trendBias) * volatility;
      } else {
        const trendFactor = (progress - 0.7) / 0.3;
        const targetNav = currentNav;
        const trendBias = dayChange > 0 ? 0.15 : -0.15;
        nav = (high + low) / 2 + (targetNav - (high + low) / 2) * trendFactor + (Math.random() - 0.5 + trendBias) * (navRange * 0.02);
      }
      
      if (progress >= 0.99) {
        nav = currentNav;
      }
      
      nav = Math.max(low, Math.min(high, nav));
      
      points.push({ 
        time, 
        nav: parseFloat(nav.toFixed(2))
      });
    }
  }
  
  return points;
};

export function MutualFundDetailPanel({
  symbol,
  marketData,
  onTradeAction,
  className,
  dataSource = 'live'
}: MutualFundDetailPanelProps) {
  const { theme } = useTheme();
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('1D');
  const [mutedColor, setMutedColor] = useState('#9ca3af');
  const [mutualFund, setMutualFund] = useState<MutualFundInfo | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const accountData = useAccountData();
  const liveMarketData = dataSource === 'live' ? accountData.data?.marketData : null;

  // Fetch mutual fund data when symbol changes
  useEffect(() => {
    const upperSymbol = symbol?.toUpperCase();
    
    // Use marketData prop if provided, otherwise try live market data
    const realMarketData = marketData || (liveMarketData?.find ? liveMarketData.find(m => m.symbol === upperSymbol) : null);
    
    if (realMarketData) {
      // Create MutualFundInfo from real market data
      const mutualFundInfo: MutualFundInfo = {
        symbol: upperSymbol,
        name: realMarketData.description || `${upperSymbol} Fund`,
        exchangeInfo: 'Mutual Fund - NAV • USD',
        nav: realMarketData.currentPrice || 0,
        change: realMarketData.dayChange || 0,
        changePercent: realMarketData.dayChangePercent || 0,
        expenseRatio: realMarketData.fundDetails?.expenseRatio || 0.03,
        minimumInvestment: 3000, // Default minimum
        chartData: {
          '1D': generateRealistic1DNavData(realMarketData),
          '1W': generateMockChartData(upperSymbol, realMarketData.currentPrice || 100)['1W'],
          '1M': generateMockChartData(upperSymbol, realMarketData.currentPrice || 100)['1M'],
          '6M': generateMockChartData(upperSymbol, realMarketData.currentPrice || 100)['6M'],
          'YTD': generateMockChartData(upperSymbol, realMarketData.currentPrice || 100)['YTD'],
          '1Y': generateMockChartData(upperSymbol, realMarketData.currentPrice || 100)['1Y'],
          'MAX': generateMockChartData(upperSymbol, realMarketData.currentPrice || 100)['MAX']
        },
        marketStats: {
          open: realMarketData.open || 0,
          high: realMarketData.high || 0,
          low: realMarketData.low || 0,
          prevClose: realMarketData.previousClose || 0,
          '52W High': realMarketData.fiftyTwoWeekHigh || 0,
          '52W Low': realMarketData.fiftyTwoWeekLow || 0,
          ytdReturn: realMarketData.fundDetails?.ytdReturn || 8.5,
          totalAssets: realMarketData.marketCap || 1000000000
        },
        fundDetails: realMarketData.fundDetails
      };
      setMutualFund(mutualFundInfo);
    } else {
      // Fallback to mock data if not found
      const mockData = generateMockChartData(upperSymbol, 100); // Default base price
      const mockMutualFund: MutualFundInfo = {
        symbol: upperSymbol,
        name: `${upperSymbol} Fund`,
        exchangeInfo: 'Mutual Fund - NAV • USD',
        nav: 100,
        change: 0,
        changePercent: 0,
        expenseRatio: 0.03,
        minimumInvestment: 3000,
        chartData: mockData,
        marketStats: {
          open: 100,
          high: 101,
          low: 99,
          prevClose: 100,
          '52W High': 120,
          '52W Low': 80,
          ytdReturn: 8.5,
          totalAssets: 1000000000
        },
        fundDetails: {
          previousClose: 100,
          ytdReturn: 8.5,
          expenseRatio: 0.03,
          category: 'US Equity Large Cap Blend',
          netAssets: 1.0,
          yield: 1.0,
          frontLoad: '-',
          inceptionDate: '01 Jan 2000'
        }
      };
      setMutualFund(mockMutualFund);
    }
  }, [symbol, marketData, liveMarketData]);

  // Get computed muted color on mount and theme change
  useEffect(() => {
    const updateMutedColor = () => {
        if (typeof window !== 'undefined') {
           const color = getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim();
           setMutedColor(color || '#9ca3af');
        }
    };

    updateMutedColor();

  }, []);

  const handleRefresh = () => {
      // TODO: Add logic here to actually refresh mutual fund data if needed
  };

  // Get chart data for current timeframe
  const currentChartData = useMemo(() => {
    if (!mutualFund) {
      return [];
    }

    // First check if we have existing chart data for this timeframe
    if (typeof mutualFund.chartData === 'object' && !Array.isArray(mutualFund.chartData)) {
      const existingData = mutualFund.chartData[selectedTimeFrame];
      if (existingData && existingData.length > 0) {
        return existingData;
      }
    }
    
    // If no existing data, try to generate realistic data
    const realMarketData = (Array.isArray(marketData) ? marketData : [])?.find((md: unknown) => (md as { symbol: string }).symbol === symbol?.toUpperCase());
    if (realMarketData) {
      if (selectedTimeFrame === '1D') {
        const data = generateRealistic1DNavData(realMarketData);
        return data;
      } else {
        // For other timeframes, generate mock data based on current price
        const mockData = generateMockChartData(symbol?.toUpperCase() || '', realMarketData.currentPrice || mutualFund.nav);
        return mockData[selectedTimeFrame] || [];
      }
    } else if (selectedTimeFrame === '1D') {
      const data = generateRealistic1DNavData({ currentPrice: mutualFund.nav });
      return data;
    }
    
    // Fallback to array data or empty array
    const data = Array.isArray(mutualFund.chartData) ? mutualFund.chartData : [];
    return data;
  }, [selectedTimeFrame, mutualFund, marketData, symbol]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!mutualFund || !isMounted) {
      return <div className="h-[250px] flex items-center justify-center text-muted-foreground">Loading Mutual Fund Data...</div>; 
  }

  // Determine stroke color based on actual day change
  const realMarketData = (Array.isArray(marketData) ? marketData : [])?.find((md: unknown) => (md as { symbol: string }).symbol === symbol?.toUpperCase());
  const actualDayChange = realMarketData?.dayChange || mutualFund.change || 0;
  const isPositive = actualDayChange >= 0;
  
  const strokeColor = isPositive 
    ? (theme === 'dark' ? '#84cc16' : '#65a30d') // One notch brighter warmer green
    : '#fca5a5'; // Red color remains the same
  const dataKey = 'nav'; // Use NAV instead of price

  const formatYAxisTick = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className={cn("space-y-4 relative rounded-md focus:outline-none focus-visible:outline-none focus-visible:ring-0", className)}>

      {/* Buy/Sell Buttons */}
      {onTradeAction && (
        <div className="flex gap-4">
           <Button
              size="lg"
              onClick={() => onTradeAction(symbol, 'buy')}
              className={cn(
                "bg-lime-500 hover:bg-lime-600 dark:bg-lime-800 dark:hover:bg-lime-700 dark:border dark:border-lime-200",
                "text-white dark:text-white font-semibold"
              )}
           >
             Buy {symbol.toUpperCase()}
           </Button>
           <Button
              size="lg"
              onClick={() => onTradeAction(symbol, 'sell')}
              className={cn(
                "bg-red-600 hover:bg-red-600 dark:bg-red-900 dark:hover:bg-red-700 dark:border dark:border-red-400",
                "text-white dark:text-white font-semibold"
              )}
           >
             Sell {symbol.toUpperCase()}
           </Button>
        </div>
      )}  

      {/* Chart Controls */}
      <div className="flex flex-col items-stretch gap-2 md:hidden"> 
        <div className="w-full flex flex-wrap items-center bg-muted p-1 rounded-md space-x-1 gap-y-1">
          {timeFrames.map((frame) => (
            <Button
              key={`${frame}-mobile`}
              variant={selectedTimeFrame === frame ? 'secondary' : 'ghost'}
              onClick={() => setSelectedTimeFrame(frame)}
              className="px-3 h-8"
            >
              {frame}
            </Button>
          ))}
        </div>
      </div>

      <div className="hidden md:flex md:flex-row md:justify-between md:items-center md:gap-2"> 
        <div className="flex items-center bg-muted p-1 rounded-md space-x-1"> 
          {timeFrames.map((frame) => (
            <Button
              key={`${frame}-desktop`}
              variant={selectedTimeFrame === frame ? 'secondary' : 'ghost'}
              onClick={() => setSelectedTimeFrame(frame)}
              className="px-3 h-8"
            >
              {frame}
            </Button>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end items-center space-x-2 pt-1 text-muted-foreground text-xs"> 
         <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6"
            onClick={handleRefresh}
            aria-label="Refresh data"
         >
             <RefreshCw className="h-3 w-3" />
         </Button>
      </div>

      {/* Chart */} 
      <div className="h-[250px] w-full mt-1 rounded-md"> 
        {currentChartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No chart data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentChartData} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
            <defs>
              <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ strokeDasharray: '3 3', stroke: 'hsl(var(--muted-foreground))' }}
            />
            <XAxis 
               dataKey="time" 
               axisLine={false}
               tickLine={false}
               tick={{ fill: mutedColor, fontSize: 14 }}
               dy={13}
            /> 
            <YAxis 
               axisLine={false}
               tickLine={false}
               tick={{ fill: mutedColor, fontSize: 14 }}
               tickFormatter={formatYAxisTick}
               domain={['dataMin * 0.995', 'dataMax * 1.005']}
               width={60}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={strokeColor} 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#navGradient)" 
              dot={false}
              activeDot={{ r: 4, fill: strokeColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>

      {/* Fund Details */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {mutualFund.fundDetails ? (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Previous close</span>
              <span>${mutualFund.fundDetails.previousClose.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">YTD Return</span>
              <span>{mutualFund.fundDetails.ytdReturn.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expense Ratio</span>
              <span>{mutualFund.fundDetails.expenseRatio.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="text-right">{mutualFund.fundDetails.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Net assets</span>
              <span>{mutualFund.fundDetails.netAssets.toFixed(2)}B USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Yield</span>
              <span>{mutualFund.fundDetails.yield.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Front load</span>
              <span>{mutualFund.fundDetails.frontLoad}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Inception date</span>
              <span>{mutualFund.fundDetails.inceptionDate}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between"><span className="text-muted-foreground">Previous close</span><span>N/A</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">YTD Return</span><span>N/A</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Expense Ratio</span><span>N/A</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span>N/A</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Net assets</span><span>N/A</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Yield</span><span>N/A</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Front load</span><span>N/A</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Inception date</span><span>N/A</span></div>
          </>
        )}
      </div>
    </div>
  )
}
