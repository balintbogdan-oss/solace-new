import { MarketData, Security } from '@/types/account';

// Market data for stocks
let stocksMarketData: unknown = null;
let optionsMarketData: unknown = null;

// Function to clear cache and force reload
export function clearMarketDataCache() {
  stocksMarketData = null;
  optionsMarketData = null;
  // Market data cache cleared
}

// Function to force reload market data
export async function forceReloadMarketData() {
  clearMarketDataCache();
  return await loadStocksMarketData();
}

// Load market data from JSON files
export async function loadStocksMarketData(): Promise<unknown> {
  if (stocksMarketData) return stocksMarketData;
  
  try {
    if (typeof window === 'undefined') {
      // Server side - read file directly
      try {
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(process.cwd(), 'public/data/market-data-stocks.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        stocksMarketData = JSON.parse(fileContent);
      } catch (error) {
        console.error('Error loading market data on server side:', error);
        const cacheBuster = new Date().getTime();
        const response = await fetch(`http://localhost:3000/data/market-data-stocks.json?t=${cacheBuster}`);
        stocksMarketData = await response.json();
      }
    } else {
      // Client side - fetch from URL with cache busting
      const cacheBuster = new Date().getTime();
      const url = `/data/market-data-stocks.json?t=${cacheBuster}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      stocksMarketData = await response.json();
    }
    
    return stocksMarketData;
  } catch (error) {
    console.error('Error loading stocks market data:', error);
    return null;
  }
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
  
  // First try to get data from Supabase database
  try {
    // Attempting to load market data from database
    const { createClient } = await import('@supabase/supabase-js');
    const { getValidatedEnv } = await import('@/lib/env-validation');
    
    let supabase;
    try {
      const env = getValidatedEnv();
      supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    } catch {
      // Missing Supabase environment variables, falling back to JSON files
      throw new Error('Missing Supabase credentials');
    }
    
    const { data: dbData, error } = await supabase
      .from('market_data')
      .select('*')
      .in('symbol', symbols);
    
    if (error) {
      console.error('❌ Database error:', error);
    } else if (dbData && dbData.length > 0) {
      const result = dbData.map((stock: Record<string, unknown>) => ({
        symbol: String(stock.symbol || ''),
        currentPrice: Number(stock.current_price) || 0,
        previousClose: Number(stock.previous_close) || 0,
        dayChange: Number(stock.day_change) || 0,
        dayChangePercent: Number(stock.day_change_percent) || 0,
        volume: Number(stock.volume) || 0,
        marketCap: Number(stock.market_cap) || 0,
        open: Number(stock.current_price) || 0, // Use current price as fallback
        high: (Number(stock.current_price) || 0) * 1.02, // Generate realistic high
        low: (Number(stock.current_price) || 0) * 0.98, // Generate realistic low
        fiftyTwoWeekHigh: (Number(stock.current_price) || 0) * 1.2, // Generate realistic 52W high
        fiftyTwoWeekLow: (Number(stock.current_price) || 0) * 0.8, // Generate realistic 52W low
        sector: 'Technology', // Default sector
        description: String(stock.symbol || '') + ' Inc.', // Generate description
        lastUpdated: String(stock.last_updated) || new Date().toISOString()
      }));
      
      return result;
    } else {
      // No data found in database
    }
  } catch {
    // Database fetch failed, falling back to JSON files
  }
  
  // Fallback to local JSON files
  const stocksData = await loadStocksMarketData();
  
  if (!stocksData || !(stocksData as { stocks?: unknown[] }).stocks) {
    console.error('No stocks data available');
    return [];
  }
  
  const filteredStocks = (stocksData as { stocks: unknown[] }).stocks
    .filter((stock: unknown) => symbols.includes((stock as { symbol: string }).symbol));
  
  if (filteredStocks.length === 0) {
    return [];
  }
  
  const result = filteredStocks.map((stock: unknown) => {
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

// Get all available stocks
export async function getAllStocks(): Promise<Security[]> {
  const stocksData = await loadStocksMarketData();
  if (!stocksData) return [];
  
  return (stocksData as { stocks: unknown[] }).stocks.map((stock: unknown) => {
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
  totalStocks: number;
  totalOptions: number;
  lastUpdated: string;
}> {
  const stocksData = await loadStocksMarketData();
  const optionsData = await loadOptionsMarketData();
  
  return {
    totalStocks: (stocksData as { stocks?: unknown[] })?.stocks?.length || 0,
    totalOptions: (optionsData as { options?: unknown[] })?.options?.length || 0,
    lastUpdated: (stocksData as { lastUpdated?: string })?.lastUpdated || new Date().toISOString()
  };
}