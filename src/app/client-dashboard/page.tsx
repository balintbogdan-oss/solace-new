'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUserRole } from '@/contexts/UserRoleContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, ChevronRight, RefreshCw, Users, X, Check, Building2, Home } from 'lucide-react';
import { AccountData, Household } from '@/types/account';
import { formatCurrency } from '@/lib/utils';
import { DonutChart } from '@/components/charts/DonutChart';
import { getChartColor } from '@/lib/chartColors';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HouseholdGroup {
  household: Household | null;
  accounts: AccountData[];
  totalValue: number;
}

// Helper function to render account table columns
const renderAccountTable = (accounts: AccountData[], onAccountClick: (accountId: string) => void) => {
  return (
    <>
      {/* Account Column */}
      <div className="flex flex-col items-start min-w-[120px] w-[300px] overflow-hidden">
        <div className="bg-muted flex gap-2 h-10 items-center min-w-[85px] px-6 py-0 w-full">
          <div className="flex-1 flex gap-2 items-center px-0 py-2">
            <p className="flex-1 text-sm font-medium text-muted-foreground leading-6">Account</p>
          </div>
        </div>
        {accounts.map((account) => (
          <div
            key={account.accountId}
            className="border-b border-t-0 border-l-0 border-r-0 flex gap-2 h-[72px] items-center min-w-[85px] pl-6 pr-0 py-2 w-full cursor-pointer hover:bg-muted/50"
            onClick={() => onAccountClick(account.accountId)}
          >
            <div className="flex-1 flex flex-col gap-0.5 items-start leading-0 min-w-0">
              <p className="text-sm font-medium text-foreground leading-6 truncate w-full">
                {account.accountType === 'joint_jtwros' ? 'Joint account' : 
                 account.accountType === 'trust' ? 'Personal trust' :
                 account.accountType === 'individual' ? 'Single account' :
                 account.accountType === 'ira' ? 'Single account' :
                 'Account'}
              </p>
              <p className="text-sm font-normal text-muted-foreground leading-4 truncate w-full">
                {account.accountId} • {account.accountName}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Cash + FDIC sweep Column */}
      <div className="flex-1 flex flex-col items-start overflow-hidden">
        <div className="bg-muted flex gap-2 h-10 items-center min-w-[85px] px-2 py-0 w-full">
          <div className="flex-1 flex gap-2 items-center justify-end px-0 py-2">
            <p className="flex-1 text-sm font-medium text-muted-foreground leading-6 text-right">Cash + FDIC sweep</p>
          </div>
        </div>
        {accounts.map((account) => (
          <div
            key={account.accountId}
            className="border-b border-t-0 border-l-0 border-r-0 flex h-[72px] items-center min-w-[85px] p-2 w-full cursor-pointer hover:bg-muted/50"
            onClick={() => onAccountClick(account.accountId)}
          >
            <p className="flex-1 text-sm font-medium text-foreground leading-6 text-right">
              {formatCurrency(account.balances?.cash || 0)}
            </p>
          </div>
        ))}
      </div>

      {/* Invested value Column */}
      <div className="flex flex-col items-start overflow-hidden w-[128px]">
        <div className="bg-muted flex gap-2 h-10 items-center min-w-[85px] px-2 py-0 w-full">
          <div className="flex-1 flex gap-2 items-center justify-end px-0 py-2">
            <p className="flex-1 text-sm font-medium text-muted-foreground leading-6 text-right">Invested value</p>
          </div>
        </div>
        {accounts.map((account) => (
          <div
            key={account.accountId}
            className="border-b border-t-0 border-l-0 border-r-0 flex h-[72px] items-center min-w-[85px] p-2 w-full cursor-pointer hover:bg-muted/50"
            onClick={() => onAccountClick(account.accountId)}
          >
            <p className="flex-1 text-sm font-medium text-foreground leading-6 text-right">
              {formatCurrency(account.balances?.investedValue || 0)}
            </p>
          </div>
        ))}
      </div>

      {/* Market value Column */}
      <div className="flex flex-col items-start overflow-hidden w-[137px]">
        <div className="bg-muted flex gap-2 h-10 items-center min-w-[85px] px-2 py-0 w-full">
          <div className="flex-1 flex gap-2 items-center justify-end px-0 py-2">
            <p className="flex-1 text-sm font-medium text-muted-foreground leading-6 text-right">Market value</p>
          </div>
        </div>
        {accounts.map((account) => (
          <div
            key={account.accountId}
            className="border-b border-t-0 border-l-0 border-r-0 flex h-[72px] items-center min-w-[85px] p-2 w-full cursor-pointer hover:bg-muted/50"
            onClick={() => onAccountClick(account.accountId)}
          >
            <p className="flex-1 text-sm font-medium text-foreground leading-6 text-right">
              {formatCurrency(account.balances?.totalValue || 0)}
            </p>
          </div>
        ))}
      </div>

      {/* Funds available Column */}
      <div className="flex flex-col items-start overflow-hidden w-[133px]">
        <div className="bg-muted flex gap-2 h-10 items-center min-w-[85px] px-2 py-0 w-full">
          <div className="flex-1 flex gap-2 items-center justify-end px-0 py-2">
            <p className="flex-1 text-sm font-medium text-muted-foreground leading-6 text-right">Funds available</p>
          </div>
        </div>
        {accounts.map((account) => (
          <div
            key={account.accountId}
            className="border-b border-t-0 border-l-0 border-r-0 flex h-[72px] items-center min-w-[85px] p-2 w-full cursor-pointer hover:bg-muted/50"
            onClick={() => onAccountClick(account.accountId)}
          >
            <p className="flex-1 text-sm font-medium text-foreground leading-6 text-right">
              {formatCurrency(account.balances?.buyingPower || 0)}
            </p>
          </div>
        ))}
      </div>

      {/* Margin balance Column */}
      <div className="flex flex-col items-start overflow-hidden w-[125px]">
        <div className="bg-muted flex gap-2 h-10 items-center min-w-[85px] px-2 py-0 w-full">
          <div className="flex-1 flex gap-2 items-center justify-end px-0 py-2">
            <p className="flex-1 text-sm font-medium text-muted-foreground leading-6 text-right">Margin balance</p>
          </div>
        </div>
        {accounts.map((account) => (
          <div
            key={account.accountId}
            className="border-b border-t-0 border-l-0 border-r-0 flex h-[72px] items-center min-w-[85px] p-2 w-full cursor-pointer hover:bg-muted/50"
            onClick={() => onAccountClick(account.accountId)}
          >
            <p className="flex-1 text-sm font-medium text-foreground leading-6 text-right">
              {formatCurrency(account.balances?.margin || 0)}
            </p>
          </div>
        ))}
      </div>

      {/* Total account value Column */}
      <div className="flex-1 flex flex-col items-start overflow-hidden">
        <div className="bg-muted flex gap-2 h-10 items-center min-w-[85px] px-2 py-0 w-full">
          <div className="flex-1 flex gap-2 items-center justify-end px-0 py-2">
            <p className="flex-1 text-sm font-medium text-muted-foreground leading-6 text-right">Total account value</p>
          </div>
        </div>
        {accounts.map((account) => (
          <div
            key={account.accountId}
            className="border-b border-t-0 border-l-0 border-r-0 flex h-[72px] items-center min-w-[85px] px-2 py-2 w-full cursor-pointer hover:bg-muted/50"
            onClick={() => onAccountClick(account.accountId)}
          >
            <p className="flex-1 text-sm font-medium text-foreground leading-6 text-right">
              {formatCurrency(account.balances?.totalValue || 0)}
            </p>
          </div>
        ))}
      </div>

      {/* Chevron Column */}
      <div className="flex flex-col items-start overflow-hidden w-[42px]">
        <div className="bg-muted flex gap-2 h-10 items-center px-2 py-0 w-full" />
        {accounts.map((account) => (
          <div
            key={account.accountId}
            className="border-b border-t-0 border-l-0 border-r-0 flex h-[72px] items-center justify-end p-2 w-full cursor-pointer hover:bg-muted/50"
            onClick={() => onAccountClick(account.accountId)}
          >
            <div className="flex gap-1 items-center">
              <div className="flex gap-2 h-9 items-center justify-center px-3 py-2.5 rounded-lg">
                <ChevronRight className="h-4 w-4 text-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default function ClientDashboardPage() {
  const router = useRouter();
  const { role } = useUserRole();
  const [householdGroups, setHouseholdGroups] = useState<HouseholdGroup[]>([]);
  const [nonHouseholdAccounts, setNonHouseholdAccounts] = useState<AccountData[]>([]);
  const [expandedHouseholds, setExpandedHouseholds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState('Michael Johnson');
  const [isAccountsSheetOpen, setIsAccountsSheetOpen] = useState(false);
  const [selectedAccountIds, setSelectedAccountIds] = useState<Set<string>>(new Set());
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'household' | 'non-household' | 'custom'>('all');

  // Redirect if not a client (unless they're on an account page)
  useEffect(() => {
    if (role !== 'client') {
      const pathname = window.location.pathname;
      // Don't redirect if on an account page - allow role switching to work
      if (!pathname.startsWith('/account/')) {
        router.push('/');
      }
    }
  }, [role, router]);

  const fetchClientData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/client-dashboard?clientId=client-1');
      if (!response.ok) {
        throw new Error('Failed to fetch client data');
      }
      const data = await response.json();
      
      setClientName(`${data.client.firstName} ${data.client.lastName}`);
      
      const accounts: AccountData[] = data.accounts || [];
      
      // Group accounts by household
      const householdsMap = new Map<string, HouseholdGroup>();
      const nonHousehold: AccountData[] = [];
      
      accounts.forEach((account) => {
        if (account.householdId && account.household) {
          if (!householdsMap.has(account.householdId)) {
            householdsMap.set(account.householdId, {
              household: account.household,
              accounts: [],
              totalValue: 0
            });
          }
          const group = householdsMap.get(account.householdId)!;
          group.accounts.push(account);
          group.totalValue += account.balances?.totalValue || 0;
        } else {
          nonHousehold.push(account);
        }
      });

      const groups = Array.from(householdsMap.values());
      setHouseholdGroups(groups);
      setNonHouseholdAccounts(nonHousehold);
      
      // Expand all households by default
      const allHouseholdIds = new Set(groups.map(g => g.household?.id).filter(Boolean) as string[]);
      if (nonHousehold.length > 0) {
        allHouseholdIds.add('non-household');
      }
      setExpandedHouseholds(allHouseholdIds);
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch client data - start fetching immediately if role is client, don't wait for hydration
  useEffect(() => {
    // Start fetching data as soon as we know we're a client
    // This allows data to load in parallel with role hydration
    if (role === 'client') {
      fetchClientData();
    }
  }, [role, fetchClientData]);

  const toggleHousehold = (householdId: string | null) => {
    const key = householdId || 'non-household';
    setExpandedHouseholds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleAccountClick = (accountId: string) => {
    router.push(`/account/${accountId}`);
  };

  // Get all accounts for portfolio calculations
  const allAccounts = useMemo(() => {
    return [
      ...householdGroups.flatMap(g => g.accounts),
      ...nonHouseholdAccounts
    ];
  }, [householdGroups, nonHouseholdAccounts]);

  // Get selected accounts for display
  const selectedAccounts = useMemo(() => {
    if (selectedAccountIds.size === 0 || selectedAccountIds.size === allAccounts.length) {
      return allAccounts;
    }
    return allAccounts.filter(acc => selectedAccountIds.has(acc.accountId));
  }, [allAccounts, selectedAccountIds]);

  // Get button label based on selection
  const getDropdownButtonLabel = () => {
    // If all accounts are selected, show "All accounts"
    if (selectedAccounts.length === allAccounts.length && allAccounts.length > 0) {
      return 'All accounts';
    }
    if (selectedAccounts.length === 0) {
      return 'All accounts';
    }
    if (selectedAccounts.length === 1) {
      const account = selectedAccounts[0];
      const accountType = account.accountType === 'joint_jtwros' ? 'Joint account' : 
                         account.accountType === 'trust' ? 'Personal trust' :
                         account.accountType === 'individual' ? 'Single account' :
                         account.accountType === 'ira' ? 'Single account' :
                         'Account';
      return accountType;
    }
    if (selectedAccounts.length === 2) {
      const account = selectedAccounts[0];
      const accountType = account.accountType === 'joint_jtwros' ? 'Joint account' : 
                         account.accountType === 'trust' ? 'Personal trust' :
                         account.accountType === 'individual' ? 'Single account' :
                         account.accountType === 'ira' ? 'Single account' :
                         'Account';
      return `${accountType} +1 more`;
    }
    // Check if all are household or all are non-household
    const householdCount = selectedAccounts.filter(acc => acc.householdId).length;
    if (householdCount === selectedAccounts.length && householdCount > 0) {
      return 'Household accounts';
    }
    if (householdCount === 0 && selectedAccounts.length > 0) {
      return 'Non-household accounts';
    }
    return `${selectedAccounts.length} accounts`;
  };

  const selectAllAccounts = () => {
    setSelectedAccountIds(new Set(allAccounts.map(acc => acc.accountId)));
    setActiveFilter('all');
  };

  const toggleAccountSelection = (accountId: string) => {
    setSelectedAccountIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(accountId)) {
        newSet.delete(accountId);
      } else {
        newSet.add(accountId);
      }
      if (newSet.size === 0 || newSet.size === allAccounts.length) {
        setActiveFilter('all');
      } else {
        setActiveFilter('custom');
      }
      return newSet;
    });
  };

  const selectFilter = (filter: 'all' | 'household' | 'non-household' | 'custom') => {
    setActiveFilter(filter);
    if (filter === 'all') {
      selectAllAccounts();
    } else if (filter === 'household') {
      const householdAccountIds = householdGroups.flatMap(group => 
        group.accounts.map(acc => acc.accountId)
      );
      setSelectedAccountIds(new Set(householdAccountIds));
    } else if (filter === 'non-household') {
      setSelectedAccountIds(new Set(nonHouseholdAccounts.map(acc => acc.accountId)));
    }
  };

  const totalPortfolioValue = useMemo(() => {
    // Calculate total from selected accounts only
    return selectedAccounts.reduce((sum, acc) => sum + (acc.balances?.totalValue || 0), 0);
  }, [selectedAccounts]);

  // Helper function to map security type to asset class
  const getAssetClass = (securityType: string): string => {
    switch (securityType) {
      case 'mutual_fund':
        return 'Mutual funds';
      case 'equity':
      case 'etf':
        return 'Equities';
      case 'option':
        return 'Options';
      case 'bond':
        return 'Fixed income';
      default:
        return 'Other';
    }
  };

  // Calculate asset allocation data for the pie chart from selected accounts
  const assetAllocationData = useMemo(() => {
    // Aggregate holdings from all selected accounts
    const allHoldings: Array<{ security: { type: string }; marketValue: number }> = [];
    
    selectedAccounts.forEach(account => {
      if (account.holdings && account.securities && account.marketData) {
        account.holdings.forEach(holding => {
          const security = account.securities.find(s => s.symbol === holding.symbol);
          const marketData = account.marketData.find(m => m.symbol === holding.symbol);
          if (security && marketData) {
            const marketValue = (marketData.currentPrice || 0) * holding.quantity;
            allHoldings.push({
              security: { type: security.type },
              marketValue
            });
          }
        });
      }
    });

    // Group by asset class
    const allocationMap = new Map<string, number>();
    allHoldings.forEach(holding => {
      const assetClass = getAssetClass(holding.security.type);
      const currentValue = allocationMap.get(assetClass) || 0;
      allocationMap.set(assetClass, currentValue + holding.marketValue);
    });

    // Convert to array and calculate percentages
    const totalValue = Array.from(allocationMap.values()).reduce((sum, val) => sum + val, 0);
    
    if (totalValue === 0) {
      // Fallback to hardcoded values if no holdings
      return [
        { name: 'Mutual funds', value: 44, color: getChartColor(1) },
        { name: 'Equities', value: 20, color: getChartColor(2) },
        { name: 'Options', value: 15, color: getChartColor(3) },
        { name: 'Fixed income', value: 15, color: getChartColor(4) },
        { name: 'Annuities', value: 5, color: getChartColor(5) },
        { name: 'Other', value: 1, color: getChartColor(6) },
      ];
    }

    // Map asset classes to colors in the correct order
    const assetClassOrder = ['Mutual funds', 'Equities', 'Options', 'Fixed income', 'Annuities', 'Other'];
    const data = assetClassOrder
      .filter(className => allocationMap.has(className))
      .map((className, index) => ({
        name: className,
        value: Math.round((allocationMap.get(className)! / totalValue) * 100),
        color: getChartColor(index + 1)
      }))
      .filter(item => item.value > 0); // Only include non-zero allocations

    // Add any other classes not in the standard list
    allocationMap.forEach((value, className) => {
      if (!assetClassOrder.includes(className)) {
        data.push({
          name: className,
          value: Math.round((value / totalValue) * 100),
          color: getChartColor(6)
        });
      }
    });

    return data.length > 0 ? data : [
      { name: 'Mutual funds', value: 44, color: getChartColor(1) },
      { name: 'Equities', value: 20, color: getChartColor(2) },
      { name: 'Options', value: 15, color: getChartColor(3) },
      { name: 'Fixed income', value: 15, color: getChartColor(4) },
      { name: 'Annuities', value: 5, color: getChartColor(5) },
      { name: 'Other', value: 1, color: getChartColor(6) },
    ];
  }, [selectedAccounts]);

  if (role !== 'client') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-[1440px] mx-auto px-[100px] py-0">
          <div className="flex items-center justify-center h-screen">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="w-full relative" style={{ backgroundColor: '#041340' }}>
        <div className="max-w-[1440px] mx-auto px-[100px] py-8">
          <div className="relative z-10">
            <h1 className="text-2xl font-medium text-white mb-2">
              Welcome back, {clientName}
            </h1>
          </div>
          <div className="absolute inset-0 opacity-10 relative">
            <Image 
              src="/images/client-hero.jpg" 
              alt="" 
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
      
      <div className="max-w-[1440px] mx-auto px-[100px] py-0">
        <div className="flex gap-8 py-6">
          {/* Left Column: Accounts and Portfolio */}
          <div className="flex-1 space-y-8">
            {/* Accounts Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                  Accounts
                </h2>
                <button 
                  onClick={() => {
                    setIsAccountsSheetOpen(true);
                  }}
                  className="text-sm font-medium text-primary hover:underline px-1.5 py-0.5 rounded"
                >
                  See more details
                </button>
              </div>

              <div className="space-y-4">
                {/* Household Accounts - Each household gets its own card */}
                {householdGroups.map((group) => {
                  const isExpanded = expandedHouseholds.has(group.household?.id || '');
                  const householdName = group.household?.name || 'Household';
                  const householdSubtitle = group.household?.description || group.accounts
                    .map(acc => `${acc.client.firstName} ${acc.client.lastName}`)
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .join(' & ');

                  return (
                    <Card key={group.household?.id || 'household'} className="overflow-hidden p-0">
                      {/* Household Header */}
                      <div
                        className="flex items-center justify-between px-6 py-4 border-b cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => toggleHousehold(group.household?.id || null)}
                      >
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-foreground leading-none">
                            {householdName}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {householdSubtitle}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right" style={{ width: '200px' }}>
                            <p className="text-xs text-muted-foreground">Total value</p>
                            <p className="text-sm font-semibold text-foreground leading-none">
                              {formatCurrency(group.totalValue)}
                            </p>
                          </div>
                          <div className="flex-shrink-0" style={{ width: '24px' }}>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-foreground" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Accounts */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="border-l-4 overflow-hidden"
                            style={{ borderColor: '#72cac4' }}
                          >
                            {group.accounts.map((account) => (
                              <div
                                key={account.accountId}
                                className="flex items-center px-6 py-4 border-b hover:bg-muted/30 cursor-pointer transition-colors"
                                onClick={() => handleAccountClick(account.accountId)}
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-sm font-medium text-foreground">
                                      {account.accountType === 'joint_jtwros' ? 'Joint account' : 
                                       account.accountType === 'trust' ? 'Personal trust' :
                                       account.accountType === 'individual' ? 'Single account' :
                                       account.accountType === 'ira' ? 'Single account' :
                                       'Account'}
                                    </span>
                                    {account.isPrimary && (
                                      <span 
                                        className="px-1.5 py-0.5 rounded-full text-xs font-medium"
                                        style={{ 
                                          backgroundColor: '#eaeffc',
                                          color: '#2c54c9'
                                        }}
                                      >
                                        Primary
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {account.accountId} • {account.accountName}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0" style={{ width: '224px', justifyContent: 'flex-end' }}>
                                  <span className="text-sm font-semibold text-foreground text-right" style={{ width: '200px' }}>
                                    {formatCurrency(account.balances?.totalValue || 0)}
                                  </span>
                                  <div className="flex-shrink-0" style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {/* Updated timestamp */}
                            <div className="flex items-center justify-end gap-2 px-6 py-3 border-t text-xs text-muted-foreground">
                              <RefreshCw className="h-3 w-3" />
                              <span>Updated {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} ET</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  );
                })}

                {/* Non-Household Accounts - Separate card */}
                {nonHouseholdAccounts.length > 0 && (
                  <Card className="overflow-hidden p-0">
                    {/* Header */}
                    <div
                      className="flex items-center justify-between border-b cursor-pointer hover:bg-muted/50 transition-colors"
                      style={{ 
                        borderColor: '#ebebeb',
                        padding: '16px 24px'
                      }}
                      onClick={() => toggleHousehold(null)}
                    >
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-foreground leading-none">
                          Non-household
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right" style={{ width: '200px' }}>
                          <p className="text-xs text-muted-foreground">Total value</p>
                          <p className="text-sm font-semibold text-foreground leading-none">
                            {formatCurrency(
                              nonHouseholdAccounts.reduce((sum, acc) => sum + (acc.balances?.totalValue || 0), 0)
                            )}
                          </p>
                        </div>
                        <div className="flex-shrink-0" style={{ width: '24px' }}>
                          {expandedHouseholds.has('non-household') ? (
                            <ChevronUp className="h-4 w-4 text-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-foreground" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Account rows */}
                    <AnimatePresence initial={false}>
                      {expandedHouseholds.has('non-household') && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          {nonHouseholdAccounts.map((account) => (
                            <div
                              key={account.accountId}
                              className="flex items-center px-6 py-4 border-b hover:bg-muted/30 cursor-pointer transition-colors"
                              style={{ 
                                borderColor: '#ebebeb',
                                borderLeft: '4px solid #0e00d0'
                              }}
                              onClick={() => handleAccountClick(account.accountId)}
                            >
                              <div className="flex-1">
                                <span className="text-sm font-medium text-foreground">
                                  Single account
                                </span>
                                <p className="text-sm text-muted-foreground">
                                  {account.accountId} • {account.accountName}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0" style={{ width: '224px', justifyContent: 'flex-end' }}>
                                <span className="text-sm font-semibold text-foreground text-right" style={{ width: '200px' }}>
                                  {formatCurrency(account.balances?.totalValue || 0)}
                                </span>
                                <div className="flex-shrink-0" style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Updated timestamp */}
                          <div className="px-6 py-2 border-t flex justify-between items-center">
                            <div className="flex-1 flex justify-start items-center gap-0.5">
                              <span className="text-xs font-normal text-muted-foreground leading-5">
                                Updated {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} ET
                              </span>
                              <button className="w-6 h-6 bg-card rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-border flex items-center justify-center">
                                <RefreshCw className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                )}
              </div>
            </div>

            {/* Portfolio Details Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                  Portfolio details
                </h2>
                <DropdownMenu open={isAccountDropdownOpen} onOpenChange={setIsAccountDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={activeFilter === 'all' ? 'outline' : 'active'}
                      size="sm"
                      className={`flex items-center gap-2 ${activeFilter === 'all' ? '!bg-white' : ''}`}
                    >
                      <span>{getDropdownButtonLabel()}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    {/* Filter Buttons */}
                    <div className="p-2 flex gap-2 border-b">
                      <Button
                        variant={activeFilter === 'all' ? 'active' : 'outline'}
                        size="sm"
                        onClick={() => selectFilter('all')}
                        className="flex-1"
                      >
                        All
                      </Button>
                      <Button
                        variant={activeFilter === 'household' ? 'active' : 'outline'}
                        size="sm"
                        onClick={() => selectFilter('household')}
                        className="flex-1"
                      >
                        Household
                      </Button>
                      <Button
                        variant={activeFilter === 'non-household' ? 'active' : 'outline'}
                        size="sm"
                        onClick={() => selectFilter('non-household')}
                        className="flex-1"
                      >
                        Non-household
                      </Button>
                      <Button
                        variant={activeFilter === 'custom' ? 'active' : 'outline'}
                        size="sm"
                        onClick={() => selectFilter('custom')}
                        className="flex-1"
                      >
                        Custom
                      </Button>
                    </div>

                    {/* Account List */}
                    <div className="max-h-96 overflow-y-auto">
                      {/* Household Accounts */}
                      {householdGroups.length > 0 && (
                        <div className="p-2">
                          <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Household</div>
                          {householdGroups.flatMap(group => group.accounts).map((account) => {
                            const isSelected = selectedAccountIds.has(account.accountId);
                            return (
                              <div
                                key={account.accountId}
                                className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted cursor-pointer"
                                onClick={() => toggleAccountSelection(account.accountId)}
                              >
                                <div className="w-4 h-4 rounded flex items-center justify-center bg-muted">
                                  <Home className="h-3 w-3 text-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-foreground truncate">
                                    {account.accountType === 'joint_jtwros' ? 'Joint account' : 
                                     account.accountType === 'trust' ? 'Personal trust' :
                                     account.accountType === 'individual' ? 'Single account' :
                                     account.accountType === 'ira' ? 'Single account' :
                                     'Account'}
                                  </div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    {account.accountId} • {account.accountName}
                                  </div>
                                </div>
                                {isSelected && (
                                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                    <Check className="h-3 w-3 text-primary-foreground" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Non-household Accounts */}
                      {nonHouseholdAccounts.length > 0 && (
                        <div className="p-2 border-t">
                          <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Non-household</div>
                          {nonHouseholdAccounts.map((account) => {
                            const isSelected = selectedAccountIds.has(account.accountId);
                            return (
                              <div
                                key={account.accountId}
                                className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted cursor-pointer"
                                onClick={() => toggleAccountSelection(account.accountId)}
                              >
                                <div className="w-4 h-4 rounded flex items-center justify-center bg-muted">
                                  <Building2 className="h-3 w-3 text-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-foreground truncate">
                                    {account.accountType === 'joint_jtwros' ? 'Joint account' : 
                                     account.accountType === 'trust' ? 'Personal trust' :
                                     account.accountType === 'individual' ? 'Single account' :
                                     account.accountType === 'ira' ? 'Single account' :
                                     'Account'}
                                  </div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    {account.accountId} • {account.accountName}
                                  </div>
                                </div>
                                {isSelected && (
                                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                    <Check className="h-3 w-3 text-primary-foreground" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Asset Allocation Card */}
              <Card className="rounded-2xl shadow-[0px_0px_2px_1px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="p-6 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-medium text-foreground leading-6">Asset Allocation</h2>
                  </div>

                  {/* Chart and Legend */}
                  <div className="flex items-start gap-16">
                    {/* Donut Chart - 200x200 */}
                    <div className="w-[200px] h-[200px] flex-shrink-0">
                      <DonutChart 
                        data={assetAllocationData} 
                        portfolioValue={totalPortfolioValue}
                        size="large"
                      />
                    </div>

                    {/* Legend - Two columns */}
                    <div className="flex-1 flex items-start overflow-hidden">
                      {/* Left column: Color + Name */}
                      <div className="w-[134px] flex flex-col overflow-hidden">
                        {assetAllocationData.map((item, index) => (
                          <div 
                            key={item.name} 
                            className={`min-w-[85px] px-2 py-2.5 flex items-center gap-2 ${
                              index < assetAllocationData.length - 1 ? 'border-b' : ''
                            }`}
                          >
                            <div className="flex-1 flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                              <span className="text-sm font-medium text-foreground leading-6 line-clamp-1">{item.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Right column: Percentage + Value */}
                      <div className="flex-1 flex flex-col overflow-hidden">
                        {assetAllocationData.map((item, index) => {
                          const dollarValue = (totalPortfolioValue * item.value) / 100;
                          const formattedValue = dollarValue >= 1000000 
                            ? `$${(dollarValue / 1000000).toFixed(1)}M`
                            : dollarValue >= 1000
                            ? `$${(dollarValue / 1000).toFixed(0)}K`
                            : formatCurrency(dollarValue);
                          
                          return (
                            <div 
                              key={item.name} 
                              className={`min-w-[85px] px-2 py-2.5 flex items-center gap-2 ${
                                index < assetAllocationData.length - 1 ? 'border-b' : ''
                              }`}
                            >
                              <div className="flex-1 text-right text-sm font-medium text-foreground leading-6 line-clamp-1">
                                {item.value}%
                              </div>
                              <div className="text-sm font-normal text-muted-foreground leading-6 line-clamp-1">
                                {formattedValue}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-2 border-t flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">
                    Updated {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} ET
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column: Widgets and Asset Allocation */}
          <div className="w-[312px] space-y-[28px] pt-[44px]">
            {/* Your advisors widget */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-foreground">Your advisors</h3>
                <button className="rotate-180 rounded-full border border-[#ebebeb] bg-card p-2.5 w-8 h-8 flex items-center justify-center">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-foreground">Samantha C. +2 more</span>
              </div>
            </Card>

            {/* Take a quick tour widget */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-foreground">Take a quick tour</h3>
                <button className="rounded-full border border-[#ebebeb] bg-card p-2.5 w-8 h-8 flex items-center justify-center">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Quick tutorials that walk you through the platform and its key features.
              </p>
            </Card>

            {/* Wedbush Research widget */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-foreground">Wedbush Research</h3>
                <button className="rounded-full border border-[#ebebeb] bg-card p-2.5 w-8 h-8 flex items-center justify-center">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Access our resources on investing, tailored to help you make informed decisions.
              </p>
            </Card>

          </div>
        </div>
      </div>

      {/* Accounts Bottom Sheet */}
      <AnimatePresence>
        {isAccountsSheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAccountsSheetOpen(false)}
              className="fixed inset-0 z-40 bg-black/25"
            />
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-background border-t border-l-0 border-r-0 border-b-0 rounded-t-2xl z-50 flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Content Container */}
              <div className="flex-1 flex flex-col gap-4 px-6 py-12 overflow-y-auto max-w-[1228px] mx-auto w-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex items-center gap-1.5">
                    <h2 className="text-xl font-medium text-foreground leading-8 tracking-[-0.2px]" style={{ fontFamily: 'var(--font-family-headers, "Source Serif 4")' }}>
                      Accounts
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsAccountsSheetOpen(false)}
                    className="flex items-center gap-2 h-9 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span className="text-sm font-medium text-foreground">Close view</span>
                  </button>
                </div>

                {/* Accounts Section */}
                <div className="flex flex-col gap-4">
                  {/* Household Sections */}
                  {householdGroups.map((group) => {
                    const householdName = group.household?.name || 'Household';
                    return (
                      <div key={group.household?.id || 'household'} className="bg-card rounded-2xl shadow-[0px_0px_2px_1px_rgba(0,0,0,0.06)] overflow-hidden">
                        {/* Accordion Trigger */}
                        <div className="flex gap-8 items-center px-6 py-4 border-b">
                          <div className="flex-1 flex gap-3 items-center min-w-[120px]">
                            <div className="flex-1 flex flex-col items-start">
                              <p className="text-sm font-medium text-foreground leading-5">
                                {householdName}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center">
                            <div className="flex flex-col items-end justify-center">
                              <p className="text-sm font-normal text-muted-foreground leading-6">Total value</p>
                              <p className="text-sm font-semibold text-foreground leading-5 whitespace-nowrap">
                                {formatCurrency(group.totalValue)}
                              </p>
                            </div>
                            <ChevronUp className="h-4 w-4 text-foreground" />
                          </div>
                        </div>

                        {/* Table Container with Blue Left Border */}
                        <div className="bg-card border-l-4 border-primary relative w-full">
                          <div className="flex gap-0 items-start overflow-hidden w-full">
                            {renderAccountTable(group.accounts, (accountId) => {
                              setIsAccountsSheetOpen(false);
                              handleAccountClick(accountId);
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Non-household Section */}
                  {nonHouseholdAccounts.length > 0 && (
                    <div className="bg-card rounded-2xl shadow-[0px_0px_2px_1px_rgba(0,0,0,0.06)] overflow-hidden">
                      {/* Accordion Trigger */}
                      <div className="flex gap-8 items-center px-6 py-4 border-b">
                        <div className="flex-1 flex gap-3 items-center min-w-[120px]">
                          <div className="flex-1 flex flex-col items-start">
                            <p className="text-sm font-medium text-foreground leading-5">
                              Non-household
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <div className="flex flex-col items-end justify-center">
                            <p className="text-sm font-normal text-muted-foreground leading-6">Total value</p>
                            <p className="text-sm font-semibold text-foreground leading-5 whitespace-nowrap">
                              {formatCurrency(
                                nonHouseholdAccounts.reduce((sum, acc) => sum + (acc.balances?.totalValue || 0), 0)
                              )}
                            </p>
                          </div>
                          <ChevronUp className="h-4 w-4 text-foreground" />
                        </div>
                      </div>

                      {/* Table Container with Blue Left Border */}
                      <div className="bg-card border-l-4 border-primary relative w-full">
                        <div className="flex gap-0 items-start overflow-hidden w-full">
                          {renderAccountTable(nonHouseholdAccounts, (accountId) => {
                            setIsAccountsSheetOpen(false);
                            handleAccountClick(accountId);
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
