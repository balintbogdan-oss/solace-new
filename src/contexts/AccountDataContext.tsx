'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AccountData, AccountDataContextType, Holding, Trade, Activity, AccountBalances, MarketData, Security, HoldingWithDetails } from '@/types/account';

const AccountDataContext = createContext<AccountDataContextType | undefined>(undefined);

const getStorageKey = (accountId: string) => `account-data-${accountId}`;

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

  // Load data from localStorage or seed data
  const loadData = useCallback(() => {
    try {
      setLoading(true);
      setError(null);

      const storageKey = getStorageKey(accountId);
      
      // Check localStorage first
      const storedData = localStorage.getItem(storageKey);
      
      if (storedData) {
        const parsedData = JSON.parse(storedData) as AccountData;
        console.log('Loaded from localStorage:', parsedData.accountId, 'marketData length:', parsedData.marketData?.length || 0);
        setData(parsedData);
      } else {
        // For demo purposes, use seed data for 1PB10001, empty for others
        if (accountId === '1PB10001') {
          // Create basic seed data
          const seedData: AccountData = {
            accountId: '1PB10001',
            accountName: 'Jim Robinson & Alexa Robinson',
            accountType: 'joint',
            clientId: 'jim-robinson',
            client: {
              id: 'jim-robinson',
              firstName: 'Jim',
              lastName: 'Robinson',
              createdAt: new Date().toISOString(),
              lastUpdated: new Date().toISOString()
            },
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
          console.log('Loading seed data for 1PB10001, marketData length:', seedData.marketData?.length || 0);
          setData(seedData);
          // Save seed data to localStorage
          localStorage.setItem(storageKey, JSON.stringify(seedData));
        } else {
          // Create empty account data for new accounts
          const emptyAccountData: AccountData = {
            accountId,
            accountName: 'Unknown Account',
            accountType: 'individual',
            clientId: 'unknown',
            client: {
              id: 'unknown',
              firstName: 'Unknown',
              lastName: 'Client',
              email: '',
              phone: '',
              createdAt: new Date().toISOString(),
              lastUpdated: new Date().toISOString()
            },
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
              unrealizedGL: 0,
              realizedGL: 0,
              lastUpdated: new Date().toISOString()
            },
            realizedGL: [],
            unrealizedGL: [],
            commissions: [],
            lastUpdated: new Date().toISOString()
          };
          setData(emptyAccountData);
          localStorage.setItem(storageKey, JSON.stringify(emptyAccountData));
        }
      }
    } catch (err) {
      console.error('Error loading account data:', err);
      setError('Failed to load account data');
      // Fallback to empty data
      const emptyAccountData: AccountData = {
        accountId,
        accountName: 'Unknown Account',
        accountType: 'individual',
        clientId: 'unknown',
        client: {
          id: 'unknown',
          firstName: 'Unknown',
          lastName: 'Client',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
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
          unrealizedGL: 0,
          realizedGL: 0,
          lastUpdated: new Date().toISOString()
        },
        realizedGL: [],
        unrealizedGL: [],
        commissions: [],
        lastUpdated: new Date().toISOString()
      };
      setData(emptyAccountData);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  // Save data to localStorage
  const saveData = useCallback((newData: AccountData) => {
    try {
      const storageKey = getStorageKey(accountId);
      localStorage.setItem(storageKey, JSON.stringify(newData));
      setData(newData);
    } catch (err) {
      console.error('Error saving account data:', err);
      setError('Failed to save account data');
    }
  }, [accountId]);

  // Get security by symbol
  const getSecurity = useCallback((symbol: string): Security | undefined => {
    return data?.securities.find(s => s.symbol === symbol);
  }, [data]);

  // Add new security
  const addSecurity = useCallback((security: Security) => {
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

    saveData(updatedData);
  }, [data, saveData]);

  // Update security
  const updateSecurity = useCallback((symbol: string, updates: Partial<Security>) => {
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

    saveData(updatedData);
  }, [data, saveData]);

  // Get holdings with full details (security + market data)
  const getHoldingsWithDetails = useCallback((): HoldingWithDetails[] => {
    if (!data) {
      console.log('No data available');
      return [];
    }

    if (!data.holdings || !Array.isArray(data.holdings)) {
      console.log('No holdings data available');
      return [];
    }

    if (!data.securities || !Array.isArray(data.securities)) {
      console.log('No securities data available');
      return [];
    }

    if (!data.marketData || !Array.isArray(data.marketData)) {
      console.log('No market data available, holdings:', data.holdings.length);
      return [];
    }

    console.log('Processing holdings:', data.holdings.length, 'securities:', data.securities.length, 'marketData:', data.marketData.length);

    return data.holdings.map(holding => {
      const security = data.securities.find(s => s.symbol === holding.symbol);
      const marketData = data.marketData.find(md => md.symbol === holding.symbol);
      
      if (!security) {
        console.error(`Security not found for symbol: ${holding.symbol}`);
        throw new Error(`Security not found for symbol: ${holding.symbol}`);
      }
      
      if (!marketData) {
        console.error(`Market data not found for symbol: ${holding.symbol}`);
        throw new Error(`Market data not found for symbol: ${holding.symbol}`);
      }

      // Calculate market value and unrealized GL
      const currentPrice = marketData.currentPrice;
      const marketValue = holding.quantity * currentPrice;
      const unrealizedGL = marketValue - (holding.quantity * holding.avgPrice);
      const unrealizedGLPercent = (holding.quantity * holding.avgPrice) > 0 
        ? (unrealizedGL / (holding.quantity * holding.avgPrice)) * 100 
        : 0;

      return {
        ...holding,
        marketValue,
        unrealizedGL,
        unrealizedGLPercent,
        security,
        marketData
      };
    });
  }, [data]);

  // Update market data for holdings
  const updateMarketData = useCallback((marketData: MarketData[]) => {
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

    // Recalculate holdings with new market data
    const updatedHoldings = data.holdings.map(holding => {
      const marketDataForSymbol = marketData.find(md => md.symbol === holding.symbol);
      if (marketDataForSymbol) {
        const updated = { ...holding };
        // Recalculate market value and unrealized G/L
        updated.marketValue = updated.quantity * marketDataForSymbol.currentPrice;
        updated.unrealizedGL = updated.marketValue - (updated.quantity * updated.avgPrice);
        updated.unrealizedGLPercent = (updated.unrealizedGL / (updated.quantity * updated.avgPrice)) * 100;
        updated.lastUpdated = new Date().toISOString();
        return updated;
      }
      return holding;
    });

    // Recalculate total balances
    const totalMarketValue = updatedHoldings.reduce((sum, h) => sum + (h.marketValue || 0), 0);
    const totalInvestedValue = updatedHoldings.reduce((sum, h) => sum + (h.quantity * h.avgPrice), 0);
    const totalUnrealizedGL = totalMarketValue - totalInvestedValue;

    const updatedBalances = {
      ...data.balances,
      totalValue: data.balances.cash + totalMarketValue,
      investedValue: totalInvestedValue,
      unrealizedGL: totalUnrealizedGL,
      lastUpdated: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      holdings: updatedHoldings,
      marketData: updatedMarketData,
      balances: updatedBalances,
      lastUpdated: new Date().toISOString()
    };

    saveData(updatedData);
  }, [data, saveData]);

  // Add new holding
  const addHolding = useCallback((holdingData: Omit<Holding, 'marketValue' | 'unrealizedGL' | 'unrealizedGLPercent'>) => {
    if (!data) return;

    // Get market data for the symbol
    const marketData = data.marketData?.find(md => md.symbol === holdingData.symbol);
    if (!marketData) {
      throw new Error(`Market data not found for symbol: ${holdingData.symbol}`);
    }

    // Calculate values
    const marketValue = holdingData.quantity * marketData.currentPrice;
    const unrealizedGL = marketValue - (holdingData.quantity * holdingData.avgPrice);
    const unrealizedGLPercent = (unrealizedGL / (holdingData.quantity * holdingData.avgPrice)) * 100;

    const newHolding: Holding = {
      ...holdingData,
      marketValue,
      unrealizedGL,
      unrealizedGLPercent,
      lastUpdated: new Date().toISOString()
    };

    const updatedHoldings = [...data.holdings, newHolding];

    // Recalculate total balances
    const totalMarketValue = updatedHoldings.reduce((sum, h) => sum + (h.marketValue || 0), 0);
    const totalInvestedValue = updatedHoldings.reduce((sum, h) => sum + (h.quantity * h.avgPrice), 0);
    const totalUnrealizedGL = totalMarketValue - totalInvestedValue;

    const updatedBalances = {
      ...data.balances,
      totalValue: data.balances.cash + totalMarketValue,
      investedValue: totalInvestedValue,
      unrealizedGL: totalUnrealizedGL,
      lastUpdated: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      holdings: updatedHoldings,
      balances: updatedBalances,
      lastUpdated: new Date().toISOString()
    };

    saveData(updatedData);
  }, [data, saveData]);

  // Remove holding
  const removeHolding = useCallback((symbol: string) => {
    if (!data) return;

    const updatedHoldings = data.holdings.filter(h => h.symbol !== symbol);

    // Recalculate total balances
    const totalMarketValue = updatedHoldings.reduce((sum, h) => sum + (h.marketValue || 0), 0);
    const totalInvestedValue = updatedHoldings.reduce((sum, h) => sum + (h.quantity * h.avgPrice), 0);
    const totalUnrealizedGL = totalMarketValue - totalInvestedValue;

    const updatedBalances = {
      ...data.balances,
      totalValue: data.balances.cash + totalMarketValue,
      investedValue: totalInvestedValue,
      unrealizedGL: totalUnrealizedGL,
      lastUpdated: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      holdings: updatedHoldings,
      balances: updatedBalances,
      lastUpdated: new Date().toISOString()
    };

    saveData(updatedData);
  }, [data, saveData]);

  // Update holding (for static data changes like quantity)
  const updateHolding = useCallback((symbol: string, updates: Partial<Holding>) => {
    if (!data) return;

    const updatedHoldings = data.holdings.map(holding => {
      if (holding.symbol === symbol) {
        const updated = { ...holding, ...updates };
        
        // Get current market data
        const marketData = data.marketData?.find(md => md.symbol === symbol);
        if (marketData) {
          // Recalculate market value and unrealized G/L using current market data
          updated.marketValue = updated.quantity * marketData.currentPrice;
          updated.unrealizedGL = updated.marketValue - (updated.quantity * updated.avgPrice);
          updated.unrealizedGLPercent = (updated.unrealizedGL / (updated.quantity * updated.avgPrice)) * 100;
        }
        
        updated.lastUpdated = new Date().toISOString();
        return updated;
      }
      return holding;
    });

    // Recalculate total balances
    const totalMarketValue = updatedHoldings.reduce((sum, h) => sum + (h.marketValue || 0), 0);
    const totalInvestedValue = updatedHoldings.reduce((sum, h) => sum + (h.quantity * h.avgPrice), 0);
    const totalUnrealizedGL = totalMarketValue - totalInvestedValue;

    const updatedBalances = {
      ...data.balances,
      totalValue: data.balances.cash + totalMarketValue,
      investedValue: totalInvestedValue,
      unrealizedGL: totalUnrealizedGL,
      lastUpdated: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      holdings: updatedHoldings,
      balances: updatedBalances,
      lastUpdated: new Date().toISOString()
    };

    saveData(updatedData);
  }, [data, saveData]);

  // Add trade
  const addTrade = useCallback((tradeData: Omit<Trade, 'id'>) => {
    if (!data) return;

    const newTrade: Trade = {
      ...tradeData,
      id: `trade-${Date.now()}`
    };

    const updatedTrades = [newTrade, ...data.trades];
    
    // Add corresponding activity
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      type: 'TRADE',
      description: `${tradeData.action === 'BUY' ? 'Bought' : 'Sold'} ${tradeData.quantity} shares of ${tradeData.symbol}`,
      amount: tradeData.action === 'BUY' ? -tradeData.totalValue : tradeData.totalValue,
      date: tradeData.date,
      time: tradeData.time,
      symbol: tradeData.symbol,
      quantity: tradeData.quantity,
      price: tradeData.price
    };

    const updatedActivities = [newActivity, ...data.activities];

    // Update cash balance
    const cashChange = tradeData.action === 'BUY' ? -tradeData.totalValue : tradeData.totalValue;
    const updatedBalances = {
      ...data.balances,
      cash: data.balances.cash + cashChange,
      buyingPower: data.balances.cash + cashChange,
      lastUpdated: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      trades: updatedTrades,
      activities: updatedActivities,
      balances: updatedBalances,
      lastUpdated: new Date().toISOString()
    };

    saveData(updatedData);
  }, [data, saveData]);

  // Add activity
  const addActivity = useCallback((activityData: Omit<Activity, 'id'>) => {
    if (!data) return;

    const newActivity: Activity = {
      ...activityData,
      id: `activity-${Date.now()}`
    };

    const updatedActivities = [newActivity, ...data.activities];
    
    // Update cash balance if it's a deposit/withdrawal
    let updatedBalances = data.balances;
    if (activityData.type === 'DEPOSIT' || activityData.type === 'WITHDRAWAL') {
      const cashChange = activityData.type === 'DEPOSIT' ? activityData.amount : -activityData.amount;
      updatedBalances = {
        ...data.balances,
        cash: data.balances.cash + cashChange,
        buyingPower: data.balances.cash + cashChange,
        lastUpdated: new Date().toISOString()
      };
    }

    const updatedData = {
      ...data,
      activities: updatedActivities,
      balances: updatedBalances,
      lastUpdated: new Date().toISOString()
    };

    saveData(updatedData);
  }, [data, saveData]);

  // Update balances
  const updateBalances = useCallback((updates: Partial<AccountBalances>) => {
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

    saveData(updatedData);
  }, [data, saveData]);

  // Reset to seed data
  const resetToSeed = useCallback(() => {
    const storageKey = getStorageKey(accountId);
    localStorage.removeItem(storageKey);
    if (accountId === '1PB10001') {
      // Create basic seed data
      const seedData: AccountData = {
        accountId: '1PB10001',
        accountName: 'Jim Robinson & Alexa Robinson',
        accountType: 'joint',
        clientId: 'jim-robinson',
        client: {
          id: 'jim-robinson',
          firstName: 'Jim',
          lastName: 'Robinson',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
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
      setData(seedData);
      localStorage.setItem(storageKey, JSON.stringify(seedData));
    } else {
      // Reset to empty data for other accounts
      const emptyAccountData: AccountData = {
        accountId,
        accountName: 'Unknown Account',
        accountType: 'individual',
        clientId: 'unknown',
        client: {
          id: 'unknown',
          firstName: 'Unknown',
          lastName: 'Client',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
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
          unrealizedGL: 0,
          realizedGL: 0,
          lastUpdated: new Date().toISOString()
        },
        realizedGL: [],
        unrealizedGL: [],
        commissions: [],
        lastUpdated: new Date().toISOString()
      };
      setData(emptyAccountData);
      localStorage.setItem(storageKey, JSON.stringify(emptyAccountData));
    }
  }, [accountId]);

  // Refresh data (reload from localStorage)
  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  // Execute trade
  const executeTrade = useCallback((tradeData: {
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

    // Add trade to trades array
    const newTrade: Trade = {
      id: Date.now().toString(),
      symbol: tradeData.symbol,
      cusip: '', // Would need to be provided or looked up
      description: `${tradeData.action} ${tradeData.quantity} shares of ${tradeData.symbol}`,
      action: tradeData.action,
      quantity: tradeData.quantity,
      price: tradeData.price,
      totalValue: tradeData.totalValue,
      commission: tradeData.commission,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      longShort: 'Long',
      lastUpdated: new Date().toISOString()
    };

    const updatedTrades = [...data.trades, newTrade];

    // Update holdings if provided
    const updatedHoldings = data.holdings;
    if (tradeData.holdingUpdates) {
      const existingIndex = updatedHoldings.findIndex(h => h.symbol === tradeData.symbol);
      if (existingIndex >= 0) {
        updatedHoldings[existingIndex] = { ...updatedHoldings[existingIndex], ...tradeData.holdingUpdates };
      } else {
        updatedHoldings.push(tradeData.holdingUpdates as Holding);
      }
    }

    // Update balances if provided
    const updatedBalances = tradeData.balanceUpdates 
      ? { ...data.balances, ...tradeData.balanceUpdates, lastUpdated: new Date().toISOString() }
      : data.balances;

    const updatedData = {
      ...data,
      trades: updatedTrades,
      holdings: updatedHoldings,
      balances: updatedBalances,
      lastUpdated: new Date().toISOString()
    };

    saveData(updatedData);
  }, [data, saveData]);

  // Refresh market data (placeholder)
  const refreshMarketData = useCallback(() => {
    // This would typically call a market data service
    console.log('Refreshing market data...');
  }, []);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

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
    // Helper functions
    getHoldingsWithDetails,
    calculateUnrealizedPositions: () => [], // No-op for mock context
    generateHistoricalActivities: async () => {}, // No-op for mock context
    // Cache management
    clearCache: () => {}, // No-op for mock context
    preloadAccountData: async () => null // No-op for mock context
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

