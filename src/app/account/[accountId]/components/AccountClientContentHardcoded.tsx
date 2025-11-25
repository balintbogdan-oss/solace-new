'use client'

import { useState, useMemo } from 'react'
import { HoldingsTableHardcoded } from './HoldingsTableHardcoded'
import { Card } from '@/components/ui/card'
import { SearchModal } from '@/components/trade/SearchModal'
import { StockDetailPanel } from '@/components/trade/StockDetailPanel'
import { TradeExecutionPanel } from '@/components/trade/TradeExecutionPanel'
import { DonutChart } from '@/components/charts/DonutChart'
import { Info, X, FileText, History } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader,
  DrawerTitle,
  DrawerClose
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { OptionTradeDetails } from '@/components/trade/OptionsChainTable'
import { STOCK_DATA } from '@/components/trade/StockDetailPanel'
import { SecurityHeader } from '@/components/trade/SecurityHeader'
import { LastUpdated } from '@/components/ui/last-updated'
import { HoldingWithDetails } from '@/types/account'

const getCurrentTimestamp = () => {
    return new Date().toLocaleString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true, 
        timeZoneName: 'short' 
    }).replace(',', '');
};

type TradeMode = 'buy' | 'sell' | null
type DrawerOptionTradeDetails = Omit<OptionTradeDetails, 'symbol'>;

interface AccountClientContentProps {
  accountId: string;
}

