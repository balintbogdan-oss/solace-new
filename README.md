# Solace Demo - Financial Portfolio Management Platform

> **Note**: This is a demo version of Solace - the advisor workstation. This implementation serves as a demonstration and development environment using local data sources for all functionality.

## 🏗️ Architecture Overview

### Core Technologies
- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS 3.4+ with custom design system
- **Data**: Local JSON files and mock data services
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

### Data Sources
The application uses local data services and mock data for demonstration purposes:

- **Account Data**: Stored in local JSON files and managed through `localDataService`
- **Market Data**: Mock market data service with real-time price simulation
- **Client Data**: Local JSON files for client and household information

## 🔧 Configuration & Setup

### Environment Variables
Create a `.env.local` file with the following:
```bash
ADMIN_PASSWORD=your_admin_password
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