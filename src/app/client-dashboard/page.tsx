'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/contexts/UserRoleContext';
import { 
  HeroSection, 
  RightColumnWidgets,
  AccountsSection,
  PortfolioDetailsSection,
  AccountsBottomSheet,
  AdvisorsDrawer,
  ClientDashboardSkeleton,
} from './components';
import { useClientDashboardData } from './hooks/useClientDashboardData';
import { calculateAssetAllocation } from './utils/assetAllocation';

export default function ClientDashboardPage() {
  const router = useRouter();
  const { role } = useUserRole();
  const {
    householdGroups,
    nonHouseholdAccounts,
    expandedHouseholds,
    setExpandedHouseholds,
    loading,
    clientName,
    fetchClientData,
    refreshData,
  } = useClientDashboardData();
  
  const [isAccountsSheetOpen, setIsAccountsSheetOpen] = useState(false);
  const [selectedAccountIds, setSelectedAccountIds] = useState<Set<string>>(new Set());
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'household' | 'non-household' | 'custom'>('all');
  const [householdRefreshRotation, setHouseholdRefreshRotation] = useState(0);
  const [nonHouseholdRefreshRotation, setNonHouseholdRefreshRotation] = useState(0);
  const [isAdvisorsDrawerOpen, setIsAdvisorsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not a client (unless they're on an account page)
  useEffect(() => {
    if (role !== 'client') {
      const pathname = window.location.pathname;
      if (!pathname.startsWith('/account/')) {
        router.push('/');
      }
    }
  }, [role, router]);

  // Fetch client data when role is client
  useEffect(() => {
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

  // Auto-select all accounts when filter is "all" and accounts are loaded
  useEffect(() => {
    if (activeFilter === 'all' && allAccounts.length > 0) {
      const allAccountIds = new Set(allAccounts.map(acc => acc.accountId));
      // Only update if not all accounts are selected
      if (selectedAccountIds.size !== allAccountIds.size) {
        setSelectedAccountIds(allAccountIds);
      }
    }
  }, [activeFilter, allAccounts, selectedAccountIds.size]);

  // Get selected accounts for display
  const selectedAccounts = useMemo(() => {
    if (selectedAccountIds.size === 0 || selectedAccountIds.size === allAccounts.length) {
      return allAccounts;
    }
    return allAccounts.filter(acc => selectedAccountIds.has(acc.accountId));
  }, [allAccounts, selectedAccountIds]);

  // Get button label based on active filter
  const getDropdownButtonLabel = () => {
    // If filter is "all", show "All accounts"
    if (activeFilter === 'all') {
      return 'All accounts';
    }
    
    // If filter is "household", show "Household accounts"
    if (activeFilter === 'household') {
      return 'Household accounts';
    }
    
    // If filter is "non-household", show "Non-household accounts"
    if (activeFilter === 'non-household') {
      return 'Non-household accounts';
    }
    
    // If filter is "custom", show selection-based label
    if (activeFilter === 'custom') {
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
      return `${selectedAccounts.length} accounts`;
    }
    
    // Fallback
    return 'All accounts';
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

  const handleRefresh = async (e: React.MouseEvent, isHousehold: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (isHousehold) {
      setHouseholdRefreshRotation(prev => prev + 360);
    } else {
      setNonHouseholdRefreshRotation(prev => prev + 360);
    }
    await refreshData();
  };

  const totalPortfolioValue = useMemo(() => {
    // Calculate total from selected accounts only
    return selectedAccounts.reduce((sum, acc) => sum + (acc.balances?.totalValue || 0), 0);
  }, [selectedAccounts]);

  const assetAllocationData = useMemo(() => {
    return calculateAssetAllocation(selectedAccounts);
  }, [selectedAccounts]);

  if (role !== 'client') {
    return null;
  }

  // During SSR, return null to match what Next.js expects (Suspense boundary)
  // After mount, show skeleton if loading
  if (!mounted) {
    return null;
  }

  if (loading) {
    return <ClientDashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection clientName={clientName} />
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px] py-0">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 py-6">
          <div className="flex-1 space-y-6 lg:space-y-8">
            <AccountsSection
              householdGroups={householdGroups}
              nonHouseholdAccounts={nonHouseholdAccounts}
              expandedHouseholds={expandedHouseholds}
              householdRefreshRotation={householdRefreshRotation}
              nonHouseholdRefreshRotation={nonHouseholdRefreshRotation}
              onToggleHousehold={toggleHousehold}
              onAccountClick={handleAccountClick}
              onRefresh={handleRefresh}
              onSeeMoreDetails={() => setIsAccountsSheetOpen(true)}
            />

            <PortfolioDetailsSection
              householdGroups={householdGroups}
              nonHouseholdAccounts={nonHouseholdAccounts}
              selectedAccountIds={selectedAccountIds}
              isAccountDropdownOpen={isAccountDropdownOpen}
              activeFilter={activeFilter}
              assetAllocationData={assetAllocationData}
              totalPortfolioValue={totalPortfolioValue}
              onSetIsAccountDropdownOpen={setIsAccountDropdownOpen}
              onSelectFilter={selectFilter}
              onToggleAccountSelection={toggleAccountSelection}
              getDropdownButtonLabel={getDropdownButtonLabel}
            />
          </div>

          <RightColumnWidgets onAdvisorsClick={() => setIsAdvisorsDrawerOpen(true)} />
        </div>
      </div>

      <AccountsBottomSheet
        isOpen={isAccountsSheetOpen}
        householdGroups={householdGroups}
        nonHouseholdAccounts={nonHouseholdAccounts}
        onClose={() => setIsAccountsSheetOpen(false)}
        onAccountClick={handleAccountClick}
      />

      <AdvisorsDrawer
        isOpen={isAdvisorsDrawerOpen}
        onOpenChange={setIsAdvisorsDrawerOpen}
        accounts={allAccounts}
      />
    </div>
  );
}
