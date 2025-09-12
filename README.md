# Solace Demo - Financial Portfolio Management Platform

> **Note**: This is a vibecoded and hardcoded demo version of Solace - the advisor workstation. This implementation serves as a demonstration and development environment with mock data and simplified functionality. Supabase is currently only used for trading functionality, while the other parts of the website use hardcoded data.

A comprehensive Next.js-based financial portfolio management platform demo with real-time data integration, dynamic navigation, and multi-account support.

## 🏗️ Architecture Overview

### Core Technologies
- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS 3.4+ with custom design system
- **Database**: Supabase (PostgreSQL with real-time capabilities)
- **State Management**: React Context API
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives with custom styling
- **Drag & Drop**: @dnd-kit for sortable interfaces
- **Animations**: Framer Motion for smooth transitions
- **Date Handling**: date-fns for date manipulation
- **Command Palette**: cmdk for search interfaces

### Project Structure
```
src/
├── app/                          # Next.js App Router pages
│   ├── account/[accountId]/      # Dynamic account pages
│   │   ├── components/           # Account-specific components
│   │   ├── activity/            # Activity page
│   │   ├── balances/            # Balances page
│   │   ├── commission/          # Commission page
│   │   ├── realized-gl/         # Realized G/L page
│   │   └── unrealized-gl/       # Unrealized G/L page
│   ├── clients/                 # Client management pages
│   ├── reports/                 # Reporting pages
│   ├── settings/                # App settings page
│   └── trade/                   # Trading interface
├── components/                   # Reusable UI components
│   ├── layout/                  # Layout components (Header, Sidebar, etc.)
│   ├── ui/                      # Base UI components (buttons, inputs, etc.)
│   ├── widgets/                 # Dashboard widgets
│   └── charts/                  # Chart components
├── contexts/                    # React Context providers
├── data/                        # Seed data and mock data
├── services/                    # External service integrations
├── types/                       # TypeScript type definitions
└── lib/                         # Utility functions and configurations
```

## 🗄️ Data Infrastructure

### Database Schema (Supabase)
The application uses a normalized PostgreSQL schema with the following key tables:

#### Core Tables
- **`accounts`**: Account metadata and timestamps
- **`securities`**: Master list of all tradable instruments (stocks, options, etc.)
- **`holdings`**: User's positions referencing securities
- **`market_data`**: Real-time market prices and metrics
- **`trades`**: Trade execution records
- **`activities`**: Account activity log (deposits, withdrawals, etc.)
- **`balances`**: Account balance information
- **`realized_gl`**: Realized gains/losses from closed positions
- **`unrealized_gl`**: ~~Removed~~ - Now calculated dynamically from market data
- **`commissions`**: Commission tracking and reporting

#### Key Relationships
```sql
accounts (1) → (many) securities
accounts (1) → (many) holdings
securities (1) → (many) holdings
securities (1) → (1) market_data
accounts (1) → (1) balances
accounts (1) → (many) trades
accounts (1) → (many) activities
```

### Data Flow Architecture

#### 1. **Data Loading Pipeline**
```
Supabase Database → SupabaseAccountService → SupabaseAccountDataContext → React Components
```

#### 2. **Context Providers Hierarchy**
```tsx
<SettingsProvider>           // Global app settings
  <NavigationProvider>       // Navigation state
    <SupabaseAccountDataProvider>  // Account-specific data
      <AccountPages />
    </SupabaseAccountDataProvider>
  </NavigationProvider>
</SettingsProvider>
```

#### 3. **Data Transformation Layer**
- **`SupabaseAccountService`**: Handles all database operations
- **Data Transformation**: Converts snake_case (DB) ↔ camelCase (TypeScript)
- **Type Safety**: Strict TypeScript interfaces for all data structures