const mockHoldings: (HoldingWithDetails & { 
    accountType: string;
    investedValue: number;
    todaysUnrealizedGL: number;
    longShort: 'L' | 'S';
})[] = [
    {
        symbol: 'AAPL',
        quantity: 1000,
        avgPrice: 150.00,
        marketValue: 234350.00,
        unrealizedGL: 84350.00,
        unrealizedGLPercent: 56.23,
        lastUpdated: new Date().toISOString(),
        accountType: 'Long Margin',
        investedValue: 150000.00,
        todaysUnrealizedGL: 2500.00,
        longShort: 'L',
        security: {
            symbol: 'AAPL',
            cusip: '037833100',
            description: 'Apple Inc.',
            sector: 'Technology',
            type: 'equity',
            exchange: 'NASDAQ',
            lastUpdated: new Date().toISOString(),
        },
        marketData: {
            symbol: 'AAPL',
            currentPrice: 234.35,
            previousClose: 237.88,
            dayChange: -3.53,
            dayChangePercent: -1.48,
            volume: 50594875,
            lastUpdated: new Date().toISOString(),
        }
    },
    {
        symbol: 'GOOGL',
        quantity: 500,
        avgPrice: 2800.00,
        marketValue: 1450000.00,
        unrealizedGL: 50000.00,
        unrealizedGLPercent: 3.57,
        lastUpdated: new Date().toISOString(),
        accountType: 'Long Margin',
        investedValue: 1400000.00,
        todaysUnrealizedGL: 10000.00,
        longShort: 'L',
        security: {
            symbol: 'GOOGL',
            cusip: '02079K305',
            description: 'Alphabet Inc. Class A',
            sector: 'Technology',
            type: 'equity',
            exchange: 'NASDAQ',
            lastUpdated: new Date().toISOString(),
        },
        marketData: {
            symbol: 'GOOGL',
            currentPrice: 2900.00,
            previousClose: 2880.00,
            dayChange: 20.00,
            dayChangePercent: 0.69,
            volume: 1000000,
            lastUpdated: new Date().toISOString(),
        }
    },
    {
        symbol: 'MSFT',
        quantity: 750,
        avgPrice: 330.00,
        marketValue: 236250.00,
        unrealizedGL: -11250.00,
        unrealizedGLPercent: -4.55,
        lastUpdated: new Date().toISOString(),
        accountType: 'Long Margin',
        investedValue: 247500.00,
        todaysUnrealizedGL: -3750.00,
        longShort: 'L',
        security: {
            symbol: 'MSFT',
            cusip: '594918104',
            description: 'Microsoft Corporation',
            sector: 'Technology',
            type: 'equity',
            exchange: 'NASDAQ',
            lastUpdated: new Date().toISOString(),
        },
        marketData: {
            symbol: 'MSFT',
            currentPrice: 315.00,
            previousClose: 320.00,
            dayChange: -5.00,
            dayChangePercent: -1.56,
            volume: 25000000,
            lastUpdated: new Date().toISOString(),
        },
    },
    {
        symbol: 'AMZN',
        quantity: 2500,
        avgPrice: 140.00,
        marketValue: 337500.00,
        unrealizedGL: -12500.00,
        unrealizedGLPercent: -3.57,
        lastUpdated: new Date().toISOString(),
        accountType: 'Cash',
        investedValue: 350000.00,
        todaysUnrealizedGL: -2500.00,
        longShort: 'L',
        security: {
            symbol: 'AMZN',
            cusip: '023135106',
            description: 'Amazon.com, Inc.',
            sector: 'Consumer Discretionary',
            type: 'equity',
            exchange: 'NASDAQ',
            lastUpdated: new Date().toISOString(),
        },
        marketData: {
            symbol: 'AMZN',
            currentPrice: 135.00,
            previousClose: 136.00,
            dayChange: -1.00,
            dayChangePercent: -0.74,
            volume: 40000000,
            lastUpdated: new Date().toISOString(),
        },
    },
    {
        symbol: 'SPY',
        quantity: 2000,
        avgPrice: 450.00,
        marketValue: 920000.00,
        unrealizedGL: 20000.00,
        unrealizedGLPercent: 2.22,
        lastUpdated: new Date().toISOString(),
        accountType: 'Long Margin',
        investedValue: 900000.00,
        todaysUnrealizedGL: 4000.00,
        longShort: 'L',
        security: {
            symbol: 'SPY',
            cusip: '78462F103',
            description: 'SPDR S&P 500 ETF Trust',
            sector: 'Index',
            type: 'etf',
            exchange: 'ARCA',
            lastUpdated: new Date().toISOString(),
        },
        marketData: {
            symbol: 'SPY',
            currentPrice: 460.00,
            previousClose: 458.00,
            dayChange: 2.00,
            dayChangePercent: 0.44,
            volume: 60000000,
            lastUpdated: new Date().toISOString(),
        }
    },
    {
        symbol: 'SPY251115C00603000',
        quantity: 100,
        avgPrice: 6.50,
        marketValue: 60000,
        unrealizedGL: -5000,
        unrealizedGLPercent: -7.69,
        lastUpdated: new Date().toISOString(),
        accountType: 'Short Margin',
        investedValue: 65000.00,
        todaysUnrealizedGL: -2000.00,
        longShort: 'S',
        security: {
            symbol: 'SPY251115C00603000',
            cusip: 'SPY251115C00603000',
            description: 'SPY Nov 15 2025 603.00 Call',
            sector: 'Options',
            type: 'option',
            exchange: 'CBOE',
            underlying: 'SPY',
            strikePrice: 603,
            expirationDate: '2025-11-15T00:00:00Z',
            optionType: 'call',
            lastUpdated: new Date().toISOString(),
        },
        marketData: {
            symbol: 'SPY251115C00603000',
            currentPrice: 6.00,
            previousClose: 6.20,
            dayChange: -0.20,
            dayChangePercent: -3.22,
            volume: 1000,
            lastUpdated: new Date().toISOString(),
        },
    },
    {
        symbol: 'NVDA251017C00135000',
        quantity: 50,
        avgPrice: 10.00,
        marketValue: 62500,
        unrealizedGL: 12500,
        unrealizedGLPercent: 25.00,
        lastUpdated: new Date().toISOString(),
        accountType: 'Short Margin',
        investedValue: 50000.00,
        todaysUnrealizedGL: 2500.00,
        longShort: 'S',
        security: {
            symbol: 'NVDA251017C00135000',
            cusip: 'NVDA251017C00135000',
            description: 'NVDA Oct 17 2025 135.00 Call',
            sector: 'Options',
            type: 'option',
            exchange: 'CBOE',
            underlying: 'NVDA',
            strikePrice: 135,
            expirationDate: '2025-10-17T00:00:00Z',
            optionType: 'call',
            lastUpdated: new Date().toISOString(),
        },
        marketData: {
            symbol: 'NVDA251017C00135000',
            currentPrice: 12.50,
            previousClose: 12.00,
            dayChange: 0.50,
            dayChangePercent: 4.17,
            volume: 500,
            lastUpdated: new Date().toISOString(),
        }
    },
    {
        symbol: 'VTSAX',
        quantity: 10000,
        avgPrice: 110.00,
        marketValue: 1250000.00,
        unrealizedGL: 150000.00,
        unrealizedGLPercent: 13.64,
        lastUpdated: new Date().toISOString(),
        accountType: 'Cash',
        investedValue: 1100000.00,
        todaysUnrealizedGL: 10000.00,
        longShort: 'L',
        security: {
            symbol: 'VTSAX',
            cusip: '922908728',
            description: 'Vanguard Total Stock Mkt Idx Adm',
            sector: 'Blend',
            type: 'mutual_fund',
            exchange: 'MUTUAL',
            lastUpdated: new Date().toISOString(),
        },
        marketData: {
            symbol: 'VTSAX',
            currentPrice: 125.00,
            previousClose: 124.00,
            dayChange: 1.00,
            dayChangePercent: 0.81,
            volume: 0,
            lastUpdated: new Date().toISOString(),
        }
    },
    {
        symbol: 'TMUBMUSD10Y',
        quantity: 500,
        avgPrice: 980.00,
        marketValue: 500000.00,
        unrealizedGL: 10000.00,
        unrealizedGLPercent: 2.04,
        lastUpdated: new Date().toISOString(),
        accountType: 'Cash',
        investedValue: 490000.00,
        todaysUnrealizedGL: 1000.00,
        longShort: 'L',
        security: {
            symbol: 'TMUBMUSD10Y',
            cusip: '9128283R9',
            description: 'US Treasury Note 10 Year',
            sector: 'Government',
            type: 'bond',
            exchange: 'OTC',
            lastUpdated: new Date().toISOString(),
            // @ts-expect-error - Property 'maturityDate' does not exist on type 'Security'
            maturityDate: '2034-08-15T00:00:00Z',
            yield: 4.15,
        },
        marketData: {
            symbol: 'TMUBMUSD10Y',
            currentPrice: 1000.00,
            previousClose: 998.00,
            dayChange: 2.00,
            dayChangePercent: 0.20,
            volume: 100000,
            lastUpdated: new Date().toISOString(),
        }
    }
];

