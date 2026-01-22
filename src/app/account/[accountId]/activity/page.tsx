'use client';

import { useState, useMemo, useCallback } from 'react';
import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LastUpdated } from '@/components/ui/last-updated';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Download, 
  Maximize,
  ArrowUp,
  ArrowDown,
  Search,
  ChevronsUpDown
} from 'lucide-react';
import { Activity } from '@/types/account';

const activityTypes = [
  'All',
  'Non-Trade',
  'Deposit',
  'Dividend',
  'Interest',
  'Journal',
  'Trade',
  'Delivery',
  'Check Issue',
  'Credit Interest',
  'Margin Interest',
  'Principal',
  'Redemption'
];

const accountTypes = [
  'All',
  'Cash',
  'Margin'
];

const tabs = [
  { id: 'all', label: 'All activity' },
  { id: 'cashflow', label: 'Cashflow' },
  { id: 'ira', label: 'IRA' }
];

// Mock activity data matching the design
const mockActivities: Activity[] = [
  {
    id: '1',
    date: '2023-12-15',
    time: '16:00:00',
    type: 'TRADE',
    action: 'BUY',
    symbol: 'AAPL',
    cusip: '037833100',
    description: 'Apple Inc. - Technology',
    quantity: 100,
    buyPrice: 175.50,
    amount: 17550.00,
    settleDate: '2023-12-17',
    transactionType: 'MARKET',
    accountType: 'CASH',
    tradeNumber: 'T123456',
    lastUpdated: '2023-12-15T16:00:00Z'
  },
  {
    id: '2',
    date: '2023-11-28',
    time: '10:30:00',
    type: 'DEPOSIT',
    action: undefined,
    symbol: '',
    cusip: '',
    description: 'ACH Deposit',
    quantity: 0,
    buyPrice: 0,
    amount: 425.75,
    settleDate: '',
    transactionType: 'ACH',
    accountType: 'CASH',
    tradeNumber: '',
    lastUpdated: '2023-11-28T10:30:00Z'
  },
  {
    id: '3',
    date: '2023-10-15',
    time: '09:00:00',
    type: 'DEPOSIT',
    action: undefined,
    symbol: '',
    cusip: '',
    description: 'FDIC Sweep Program',
    quantity: 0,
    buyPrice: 0,
    amount: 147.90,
    settleDate: '',
    transactionType: 'FDIC_SWEEP',
    accountType: 'CASH',
    tradeNumber: '',
    lastUpdated: '2023-10-15T09:00:00Z'
  },
  {
    id: '4',
    date: '2023-09-22',
    time: '16:00:00',
    type: 'DIVIDEND',
    action: undefined,
    symbol: 'TLT',
    cusip: '037833100',
    description: 'Quarterly Dividend',
    quantity: 275,
    buyPrice: 0,
    amount: 178.25,
    settleDate: '2023-09-22',
    transactionType: 'DIVIDEND',
    accountType: 'CASH',
    tradeNumber: '',
    lastUpdated: '2023-09-22T16:00:00Z'
  },
  {
    id: '5',
    date: '2023-08-30',
    time: '12:00:00',
    type: 'NON_TRADES',
    action: undefined,
    symbol: '',
    cusip: '',
    description: 'Account Maintenance Fee',
    quantity: 0,
    buyPrice: 0,
    amount: -245.30,
    settleDate: '',
    transactionType: 'FEE',
    accountType: 'CASH',
    tradeNumber: '',
    lastUpdated: '2023-08-30T12:00:00Z'
  },
  {
    id: '6',
    date: '2023-07-15',
    time: '16:00:00',
    type: 'INTEREST',
    action: undefined,
    symbol: 'VNQ',
    cusip: '037833100',
    description: 'Bond Interest Payment',
    quantity: 0,
    buyPrice: 0,
    amount: 892.15,
    settleDate: '2023-07-15',
    transactionType: 'INTEREST',
    accountType: 'CASH',
    tradeNumber: '',
    lastUpdated: '2023-07-15T16:00:00Z'
  },
  {
    id: '7',
    date: '2023-08-30',
    time: '14:30:00',
    type: 'JOURNAL',
    action: undefined,
    symbol: 'TSLA 800C',
    cusip: '037833100',
    description: 'Account Transfer',
    quantity: 185,
    buyPrice: 0,
    amount: 245.30,
    settleDate: '',
    transactionType: 'JOURNAL',
    accountType: 'MARGIN',
    tradeNumber: 'T123460',
    lastUpdated: '2023-08-30T14:30:00Z'
  },
  {
    id: '8',
    date: '2023-07-15',
    time: '11:00:00',
    type: 'TRADE',
    action: 'SELL',
    symbol: 'MSFT',
    cusip: '594918104',
    description: 'Microsoft Corporation',
    quantity: 50,
    buyPrice: 0,
    amount: 18500.00,
    settleDate: '2023-07-17',
    transactionType: 'MARKET',
    accountType: 'CASH',
    tradeNumber: 'T123461',
    lastUpdated: '2023-07-15T11:00:00Z'
  },
  {
    id: '9',
    date: '2023-08-30',
    time: '15:45:00',
    type: 'SECURITY_TRANSFER',
    action: undefined,
    symbol: 'TSLA 800C',
    cusip: '037833100',
    description: 'NVIDIA Corporation',
    quantity: 100,
    buyPrice: 0,
    amount: 245.30,
    settleDate: '',
    transactionType: 'SECURITY_TRANSFER',
    accountType: 'MARGIN',
    tradeNumber: '',
    lastUpdated: '2023-08-30T15:45:00Z'
  },
  {
    id: '10',
    date: '2023-07-15',
    time: '13:20:00',
    type: 'REPO',
    action: undefined,
    symbol: '',
    cusip: '',
    description: 'Repurchase Agreement',
    quantity: 0,
    buyPrice: 0,
    amount: 892.15,
    settleDate: '2023-07-15',
    transactionType: 'REPO',
    accountType: 'CASH',
    tradeNumber: '',
    lastUpdated: '2023-07-15T13:20:00Z'
  }
];

