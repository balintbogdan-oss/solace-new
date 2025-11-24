import { MarketData, Security } from '@/types/account';

// Market data for equities and mutual funds
let equitiesMarketData: unknown = null;
let mutualFundsMarketData: unknown = null;
let optionsMarketData: unknown = null;

// Function to clear cache and force reload
export function clearMarketDataCache() {
  equitiesMarketData = null;
  mutualFundsMarketData = null;
  optionsMarketData = null;
  // Market data cache cleared
}

// Function to force reload market data
export async function forceReloadMarketData() {
  clearMarketDataCache();
  return await loadEquitiesMarketData();
}

// Load equities market data from JSON files
export async function loadEquitiesMarketData(): Promise<unknown> {
  if (equitiesMarketData) return equitiesMarketData;
  
  try {
    if (typeof window === 'undefined') {
      // Server side - read file directly
      try {
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(process.cwd(), 'public/data/market-data-equities.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        equitiesMarketData = JSON.parse(fileContent);
      } catch (error) {
        console.error('Error loading equities market data on server side:', error);
        const response = await fetch(`http://localhost:3000/data/market-data-equities.json`);
        equitiesMarketData = await response.json();
      }
    } else {
      // Client side - fetch from URL
      const url = `/data/market-data-equities.json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      equitiesMarketData = await response.json();
    }
    
    return equitiesMarketData;
  } catch (error) {
    console.error('Error loading equities market data:', error);
    return null;
  }
}

// Load mutual funds market data from JSON files
export async function loadMutualFundsMarketData(): Promise<unknown> {
  if (mutualFundsMarketData) return mutualFundsMarketData;
  
  try {
    if (typeof window === 'undefined') {
      // Server side - read file directly
      try {
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(process.cwd(), 'public/data/market-data-mutual-funds.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        mutualFundsMarketData = JSON.parse(fileContent);
      } catch (error) {
        console.error('Error loading mutual funds market data on server side:', error);
        const response = await fetch(`http://localhost:3000/data/market-data-mutual-funds.json`);
        mutualFundsMarketData = await response.json();
      }
    } else {
      // Client side - fetch from URL
      const url = `/data/market-data-mutual-funds.json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      mutualFundsMarketData = await response.json();
    }
    
    return mutualFundsMarketData;
  } catch (error) {
    console.error('Error loading mutual funds market data:', error);
    return null;
  }
}

// Backward compatibility
export async function loadStocksMarketData(): Promise<unknown> {
  return await loadEquitiesMarketData();
}

export async function loadOptionsMarketData(): Promise<unknown> {
  if (optionsMarketData) return optionsMarketData;
  
  try {
    // Check if we're on the server side
    if (typeof window === 'undefined') {
      // Server side - read file directly
      try {
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(process.cwd(), 'public/data/market-data-options.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        optionsMarketData = JSON.parse(fileContent);
      } catch (error) {
        console.error('Error loading options market data on server side:', error);
        // Fallback to fetch
        const response = await fetch('http://localhost:3000/data/market-data-options.json');
        optionsMarketData = await response.json();
      }
    } else {
      // Client side - fetch from URL
      const response = await fetch('/data/market-data-options.json');
      optionsMarketData = await response.json();
    }
    return optionsMarketData;
  } catch (error) {
    console.error('Error loading options market data:', error);
    return null;
  }
}

// Get market data for specific symbols
export async function getMarketDataForSymbols(symbols: string[]): Promise<MarketData[]> {
  if (!symbols || symbols.length === 0) {
    return [];
  }
  
  // Using local data only
  // Go straight to loading from JSON files
  
  // Load from local JSON files - check both equities and mutual funds
  const equitiesData = await loadEquitiesMarketData();
  const mutualFundsData = await loadMutualFundsMarketData();
  
  let allSecurities: unknown[] = [];
  
  if (equitiesData && (equitiesData as { stocks?: unknown[] }).stocks) {
    allSecurities = [...allSecurities, ...(equitiesData as { stocks: unknown[] }).stocks];
  }
  
  if (mutualFundsData && (mutualFundsData as { mutualFunds?: unknown[] }).mutualFunds) {
    allSecurities = [...allSecurities, ...(mutualFundsData as { mutualFunds: unknown[] }).mutualFunds];
  }
  
  if (allSecurities.length === 0) {
    console.error('No market data available');
    return [];
  }
  
  const filteredSecurities = allSecurities
    .filter((security: unknown) => symbols.includes((security as { symbol: string }).symbol));
  
  if (filteredSecurities.length === 0) {
    return [];
  }
  
  const result = filteredSecurities.map((stock: unknown) => {
    const s = stock as {
      symbol: string;
      currentPrice?: number;
      previousClose?: number;
      dayChange?: number;
      dayChangePercent?: number;
      volume?: number;
      marketCap?: number;
      open?: number;
      high?: number;
      low?: number;
      fiftyTwoWeekHigh?: number;
      fiftyTwoWeekLow?: number;
      sector?: string;
      description?: string;
      fundDetails?: {
        previousClose: number;
        ytdReturn: number;
        expenseRatio: number;
        category: string;
        netAssets: number;
        yield: number;
        frontLoad: string;
        inceptionDate: string;
      };
      lastUpdated?: string;
    };
    return {
      symbol: s.symbol,
      currentPrice: s.currentPrice || 0,
      previousClose: s.previousClose || 0,
      dayChange: s.dayChange || 0,
      dayChangePercent: s.dayChangePercent || 0,
      volume: s.volume || 0,
      marketCap: s.marketCap || 0,
      open: s.open || 0,
      high: s.high || 0,
      low: s.low || 0,
      fiftyTwoWeekHigh: s.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: s.fiftyTwoWeekLow || 0,
      sector: s.sector || '',
      description: s.description || '',
      fundDetails: s.fundDetails,
      lastUpdated: s.lastUpdated || new Date().toISOString()
    };
  });
  
  // Market data loaded successfully
  return result;
}

// Get market data for a single symbol
export async function getMarketDataForSymbol(symbol: string): Promise<MarketData | null> {
  const marketData = await getMarketDataForSymbols([symbol]);
  return marketData.length > 0 ? marketData[0] : null;
}

// Get all available securities (equities and mutual funds)
export async function getAllStocks(): Promise<Security[]> {
  const equitiesData = await loadEquitiesMarketData();
  const mutualFundsData = await loadMutualFundsMarketData();
  
  let allSecurities: Security[] = [];
  
  // Process equities
  if (equitiesData && (equitiesData as { stocks?: unknown[] }).stocks) {
    const equities = (equitiesData as { stocks: unknown[] }).stocks.map((stock: unknown) => {
      const s = stock as {
        symbol: string;
        cusip: string;
        description: string;
        sector: string;
      };
      return {
        symbol: s.symbol,
        cusip: s.cusip,
        description: s.description,
        sector: s.sector,
        type: 'equity' as const,
        exchange: 'NASDAQ',
        lastUpdated: (stock as { lastUpdated?: string }).lastUpdated || new Date().toISOString()
      };
    });
    allSecurities = [...allSecurities, ...equities];
  }
  
  // Process mutual funds
  if (mutualFundsData && (mutualFundsData as { mutualFunds?: unknown[] }).mutualFunds) {
    const mutualFunds = (mutualFundsData as { mutualFunds: unknown[] }).mutualFunds.map((fund: unknown) => {
      const f = fund as {
        symbol: string;
        cusip: string;
        description: string;
        sector: string;
      };
      return {
        symbol: f.symbol,
        cusip: f.cusip,
        description: f.description,
        sector: f.sector,
        type: 'mutual_fund' as const,
        exchange: 'Mutual Fund',
        lastUpdated: (fund as { lastUpdated?: string }).lastUpdated || new Date().toISOString()
      };
    });
    allSecurities = [...allSecurities, ...mutualFunds];
  }
  
  return allSecurities;
}

// Get options for a specific underlying symbol
export async function getOptionsForSymbol(symbol: string): Promise<unknown[]> {
  const optionsData = await loadOptionsMarketData();
  if (!optionsData) return [];
  
  return (optionsData as { options: unknown[] }).options.filter((option: unknown) => (option as { underlying: string }).underlying === symbol);
}

// Get options by expiration date
export async function getOptionsByExpiration(symbol: string, expiration: string): Promise<unknown[]> {
  const options = await getOptionsForSymbol(symbol);
  return options.filter((option: unknown) => (option as { expiration: string }).expiration === expiration);
}

// Get options by strike price range
export async function getOptionsByStrikeRange(
  symbol: string, 
  minStrike: number, 
  maxStrike: number
): Promise<unknown[]> {
  const options = await getOptionsForSymbol(symbol);
  return options.filter((option: unknown) => {
    const o = option as { strike: number };
    return o.strike >= minStrike && o.strike <= maxStrike;
  });
}

// Get in-the-money options
export async function getInTheMoneyOptions(symbol: string): Promise<unknown[]> {
  const options = await getOptionsForSymbol(symbol);
  return options.filter((option: unknown) => (option as { inTheMoney: boolean }).inTheMoney);
}

// Get out-of-the-money options
export async function getOutOfTheMoneyOptions(symbol: string): Promise<unknown[]> {
  const options = await getOptionsForSymbol(symbol);
  return options.filter((option: unknown) => !(option as { inTheMoney: boolean }).inTheMoney);
}

// Search options by criteria
export async function searchOptions(criteria: {
  symbol?: string;
  type?: 'call' | 'put';
  expiration?: string;
  minStrike?: number;
  maxStrike?: number;
  inTheMoney?: boolean;
  minVolume?: number;
  minOpenInterest?: number;
}): Promise<unknown[]> {
  const optionsData = await loadOptionsMarketData();
  if (!optionsData) return [];
  
  let options = (optionsData as { options: unknown[] }).options;
  
  if (criteria.symbol) {
    options = options.filter((option: unknown) => (option as { underlying: string }).underlying === criteria.symbol);
  }
  
  if (criteria.type) {
    options = options.filter((option: unknown) => (option as { type: string }).type === criteria.type);
  }
  
  if (criteria.expiration) {
    options = options.filter((option: unknown) => (option as { expiration: string }).expiration === criteria.expiration);
  }
  
  if (criteria.minStrike !== undefined) {
    options = options.filter((option: unknown) => (option as { strike: number }).strike >= criteria.minStrike!);
  }
  
  if (criteria.maxStrike !== undefined) {
    options = options.filter((option: unknown) => (option as { strike: number }).strike <= criteria.maxStrike!);
  }
  
  if (criteria.inTheMoney !== undefined) {
    options = options.filter((option: unknown) => (option as { inTheMoney: boolean }).inTheMoney === criteria.inTheMoney);
  }
  
  if (criteria.minVolume !== undefined) {
    options = options.filter((option: unknown) => (option as { volume: number }).volume >= criteria.minVolume!);
  }
  
  if (criteria.minOpenInterest !== undefined) {
    options = options.filter((option: unknown) => (option as { openInterest: number }).openInterest >= criteria.minOpenInterest!);
  }
  
  return options;
}

// Get market data summary
export async function getMarketDataSummary(): Promise<{
  totalEquities: number;
  totalMutualFunds: number;
  totalOptions: number;
  lastUpdated: string;
}> {
  const equitiesData = await loadEquitiesMarketData();
  const mutualFundsData = await loadMutualFundsMarketData();
  const optionsData = await loadOptionsMarketData();
  
  return {
    totalEquities: (equitiesData as { stocks?: unknown[] })?.stocks?.length || 0,
    totalMutualFunds: (mutualFundsData as { mutualFunds?: unknown[] })?.mutualFunds?.length || 0,
    totalOptions: (optionsData as { options?: unknown[] })?.options?.length || 0,
    lastUpdated: (equitiesData as { lastUpdated?: string })?.lastUpdated || new Date().toISOString()
  };
}