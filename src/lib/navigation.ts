import { LucideIcon, Home, Users, FileText, TrendingUp, MessageSquare, Briefcase, Bell, PieChart, ChartLine, Activity, FileBarChart, ClipboardList, TrendingUp as LineChart, Link, Coins, UserCheck } from 'lucide-react';
import { NavigationSettings } from '@/contexts/SettingsContext';

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  subItems?: NavItem[];
  groupTitle?: string;
}

export interface SidebarSection {
  label: string;
  items: NavItem[];
}

// Top-level navigation items (header)
export const topLevelNavItems: NavItem[] = [
  { label: 'My dashboard', href: '/', icon: Home },
  { label: 'Clients', href: '/clients', icon: Users },
  { label: 'Reports', href: '/reports', icon: FileText },
  { label: 'Trade', href: '/trade', icon: TrendingUp },
  { label: 'CRM', href: '/crm', icon: MessageSquare },
  { label: 'Tools', href: '/tools' },
];

// Sidebar sections for different routes
export const sidebarSections: Record<string, SidebarSection> = {
  // Reports section
  '/reports': {
    label: '',
    items: [
      { 
        label: 'Overview', 
        href: '/reports', 
        icon: FileBarChart,
      },
      { 
        label: 'Positions', 
        href: '/reports/positions', 
        icon: ClipboardList,
        groupTitle: 'CATEGORIES',
        subItems: [
          { label: 'Bond ratings', href: '/reports/positions/bond-ratings' },
          { label: 'Maturity schedule', href: '/reports/positions/maturity-schedule' },
          { label: 'Reorg tracking', href: '/reports/positions/reorg-tracking' },
          { label: 'Stock record', href: '/reports/positions/stock-record' },
        ]
      },
      { 
        label: 'Analysis', 
        href: '/reports/analysis', 
        icon: LineChart,
        subItems: [
          { label: 'Account analysis', href: '/reports/analysis/account-analysis' },
          { label: 'Options analysis', href: '/reports/analysis/options-analysis' },
          { label: 'Performance analysis', href: '/reports/analysis/performance-analysis' },
          { label: 'Portfolio performance', href: '/reports/analysis/portfolio-performance' },
          { label: 'Portfolio valuation', href: '/reports/analysis/portfolio-valuation' },
        ]
      },
      { 
        label: 'Commissions', 
        href: '/reports/commissions', 
        icon: Link,
        subItems: [
          { label: 'Commissions detail', href: '/reports/commissions/commissions-detail' },
          { label: 'Commissions summary', href: '/reports/commissions/commissions-summary' },
          { label: 'Performance - commissions', href: '/reports/commissions/performance-commissions' },
        ]
      },
      { 
        label: 'Funds', 
        href: '/reports/funds', 
        icon: Coins,
        subItems: [
          { label: 'Buying power', href: '/reports/funds/buying-power' },
          { label: 'Margin analysis', href: '/reports/funds/margin-analysis' },
          { label: 'Margin balance', href: '/reports/funds/margin-balance' },
          { label: 'Margin equity', href: '/reports/funds/margin-equity' },
          { label: 'Market equity percentage', href: '/reports/funds/market-equity-percentage' },
          { label: 'Margin status', href: '/reports/funds/margin-status' },
          { label: 'Money market balance', href: '/reports/funds/money-market-balance' },
          { label: 'Net market value', href: '/reports/funds/net-market-value' },
          { label: 'Net money balance', href: '/reports/funds/net-money-balance' },
          { label: 'Short positions', href: '/reports/funds/short-positions' },
          { label: 'Total value', href: '/reports/funds/total-value' },
        ]
      },
      { 
        label: 'Client admin', 
        href: '/reports/client-admin', 
        icon: UserCheck,
        subItems: [
          { label: 'Account information chang...', href: '/reports/client-admin/account-information-changes' },
          { label: 'Action items', href: '/reports/client-admin/action-items' },
          { label: 'ACH', href: '/reports/client-admin/ach' },
          { label: 'ACAT status', href: '/reports/client-admin/acat-status' },
          { label: 'Credit plus', href: '/reports/client-admin/credit-plus' },
          { label: 'Document status', href: '/reports/client-admin/document-status' },
          { label: 'Funds available', href: '/reports/client-admin/funds-available' },
          { label: 'Household accounts', href: '/reports/client-admin/household-accounts' },
          { label: 'IRA minimum distribution', href: '/reports/client-admin/ira-minimum-distribution' },
          { label: 'Name and address', href: '/reports/client-admin/name-and-address' },
          { label: 'Pending income', href: '/reports/client-admin/pending-income' },
        ]
      },
      { 
        label: 'Activity', 
        href: '/reports/activity', 
        icon: Activity,
        subItems: [
          { label: 'Daily activity', href: '/reports/activity/daily-activity' },
          { label: 'Dividend balance', href: '/reports/activity/dividend-balance' },
        ]
      },
    ],
  },

  // Account section (Key changed to dynamic)
  '/account/[accountId]': {
    label: 'Account',
    
    items: [
      { 
        label: 'Financials', 
        href: 'financials', 
        icon: PieChart,
        subItems: [
          { label: 'Holdings', href: '' },
          { label: 'Activity', href: 'activity' },
          { label: 'Balances', href: 'balances' },
          { label: 'Realized G/L', href: 'realized-gl' },
          { label: 'Unrealized G/L', href: 'unrealized-gl' },
          { label: 'Commission', href: 'commission' },
        ]
      },
      { 
        label: 'Trade', 
        href: 'trade', 
        icon: ChartLine,
        subItems: [
          // Account-level trade search ticket
          { label: 'Search', href: 'trade' },
          // Placeholder route for open orders within this account
          { label: 'Open orders', href: 'trade/open-orders' },
        ],
      },
      { 
        label: 'Documents', 
        href: 'statements-reports', 
        icon: FileText,
      },
    ],
  },

  // Client section
  '/clients': {
    label: 'Clients',
    items: [
      { label: 'Client list', href: '/clients', icon: Users },
      { label: 'Account opening', href: '/clients/account-opening', icon: FileText },
    ],
  },

  // Individual client section
  '/clients/[clientId]': {
    label: 'Client',
    items: [
      { label: 'Overview', href: '', icon: Users },
      { label: 'Accounts', href: 'accounts', icon: Briefcase },
      { label: 'Documents', href: 'documents', icon: FileText },
      { label: 'Notifications', href: 'notifications', icon: Bell },
      { label: 'Client maintenance', href: 'maintenance' },
    ],
  },
};

// Helper function to get client navigation with actual client ID
export function getClientNavigation(clientId: string): NavItem[] {
  const items = sidebarSections['/clients/[clientId]'].items;
  return items.map(item => ({
    ...item,
    href: item.href ? `/clients/${clientId}/${item.href}` : `/clients/${clientId}`,
  }));
}

// Helper function to get filtered top-level navigation based on settings
export function getFilteredTopLevelNavItems(settings: NavigationSettings): NavItem[] {
  return topLevelNavItems.filter(item => {
    switch (item.href) {
      case '/clients':
        return settings.clients;
      case '/trade':
        return settings.trade;
      case '/crm':
        return settings.crm;
      case '/tools':
        return settings.tools;
      default:
        return true; // Always show dashboard and reports
    }
  });
} 