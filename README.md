# Solace Demo - Financial Portfolio Management Platform

> **Note**: This is a demo version of Solace - the advisor workstation. This implementation serves as a demonstration and development environment with mixed data sources: Supabase integration for client management, navigation, and search functionality, while financial/account pages use hardcoded data for demonstration purposes.

## 🏗️ Architecture Overview

### Core Technologies
- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS 3.4+ with custom design system
- **Database**: Supabase (PostgreSQL with real-time capabilities)
- **State Management**: React Context API
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **UI Components**: ShadCN,Radix UI primitives with custom styling
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

## 🔧 Configuration & Setup

### Environment Variables
Create a `.env.local` file with the shared team credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=your_admin_password
```

DB informaton can be found in our 1password vault. 

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