const getAssetClass = (holding: HoldingWithDetails): string => {
    switch (holding.security.type) {
        case 'option': return 'Options';
        case 'mutual_fund': return 'Mutual Funds';
        case 'bond': return 'Fixed Income';
        case 'etf':
        case 'equity': return 'Equities';
        default: return 'Other';
    }
};

const getAssetClassColor = (assetClass: string) => {
    const colors = {
        'Equities': '#A16207',
        'Options': '#D97706',
        'Mutual Funds': '#881337',
        'Fixed Income': '#1E40AF',
        'Other': '#6B7280'
    };
    return colors[assetClass as keyof typeof colors] || '#6B7280';
};

const assetAllocationData = mockHoldings.reduce((acc, holding) => {
    const assetClass = getAssetClass(holding);
    const marketValue = holding.marketValue || 0;
    const existing = acc.find(item => item.name === assetClass);

    if (existing) {
        existing.value += marketValue;
    } else {
        acc.push({
            name: assetClass,
            value: marketValue,
            color: getAssetClassColor(assetClass)
        });
    }
    return acc;
}, [] as Array<{ name: string; value: number; color: string }>);

const totalMarketValueForAllocation = assetAllocationData.reduce((sum, item) => sum + item.value, 0);

const assetAllocationPercentages = assetAllocationData.map(item => ({
    ...item,
    value: totalMarketValueForAllocation > 0 ? Math.round((item.value / totalMarketValueForAllocation) * 100) : 0
}));

const mockPortfolioData = {
      portfolioValue: `$4,419,983.62`,
      todaysGL: { 
        amount: `+$21,750.00`, 
        percentage: `0.49%` 
      },
      totalGL: { 
        amount: `+$238,750.00`, 
        percentage: `5.40%` 
      },
      positions: { 
        long: { amount: `$4,991,250.00` }, 
        short: { amount: '-$571,266.38' } 
      },
      availableCash: `$750,000.00`,
      fdicSweep: '$250,000.00',
      marginBalance: `$250,000.00`,
      fundsAvailable: `$750,000.00`,
      totalAccountValue: `$5,669,983.62`,
      assetAllocation: assetAllocationPercentages
    };

