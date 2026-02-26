'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowRight, ArrowLeft, ChevronDown, Info, List, Grid } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define details passed when an option cell is clicked
export type OptionTradeDetails = {
  symbol: string;
  strikePrice: number;
  optionType: 'call' | 'put';
  action: 'buy' | 'sell'; // Buy Call/Put or Sell Call/Put
  price: number; // The ask price for buying, bid price for selling
  skipSegmentedControl?: boolean; // Skip segmented control and go directly to Sell to Close
  // expirationDate: string; // TODO: Add expiration date later if needed
};

interface OptionsChainTableProps {
  symbol: string;
  // Add the new callback prop
  onOptionTradeClick?: (details: OptionTradeDetails) => void;
  // Add current option trade details for highlighting
  currentOptionTrade?: OptionTradeDetails | null;
  // Add selected action from segmented control
  selectedAction?: 'buyToOpen' | 'sellToOpen' | null;
}

// --- Mock Data Generation ---
const generateMockOptionData = (symbol: string, strikeBase: number, count: number) => {
  const options = [];
  
  // More realistic parameters based on symbol
  let currentPrice, volatility, strikeIncrement;
  
  if (symbol === 'AAPL') {
    currentPrice = 234.35; // Current AAPL price
    volatility = 0.25; // 25% implied volatility
    strikeIncrement = 5; // $5 strike increments
  } else if (symbol === 'MSFT') {
    currentPrice = 319.04;
    volatility = 0.22;
    strikeIncrement = 5;
  } else if (symbol === 'GOOGL') {
    currentPrice = 134.45;
    volatility = 0.28;
    strikeIncrement = 2.5;
  } else {
    // Default for other symbols
    currentPrice = strikeBase;
    volatility = 0.25;
    strikeIncrement = 5;
  }

  // Generate strikes around current price
  const startStrike = Math.floor(currentPrice / strikeIncrement) * strikeIncrement - (Math.floor(count / 2) * strikeIncrement);
  
  for (let i = 0; i < count; i++) {
    const strike = startStrike + (i * strikeIncrement);
    
    // Check if this strike is where we should add a border (current price falls between strikes)
    const isCurrentPriceBetween = strike > currentPrice && (i === 0 || (startStrike + (i - 1) * strikeIncrement) <= currentPrice);
    
    // Calculate intrinsic value
    const callIntrinsic = Math.max(0, currentPrice - strike);
    const putIntrinsic = Math.max(0, strike - currentPrice);
    
    // Calculate time value (more realistic)
    const timeToExpiry = 0.1; // ~36 days
    const timeValue = volatility * Math.sqrt(timeToExpiry) * currentPrice * 0.4;
    
    // Base option prices - use deterministic values based on strike and symbol
    const randomSeed = (strike * 1000 + symbol.charCodeAt(0) + symbol.charCodeAt(1)) % 1000;
    const randomFactor1 = (randomSeed / 1000) * 0.3;
    const randomFactor2 = ((randomSeed * 7) % 1000 / 1000) * 0.3;
    const callPrice = callIntrinsic + timeValue * (1 + randomFactor1);
    const putPrice = putIntrinsic + timeValue * (1 + randomFactor2);
    
    // More realistic bid-ask spreads (1-3% of option price)
    const callSpread = Math.max(0.05, callPrice * 0.02);
    const putSpread = Math.max(0.05, putPrice * 0.02);
    
    // More realistic daily changes - use deterministic values
    const changeSeed1 = (strike * 13 + symbol.charCodeAt(0)) % 1000;
    const changeSeed2 = (strike * 17 + symbol.charCodeAt(1)) % 1000;
    const callChange = ((changeSeed1 / 1000) - 0.5) * callPrice * 0.4;
    const putChange = ((changeSeed2 / 1000) - 0.5) * putPrice * 0.4;
    
    // Calculate percentage changes
    const callChangePercent = callPrice > 0 ? (callChange / callPrice) * 100 : 0;
    const putChangePercent = putPrice > 0 ? (putChange / putPrice) * 100 : 0;
    
    // Volume and open interest - use deterministic values
    const volumeSeed = (strike * 19 + symbol.charCodeAt(0) + symbol.charCodeAt(1)) % 1000;
    const oiSeed = (strike * 23 + symbol.charCodeAt(0) + symbol.charCodeAt(1)) % 1000;
    const volume = Math.floor((volumeSeed / 1000) * 1000) + 10;
    const openInterest = Math.floor((oiSeed / 1000) * 5000) + 100;

    options.push({
      strike: strike,
      isCurrentPriceBetween: isCurrentPriceBetween,
      call: {
        bid: Math.max(0.01, (callPrice - callSpread / 2)).toFixed(2),
        ask: (callPrice + callSpread / 2).toFixed(2),
        last: callPrice.toFixed(2),
        change: callChange.toFixed(2),
        changePercent: callChangePercent.toFixed(2),
        close: (callPrice - callChange).toFixed(2),
        volume: volume,
        openInterest: openInterest,
      },
      put: {
        bid: Math.max(0.01, (putPrice - putSpread / 2)).toFixed(2),
        ask: (putPrice + putSpread / 2).toFixed(2),
        last: putPrice.toFixed(2),
        change: putChange.toFixed(2),
        changePercent: putChangePercent.toFixed(2),
        close: (putPrice - putChange).toFixed(2),
        volume: volume,
        openInterest: openInterest,
      },
    });
  }
  // Sort by strike price
  return options.sort((a, b) => a.strike - b.strike);
};


