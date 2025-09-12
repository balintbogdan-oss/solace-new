# Solace Demo - Financial Portfolio Management Platform

> **Note**: This is a demo version of Solace - the advisor workstation. This implementation serves as a demonstration and development environment with mixed data sources: Supabase integration for client management, navigation, and search functionality, while financial/account pages use hardcoded data for demonstration purposes.

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
│   │   ├── holdings/[symbol]/   # Holdings detail pages
│   │   ├── performance/         # Performance page
│   │   ├── realized-gl/         # Realized G/L page
│   │   ├── statements-reports/  # Statements & reports
│   │   ├── trade/[symbol]/      # Trading pages
│   │   └── unrealized-gl/       # Unrealized G/L page
│   ├── clients/[clientId]/      # Client management pages
│   ├── households/[householdId]/ # Household pages
│   ├── reports/                 # Reporting pages
│   ├── settings/                # App settings page
│   ├── trade/                   # Trading interface
│   ├── api/                     # API routes
│   └── admin/                   # Admin pages
├── components/                   # Reusable UI components
│   ├── layout/                  # Layout components (Header, Sidebar, etc.)
│   ├── ui/                      # Base UI components (buttons, inputs, etc.)
│   ├── widgets/                 # Dashboard widgets
│   ├── charts/                  # Chart components
│   ├── trade/                   # Trading-specific components
│   └── reports/                 # Report components
├── contexts/                    # React Context providers
├── data/                        # Sample data and utilities
├── hooks/                       # Custom React hooks
├── services/                    # External service integrations
├── types/                       # TypeScript type definitions
└── lib/                         # Utility functions and configurations
```

## 🗄️ Data Infrastructure

### Database Schema (Supabase)
The application uses a normalized PostgreSQL schema with the following key tables:

#### Core Tables
- **`clients`**: Client information (name, email, phone, etc.)
- **`households`**: Household/group information for shared accounts
- **`accounts`**: Account metadata, types, and relationships
- **`balances`**: Account balance information (buying power, total value, etc.)
- **`securities`**: Master list of all tradable instruments (stocks, options, etc.)
- **`holdings`**: User's positions referencing securities
- **`market_data`**: Real-time market prices and metrics
- **`trades`**: Trade execution records
- **`activities`**: Account activity log (deposits, withdrawals, etc.)
- **`realized_gl`**: Realized gains/losses from closed positions
- **`unrealized_gl`**: ~~Removed~~ - Now calculated dynamically from market data
- **`commissions`**: Commission tracking and reporting

#### Key Relationships
```sql
clients (1) → (many) accounts
households (1) → (many) accounts
accounts (1) → (1) clients
accounts (1) → (0..1) households
accounts (1) → (1) balances
accounts (1) → (many) trades
accounts (1) → (many) activities
securities (1) → (many) holdings
securities (1) → (1) market_data
```

### Data Flow Architecture

### Data Flow
- **Database**: Supabase PostgreSQL with real-time capabilities
- **Services**: Centralized data access via `supabaseService` and `searchService`
- **Context**: React Context providers for state management
- **Components**: React components consume data from contexts

### Key Features
- **Real-time Updates**: Database changes reflect immediately
- **Data Transformation**: Automatic conversion between database and app formats
- **Type Safety**: Full TypeScript coverage throughout
- **Dynamic Calculations**: Market values and gains/losses calculated on-demand

### Data Types
- **AccountData**: Core account information with client relationships
- **Client**: Client profiles with contact information
- **Security**: Financial instruments (stocks, bonds, etc.)
- **Holding**: Portfolio positions with calculated values
- **MarketData**: Real-time price and market information
- **Trade**: Transaction records and history

## 🔧 Configuration & Setup

### Environment Variables
Create a `.env.local` file with the shared team credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=your_admin_password
```

**Application Credentials (for running the app):**
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (shared team credentials)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key (shared team credentials)
- `ADMIN_PASSWORD`: Admin password for protected routes (minimum 8 characters)