// Mock summary data for the three cards
const mockSummaryData = {
  netFlow: {
    total: 30000.00,
    deposits: {
      count: 1132,
      amount: 1000000000.00
    },
    withdrawals: {
      count: 98,
      amount: 90000000.00
    }
  },
  totalIncome: {
    total: 3700.00,
    dividendIncome: {
      count: 5,
      amount: 2500.00
    },
    interestPayments: {
      amount: 1200.00
    }
  },
  upcomingActions: {
    total: 5,
    maturingBonds: 3,
    corporateActions: 2
  }
};

function ActivityPageContent() {
  const [activeTab, setActiveTab] = useState<'all' | 'cashflow' | 'ira'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState('');
  const [, setLastRefresh] = useState<Date>(new Date());
  const [timeframe, setTimeframe] = useState('Last 30 days');

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setLastRefresh(new Date());
  }, []);

  // Process activities for display
  const processedActivities = useMemo(() => {
    let filtered = mockActivities;

    // Filter by active tab
    if (activeTab === 'cashflow') {
      filtered = filtered.filter((activity: Activity) => 
        ['DEPOSIT', 'WITHDRAWAL', 'DIVIDEND', 'INTEREST'].includes(activity.type)
      );
    } else if (activeTab === 'ira') {
      filtered = filtered.filter((activity: Activity) => 
        activity.accountType === 'IRA' || activity.type === 'IRA'
      );
    }
    // 'all' tab shows all activities

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((activity: Activity) => {
        return activity.description.toLowerCase().includes(searchLower) ||
               activity.symbol?.toLowerCase().includes(searchLower) ||
               activity.type.toLowerCase().includes(searchLower) ||
               activity.cusip?.toLowerCase().includes(searchLower);
      });
    }

    // Filter by activity type
    if (activityTypeFilter && activityTypeFilter !== 'All') {
      const typeMap: Record<string, string> = {
        'Non-Trade': 'NON_TRADES',
        'Deposit': 'DEPOSIT',
        'Dividend': 'DIVIDEND',
        'Interest': 'INTEREST',
        'Journal': 'JOURNAL',
        'Trade': 'TRADE',
        'Delivery': 'DELIVERY',
        'Check Issue': 'CHECK_ISSUES',
        'Credit Interest': 'CREDIT_INTEREST',
        'Margin Interest': 'MARGIN_INTEREST',
        'Principal': 'PRINCIPAL',
        'Redemption': 'REDEMPTIONS'
      };
      const mappedType = typeMap[activityTypeFilter] || activityTypeFilter;
      filtered = filtered.filter((activity: Activity) => activity.type === mappedType);
    }

    // Filter by account type
    if (accountTypeFilter && accountTypeFilter !== 'All') {
      const accountTypeMap: Record<string, string> = {
        'Cash': 'CASH',
        'Margin': 'MARGIN'
      };
      const mappedAccountType = accountTypeMap[accountTypeFilter] || accountTypeFilter;
      filtered = filtered.filter((activity: Activity) => activity.accountType === mappedAccountType);
    }

    return filtered.sort((a: Activity, b: Activity) => {
      // Use lastUpdated timestamp for proper chronological sorting
      const timeA = new Date(a.lastUpdated || a.date).getTime();
      const timeB = new Date(b.lastUpdated || b.date).getTime();
      return timeB - timeA; // Most recent first
    });
  }, [activeTab, searchTerm, activityTypeFilter, accountTypeFilter]);

  const formatAmount = (amount: number) => {
    const isNegative = amount < 0;
    const absoluteAmount = Math.abs(amount);
    const formattedAmount = absoluteAmount.toLocaleString('en-US', { minimumFractionDigits: 2 });
    return isNegative ? `-$${formattedAmount}` : `$${formattedAmount}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  // Helper function to format activity type
  const formatActivityType = (type: string) => {
    const typeMap: Record<string, string> = {
      'DEPOSIT': 'Deposit',
      'WITHDRAWAL': 'Withdrawal',
      'DIVIDEND': 'Dividend',
      'TRADE': 'Trade',
      'TRANSFER': 'Transfer',
      'EQUITY': 'Equity',
      'MUTUAL_FUNDS': 'Mutual funds',
      'INTEREST': 'Interest',
      'IRA': 'IRA',
      'NON_TRADES': 'Non-Trade',
      'JOURNAL': 'Journal',
      'DELIVERY': 'Delivery',
      'CHECK_ISSUES': 'Check Issue',
      'CREDIT_INTEREST': 'Credit Interest',
      'MARGIN_INTEREST': 'Margin Interest',
      'PRINCIPAL': 'Principal',
      'REDEMPTIONS': 'Redemption',
      'SECURITY_TRANSFER': 'Delivery',
      'REPO': 'Non-Trade'
    };
    return typeMap[type] || type;
  };

  const getCurrentTimestamp = () => {
    return new Date().toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'
    });
  };

  // Calculate net total
  const netTotal = processedActivities.reduce((sum, activity) => sum + activity.amount, 0);

  return (
    <div className="min-h-screen rounded-md space-y-4 md:space-y-4">
      {/* Page Title and Controls */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-foreground">Activity</h1>
        <div className="flex items-center gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Last 7 days">Last 7 days</SelectItem>
              <SelectItem value="Last 30 days">Last 30 days</SelectItem>
              <SelectItem value="Last 90 days">Last 90 days</SelectItem>
              <SelectItem value="Last year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary">
            <Download className="h-5 w-5 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Three Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Net Flow Card */}
        <Card className="p-6 bg-card">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Net flow</p>
              <h3 className="text-xl font-medium text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                {formatAmount(mockSummaryData.netFlow.total)}
              </h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <ArrowDown className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">
                    Deposits
                  </span>
                  <div className="text-sm font-medium text-foreground">
                    {formatAmount(mockSummaryData.netFlow.deposits.amount)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <ArrowUp className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">
                    Withdrawals
                  </span>
                  <div className="text-sm font-medium text-foreground">
                    {formatAmount(mockSummaryData.netFlow.withdrawals.amount)}
                  </div>
                </div>
              </div>
            </div>
            
            <LastUpdated 
              timestamp={`Updated ${getCurrentTimestamp()}`} 
              onRefresh={handleRefresh}
              className="mt-4"
            />
          </div>
        </Card>

        {/* Total Income Card */}
        <Card className="p-6 bg-card">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total income</p>
              <h3 className="text-xl font-medium text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                {formatAmount(mockSummaryData.totalIncome.total)}
              </h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">
                    Dividend income · {mockSummaryData.totalIncome.dividendIncome.count} transactions
                  </span>
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    +{formatAmount(mockSummaryData.totalIncome.dividendIncome.amount)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">
                    Interest payments
                  </span>
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    +{formatAmount(mockSummaryData.totalIncome.interestPayments.amount)}
                  </div>
                </div>
              </div>
            </div>
            
            <LastUpdated 
              timestamp={`Updated ${getCurrentTimestamp()}`} 
              onRefresh={handleRefresh}
              className="mt-4"
            />
          </div>
        </Card>

        {/* Upcoming Actions Card */}
        <Card className="p-6 bg-card">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Upcoming actions</p>
              <h3 className="text-xl font-medium text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                {mockSummaryData.upcomingActions.total} events
              </h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">
                    Maturing bonds
                  </span>
                  <div className="text-sm font-medium text-foreground">
                    {mockSummaryData.upcomingActions.maturingBonds} upcoming
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">
                    Corporate Actions
                  </span>
                  <div className="text-sm font-medium text-foreground">
                    {mockSummaryData.upcomingActions.corporateActions} pending
                  </div>
                </div>
              </div>
            </div>
            
            <LastUpdated 
              timestamp={`Updated ${getCurrentTimestamp()}`} 
              onRefresh={handleRefresh}
              className="mt-4"
            />
          </div>
        </Card>
      </div>

      {/* Activity Tabs, Filters, and Table */}
      <Card className="p-6">
        {/* Activity Tabs */}
        <div className="flex justify-between items-end mb-4 pb-2">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'all' | 'cashflow' | 'ira')}
                className={`pb-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <LastUpdated 
            timestamp={`Updated ${getCurrentTimestamp()}`} 
            onRefresh={handleRefresh}
            className="pb-2"
            showBorder={false}
          />
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {/* Filters and Search */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by Symbol or CUSIP"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-gray-300 dark:border-gray-600 pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
                  <SelectTrigger className="w-[180px] border-gray-300 dark:border-gray-600 text-foreground dark:text-white">
                    <SelectValue placeholder="Activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === 'All' ? 'Activity type' : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={accountTypeFilter} onValueChange={setAccountTypeFilter}>
                  <SelectTrigger className="w-[140px] border-gray-300 dark:border-gray-600 text-foreground dark:text-white">
                    <SelectValue placeholder="Account type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === 'All' ? 'Account type' : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="secondary">
                  <Maximize className="h-4 w-4 mr-2" />
                  Expand
                </Button>

                <Button variant="secondary">
                  Customize columns
                </Button>
              </div>
            </div>
          </div>

          {/* Activity Table */}
          <div className="rounded-lg min-h-[400px]">
            <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap min-w-[80px]">
                    <div className="flex items-center gap-1">
                      Date
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap min-w-[120px]">
                    <div className="flex items-center gap-1">
                      Activity type
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap min-w-[80px]">
                    <div className="flex items-center gap-1">
                      Action
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap min-w-[120px]">
                    <div className="flex items-center gap-1">
                      Symbol/CUSIP
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap min-w-[200px]">
                    <div className="flex items-center gap-1">
                      Description
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap min-w-[100px]">
                    <div className="flex items-center gap-1">
                      Quantity
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap min-w-[100px]">
                    <div className="flex items-center gap-1">
                      Buy price
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap min-w-[120px]">
                    <div className="flex items-center gap-1">
                      Amount
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap min-w-[100px]">
                    <div className="flex items-center gap-1">
                      Settle date
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap min-w-[140px]">
                    <div className="flex items-center gap-1">
                      Transaction type
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap min-w-[120px]">
                    <div className="flex items-center gap-1">
                      Account type
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground whitespace-nowrap min-w-[120px]">
                    <div className="flex items-center gap-1">
                      Trade number
                      <ChevronsUpDown className="h-4 w-4" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {processedActivities.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="text-center py-8 text-muted-foreground">
                      No activities found
                    </td>
                  </tr>
                ) : (
                  processedActivities.map((activity: Activity) => (
                    <tr key={activity.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm text-foreground">
                        {formatDate(activity.date)}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {formatActivityType(activity.type)}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {activity.action || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        <div>
                          <div className="font-medium">{activity.symbol || '-'}</div>
                          <div className="text-xs text-muted-foreground">{activity.cusip || '-'}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground max-w-[200px] truncate">
                        {activity.description}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {activity.quantity ? activity.quantity.toLocaleString() : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {activity.buyPrice ? formatAmount(activity.buyPrice) : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {formatAmount(activity.amount)}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {activity.settleDate ? formatDate(activity.settleDate) : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {activity.transactionType || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {activity.accountType || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {activity.tradeNumber || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="border-t font-medium">
                  <td colSpan={8} className="py-3 px-4 text-sm text-foreground">
                    Net All Activity
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">
                    {formatAmount(netTotal)}
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ActivityPageSkeleton() {
  return (
    <div className="rounded-md space-y-4 md:space-y-4">
      {/* Page Title and Controls Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-[140px] bg-muted rounded animate-pulse"></div>
          <div className="h-9 w-24 bg-muted rounded animate-pulse"></div>
        </div>
      </div>

      {/* Three Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 bg-card">
            <div className="space-y-4">
              <div>
                <div className="h-4 w-24 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-7 w-32 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Activity Card Skeleton */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Tabs Skeleton */}
          <div className="flex space-x-8 border-b pb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-24 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
          {/* Filters Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="h-10 flex-1 bg-muted rounded animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-10 w-[180px] bg-muted rounded animate-pulse"></div>
              <div className="h-10 w-[140px] bg-muted rounded animate-pulse"></div>
              <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
              <div className="h-10 w-40 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
          {/* Table Skeleton */}
          <div className="min-h-[400px]">
            <div className="h-10 w-full bg-muted rounded animate-pulse mb-2"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-full bg-muted rounded animate-pulse mb-2"></div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ActivityPage() {
  return (
    <Suspense fallback={<ActivityPageSkeleton />}>
      <ActivityPageContent />
    </Suspense>
  );
}