// --- Component ---
// export function OptionsChainTable({ symbol, onTradeEquitiesClick }: OptionsChainTableProps) { // OLD
export function OptionsChainTable({ symbol, onOptionTradeClick, currentOptionTrade, selectedAction }: OptionsChainTableProps) {
  // Get current price from market data
  const [currentPrice, setCurrentPrice] = React.useState(235); // Default for AAPL
  const [viewMode, setViewMode] = React.useState<'list' | 'straddle'>('straddle');
  
  // Debug logging
  console.log('🎯 OptionsChainTable props:', { symbol, selectedAction, currentOptionTrade });
  console.log('🎯 selectedAction type:', typeof selectedAction, 'value:', selectedAction);
  console.log('🎯 selectedAction === "sellToOpen":', selectedAction === 'sellToOpen');
  console.log('🎯 selectedAction === "buyToOpen":', selectedAction === 'buyToOpen');
  
  React.useEffect(() => {
    // Get current price based on symbol
    if (symbol === 'AAPL') setCurrentPrice(235);
    else if (symbol === 'MSFT') setCurrentPrice(320);
    else if (symbol === 'GOOGL') setCurrentPrice(135);
    else setCurrentPrice(190); // Default
  }, [symbol]);

  // TODO: Fetch real data based on symbol and selected expiration
  const mockOptionsData = React.useMemo(() => {
    return generateMockOptionData(symbol, currentPrice, 15); // More strikes for better display
  }, [symbol, currentPrice]);

  // Helper function to check if a cell is currently active
  const isCellActive = (strike: number, optionType: 'call' | 'put', action: 'buy' | 'sell') => {
    // If we have both a current option trade AND a selected action from segmented control,
    // only highlight the specific pill that matches both the trade details AND the action
    if (currentOptionTrade && selectedAction) {
      const isActive = currentOptionTrade.strikePrice === strike &&
             currentOptionTrade.optionType === optionType &&
             (
               (selectedAction === 'buyToOpen' && action === 'buy') || // Highlight ask for buyToOpen
               (selectedAction === 'sellToOpen' && action === 'sell')  // Highlight bid for sellToOpen
             );
      
      // Debug logging
      if (strike <= 200 && optionType === 'call') {
        console.log('🔍 Checking cell (segmented control + current trade):', { 
          strike, 
          optionType, 
          action, 
          selectedAction,
          currentOptionTradeStrike: currentOptionTrade.strikePrice,
          currentOptionTradeType: currentOptionTrade.optionType,
          isActive
        });
      }
      
      return isActive;
    }
    
    // If only a specific option trade is selected (no segmented control action)
    if (currentOptionTrade) {
      const isActive = currentOptionTrade.strikePrice === strike && 
             currentOptionTrade.optionType === optionType && 
             currentOptionTrade.action === action;
      
      // Debug logging
      console.log('🔍 Checking cell (current trade only):', { strike, optionType, action, isActive });
      return isActive;
    }
    
    // If only segmented control action is selected (no specific trade), don't highlight anything
    // This prevents highlighting ALL pills when just switching the segmented control
    if (selectedAction) {
      return false;
    }
    
    return false;
  };

  // Mock data for List view (separate calls and puts tables)
  const mockListData = React.useMemo(() => {
    const calls = [
      { contractName: 'AAPL250912C00295000', lastTradeDate: '8/28/2025 11:05 AM', strike: 295, lastPrice: 0.01, bid: 0.00, ask: 0.01, change: 0.00, changePercent: 0.00, volume: 2, openInterest: 127, impliedVol: 93.75 },
      { contractName: 'AAPL250912C00300000', lastTradeDate: '9/5/2025 1:33 PM', strike: 300, lastPrice: 0.01, bid: 0.00, ask: 0.01, change: 0.00, changePercent: 0.00, volume: 5, openInterest: 1352, impliedVol: 96.88 },
      { contractName: 'AAPL250912C00305000', lastTradeDate: '8/26/2025 12:27 PM', strike: 305, lastPrice: 0.01, bid: 0.00, ask: 0.01, change: 0.00, changePercent: 0.00, volume: 1, openInterest: 23, impliedVol: 103.13 },
      { contractName: 'AAPL250912C00310000', lastTradeDate: '9/8/2025 9:30 AM', strike: 310, lastPrice: 0.01, bid: 0.00, ask: 0.01, change: 0.00, changePercent: 0.00, volume: 7, openInterest: 26, impliedVol: 109.38 },
      { contractName: 'AAPL250912C00315000', lastTradeDate: '8/18/2025 10:11 AM', strike: 315, lastPrice: 0.01, bid: 0.00, ask: 0.01, change: 0.00, changePercent: 0.00, volume: 1, openInterest: 21, impliedVol: 112.50 },
      { contractName: 'AAPL250912C00320000', lastTradeDate: '9/8/2025 9:30 AM', strike: 320, lastPrice: 0.01, bid: 0.00, ask: 0.01, change: 0.00, changePercent: 0.00, volume: 1, openInterest: 107, impliedVol: 118.75 },
      { contractName: 'AAPL250912C00325000', lastTradeDate: '9/10/2025 11:29 AM', strike: 325, lastPrice: 0.01, bid: 0.00, ask: 0.01, change: 0.00, changePercent: 0.00, volume: 2, openInterest: 791, impliedVol: 121.88 },
    ];
    
    const puts = [
      { contractName: 'AAPL250912P00130000', lastTradeDate: '9/5/2025 9:37 AM', strike: 130, lastPrice: 0.01, bid: 0.00, ask: 0.01, change: 0.00, changePercent: 0.00, volume: 1, openInterest: 10, impliedVol: 187.50 },
      { contractName: 'AAPL250912P00135000', lastTradeDate: '9/9/2025 9:30 AM', strike: 135, lastPrice: 0.01, bid: 0.00, ask: 0.01, change: 0.00, changePercent: 0.00, volume: 24, openInterest: 379, impliedVol: 178.13 },
      { contractName: 'AAPL250912P00140000', lastTradeDate: '9/3/2025 2:04 PM', strike: 140, lastPrice: 0.01, bid: 0.00, ask: 0.01, change: 0.00, changePercent: 0.00, volume: 70, openInterest: 92, impliedVol: 165.63 },
      { contractName: 'AAPL250912P00145000', lastTradeDate: '8/26/2025 2:10 PM', strike: 145, lastPrice: 0.01, bid: 0.00, ask: 0.01, change: 0.00, changePercent: 0.00, volume: 10, openInterest: 87, impliedVol: 156.25 },
      { contractName: 'AAPL250912P00150000', lastTradeDate: '8/28/2025 9:57 AM', strike: 150, lastPrice: 0.01, bid: 0.00, ask: 0.01, change: 0.00, changePercent: 0.00, volume: 2, openInterest: 77, impliedVol: 143.75 },
      { contractName: 'AAPL250912P00155000', lastTradeDate: '9/10/2025 10:03 AM', strike: 155, lastPrice: 0.01, bid: 0.00, ask: 0.01, change: 0.00, changePercent: 0.00, volume: 1, openInterest: 49, impliedVol: 131.25 },
    ];
    
    return { calls, puts };
  }, []);


  return (
    <div className="rounded-lg">
      {/* Filter Controls */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Select defaultValue="all-strikes">
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="All strikes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-strikes">All strikes</SelectItem>
                <SelectItem value="near-money">Near money</SelectItem>
                <SelectItem value="itm">In the money</SelectItem>
                <SelectItem value="otm">Out of the money</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="call-put">
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue placeholder="Call/Put" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call-put">Call/Put</SelectItem>
                <SelectItem value="calls-only">Calls only</SelectItem>
                <SelectItem value="puts-only">Puts only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-accent rounded-md p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 px-3"
              onClick={() => setViewMode('list')}
            >
              <List className="h-3 w-3 mr-1" />
              List
            </Button>
            <Button
              variant={viewMode === 'straddle' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 px-3"
              onClick={() => setViewMode('straddle')}
            >
              <Grid className="h-3 w-3 mr-1" />
              Straddle
            </Button>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <span>15 minutes delay</span>
                    <Info className="h-3 w-3 info-icon" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Market data is delayed by 15 minutes for non-professional users. 
                    This delay is required by market data providers to distinguish 
                    between professional and retail traders.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Expiration Dates */}
      <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2">
        <Button
          variant="outline"
          size="sm"
          className="h-[58px] px-3 whitespace-nowrap border-primary bg-background flex flex-col items-center justify-center"
        >
          <div className="text-xs font-semibold text-primary">AUG 22</div>
          <div className="text-xs text-muted-foreground">5 days</div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-[58px] px-3 whitespace-nowrap flex flex-col items-center justify-center"
        >
          <div className="text-xs font-semibold">AUG 25</div>
          <div className="text-xs">10 days</div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-[58px] px-3 whitespace-nowrap flex flex-col items-center justify-center"
        >
          <div className="text-xs font-semibold">SEP 03</div>
          <div className="text-xs">15 days</div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-[58px] px-3 whitespace-nowrap flex flex-col items-center justify-center"
        >
          <div className="text-xs font-semibold">SEP 03</div>
          <div className="text-xs">15 days</div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-[58px] px-3 whitespace-nowrap flex flex-col items-center justify-center"
        >
          <div className="text-xs font-semibold">SEP 15</div>
          <div className="text-xs">25 days</div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-[58px] px-3 whitespace-nowrap flex flex-col items-center justify-center"
        >
          <div className="text-xs font-semibold">SEP 28</div>
          <div className="text-xs">33 days</div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-[58px] px-3 whitespace-nowrap flex flex-col items-center justify-center"
        >
          <div className="text-xs font-semibold">OCT 05</div>
          <div className="text-xs">42 days</div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-[58px] px-3 whitespace-nowrap flex flex-col items-center justify-center"
        >
          <div className="text-xs font-semibold">OCT 15</div>
          <div className="text-xs">50 days</div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-[58px] px-3 whitespace-nowrap flex flex-col items-center justify-center"
        >
          <div className="text-xs font-semibold">OCT 15</div>
          <div className="text-xs">50 days</div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-[58px] px-3 whitespace-nowrap flex flex-col items-center justify-center"
        >
          <div className="text-xs font-semibold">OCT 15</div>
          <div className="text-xs">50 days</div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-[58px] px-3 whitespace-nowrap flex flex-col items-center justify-center"
        >
          <ChevronDown className="h-3 w-3" />
          <div className="text-xs mt-1">More</div>
        </Button>
      </div>

      {/* Options Table */}
      <div className="overflow-x-auto">
        {viewMode === 'straddle' ? (
          <Table className="min-w-full border-collapse text-sm border-0">
            <TableHeader className="sticky top-0 z-10 border-0">
              <TableRow className="border-0">
                {/* Calls Header */}
                <TableHead colSpan={8} className="text-center text-sm p-2 text-black dark:text-white">
                  <div className="flex items-center justify-center gap-2">
                    <span className="uppercase">Calls</span> <ArrowRight className="h-3 w-3" />
                  </div>
                </TableHead>
                {/* Strike Header */}
                <TableHead className="text-center text-sm p-2 text-black dark:text-white align-middle min-w-[80px] uppercase bg-accent">Strike</TableHead>
                {/* Puts Header */}
                <TableHead colSpan={8} className="text-center text-sm p-2 text-black dark:text-white">
                   <div className="flex items-center justify-center gap-2">
                      <ArrowLeft className="h-3 w-3" /> <span className="uppercase">Puts</span>
                  </div>
                </TableHead>
              </TableRow>
              <TableRow>
                {/* Call Columns - Reordered to put Bid/Ask closer to strike */}
                <TableHead className="p-1 font-medium text-muted-foreground text-right text-xs">Last</TableHead>
                <TableHead className="p-1 font-medium text-muted-foreground text-right text-xs">% Change</TableHead>
                <TableHead className="p-1 font-medium text-muted-foreground text-right text-xs">Change</TableHead>
                <TableHead className="p-1 font-medium text-muted-foreground text-right text-xs">Volume</TableHead>
                <TableHead className="p-1 font-medium text-muted-foreground text-right text-xs">OI</TableHead>
                <TableHead className="p-1 font-medium text-muted-foreground text-right text-xs">Bid</TableHead>
                <TableHead className="p-1 font-medium text-muted-foreground text-right text-xs">Ask</TableHead>
                <TableHead className="p-1 font-medium text-muted-foreground text-center text-xs align-middle"></TableHead>
                {/* Strike */}
                <TableHead className="p-1 font-medium text-muted-foreground text-center text-xs bg-accent"> </TableHead>
                {/* Put Columns - Reordered to put Bid/Ask closer to strike */}
                <TableHead className="p-1 font-medium text-muted-foreground text-right text-xs">Bid</TableHead>
                <TableHead className="p-1 font-medium text-muted-foreground text-right text-xs">Ask</TableHead>
                <TableHead className="p-1 font-medium text-muted-foreground text-right text-xs">Last</TableHead>
                <TableHead className="p-1 font-medium text-muted-foreground text-right text-xs">% Change</TableHead>
                <TableHead className="p-1 font-medium text-muted-foreground text-right text-xs">Change</TableHead>
                <TableHead className="p-1 font-medium text-muted-foreground text-right text-xs">Volume</TableHead>
                <TableHead className="p-1 font-medium text-muted-foreground text-right text-xs">OI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOptionsData.map((option) => (
                <TableRow 
                  key={option.strike} 
                  className={`hover:bg-muted/50 border-0 ${option.isCurrentPriceBetween ? 'border-t-2 border-t-black dark:border-t-white' : ''}`}
                >
                  {/* Call Data - Reordered to match new header */}
                  <TableCell className="p-1 text-right text-sm">${option.call.last}</TableCell>
                  <TableCell className="p-1 text-right text-sm">
                      {option.call.changePercent}
                  </TableCell>
                  <TableCell className="p-1 text-right text-sm">
                      {option.call.change}
                  </TableCell>
                  <TableCell className="p-1 text-right text-sm">{option.call.volume.toLocaleString()}</TableCell>
                  <TableCell className="p-1 text-right text-sm">
                    <div className="flex items-center justify-end gap-1">
                      <span>{option.call.openInterest.toLocaleString()}</span>
                      {option.call.openInterest === 534 && (
                        <button
                          onClick={() => onOptionTradeClick?.({ 
                            symbol, 
                            strikePrice: option.strike, 
                            optionType: 'call', 
                            action: 'sell', 
                            price: parseFloat(option.call.bid),
                            skipSegmentedControl: true
                          })}
                          className="text-xs bg-green-600 text-white px-1 py-0.5 rounded hover:bg-green-700 transition-colors"
                        >
                          +1
                        </button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell 
                    className="p-1 text-right text-sm hover:bg-red-500/10 cursor-pointer"
                    onClick={() => onOptionTradeClick?.({ 
                      symbol, 
                      strikePrice: option.strike, 
                      optionType: 'call', 
                      action: 'sell', 
                      price: parseFloat(option.call.bid) 
                    })}
                  >
                    <span className={cn(
                      "inline-block rounded-full text-sm font-medium px-2 py-1 border-2",
                      isCellActive(option.strike, 'call', 'sell') 
                        ? "bg-red-500 text-white border-red-500 shadow-xl ring-2 ring-red-300" 
                        : "bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-transparent"
                    )}>
                      ${option.call.bid}
                    </span>
                  </TableCell>
                  <TableCell 
                    className="p-1 text-right text-sm hover:bg-lime-500/10 cursor-pointer"
                    onClick={() => onOptionTradeClick?.({ 
                      symbol, 
                      strikePrice: option.strike, 
                      optionType: 'call', 
                      action: 'buy', 
                      price: parseFloat(option.call.ask) 
                    })}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span className={cn(
                        "inline-block rounded-full text-sm font-medium px-2 py-1 border-2",
                        isCellActive(option.strike, 'call', 'buy') 
                          ? "bg-green-600 text-white border-green-600 shadow-xl ring-2 ring-green-300" 
                          : "bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-transparent"
                      )}>
                        ${option.call.ask}
                      </span>
                      {parseFloat(option.call.ask) === 42.84 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOptionTradeClick?.({ 
                              symbol, 
                              strikePrice: option.strike, 
                              optionType: 'call', 
                              action: 'sell', 
                              price: parseFloat(option.call.bid),
                              skipSegmentedControl: true
                            });
                          }}
                          className="text-xs bg-green-600 text-white px-1 py-0.5 rounded hover:bg-green-700 transition-colors"
                        >
                          +1
                        </button>
                      )}
                    </div>
                  </TableCell>
                  {/* +1 and -1 Buttons for specific rows */}
                  <TableCell className="p-1 text-center align-middle">
                    {option.strike === 200.00 && (
                      <button
                        onClick={() => onOptionTradeClick?.({ 
                          symbol, 
                          strikePrice: option.strike, 
                          optionType: 'call', 
                          action: 'sell', 
                          price: parseFloat(option.call.bid),
                          skipSegmentedControl: true
                        })}
                        className="text-xs text-green-600 hover:text-green-700 transition-colors font-medium"
                      >
                        +1
                      </button>
                    )}
                    {option.strike === 230.00 && (
                      <button
                        onClick={() => onOptionTradeClick?.({ 
                          symbol, 
                          strikePrice: option.strike, 
                          optionType: 'call', 
                          action: 'buy', 
                          price: parseFloat(option.call.ask),
                          skipSegmentedControl: true
                        })}
                        className="text-xs text-red-600 hover:text-red-700 transition-colors font-medium"
                      >
                        -1
                      </button>
                    )}
                  </TableCell>
                  {/* Strike Price */}
                  <TableCell className="p-1 text-center font-semibold bg-accent">
                    {option.strike.toFixed(2)}
                  </TableCell>
                  {/* Put Data - Reordered to match new header */}
                  <TableCell 
                    className="p-1 text-right text-sm hover:bg-red-500/10 cursor-pointer"
                    onClick={() => onOptionTradeClick?.({ 
                      symbol, 
                      strikePrice: option.strike, 
                      optionType: 'put', 
                      action: 'sell', 
                      price: parseFloat(option.put.bid) 
                    })}
                  >
                    <span className={cn(
                      "inline-block rounded-full text-sm font-medium px-2 py-1 border-2",
                      isCellActive(option.strike, 'put', 'sell') 
                        ? "bg-red-500 text-white border-red-500 shadow-xl ring-2 ring-red-300" 
                        : "bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-transparent"
                    )}>
                      ${option.put.bid}
                    </span>
                  </TableCell>
                  <TableCell 
                    className="p-1 text-right text-sm hover:bg-lime-500/10 cursor-pointer"
                    onClick={() => onOptionTradeClick?.({ 
                      symbol, 
                      strikePrice: option.strike, 
                      optionType: 'put', 
                      action: 'buy', 
                      price: parseFloat(option.put.ask) 
                    })}
                  >
                    <span className={cn(
                      "inline-block rounded-full text-sm font-medium px-2 py-1 border-2",
                      isCellActive(option.strike, 'put', 'buy') 
                        ? "bg-green-600 text-white border-green-600 shadow-xl ring-2 ring-green-300" 
                        : "bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-transparent"
                    )}>
                      ${option.put.ask}
                    </span>
                  </TableCell>
                  <TableCell className="p-1 text-right text-sm">${option.put.last}</TableCell>
                  <TableCell className="p-1 text-right text-sm">
                      {option.put.changePercent}
                  </TableCell>
                  <TableCell className="p-1 text-right text-sm">
                      {option.put.change}
                  </TableCell>
                  <TableCell className="p-1 text-right text-sm">{option.put.volume.toLocaleString()}</TableCell>
                  <TableCell className="p-1 text-right text-sm">
                    <div className="flex items-center justify-end gap-1">
                      <span>{option.put.openInterest.toLocaleString()}</span>
                      {option.put.openInterest === 534 && (
                        <button
                          onClick={() => onOptionTradeClick?.({ 
                            symbol, 
                            strikePrice: option.strike, 
                            optionType: 'put', 
                            action: 'sell', 
                            price: parseFloat(option.put.bid),
                            skipSegmentedControl: true
                          })}
                          className="text-xs bg-green-600 text-white px-1 py-0.5 rounded hover:bg-green-700 transition-colors"
                        >
                          +1
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="space-y-6 w-full">
          {/* Calls Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Calls</h3>
              <Button variant="outline" size="sm" className="h-8">
                In The Money
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table className="min-w-full border-collapse text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Contract Name</TableHead>
                    <TableHead className="text-left">Last Trade Date (EDT)</TableHead>
                    <TableHead className="text-center">Strike</TableHead>
                    <TableHead className="text-right">Last Price</TableHead>
                    <TableHead className="text-right">Bid</TableHead>
                    <TableHead className="text-right">Ask</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                    <TableHead className="text-right">% Change</TableHead>
                    <TableHead className="text-right">Volume</TableHead>
                    <TableHead className="text-right">Open Interest</TableHead>
                    <TableHead className="text-right">Implied Volatility</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockListData.calls.map((call, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="text-left text-sm max-w-[200px] truncate">{call.contractName}</TableCell>
                      <TableCell className="text-left text-sm max-w-[150px] truncate">{call.lastTradeDate}</TableCell>
                      <TableCell className="text-center text-sm font-semibold">{call.strike}</TableCell>
                      <TableCell className="text-right text-sm">${call.lastPrice}</TableCell>
                      <TableCell className="text-right text-sm bg-red-50 dark:bg-red-900/40">${call.bid}</TableCell>
                      <TableCell className="text-right text-sm bg-green-50 dark:bg-green-900/40">${call.ask}</TableCell>
                      <TableCell className="text-right text-sm">{call.change}</TableCell>
                      <TableCell className="text-right text-sm">{call.changePercent}%</TableCell>
                      <TableCell className="text-right text-sm">{call.volume}</TableCell>
                      <TableCell className="text-right text-sm">{call.openInterest.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm">{call.impliedVol}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Puts Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Puts</h3>
              <Button variant="outline" size="sm" className="h-8">
                In The Money
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table className="min-w-full border-collapse text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Contract Name</TableHead>
                    <TableHead className="text-left">Last Trade Date (EDT)</TableHead>
                    <TableHead className="text-center">Strike</TableHead>
                    <TableHead className="text-right">Last Price</TableHead>
                    <TableHead className="text-right">Bid</TableHead>
                    <TableHead className="text-right">Ask</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                    <TableHead className="text-right">% Change</TableHead>
                    <TableHead className="text-right">Volume</TableHead>
                    <TableHead className="text-right">Open Interest</TableHead>
                    <TableHead className="text-right">Implied Volatility</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockListData.puts.map((put, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="text-left text-sm max-w-[200px] truncate">{put.contractName}</TableCell>
                      <TableCell className="text-left text-sm max-w-[150px] truncate">{put.lastTradeDate}</TableCell>
                      <TableCell className="text-center text-sm font-semibold">{put.strike}</TableCell>
                      <TableCell className="text-right text-sm">${put.lastPrice}</TableCell>
                      <TableCell className="text-right text-sm bg-red-50 dark:bg-red-900/40">${put.bid}</TableCell>
                      <TableCell className="text-right text-sm bg-green-50 dark:bg-green-900/40">${put.ask}</TableCell>
                      <TableCell className="text-right text-sm">{put.change}</TableCell>
                      <TableCell className="text-right text-sm">{put.changePercent}%</TableCell>
                      <TableCell className="text-right text-sm">{put.volume}</TableCell>
                      <TableCell className="text-right text-sm">{put.openInterest.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm">{put.impliedVol}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
} 