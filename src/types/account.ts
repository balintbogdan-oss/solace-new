// Client information
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  createdAt: string;
  lastUpdated: string;
}

// Master securities list - single source of truth
export interface Security {
  symbol: string;
  cusip: string;
  description: string;
  sector: string;
  type: 'equity' | 'option' | 'mutual_fund' | 'etf' | 'bond';
  exchange?: string;
  // For options
  underlying?: string;
  strikePrice?: number;
  expirationDate?: string;
  optionType?: 'call' | 'put';
  // For mutual funds/ETFs
  expenseRatio?: number;
  // Metadata
  lastUpdated: string;
}

// User's holdings - references securities by symbol (raw data from database)
export interface Holding {
  symbol: string; // References Security.symbol
  quantity: number;
  avgPrice: number;
  lastUpdated: string;
  // Optional calculated fields (may be present from JSON data)
  marketValue?: number;
  unrealizedGL?: number;
  unrealizedGLPercent?: number;
  currentPrice?: number;
  previousClose?: number;
  dayChange?: number;
  dayChangePercent?: number;
  volume?: number;
  marketCap?: number;
}

// Holdings with calculated values (computed from Security + MarketData + quantity)
export interface HoldingWithCalculations {
  symbol: string;
  quantity: number;
  avgPrice: number;
  lastUpdated: string;
  // Calculated values (computed from Security + MarketData + quantity)
  marketValue: number;
  unrealizedGL: number;
  unrealizedGLPercent: number;
}

// Live market data (changes frequently via API)
export interface MarketData {
  symbol: string;
  cusip?: string;
  currentPrice: number;
  previousClose: number;
  dayChange: number;
  dayChangePercent: number;
  volume: number;
  marketCap?: number;
  open?: number;
  high?: number;
  low?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  sector?: string;
  description?: string;
  lastUpdated: string;
}

// Combined holding with full data for display
export interface HoldingWithDetails extends HoldingWithCalculations {
  security: Security;
  marketData: MarketData;
}

export interface Trade {
  id: string;
  symbol: string;
  cusip: string;
  description: string;
  action: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalValue: number;
  commission: number;
  date: string;
  time: string;
  longShort: 'Long' | 'Short';
  lastUpdated?: string;
}

export interface Activity {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'DIVIDEND' | 'TRADE' | 'TRANSFER' | 'EQUITY' | 'MUTUAL_FUNDS' | 'INTEREST' | 'IRA' | 'NON_TRADES' | 'JOURNAL' | 'DELIVERY' | 'CHECK_ISSUES' | 'CREDIT_INTEREST' | 'MARGIN_INTEREST' | 'PRINCIPAL' | 'REDEMPTIONS' | 'SECURITY_TRANSFER' | 'REPO';
  description: string;
  amount: number;
  date: string;
  time: string;
  symbol?: string;
  cusip?: string;
  quantity?: number;
  price?: number;
  buyPrice?: number;
  action?: 'BUY' | 'SELL' | 'TRADE';
  settleDate?: string;
  transactionType?: 'MARKET' | 'LIMIT' | 'ACH' | 'FDIC_SWEEP' | 'DIVIDEND' | 'FEE' | 'INTEREST' | 'JOURNAL' | 'SECURITY_TRANSFER' | 'REPO';
  accountType?: 'CASH' | 'MARGIN' | 'SHORT_MARGIN' | 'LONG_MARGIN' | 'IRA';
  tradeNumber?: string;
  lastUpdated?: string;
}

export interface AccountBalances {
  cash: number;
  margin: number;
  buyingPower: number;
  totalValue: number;
  investedValue: number;
  realizedGL: number;
  unrealizedGL?: number; // Optional, calculated dynamically from holdings
  lastUpdated: string;
}

export interface RealizedTrade {
  id: string;
  symbol: string;
  cusip: string;
  description: string;
  openDate: string;
  closeDate: string;
  quantity: number;
  avgBuyPrice: number;
  sellPrice: number;
  investedValue: number;
  totalSellValue: number;
  realizedGL: number;
  realizedGLPercent: number;
  longShort: 'Long' | 'Short';
}

export interface UnrealizedPosition {
  id: string;
  symbol: string;
  cusip: string;
  description: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedGL: number;
  unrealizedGLPercent: number;
  longShort: 'Long' | 'Short';
  lastUpdated: string;
}

export interface CommissionRecord {
  id: string;
  month: string;
  year: number;
  totalCommission: number;
  averagePerTrade: number;
  equityTrades: number;
  optionTrades: number;
  otherTrades: number;
  date: string;
}

export interface AccountData {
  accountId: string;
  accountName: string;
  accountType: 'individual' | 'joint' | 'ira' | 'roth_ira' | '401k' | '403b' | 'sep_ira' | 'simple_ira' | 'trust' | 'corporate' | 'partnership' | 'llc' | 'other';
  clientId: string;
  client: Client;
  securities: Security[]; // Master list of all securities
  holdings: Holding[]; // User's holdings (references securities)
  marketData: MarketData[]; // Live market data for holdings
  trades: Trade[];
  activities: Activity[];
  balances: AccountBalances;
  realizedGL: RealizedTrade[];
  unrealizedGL: UnrealizedPosition[];
  commissions: CommissionRecord[];
  lastUpdated: string;
}

// Market data service interface for future Polygon API integration
export interface MarketDataService {
  getMarketData: (symbols: string[]) => Promise<MarketData[]>;
  getMarketDataForSymbol: (symbol: string) => Promise<MarketData>;
  subscribeToMarketData: (symbols: string[], callback: (data: MarketData[]) => void) => () => void;
}

// Polygon API response types (for future implementation)
export interface PolygonQuote {
  symbol: string;
  last: {
    price: number;
    timestamp: number;
  };
  prevClose: {
    price: number;
    timestamp: number;
  };
  day: {
    change: number;
    changePercent: number;
    volume: number;
  };
  marketCap?: number;
}

export interface PolygonResponse {
  results: PolygonQuote[];
  status: string;
  request_id: string;
}

export interface AccountDataContextType {
  data: AccountData | null;
  loading: boolean;
  error: string | null;
  // Holdings management
  updateHolding: (symbol: string, updates: Partial<Holding>) => void;
  addHolding: (holding: Omit<Holding, 'marketValue' | 'unrealizedGL' | 'unrealizedGLPercent'>) => void;
  removeHolding: (symbol: string) => void;
  // Securities management
  addSecurity: (security: Security) => void;
  updateSecurity: (symbol: string, updates: Partial<Security>) => void;
  getSecurity: (symbol: string) => Security | undefined;
  // Market data
  updateMarketData: (marketData: MarketData[]) => void;
  // Other operations
  addTrade: (trade: Omit<Trade, 'id'>) => void;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateBalances: (updates: Partial<AccountBalances>) => void;
  executeTrade: (tradeData: {
    symbol: string;
    action: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    totalValue: number;
    commission: number;
    holdingUpdates?: Partial<Holding>;
    balanceUpdates?: Partial<AccountBalances>;
  }) => void;
  resetToSeed: () => void;
  refreshData: () => void;
  refreshMarketData: () => void;
  clearCache: () => void;
  preloadAccountData: (accountId: string) => Promise<AccountData | null>;
  // Helper functions
  getHoldingsWithDetails: () => HoldingWithDetails[];
  calculateUnrealizedPositions: () => UnrealizedPosition[];
  generateHistoricalActivities: (forceRegenerate?: boolean) => Promise<void>;
}