**Database Credentials (for downloading data):**
- Database host, username, and password (from 1Password vault)
- Required for: `supabase db pull`, database dumps, or direct PostgreSQL access

**Optional Variables:**
- `NODE_ENV`: Environment mode (defaults to 'development')

**Note**: Both application and database credentials are shared team credentials.

### Database Setup
This project uses a **shared team database** approach with centralized credential management.

**Database Access:**
- **Team Approach**: Shared Supabase project credentials in Qapital's 1Password vault
- **No Individual Access**: Developers don't need Supabase project invitations
- **Credentials Management**: All database access through shared team credentials

**Setup Steps:**
1. **Get Access**: Request access to Qapital's 1Password vault
2. **Retrieve Credentials**: Get Supabase project URL and anonymous key from vault
3. **Configure Local Environment**: Add credentials to your `.env.local` file
4. **Start Development**: Database is already configured and seeded with sample data

**Note**: This is a team-based setup where all developers work against the same shared database. Individual Supabase project access is not required.

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
- Navigation items can be toggled on/off via settings
- Settings persist across browser sessions
- Account-specific navigation available

## 📊 Data Management

### Mixed Data Sources
The application uses a hybrid approach with different data sources for different features:

#### **Supabase Integration** (Real Database)
- **Client Management**: Client profiles, contact information, relationships
- **Account Metadata**: Account types, names, client associations
- **Search Functionality**: Global search across clients and accounts
- **Navigation**: Dynamic breadcrumbs and client/account navigation

#### **Hardcoded Data** (Demo/Development)
- **Financial Data**: Holdings, trades, market data, balances
- **Account Pages**: Portfolio values, performance metrics, transactions
- **Trading Interface**: Market data, order execution, positions

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

#### **Database Data** (Supabase)
- **10 Sample Clients**: Realistic client profiles with contact information
- **2-5 Accounts per Client**: Various account types (individual, joint, IRA, trust, etc.)
- **Households**: Family groups with shared accounts
- **Account Metadata**: Account names, types, and relationships

#### **Hardcoded Data** (Local Files)
- **Financial Holdings**: Portfolio positions and securities
- **Market Data**: Current prices, day changes, volume
- **Trade History**: Sample buy/sell transactions
- **Account Balances**: Complete balance information with buying power
- **Activities**: Deposits, withdrawals, dividends

## 🔍 Search & Navigation System

### Global Search Functionality
The application features a comprehensive search system with the following capabilities:

#### Search Features
- **Multi-Entity Search**: Search across clients, accounts, and households
- **Real-time Results**: Instant search results as you type
- **Recent Searches**: Displays recently viewed clients and accounts
- **Account Values**: Shows account balances in search results
- **Formatted Display**: User-friendly account type formatting

#### Search Implementation
- **SearchService**: Handles database queries and result formatting
- **useSearch Hook**: React hook for search state management
- **Real-time Results**: Instant search as you type
- **Recent Searches**: Dynamic recent items from database

#### Account Type Formatting
- **Database Storage**: Lowercase with underscores (e.g., `sep_ira`)
- **Display Format**: User-friendly names (e.g., "SEP IRA")
- **Utility Function**: `formatAccountType()` for consistent formatting

#### Supported Account Types
- **Individual Accounts**: Individual, Joint, Single Account
- **Retirement Accounts**: IRA, Roth IRA, 401(k), 403(b), SEP IRA, SIMPLE IRA
- **Trust Accounts**: Trust, Irrevocable Trust, Testamentary Trust, Revocable Trust
- **Business Accounts**: Corporate, Partnership, LLC
- **Special Accounts**: Custodian Minor/UTMA/UGMA, 529 Plan, Estate
- **Guardian Accounts**: Guardian/Conservator Minor, Guardian/Conservator Incompetent

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
- User interactions trigger context updates
- Components re-render automatically
- UI reflects current state

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

