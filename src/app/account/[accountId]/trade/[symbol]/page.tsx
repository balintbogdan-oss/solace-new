'use client'

export const dynamic = 'force-dynamic';

import { useParams, useRouter, useSearchParams } from 'next/navigation' 
import { useState, useMemo, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { SearchModal } from '@/components/trade/SearchModal' 
import { StockDetailPanel, STOCK_DATA, StockInfo } from '@/components/trade/StockDetailPanel'
import { useAccountData } from '@/contexts/AccountDataContext'
import { TradeExecutionPanel } from '@/components/trade/TradeExecutionPanel'
import { OptionsChainTable } from '@/components/trade/OptionsChainTable'
import { SecurityHeader } from '@/components/trade/SecurityHeader'
import { OptionTradeDetails } from '@/components/trade/OptionsChainTable'
import { MutualFundDetailPanel } from '@/components/trade/MutualFundDetailPanel'
import { MutualFundInfo } from '@/types/account'
import { Card } from '@/components/ui/card'

function TradeDetailPageSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-8 rounded-md">
      {/* Main Content Card Skeleton */}
      <Card className="relative flex-grow p-6">
        {/* Security Header Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-28 bg-muted rounded animate-pulse"></div>
              <div className="h-9 w-9 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex space-x-8 border-b mt-4 mb-2">
          <div className="h-6 w-20 bg-muted rounded animate-pulse"></div>
          <div className="h-6 w-20 bg-muted rounded animate-pulse"></div>
        </div>

        {/* Content Area Skeleton */}
        <div className="mt-8 space-y-6">
          {/* Chart/Stats Section Skeleton */}
          <div className="h-64 bg-muted rounded animate-pulse"></div>
          
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Table/Additional Content Skeleton */}
          <div className="space-y-2">
            <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
            <div className="h-48 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </Card>

      {/* Right Sidebar Skeleton */}
      <div className="sm:w-[400px] h-full flex-shrink-0">
        <div className="h-full flex items-center justify-center p-6 border border-dashed border-gray-400 dark:border-gray-700 rounded-lg min-h-[500px]">
          <div className="text-center">
            <div className="h-8 w-8 bg-muted rounded animate-pulse mx-auto mb-2"></div>
            <div className="h-4 w-48 bg-muted rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

type TradeMode = 'buy' | 'sell' | null
type PageViewMode = 'stock' | 'options'
type OptionAction = 'buyToOpen' | 'sellToOpen'

// Helper function to detect mutual funds
const isMutualFund = (symbol: string): boolean => {
  const upperSymbol = symbol?.toUpperCase();
  return upperSymbol === 'VTSAX' || 
         upperSymbol === 'VFIAX' ||
         upperSymbol === 'VTSMX' ||
         false;
};