export function AccountClientContentHardcoded({ accountId }: AccountClientContentProps) {
  const accountIdFromParams = accountId;
  const timestamp = getCurrentTimestamp();

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isStockDrawerOpen, setIsStockDrawerOpen] = useState(false);
  const [selectedSymbolInDrawer, setSelectedSymbolInDrawer] = useState<string | null>(null);
  const [drawerTradeMode, setDrawerTradeMode] = useState<TradeMode>(null);
  const [drawerOptionTradeDetails, setDrawerOptionTradeDetails] = useState<DrawerOptionTradeDetails | null>(null);
  const [isDrawerWatchlisted, setIsDrawerWatchlisted] = useState(false);

  const drawerStockData = useMemo(() => {
    if (!selectedSymbolInDrawer) return null;
    return STOCK_DATA[selectedSymbolInDrawer.toUpperCase()] || null;
  }, [selectedSymbolInDrawer]);

  const isDrawerPositive = useMemo(() => 
     drawerStockData ? drawerStockData.change >= 0 : false
  , [drawerStockData]);

  const handleHoldingClick = (symbol: string) => {
    setSelectedSymbolInDrawer(symbol);
    setIsStockDrawerOpen(true);
    setDrawerTradeMode(null);
    setDrawerOptionTradeDetails(null);
  };

  const handleSymbolSelectFromSearch = () => {
    setIsSearchModalOpen(false);
  };

  const handleTradeActionFromDrawer = (tradeSymbol: string, action: TradeMode) => {
    setDrawerTradeMode(action);
    setDrawerOptionTradeDetails(null);
  };

  const handleCloseDrawerTradePanel = () => {
    setDrawerTradeMode(null);
    setDrawerOptionTradeDetails(null);
  };

  const handleAddToWatchlistFromDrawer = () => {
    if (!selectedSymbolInDrawer) return;
    setIsDrawerWatchlisted(!isDrawerWatchlisted);
  };

  const portfolioData = mockPortfolioData;

  return (
    <div className="flex flex-col h-full space-y-4 md:space-y-4">
         {/* Holdings Title and Action Buttons */}
         <div className="w-full flex justify-between items-center">
            <h2 className="text-2xl font-serif ">Holdings</h2>
            <div className="flex items-center space-x-2">
              <Button variant="secondary">
                <FileText className="mr-2 h-5 w-5" />
                Export
              </Button>
              <Button variant="secondary">
                <History className="mr-2 h-5 w-5" />
                View History
              </Button>
            </div>
          </div>
      <div className="w-full flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-4">
     
        <Card className="md:col-span-2 min-w-0  p-4 md:p-6 flex flex-col justify-between">
          <div className="flex-grow space-y-4">
            <div>
              <h3>Portfolio Market Value</h3>
              <span className="text-3xl font-serif font-medium text-foreground break-words">{portfolioData?.portfolioValue}</span>
            </div>

            {/* Combined Grid for all data points - Make Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm"> 
              {/* Today's G/L */}
              <div>
                <span className="text-xs text-muted-foreground block">Today&apos;s unrealized G/L</span>
                <span className="text-positive font-medium">
                  {portfolioData?.todaysGL.amount} ({portfolioData?.todaysGL.percentage})
                </span>
              </div>
              {/* Total G/L */}
              <div>
                <span className="text-xs text-muted-foreground block">Total unrealized G/L</span>
                <span className="text-positive font-medium">
                  {portfolioData?.totalGL.amount} ({portfolioData?.totalGL.percentage})
                </span>
              </div>
              {/* Available Cash (Moved Here) */}
              <div>
                <span className="text-xs text-muted-foreground block">Available Cash</span>
                <span className="text-md dark:text-white font-medium break-words">{portfolioData?.availableCash}</span>
              </div>
              {/* Long (Moved from 2nd row) */}
              <div>
                <span className="text-xs text-muted-foreground block">Long market value</span>
                <span className="text-foreground font-medium">{portfolioData?.positions.long.amount}</span>
              </div>
              {/* Short (Moved from 1st row) */}
              <div>
                <span className="text-xs text-muted-foreground block">Short market value</span>
                <span className="text-negative font-medium">{portfolioData?.positions.short.amount}</span>
              </div>
              {/* Funds Available */}
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Funds available</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition shrink-0">
                          <Info className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Funds available for withdrawal or trading.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-md dark:text-white font-medium break-words">{portfolioData?.fundsAvailable}</span>
              </div>
              {/* Margin Balance */}
              <div>
                <span className="text-xs text-muted-foreground block">Margin Balance</span>
                <span className="text-md dark:text-white font-medium break-words">{portfolioData?.marginBalance}</span>
              </div>
              {/* Total Account Value */}
              <div>
                 <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Total account value</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                         <button className="p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition shrink-0">
                           <Info className="w-3 h-3 text-muted-foreground" />
                         </button>
                      </TooltipTrigger>
                      <TooltipContent>
                         <p>Sum of available cash + FDIC Sweep + 
Margin Balance + Portfolio Market Value.</p>
                      </TooltipContent>
                    </Tooltip>
                   </TooltipProvider>
                 </div>
                <span className="text-md dark:text-white font-medium break-words">{portfolioData?.totalAccountValue}</span>
              </div>
              {/* FDIC Sweep */}
              <div>
                <span className="text-xs text-muted-foreground block">FDIC Sweep</span>
                <span className="text-md dark:text-white font-medium break-words">{portfolioData?.fdicSweep}</span>
              </div>
            </div>
          </div>
          <LastUpdated 
            timestamp={`Updated ${timestamp}`}
            className="mt-4 md:mt-6 pt-3"
          />
        </Card>

        <Card className="min-w-0  md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3>Asset Allocation</h3>
              <button className="text-sm text-primary hover:underline whitespace-nowrap">Expand view</button>
            </div>
            {/* Use flex-row to place chart and legend side-by-side */}
            <div className='flex flex-row items-center gap-2'> 
                {/* Chart container - reduced gap and increased max width */}
                <div className="flex-shrink-0 w-full max-w-[120px] sm:max-w-[200px]">
                   <DonutChart 
                     data={portfolioData?.assetAllocation || []} 
                     portfolioValue={portfolioData ? parseFloat(portfolioData.portfolioValue.replace(/[$,]/g, '')) : 0}
                   />
                </div>
                {/* Legend container - use flex-col for vertical stacking, items will align left by default */}
                <div className="flex flex-col gap-y-2 text-sm flex-1 min-w-0">
                  {(portfolioData?.assetAllocation || []).map(item => (
                     <div key={item.name} className="flex items-center gap-1.5">
                       <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                       <span className="truncate">{item.name}</span>
                     </div>
                  ))}
                </div>
            </div>
          </div>
          <LastUpdated 
            timestamp={`Updated ${timestamp}`}
            className="pt-3"
          />
        </Card>
      </div>
      
      <div className="flex-grow">
       <HoldingsTableHardcoded
         onStockClick={handleHoldingClick} 
         holdingsWithDetails={mockHoldings} 
         accountId={accountIdFromParams}
       />
       </div>
       

      <Drawer direction="right" open={isStockDrawerOpen} onOpenChange={setIsStockDrawerOpen}>
        <DrawerContent className="h-full w-full max-w-2xl flex flex-col bg-card backdrop-blur-lg">
          <DrawerHeader className="p-4 border-b flex items-center">
            <DrawerTitle className="text-lg font-semibold">
               {/* Intentionally empty title */}
            </DrawerTitle>
            <DrawerClose asChild className="ml-auto">
              <Button variant="secondary" className="flex items-center gap-1">
                <span>Close</span>
                <X className="h-6 w-6" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="flex-grow overflow-y-auto h-full p-4">
            {selectedSymbolInDrawer && drawerStockData && (
              drawerTradeMode ? (
                <TradeExecutionPanel
                  symbol={selectedSymbolInDrawer}
                  accountId={accountIdFromParams}
                  initialTradeMode={drawerTradeMode}
                  strikePrice={drawerOptionTradeDetails?.strikePrice}
                  optionType={drawerOptionTradeDetails?.optionType}
                  limitPrice={drawerOptionTradeDetails?.price}
                  onClose={handleCloseDrawerTradePanel}
                />
              ) : (
                 <> 
                   <SecurityHeader 
                     symbol={selectedSymbolInDrawer}
                      stock={drawerStockData}
                      isPositive={isDrawerPositive}
                      isWatchlisted={isDrawerWatchlisted}
                     onChangeSymbolClick={() => setIsSearchModalOpen(true)}
                     onAddToWatchlist={handleAddToWatchlistFromDrawer}
                     isDrawer={true}
                   />
                   <div className="mt-4 pt-4 border-t">
                     <StockDetailPanel 
                       symbol={selectedSymbolInDrawer} 
                       onTradeAction={handleTradeActionFromDrawer}
                       dataSource="mock"
                     />
                   </div>
                 </>
              )
            )}
            {selectedSymbolInDrawer && !drawerStockData && (
                <div className="p-4 text-center text-muted-foreground">
                    Could not load data for symbol: {selectedSymbolInDrawer}
                </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <SearchModal 
        isOpen={isSearchModalOpen} 
        onOpenChange={setIsSearchModalOpen}
        onSelectSymbol={handleSymbolSelectFromSearch}
      />
    </div>
  );
}
