'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AccountData, AccountDataContextType, Holding, Trade, Activity, AccountBalances, MarketData, Security, HoldingWithDetails, UnrealizedPosition, RealizedTrade, CommissionRecord } from '@/types/account';
import { localDataService } from '@/services/localDataService';
import { forceReloadMarketData, loadMutualFundsMarketData, loadEquitiesMarketData } from '@/services/marketDataService';

const AccountDataContext = createContext<AccountDataContextType | undefined>(undefined);

// Global cache to store account data across navigation
const accountDataCache = new Map<string, { data: AccountData; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Load mock data
const loadMockData = async (): Promise<{ realizedGL: RealizedTrade[]; commissions: CommissionRecord[] }> => {
  try {
    const response = await fetch('/data/mock-data.json');
    const mockData = await response.json();
    return {
      realizedGL: mockData.realizedGL || [],
      commissions: mockData.commissions || []
    };
  } catch (error) {
    console.error('Error loading mock data:', error);
    return { realizedGL: [], commissions: [] };
  }
};

// Load market data from JSON files
const loadMarketData = async (): Promise<MarketData[]> => {
  try {
    const [equitiesData, mutualFundsData] = await Promise.all([
      loadEquitiesMarketData(),
      loadMutualFundsMarketData()
    ]);

    let allMarketData: MarketData[] = [];

    // Process equities data
    if (equitiesData && (equitiesData as { stocks?: unknown[] }).stocks) {
      const stocks = (equitiesData as { stocks: unknown[] }).stocks;
      allMarketData = [...allMarketData, ...stocks.map((stock: unknown) => {
        const s = stock as Record<string, unknown>;
        return {
          symbol: String(s.symbol || ''),
          currentPrice: Number(s.currentPrice) || 0,
          previousClose: Number(s.previousClose) || 0,
          dayChange: Number(s.dayChange) || 0,
          dayChangePercent: Number(s.dayChangePercent) || 0,
          volume: Number(s.volume) || 0,
          marketCap: Number(s.marketCap) || 0,
          open: Number(s.open) || 0,
          high: Number(s.high) || 0,
          low: Number(s.low) || 0,
          fiftyTwoWeekHigh: Number(s.fiftyTwoWeekHigh) || 0,
          fiftyTwoWeekLow: Number(s.fiftyTwoWeekLow) || 0,
          sector: String(s.sector || ''),
          description: String(s.description || ''),
          lastUpdated: String(s.lastUpdated || new Date().toISOString())
        };
      })];
    }

    // Process mutual funds data
    if (mutualFundsData && (mutualFundsData as { mutualFunds?: unknown[] }).mutualFunds) {
      const mutualFunds = (mutualFundsData as { mutualFunds: unknown[] }).mutualFunds;
      allMarketData = [...allMarketData, ...mutualFunds.map((fund: unknown) => {
        const f = fund as Record<string, unknown>;
        return {
          symbol: String(f.symbol || ''),
          currentPrice: Number(f.currentPrice) || 0,
          previousClose: Number(f.previousClose) || 0,
          dayChange: Number(f.dayChange) || 0,
          dayChangePercent: Number(f.dayChangePercent) || 0,
          volume: Number(f.volume) || 0,
          marketCap: Number(f.marketCap) || 0,
          open: Number(f.open) || 0,
          high: Number(f.high) || 0,
          low: Number(f.low) || 0,
          fiftyTwoWeekHigh: Number(f.fiftyTwoWeekHigh) || 0,
          fiftyTwoWeekLow: Number(f.fiftyTwoWeekLow) || 0,
          sector: String(f.sector || ''),
          description: String(f.description || ''),
          fundDetails: f.fundDetails as MarketData['fundDetails'],
          lastUpdated: String(f.lastUpdated || new Date().toISOString())
        };
      })];
    }

    return allMarketData;
  } catch (error) {
    console.error('Error loading market data:', error);
    return [];
  }
};

export function AccountDataProvider({ 
  children, 
  accountId 
}: { 
  children: React.ReactNode;
  accountId: string;
}) {
  const [data, setData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data with caching
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = accountDataCache.get(accountId);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('Using cached account data for', accountId);
        setData(cached.data);
        setLoading(false);
        return;
      }

      console.log('Fetching fresh account data for', accountId);
      const accountData = await localDataService.getAccountData(accountId);
      
      // Load mock data and market data
      const [mockData, marketData] = await Promise.all([
        loadMockData(),
        loadMarketData()
      ]);
      
      if (accountData) {
        // Merge mock data and market data with account data
        const enhancedAccountData = {
          ...accountData,
          marketData: marketData,
          realizedGL: mockData.realizedGL,
          commissions: mockData.commissions
        };
        setData(enhancedAccountData);
        // Cache the data
        accountDataCache.set(accountId, { data: enhancedAccountData, timestamp: Date.now() });
      } else {
        // Create empty account data for new accounts with mock data
        const emptyAccountData: AccountData = {
          accountId,
          accountName: 'New Account',
          accountType: 'individual',
          clientId: 'unknown',
          client: {
            id: 'unknown',
            firstName: 'Unknown',
            lastName: 'Client',
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          },
          isPrimary: false,
          securities: [],
          holdings: [],
          marketData: marketData,
          trades: [],
          activities: [],
          balances: {
            cash: 0,
            margin: 0,
            buyingPower: 0,
            totalValue: 0,
            investedValue: 0,
            realizedGL: 0,
            unrealizedGL: 0,
            lastUpdated: new Date().toISOString()
          },
          realizedGL: mockData.realizedGL,
          unrealizedGL: [],
          commissions: mockData.commissions,
          lastUpdated: new Date().toISOString()
        };
        setData(emptyAccountData);
        // Cache the empty data
        accountDataCache.set(accountId, { data: emptyAccountData, timestamp: Date.now() });
        // Save empty data (no-op for local data service)
        await localDataService.saveAccountData();
      }
    } catch (err) {
      console.error('Error loading account data:', err);
      setError('Failed to load account data');
      // Fallback to empty data
      const emptyAccountData: AccountData = {
        accountId,
        accountName: 'New Account',
        accountType: 'individual',
        clientId: 'unknown',
        client: {
          id: 'unknown',
          firstName: 'Unknown',
          lastName: 'Client',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        isPrimary: false,
        securities: [],
        holdings: [],
        marketData: [],
        trades: [],
        activities: [],
        balances: {
          cash: 0,
          margin: 0,
          buyingPower: 0,
          totalValue: 0,
          investedValue: 0,
          realizedGL: 0,
          unrealizedGL: 0,
          lastUpdated: new Date().toISOString()
        },
        realizedGL: [],
        unrealizedGL: [],
        commissions: [],
        lastUpdated: new Date().toISOString()
      };
      setData(emptyAccountData);
      // Cache the fallback data
      accountDataCache.set(accountId, { data: emptyAccountData, timestamp: Date.now() });
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  // Save data
  const saveData = useCallback(async (newData: AccountData) => {
    try {
      const aaplHolding = newData.holdings.find(h => h.symbol === 'AAPL');
      console.log('5. AAPL quantity being saved:', aaplHolding?.quantity);
      await localDataService.saveAccountData();
      setData(newData);
      // Update cache
      accountDataCache.set(accountId, { data: newData, timestamp: Date.now() });
    } catch (err) {
      console.error('Error saving account data:', err);
      setError('Failed to save account data');
    }
  }, [accountId]);

  // Get security by symbol
  const getSecurity = useCallback((symbol: string): Security | undefined => {
    return data?.securities.find(s => s.symbol === symbol);
  }, [data]);

  // Calculate buying power based on current holdings and cash
  const calculateBuyingPower = useCallback((holdings: Holding[], cash: number, marketData: MarketData[]) => {
    const totalMarketValue = holdings.reduce((sum, h) => {
      const marketDataForSymbol = marketData?.find(md => md.symbol === h.symbol);
      return sum + (h.quantity * (marketDataForSymbol?.currentPrice || 0));
    }, 0);
    
    // For margin accounts: cash + (marginable securities * margin multiplier)
    // For cash accounts: just cash
    const marginMultiplier = 2.0; // 2:1 margin ratio
    const marginableValue = totalMarketValue; // Assume all securities are marginable
    return cash + (marginableValue * marginMultiplier);
  }, []);

  // Add new security
  const addSecurity = useCallback(async (security: Security) => {
    if (!data) return;

    const updatedSecurities = [...data.securities];
    const existingIndex = updatedSecurities.findIndex(s => s.symbol === security.symbol);
    
    if (existingIndex >= 0) {
      updatedSecurities[existingIndex] = security;
    } else {
      updatedSecurities.push(security);
    }

    const updatedData = {
      ...data,
      securities: updatedSecurities,
      lastUpdated: new Date().toISOString()
    };

    await saveData(updatedData);
  }, [data, saveData]);

  // Update security
  const updateSecurity = useCallback(async (symbol: string, updates: Partial<Security>) => {
    if (!data) return;

    const updatedSecurities = data.securities.map(security => 
      security.symbol === symbol 
        ? { ...security, ...updates, lastUpdated: new Date().toISOString() }
        : security
    );

    const updatedData = {
      ...data,
      securities: updatedSecurities,
      lastUpdated: new Date().toISOString()
    };

    await saveData(updatedData);
  }, [data, saveData]);

  // Get holdings with full details (security + market data)
  const getHoldingsWithDetails = useCallback((): HoldingWithDetails[] => {
    if (!data) {
      return [];
    }

    if (!data.holdings || !Array.isArray(data.holdings)) {
      return [];
    }

    if (!data.securities || !Array.isArray(data.securities)) {
      return [];
    }

    return data.holdings.map(holding => {
      const security = data.securities.find(s => s.symbol === holding.symbol);
      const marketData = data.marketData?.find(md => md.symbol === holding.symbol);
      
      // Always calculate from current market data (not stored values)
      const currentPrice = marketData?.currentPrice || 0;
      const marketValue = holding.quantity * currentPrice;
      const investedValue = holding.quantity * holding.avgPrice;
      const unrealizedGL = marketValue - investedValue;
      const unrealizedGLPercent = investedValue > 0 ? (unrealizedGL / investedValue) * 100 : 0;
      
      
      return {
        ...holding,
        security: security || {
          symbol: holding.symbol,
          cusip: holding.symbol,
          description: holding.symbol,
          sector: 'Unknown',
          type: 'equity' as const,
          lastUpdated: new Date().toISOString()
        },
        marketData: marketData || {
          symbol: holding.symbol,
          currentPrice: 0,
          previousClose: 0,
          dayChange: 0,
          dayChangePercent: 0,
          volume: 0,
          marketCap: 0,
          lastUpdated: new Date().toISOString()
        },
        marketValue,
        unrealizedGL,
        unrealizedGLPercent,
        currentPrice
      };
    });
  }, [data]);

  // Update market data for holdings
  const updateMarketData = useCallback(async (marketData: MarketData[]) => {
    if (!data) return;

    // Update market data in the data object
    const updatedMarketData = [...(data.marketData || [])];
    marketData.forEach(newData => {
      const existingIndex = updatedMarketData.findIndex(md => md.symbol === newData.symbol);
      if (existingIndex >= 0) {
        updatedMarketData[existingIndex] = newData;
      } else {
        updatedMarketData.push(newData);
      }
    });

    // Don't store calculated fields in holdings - they should only be calculated dynamically
    const updatedHoldings = data.holdings.map(holding => {
      const marketDataForSymbol = marketData.find(md => md.symbol === holding.symbol);
      if (marketDataForSymbol) {
        const updated = { ...holding };
        // Remove any calculated fields that might be present
        delete updated.marketValue;
        delete updated.unrealizedGL;
        delete updated.unrealizedGLPercent;
        delete updated.currentPrice;
        delete updated.previousClose;
        delete updated.dayChange;
        delete updated.dayChangePercent;
        delete updated.volume;
        delete updated.marketCap;
        updated.lastUpdated = new Date().toISOString();
        return updated;
      }
      return holding;
    });

    // Recalculate total balances using current market data
    const totalMarketValue = updatedHoldings.reduce((sum, h) => {
      const marketData = updatedMarketData.find(md => md.symbol === h.symbol);
      return sum + (h.quantity * (marketData?.currentPrice || 0));
    }, 0);
    const totalInvestedValue = updatedHoldings.reduce((sum, h) => sum + (h.quantity * h.avgPrice), 0);

    const updatedBalances = {
      ...data.balances,
      totalValue: data.balances.cash + totalMarketValue,
      investedValue: totalInvestedValue,
      lastUpdated: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      holdings: updatedHoldings,
      marketData: updatedMarketData,
      balances: updatedBalances,
      lastUpdated: new Date().toISOString()
    };

    await saveData(updatedData);
  }, [data, saveData]);

  // Add new holding
  const addHolding = useCallback(async (holdingData: Omit<Holding, 'marketValue' | 'unrealizedGL' | 'unrealizedGLPercent'>) => {
    if (!data) return;

    // Get market data for the symbol
    const marketData = data.marketData?.find(md => md.symbol === holdingData.symbol);
    if (!marketData) {
      throw new Error(`Market data not found for symbol: ${holdingData.symbol}`);
    }

    // Create holding without calculated fields - they should only be calculated dynamically
    const newHolding: Holding = {
      symbol: holdingData.symbol,
      quantity: holdingData.quantity,
      avgPrice: holdingData.avgPrice,
      lastUpdated: new Date().toISOString()
    };

    const updatedHoldings = [...data.holdings, newHolding];

    // Recalculate total balances using current market data
    const totalMarketValue = updatedHoldings.reduce((sum, h) => {
      const marketData = data.marketData?.find(md => md.symbol === h.symbol);
      return sum + (h.quantity * (marketData?.currentPrice || 0));
    }, 0);
    const totalInvestedValue = updatedHoldings.reduce((sum, h) => sum + (h.quantity * h.avgPrice), 0);

    const updatedBalances = {
      ...data.balances,
      totalValue: data.balances.cash + totalMarketValue,
      investedValue: totalInvestedValue,
      lastUpdated: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      holdings: updatedHoldings,
      balances: updatedBalances,
      lastUpdated: new Date().toISOString()
    };

    await saveData(updatedData);
  }, [data, saveData]);

  // Remove holding
  const removeHolding = useCallback(async (symbol: string) => {
    if (!data) return;

    const updatedHoldings = data.holdings.filter(h => h.symbol !== symbol);

    // Recalculate total balances using current market data
    const totalMarketValue = updatedHoldings.reduce((sum, h) => {
      const marketData = data.marketData?.find(md => md.symbol === h.symbol);
      return sum + (h.quantity * (marketData?.currentPrice || 0));
    }, 0);
    const totalInvestedValue = updatedHoldings.reduce((sum, h) => sum + (h.quantity * h.avgPrice), 0);

    const updatedBalances = {
      ...data.balances,
      totalValue: data.balances.cash + totalMarketValue,
      investedValue: totalInvestedValue,
      lastUpdated: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      holdings: updatedHoldings,
      balances: updatedBalances,
      lastUpdated: new Date().toISOString()
    };

    await saveData(updatedData);
  }, [data, saveData]);

  // Update holding (for static data changes like quantity)
  const updateHolding = useCallback(async (symbol: string, updates: Partial<Holding>) => {
    if (!data) return;

    console.log('1. updateHolding called for', symbol, 'with quantity:', updates.quantity);

    const updatedHoldings = data.holdings.map(holding => {
      if (holding.symbol === symbol) {
        const updated = { ...holding, ...updates };
        
        // Don't store calculated fields - they should only be calculated dynamically
        // Remove any calculated fields that might be present
        delete updated.marketValue;
        delete updated.unrealizedGL;
        delete updated.unrealizedGLPercent;
        delete updated.currentPrice;
        delete updated.previousClose;
        delete updated.dayChange;
        delete updated.dayChangePercent;
        delete updated.volume;
        delete updated.marketCap;
        
        updated.lastUpdated = new Date().toISOString();
        console.log('2. Updated holding:', symbol, 'from', holding.quantity, 'to', updated.quantity);
        return updated;
      }
      return holding;
    });

    // Recalculate total balances using current market data
    const totalMarketValue = updatedHoldings.reduce((sum, h) => {
      const marketData = data.marketData?.find(md => md.symbol === h.symbol);
      return sum + (h.quantity * (marketData?.currentPrice || 0));
    }, 0);
    const totalInvestedValue = updatedHoldings.reduce((sum, h) => sum + (h.quantity * h.avgPrice), 0);

    // Calculate buying power
    const calculatedBuyingPower = calculateBuyingPower(updatedHoldings, data.balances.cash, data.marketData || []);

    const updatedBalances = {
      ...data.balances,
      totalValue: data.balances.cash + totalMarketValue,
      investedValue: totalInvestedValue,
      buyingPower: calculatedBuyingPower,
      lastUpdated: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      holdings: updatedHoldings,
      balances: updatedBalances,
      lastUpdated: new Date().toISOString()
    };

    console.log('3. Saving to database...');
    await saveData(updatedData);
    console.log('4. Database save completed');
  }, [data, saveData, calculateBuyingPower]);

  // Add trade
  const addTrade = useCallback(async (tradeData: Omit<Trade, 'id'>) => {
    if (!data) return;

    const newTrade: Trade = {
      ...tradeData,
      id: `trade-${Date.now()}`,
      lastUpdated: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      trades: [...data.trades, newTrade],
      lastUpdated: new Date().toISOString()
    };

    await saveData(updatedData);
  }, [data, saveData]);

  // Add activity
  const addActivity = useCallback(async (activityData: Omit<Activity, 'id'>) => {
    if (!data) return;

    const newActivity: Activity = {
      ...activityData,
      id: `activity-${Date.now()}`,
      lastUpdated: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      activities: [...data.activities, newActivity],
      lastUpdated: new Date().toISOString()
    };

    await saveData(updatedData);
  }, [data, saveData]);

  // Update balances
  const updateBalances = useCallback(async (updates: Partial<AccountBalances>) => {
    if (!data) return;

    const updatedBalances = {
      ...data.balances,
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      balances: updatedBalances,
      lastUpdated: new Date().toISOString()
    };

    await saveData(updatedData);
  }, [data, saveData]);

  // Reset to seed data
  const resetToSeed = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Refresh data
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Execute trade (combines holding update and trade record in single save)
  const executeTrade = useCallback(async (tradeData: {
    symbol: string;
    action: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    totalValue: number;
    commission: number;
    holdingUpdates?: Partial<Holding>;
    balanceUpdates?: Partial<AccountBalances>;
  }) => {
    if (!data) return;

    console.log('🔄 Executing trade with combined save:', tradeData);

    let updatedHoldings = [...data.holdings];
    let updatedBalances = { ...data.balances };

    // Update holdings if provided
    if (tradeData.holdingUpdates) {
      updatedHoldings = data.holdings.map(holding => {
        if (holding.symbol === tradeData.symbol) {
          const updated = { ...holding, ...tradeData.holdingUpdates };
          // Remove calculated fields
          delete updated.marketValue;
          delete updated.unrealizedGL;
          delete updated.unrealizedGLPercent;
          delete updated.currentPrice;
          delete updated.previousClose;
          delete updated.dayChange;
          delete updated.dayChangePercent;
          delete updated.volume;
          delete updated.marketCap;
          updated.lastUpdated = new Date().toISOString();
          return updated;
        }
        return holding;
      });
    }

    // Update balances if provided
    if (tradeData.balanceUpdates) {
      updatedBalances = { ...data.balances, ...tradeData.balanceUpdates };
    }

    // Recalculate buying power after all updates
    const calculatedBuyingPower = calculateBuyingPower(updatedHoldings, updatedBalances.cash, data.marketData || []);
    updatedBalances.buyingPower = calculatedBuyingPower;

    // Add trade record
    const newTrade: Trade = {
      id: `trade-${Date.now()}`,
      symbol: tradeData.symbol,
      cusip: tradeData.symbol,
      description: `${tradeData.symbol} Stock`,
      action: tradeData.action,
      quantity: tradeData.quantity,
      price: tradeData.price,
      totalValue: tradeData.totalValue,
      commission: tradeData.commission,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0],
      longShort: 'Long',
      lastUpdated: new Date().toISOString()
    };

    // Add activity record for the trade
    const now = new Date();
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      date: now.toISOString().split('T')[0], // Display date only
      time: now.toTimeString().split(' ')[0], // Display time only
      type: 'TRADE',
      symbol: tradeData.symbol,
      cusip: tradeData.symbol, // Using symbol as CUSIP for now
      description: `${tradeData.action} ${tradeData.quantity} shares of ${tradeData.symbol}`,
      quantity: tradeData.quantity,
      price: tradeData.price,
      buyPrice: tradeData.price,
      action: tradeData.action,
      amount: tradeData.totalValue,
      settleDate: new Date().toISOString().split('T')[0], // Same as date for now
      transactionType: 'MARKET', // Default to market, could be made dynamic
      accountType: 'CASH', // Default to cash, could be made dynamic
      tradeNumber: `T${Date.now().toString().slice(-6)}`, // Generate trade number
      lastUpdated: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      holdings: updatedHoldings,
      trades: [...data.trades, newTrade],
      activities: [...data.activities, newActivity],
      balances: updatedBalances,
      lastUpdated: new Date().toISOString()
    };

    console.log('💾 Saving trade and holdings together...');
    await saveData(updatedData);
    console.log('✅ Trade executed successfully');
  }, [data, saveData, calculateBuyingPower]);

  // Force refresh market data
  const refreshMarketData = useCallback(async () => {
    if (!data) {
      return;
    }
    
    const newMarketData = await forceReloadMarketData();
    
    if (newMarketData && (newMarketData as { stocks?: unknown[] }).stocks) {
      const symbols = data.holdings.map(h => h.symbol);
      
      const marketDataForHoldings = (newMarketData as { stocks: unknown[] }).stocks.filter((stock: unknown) => {
        return symbols.includes((stock as { symbol: string }).symbol);
      }) as MarketData[];
      
      await updateMarketData(marketDataForHoldings);
    }
  }, [data, updateMarketData]);

  // Clear cache for this account
  const clearCache = useCallback(() => {
    accountDataCache.delete(accountId);
  }, [accountId]);

  // Pre-load data for an account (useful for hover navigation)
  const preloadAccountData = useCallback(async (targetAccountId: string) => {
    // Check if data is already cached
    const cached = accountDataCache.get(targetAccountId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    // Pre-load data in background
    try {
      const accountData = await localDataService.getAccountData(targetAccountId);
      if (accountData) {
        accountDataCache.set(targetAccountId, { data: accountData, timestamp: Date.now() });
        return accountData;
      }
    } catch {
      console.log('Pre-load failed for account:', targetAccountId);
    }
    return null;
  }, []);

  // Generate historical activities from existing holdings
  const generateHistoricalActivities = useCallback(async (forceRegenerate: boolean = false): Promise<void> => {
    if (!data) return;


    // Check if we already have historical BUY activities for holdings
    const existingTradeActivities = data.activities.filter(activity => activity.type === 'TRADE');
    const holdingsSymbols = data.holdings.map(h => h.symbol);
    const existingBuyActivities = existingTradeActivities.filter(activity => 
      activity.action === 'BUY' && holdingsSymbols.includes(activity.symbol || '')
    );


    // If we already have BUY activities for all holdings, skip (unless forcing regeneration)
    if (existingBuyActivities.length >= data.holdings.length && !forceRegenerate) {
      return;
    }

    // If forcing regeneration, remove existing historical activities first
    if (forceRegenerate && existingTradeActivities.length > 0) {
      const nonHistoricalActivities = data.activities.filter(activity => 
        activity.type !== 'TRADE' || !activity.id.startsWith('historical-')
      );
      
      const updatedData = {
        ...data,
        activities: nonHistoricalActivities,
        lastUpdated: new Date().toISOString()
      };
      
      await saveData(updatedData);
    }

    // Generate activities for each holding that doesn't already have BUY activities
    const historicalActivities: Activity[] = [];
    const now = new Date();

    data.holdings.forEach(holding => {
      // Check if we already have BUY activities for this symbol
      const hasBuyActivity = existingBuyActivities.some(activity => activity.symbol === holding.symbol);
      if (hasBuyActivity && !forceRegenerate) {
        return;
      }

      // For large holdings, simulate multiple historical purchases
      const totalQuantity = holding.quantity;
      const avgPrice = holding.avgPrice;
      
      if (totalQuantity <= 100) {
        // Small holding - single purchase
        const historicalDate = new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
        
        const activity: Activity = {
          id: `historical-${holding.symbol}-${Date.now()}`,
          type: 'TRADE',
          symbol: holding.symbol,
          cusip: holding.symbol,
          description: `Historical BUY ${totalQuantity} shares of ${holding.symbol}`,
          quantity: totalQuantity,
          price: avgPrice,
          buyPrice: avgPrice,
          action: 'BUY',
          amount: totalQuantity * avgPrice,
          date: historicalDate.toISOString().split('T')[0],
          time: historicalDate.toTimeString().split(' ')[0],
          settleDate: historicalDate.toISOString().split('T')[0],
          transactionType: 'MARKET',
          accountType: 'CASH',
          tradeNumber: `H${Date.now().toString().slice(-6)}`,
          lastUpdated: new Date().toISOString()
        };

        historicalActivities.push(activity);
      } else {
        // Large holding - simulate multiple purchases over time
        const numPurchases = Math.min(Math.ceil(totalQuantity / 50), 5); // 2-5 purchases
        const baseQuantity = Math.floor(totalQuantity / numPurchases);
        const remainder = totalQuantity % numPurchases;
        
        for (let i = 0; i < numPurchases; i++) {
          const quantity = baseQuantity + (i === numPurchases - 1 ? remainder : 0);
          if (quantity <= 0) continue;
          
          // Simulate price variation over time (±20% from average)
          const priceVariation = (Math.random() - 0.5) * 0.4; // -20% to +20%
          const purchasePrice = avgPrice * (1 + priceVariation);
          
          // Earlier purchases should be older
          const daysAgo = (numPurchases - i) * 30 + Math.random() * 30; // 30-180 days ago
          const historicalDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
          
          const activity: Activity = {
            id: `historical-${holding.symbol}-${i}-${Date.now()}`,
            type: 'TRADE',
            symbol: holding.symbol,
            cusip: holding.symbol,
            description: `Historical BUY ${quantity} shares of ${holding.symbol}`,
            quantity: quantity,
            price: purchasePrice,
            buyPrice: purchasePrice,
            action: 'BUY',
            amount: quantity * purchasePrice,
            date: historicalDate.toISOString().split('T')[0],
            time: historicalDate.toTimeString().split(' ')[0],
            settleDate: historicalDate.toISOString().split('T')[0],
            transactionType: 'MARKET',
            accountType: 'CASH',
            tradeNumber: `H${Date.now().toString().slice(-6)}${i}`,
            lastUpdated: new Date().toISOString()
          };

          historicalActivities.push(activity);
        }
      }
    });

    if (historicalActivities.length > 0) {
      
      // Add to existing activities
      const updatedData = {
        ...data,
        activities: [...data.activities, ...historicalActivities],
        lastUpdated: new Date().toISOString()
      };

      await saveData(updatedData);
    } else {
    }
  }, [data, saveData]);

  // Calculate unrealized positions from trading activities
  const calculateUnrealizedPositions = useCallback((): UnrealizedPosition[] => {
    if (!data?.activities || !data?.marketData) return [];

    // Group trades by symbol
    const tradesBySymbol = new Map<string, Array<{ type: 'BUY' | 'SELL', quantity: number, price: number, date: string }>>();
    
    data.activities
      .filter(activity => activity.type === 'TRADE' && activity.symbol && activity.quantity && activity.price)
      .forEach(activity => {
        const symbol = activity.symbol!;
        if (!tradesBySymbol.has(symbol)) {
          tradesBySymbol.set(symbol, []);
        }
        tradesBySymbol.get(symbol)!.push({
          type: activity.action as 'BUY' | 'SELL',
          quantity: activity.quantity!,
          price: activity.price!,
          date: activity.date
        });
      });

    const positions: UnrealizedPosition[] = [];

    // Calculate position for each symbol
    tradesBySymbol.forEach((trades, symbol) => {
      let totalQuantity = 0;
      let totalCost = 0;
      let buyQuantity = 0;
      let buyCost = 0;

      // Process trades chronologically
      trades.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      trades.forEach(trade => {
        if (trade.type === 'BUY') {
          totalQuantity += trade.quantity;
          totalCost += trade.quantity * trade.price;
          buyQuantity += trade.quantity;
          buyCost += trade.quantity * trade.price;
        } else if (trade.type === 'SELL') {
          // For sells, we need to calculate which shares we're selling (FIFO)
          const sharesToSell = Math.min(trade.quantity, totalQuantity);
          if (sharesToSell > 0) {
            // Calculate average cost of remaining shares
            const avgCost = buyQuantity > 0 ? buyCost / buyQuantity : 0;
            const costOfSoldShares = sharesToSell * avgCost;
            
            totalQuantity -= sharesToSell;
            totalCost -= costOfSoldShares;
            buyQuantity -= sharesToSell;
            buyCost -= costOfSoldShares;
          }
        }
      });

      // Only include positions with remaining quantity
      if (totalQuantity > 0) {
        const avgPrice = totalCost / totalQuantity;
        const marketData = data.marketData.find(md => md.symbol === symbol);
        const currentPrice = marketData?.currentPrice || 0;
        const marketValue = totalQuantity * currentPrice;
        const unrealizedGL = marketValue - totalCost;
        const unrealizedGLPercent = totalCost > 0 ? (unrealizedGL / totalCost) * 100 : 0;

        // Get security info
        const security = data.securities.find(s => s.symbol === symbol);

        positions.push({
          id: `position-${symbol}`,
          symbol,
          cusip: security?.cusip || symbol,
          description: security?.description || `${symbol} Stock`,
          quantity: totalQuantity,
          avgPrice,
          currentPrice,
          marketValue,
          unrealizedGL,
          unrealizedGLPercent,
          longShort: 'Long',
          lastUpdated: new Date().toISOString()
        });
      }
    });

    return positions;
  }, [data?.activities, data?.marketData, data?.securities]);

  // Load data on mount and generate historical activities if needed
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Generate historical activities after data is loaded
  useEffect(() => {
    if (data && !loading) {
      generateHistoricalActivities();
    }
  }, [data, loading, generateHistoricalActivities]);

  const value: AccountDataContextType = {
    data,
    loading,
    error,
    // Holdings management
    updateHolding,
    addHolding,
    removeHolding,
    // Securities management
    addSecurity,
    updateSecurity,
    getSecurity,
    // Market data
    updateMarketData,
    // Other operations
    addTrade,
    addActivity,
    updateBalances,
    executeTrade,
    resetToSeed,
    refreshData,
    refreshMarketData,
    clearCache,
    preloadAccountData,
    // Helper functions
    getHoldingsWithDetails,
    // Calculate unrealized positions from trading activities
    calculateUnrealizedPositions,
    // Generate historical activities from holdings
    generateHistoricalActivities
  };

  return (
    <AccountDataContext.Provider value={value}>
      {children}
    </AccountDataContext.Provider>
  );
}

export function useAccountData() {
  const context = useContext(AccountDataContext);
  if (context === undefined) {
    throw new Error('useAccountData must be used within an AccountDataProvider');
  }
  return context;
}
