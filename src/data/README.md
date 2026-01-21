# Market Data Files

This directory contains comprehensive market data for stocks and options that can be used for development and testing.

## Files

### `market-data-stocks.json`
Contains market data for 120+ popular stocks including:
- **Technology**: AAPL, MSFT, GOOGL, AMZN, META, NVDA, TSLA, etc.
- **Financial Services**: JPM, BAC, V, MA, etc.
- **Healthcare**: JNJ, PFE, ABBV, MRK, etc.
- **Consumer Discretionary**: HD, MCD, NKE, WMT, etc.
- **Energy**: XOM, CVX, COP, etc.
- **And many more sectors...**

Each stock entry includes:
- `symbol`: Stock ticker symbol
- `cusip`: CUSIP identifier
- `currentPrice`: Current trading price
- `previousClose`: Previous day's closing price
- `dayChange`: Price change from previous close
- `dayChangePercent`: Percentage change from previous close
- `volume`: Trading volume
- `marketCap`: Market capitalization
- `open`, `high`, `low`: Daily price range
- `fiftyTwoWeekHigh`, `fiftyTwoWeekLow`: 52-week price range
- `sector`: Industry sector
- `description`: Company description

### `market-data-options.json`
Contains option contracts for 20 popular underlying stocks with:
- **10,000+ option contracts** across multiple strikes and expirations
- **Call and Put options** for each underlying
- **Multiple expiration dates** (weekly, monthly, quarterly)
- **Strike prices** ranging from 20% below to 20% above current price

Each option entry includes:
- `symbol`: Option contract symbol
- `underlying`: Underlying stock symbol
- `type`: 'call' or 'put'
- `strike`: Strike price
- `expiration`: Expiration date
- `bid`, `ask`, `last`: Pricing information
- `volume`, `openInterest`: Trading activity
- `impliedVolatility`: IV percentage
- `delta`, `gamma`, `theta`, `vega`, `rho`: Greeks
- `intrinsicValue`, `timeValue`: Option value breakdown
- `inTheMoney`: Whether option is ITM

## Usage

### Loading Market Data
```typescript
import { getMarketDataForSymbols, getMarketDataForSymbol } from '@/services/marketDataService';

// Get data for specific symbols
const data = await getMarketDataForSymbols(['AAPL', 'MSFT']);

// Get data for single symbol
const aaplData = await getMarketDataForSymbol('AAPL');
```

### Loading Options Data
```typescript
import { getOptionsForSymbol, searchOptions } from '@/services/marketDataService';

// Get all options for a symbol
const aaplOptions = await getOptionsForSymbol('AAPL');

// Search options with criteria
const itmCalls = await searchOptions({
  symbol: 'AAPL',
  type: 'call',
  inTheMoney: true,
  minVolume: 1000
});
```

### Getting All Available Stocks
```typescript
import { getAllStocks } from '@/services/marketDataService';

const allStocks = await getAllStocks();
```

## Testing

Visit `/test-market-data` to see a live display of the market data including:
- Summary statistics (total stocks, options, last updated)
- Sample stock data with current prices and changes
- Real-time data loading and refresh functionality

## Integration with Polygon API

This local data can be easily replaced with live data from Polygon API by updating the `marketDataService.ts` to fetch from Polygon endpoints instead of local JSON files.

## Data Structure

All data follows the TypeScript interfaces defined in `/src/types/account.ts`:
- `MarketData` interface for stock data
- `Security` interface for stock information
- Custom interfaces for options data

The market data files are static JSON files that can be manually updated as needed. The data includes realistic volatility and price movements while maintaining consistent relationships between strikes, expirations, and underlying prices.