#### 4. **Dynamic Calculations**
- **Market Data Integration**: Loads real-time prices from local JSON files
- **Dynamic G/L Calculations**: Unrealized gains/losses calculated on-demand
- **Real-time Updates**: Values update automatically when market data changes
- **Calculation Formula**:
  ```typescript
  marketValue = quantity × currentPrice
  unrealizedGL = marketValue - (quantity × avgPrice)
  unrealizedGLPercent = (unrealizedGL / investedValue) × 100
  ```

### Data Types & Interfaces

#### Core Data Types
```typescript
interface AccountData {
  accountId: string;
  securities: Security[];        // Master list of all securities
  holdings: Holding[];          // User's positions (raw data)
  marketData: MarketData[];     // Live market data
  trades: Trade[];
  activities: Activity[];
  balances: AccountBalances;
  realizedGL: RealizedTrade[];
  commissions: CommissionRecord[];
  lastUpdated: string;
  // unrealizedGL calculated dynamically from holdings + marketData
}

interface Security {
  symbol: string;
  cusip: string;
  description: string;
  sector: string;
  type: 'equity' | 'option' | 'mutual_fund' | 'etf' | 'bond';
  exchange?: string;
  // ... additional fields
}

// Raw holding data from database (no calculated values)
interface Holding {
  symbol: string;              // References Security.symbol
  quantity: number;
  avgPrice: number;
  lastUpdated: string;
}

// Holdings with calculated values (computed dynamically)
interface HoldingWithCalculations {
  symbol: string;
  quantity: number;
  avgPrice: number;
  lastUpdated: string;
  // Calculated values (computed from Security + MarketData + quantity)
  marketValue: number;
  unrealizedGL: number;
  unrealizedGLPercent: number;
}

interface HoldingWithDetails extends HoldingWithCalculations {
  security: Security;
  marketData: MarketData;
}
```

## 🔧 Configuration & Setup

### Environment Variables
Create a `.env.local` file with:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
POLYGON_API_KEY=your_polygon_api_key  # For live market data
```

### Database Setup
1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Initialize Supabase**:
   ```bash
   supabase init
   supabase link --project-ref your-project-ref
   ```

3. **Run Migrations**:
   ```bash
   supabase db push
   ```

4. **Seed Data**:
   ```bash
   node scripts/migrate-data.js
   ```

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 🎛️ Feature System

### Navigation Management
The application uses a sophisticated feature toggle system for dynamic navigation:

#### Global Navigation Settings
- **Clients**: Client management interface
- **Trade**: Trading platform
- **CRM**: Customer relationship management
- **Reports**: Financial reporting
- **Tools**: Utility tools

#### Account-Specific Navigation Settings
- **Notifications**: Account notifications
- **Settings**: Account-specific settings
- **Partner Tools**: Third-party integrations

#### Settings Storage
- **Global Settings**: Stored in `localStorage` under `solace-navigation-settings`
- **Account Settings**: Stored in `localStorage` under `solace-account-settings-{accountId}`
- **Persistence**: Settings persist across browser sessions

### Dynamic Navigation Implementation
```typescript
// Navigation filtering based on settings
const filteredNavigation = navigationItems.filter(item => 
  settings.navigation[item.key] !== false
);