export default function AccountSymbolTradePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountId = params?.accountId as string;
  const symbol = params?.symbol as string;
  const { data } = useAccountData();
  const marketData = data?.marketData;
  
  // Check if this is a mutual fund
  const isMutualFundSymbol = isMutualFund(symbol);

  const stock = useMemo(() => {
    const upperSymbol = symbol?.toUpperCase();
    
    // Try to get real market data first
    const realMarketData = marketData?.find(m => m.symbol === upperSymbol);
    
    if (realMarketData) {
      // Create StockInfo from real market data
      const stockInfo: StockInfo = {
        name: realMarketData.description || `${upperSymbol} Inc.`,
        exchangeInfo: 'Nasdaq • USD',
        price: realMarketData.currentPrice || 0,
        change: realMarketData.dayChange || 0,
        changePercent: realMarketData.dayChangePercent || 0,
        peRatio: 30.5, // Mock PE ratio
        volume: realMarketData.volume || 0,
        chartData: {}, // Will be generated by StockDetailPanel
        marketStats: {
          open: realMarketData.open || 0,
          high: realMarketData.high || 0,
          low: realMarketData.low || 0,
          prevClose: realMarketData.previousClose || 0,
          '52W High': realMarketData.fiftyTwoWeekHigh || 0,
          '52W Low': realMarketData.fiftyTwoWeekLow || 0
        }
      };
      return stockInfo;
    } else {
      // Fallback to mock data if not found
      return STOCK_DATA[upperSymbol] || STOCK_DATA.AAPL;
    }
  }, [symbol, marketData]);

  // Mutual fund data
  const mutualFund = useMemo(() => {
    if (!isMutualFundSymbol) return null;
    
    const upperSymbol = symbol?.toUpperCase();
    const realMarketData = marketData?.find(m => m.symbol === upperSymbol);
    
    if (realMarketData) {
      const mutualFundInfo: MutualFundInfo = {
        symbol: upperSymbol,
        name: realMarketData.description || `${upperSymbol} Mutual Fund`,
        exchangeInfo: 'Mutual Fund - NAV • USD',
        nav: realMarketData.currentPrice || 0,
        change: realMarketData.dayChange || 0,
        changePercent: realMarketData.dayChangePercent || 0,
        expenseRatio: realMarketData.fundDetails?.expenseRatio || 0.03,
        minimumInvestment: 1000,
        chartData: {}, // Will be generated by MutualFundDetailPanel
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
      return mutualFundInfo;
    }
    return null; // Let MutualFundDetailPanel handle mock data
  }, [symbol, marketData, isMutualFundSymbol]);

  const isPositive = stock ? stock.change >= 0 : false;

  const [showSearchModal, setShowSearchModal] = useState(false)
  const [tradeMode, setTradeMode] = useState<TradeMode>(null);
  
  // Initialize pageViewMode from URL parameters
  const urlType = searchParams?.get('type');
  const initialPageViewMode = urlType === 'options' ? 'options' : 'stock';
  const [pageViewMode, setPageViewMode] = useState<PageViewMode>(initialPageViewMode);

  // Update pageViewMode when URL parameters change
  useEffect(() => {
    const currentUrlType = searchParams?.get('type');
    const newPageViewMode = currentUrlType === 'options' ? 'options' : 'stock';
    setPageViewMode(newPageViewMode);
  }, [searchParams]);
  
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [currentOptionTradeDetails, setCurrentOptionTradeDetails] = useState<OptionTradeDetails | null>(null);
  const [selectedOptionAction, setSelectedOptionAction] = useState<OptionAction>('buyToOpen');

  if (!stock) {
    return <TradeDetailPageSkeleton />; 
  }


  const handleAccountTradeAction = (tradeSymbol: string, action: TradeMode) => {
      console.log(`Trade action triggered for ${tradeSymbol}: ${action}`);
      // Ensure we are not carrying over option selection when doing equity trades
      setCurrentOptionTradeDetails(null);
      setTradeMode(action);
  }

  const handleOptionTradeClick = (details: OptionTradeDetails) => {
    console.log("Option trade initiated:", details);
    setCurrentOptionTradeDetails(details);
    setTradeMode(details.action);
    
    // Update the selected option action based on the clicked pill
    if (details.action === 'buy') {
      setSelectedOptionAction('buyToOpen');
    } else if (details.action === 'sell') {
      setSelectedOptionAction('sellToOpen');
    }
  };



  const handleAddToWatchlist = () => {
    console.log(`${isWatchlisted ? 'Removing from' : 'Adding to'} watchlist...`);
    setIsWatchlisted(!isWatchlisted);
  };

  const pageOnChangeSymbolClick = () => setShowSearchModal(true);

  const handleCloseMainPanel = () => {
    router.push(`/account/${accountId}/trade`);
  };
  
  const handleCloseTradePanel = () => {
    setTradeMode(null);
    setCurrentOptionTradeDetails(null);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-8  rounded-md">
      <Card className="relative flex-grow p-6">
        <SecurityHeader 
            symbol={symbol}
            stock={isMutualFundSymbol ? undefined : stock}
            mutualFund={isMutualFundSymbol ? (mutualFund || {
              symbol: symbol?.toUpperCase() || '',
              name: `${symbol?.toUpperCase()} Fund`,
              exchangeInfo: 'Mutual Fund - NAV • USD',
              nav: 0,
              change: 0,
              changePercent: 0,
              expenseRatio: 0.03,
              minimumInvestment: 1000,
              chartData: {},
              marketStats: {
                open: 0,
                high: 0,
                low: 0,
                prevClose: 0,
                '52W High': 0,
                '52W Low': 0,
                ytdReturn: 0,
                totalAssets: 0
              }
            }) : undefined}
            isPositive={isPositive}
            isWatchlisted={isWatchlisted}
          onChangeSymbolClick={pageOnChangeSymbolClick}
          onAddToWatchlist={handleAddToWatchlist}
          onClose={handleCloseMainPanel}
          isDrawer={false}
        />

        {/* Tabs - Only show for stocks, not mutual funds */}
        {!isMutualFundSymbol && (
          <div className="flex space-x-8 border-b mt-4 mb-2">
            <button
              onClick={() => {
                setPageViewMode('stock');
                // Clear option selection when switching back to equities
                setCurrentOptionTradeDetails(null);
                // Hide the trade panel until user clicks Buy/Sell again
                setTradeMode(null);
                // Update URL to reflect the tab change
                router.push(`/account/${accountId}/trade/${symbol}?type=equities`);
              }}
              className={`pb-2 font-medium transition-colors ${
                pageViewMode === 'stock'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Equities
            </button>
            <button
              onClick={() => {
                // Switching to Options should not auto-open a trade panel
                setPageViewMode('options');
                setTradeMode(null);
                setCurrentOptionTradeDetails(null);
                // Update URL to reflect the tab change
                router.push(`/account/${accountId}/trade/${symbol}?type=options`);
              }}
              className={`pb-2 font-medium transition-colors ${
                pageViewMode === 'options'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Options
            </button>
          </div>
        )}


        <div className="">
          {isMutualFundSymbol ? (
            <div className="mt-8">
              <MutualFundDetailPanel 
                symbol={symbol} 
                marketData={mutualFund ? {
                symbol: mutualFund.symbol,
                cusip: '',
                currentPrice: mutualFund.nav,
                previousClose: mutualFund.marketStats.prevClose,
                dayChange: mutualFund.change,
                dayChangePercent: mutualFund.changePercent,
                volume: 0,
                marketCap: mutualFund.marketStats.totalAssets,
                open: mutualFund.marketStats.open,
                high: mutualFund.marketStats.high,
                low: mutualFund.marketStats.low,
                fiftyTwoWeekHigh: mutualFund.marketStats['52W High'],
                fiftyTwoWeekLow: mutualFund.marketStats['52W Low'],
                sector: 'Mutual Fund',
                description: mutualFund.name,
                fundDetails: mutualFund.fundDetails,
                lastUpdated: new Date().toISOString()
              } : undefined}
                onTradeAction={handleAccountTradeAction}
              />
            </div>
            ) : pageViewMode === 'stock' ? (
            <StockDetailPanel 
                symbol={symbol} 
                onTradeAction={handleAccountTradeAction} 
            />
          ) : (
            <OptionsChainTable 
               symbol={symbol} 
               onOptionTradeClick={handleOptionTradeClick}
               currentOptionTrade={currentOptionTradeDetails}
               selectedAction={selectedOptionAction}
            />
          )}
        </div>
      </Card>

      <div className="sm:w-[400px] h-full flex-shrink-0">
        <div className="space-y-6"> 
          {tradeMode ? (
            <div className="bg-white border bg-card-blend dark:bg-card-blend-dark p-6 rounded-lg shadow-md">
              <TradeExecutionPanel 
                  symbol={symbol} 
                  accountId={accountId} 
                  initialTradeMode={tradeMode} 
                  strikePrice={pageViewMode === 'options' ? currentOptionTradeDetails?.strikePrice : undefined}
                  optionType={pageViewMode === 'options' ? currentOptionTradeDetails?.optionType : undefined}
                  limitPrice={pageViewMode === 'options' ? currentOptionTradeDetails?.price : undefined}
                  isOptionTradeOverride={pageViewMode === 'options'}
                  skipSegmentedControl={pageViewMode === 'options' ? currentOptionTradeDetails?.skipSegmentedControl : false}
                  onClose={handleCloseTradePanel}
                  selectedOptionAction={selectedOptionAction}
                  onSelectedOptionActionChange={setSelectedOptionAction}
              />
            </div>
          ) : (
              <div className="h-full flex items-center justify-center p-6 border border-dashed border-gray-400 dark:border-gray-700 rounded-lg  min-h-[500px]">
                  <div className="text-center">
                <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Select Buy or Sell to start trading</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <SearchModal 
        isOpen={showSearchModal}
        onOpenChange={setShowSearchModal}
        onSelectSymbol={() => {}}
      />
    </div>
  );
} 