// Account-specific navigation
const accountNavigation = accountNavItems.filter(item =>
  settings.accountNavigation[item.key] !== false
);
```

## 📊 Data Management

### Account Data Context
The `SupabaseAccountDataContext` provides:
- **Data Loading**: Automatic loading from Supabase on mount
- **Real-time Updates**: Subscribes to database changes
- **Data Transformation**: Converts database format to application format
- **Error Handling**: Comprehensive error states and loading states
- **Caching**: Efficient data caching and memoization

### Market Data Integration
- **Current Implementation**: Mock data service for development
- **Production Ready**: Polygon API integration prepared
- **Service Abstraction**: `MarketDataService` interface for easy switching
- **WebSocket Support**: Real-time price updates (when API key provided)

### Data Seeding
The application includes comprehensive seed data:
- **8 Sample Securities**: Major tech stocks (AAPL, MSFT, GOOGL, etc.)
- **8 Holdings**: Realistic portfolio positions
- **Market Data**: Current prices, day changes, volume
- **Trade History**: Sample buy/sell transactions
- **Activities**: Deposits, withdrawals, dividends
- **Balances**: Complete account balance breakdown

## 🎨 UI/UX System

### Design System
- **Typography**: Inter (sans-serif) for UI, Source Serif 4 for headings/values, Geist Mono for code
- **Colors**: Custom CSS variables for theming (`--positive`, `--negative`, etc.)
- **Components**: Radix UI primitives with custom Tailwind styling
- **Dark Mode**: Full dark mode support throughout the application

### Layout Architecture
- **Header**: Top navigation with user menu and settings
- **Sidebar**: Account-specific navigation with accordion sections
- **Main Content**: Dynamic page content based on route
- **Breadcrumbs**: Context-aware navigation breadcrumbs

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Breakpoints**: Tailwind's responsive breakpoints
- **Grid System**: CSS Grid and Flexbox for layouts
- **Component Scaling**: Responsive components that adapt to screen size

## 🔄 State Management

### Context Providers
1. **`SettingsContext`**: Global application settings
2. **`NavigationContext`**: Navigation state and breadcrumbs
3. **`SupabaseAccountDataContext`**: Account-specific data management

### State Flow
```
User Action → Context Update → Component Re-render → UI Update
```

### Data Persistence
- **Settings**: `localStorage` for user preferences
- **Account Data**: Supabase for persistent storage
- **Session State**: React state for temporary UI state

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Vercel Deployment
The application is optimized for Vercel deployment:
- **Static Generation**: Pre-rendered pages where possible
- **Server-Side Rendering**: Dynamic content as needed
- **Edge Functions**: API routes for data operations
- **Environment Variables**: Secure configuration management

### Database Considerations
- **Row Level Security**: Implemented for data protection
- **Indexing**: Optimized queries with proper indexes
- **Backups**: Regular database backups recommended
- **Scaling**: Supabase handles horizontal scaling

## 🧪 Development Guidelines

### Code Organization
- **Feature-Based**: Group related components and logic
- **Type Safety**: Strict TypeScript throughout
- **Component Composition**: Reusable, composable components
- **Custom Hooks**: Extract reusable logic into hooks

### Testing Strategy
- **Component Testing**: Test individual components
- **Integration Testing**: Test data flow and context
- **E2E Testing**: Test complete user workflows
- **Type Testing**: Leverage TypeScript for compile-time testing

### Performance Optimization
- **Memoization**: `useMemo` and `useCallback` for expensive operations
- **Code Splitting**: Dynamic imports for large components
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Regular bundle size monitoring

## 📈 Future Enhancements

### Planned Features
- **Real-time Market Data**: Live price updates via WebSocket
- **Advanced Charting**: More sophisticated chart types
- **Portfolio Analytics**: Advanced portfolio analysis tools
- **Multi-Account Support**: Enhanced multi-account management
- **Mobile App**: React Native mobile application
- **API Integration**: Third-party financial data providers

### Technical Improvements
- **Caching Strategy**: Redis for improved performance
- **Error Monitoring**: Sentry integration for error tracking
- **Analytics**: User behavior analytics
- **A/B Testing**: Feature flag system for experimentation

## 🤝 Contributing

### Development Workflow
1. **Feature Branch**: Create feature branch from `main`
2. **Development**: Implement feature with tests
3. **Code Review**: Submit pull request for review
4. **Testing**: Ensure all tests pass
5. **Merge**: Merge to `main` after approval

### Code Standards
- **ESLint**: Enforced code quality rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking
- **Conventional Commits**: Standardized commit messages

## 📞 Support

For questions or issues:
- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub discussions for questions
