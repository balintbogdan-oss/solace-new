'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useClientData } from '@/contexts/ClientDataContext';
import { 
  AccountsSection,
  PortfolioDetailsSection,
} from '@/app/client-dashboard/components';
import { calculateAssetAllocation } from '@/app/client-dashboard/utils/assetAllocation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Calendar, Hash, Building2 } from 'lucide-react';
import { HouseholdGroup } from '@/app/client-dashboard/components/types';

// Hero section for advisor view (regular theme, not blue)
function AdvisorHeroSection({ clientName }: { clientName: string }) {
  return (
    <div className="w-full relative h-20 bg-gradient-to-r from-muted to-muted/50">
      <div className="px-8 h-full relative flex items-center">
        <div>
          <h1 className="text-2xl font-medium text-foreground">
            {clientName}
          </h1>
        </div>
      </div>
    </div>
  );
}

// Profile card component (replaces RightColumnWidgets)
function ProfileCard({ client }: { client: { firstName: string; lastName: string; email?: string; phone?: string; id: string; createdAt: string } }) {
  return (
    <div className="w-full lg:w-[312px]">
      <Card className="p-4 rounded-2xl shadow-[0px_0px_2px_1px_rgba(0,0,0,0.06)]">
        <span className="text-muted-foreground text-sm mb-3 block">Profile</span>
        
        <h3 className="text-xl font-serif mb-4">{client.firstName} {client.lastName}</h3>
        
        <div className="space-y-3">
          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-muted-foreground">Email</span>
              <span className="text-sm text-foreground truncate">{client.email || 'N/A'}</span>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-muted-foreground">Phone</span>
              <span className="text-sm text-foreground">{client.phone || 'N/A'}</span>
            </div>
          </div>

          {/* Client ID */}
          <div className="flex items-center gap-3">
            <Hash className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-muted-foreground">Client ID</span>
              <span className="text-sm text-foreground">{client.id}</span>
            </div>
          </div>

          {/* Created Date */}
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-muted-foreground">Created</span>
              <span className="text-sm text-foreground">{new Date(client.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button variant="outline" className="w-full">
            <Building2 className="w-4 h-4 mr-2" />
            View Household clients
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function AdvisorClientDashboardPage() {
  const router = useRouter();
  const { data, loading, error } = useClientData();
  
  const [expandedHouseholds, setExpandedHouseholds] = useState<Set<string>>(new Set());
  const [selectedAccountIds, setSelectedAccountIds] = useState<Set<string>>(new Set());
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'household' | 'non-household' | 'custom'>('all');
  const [householdRefreshRotation, setHouseholdRefreshRotation] = useState(0);
  const [nonHouseholdRefreshRotation, setNonHouseholdRefreshRotation] = useState(0);

  // Group accounts by household
  const householdGroups = useMemo(() => {
    if (!data?.accounts) return [];
    
    const householdsMap = new Map<string, HouseholdGroup>();
    const accounts = data.accounts;
    
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
      }
    });

    return Array.from(householdsMap.values());
  }, [data?.accounts]);

  const nonHouseholdAccounts = useMemo(() => {
    if (!data?.accounts) return [];
    return data.accounts.filter(acc => !acc.householdId);
  }, [data?.accounts]);

  // Expand all households by default
  useEffect(() => {
    const allHouseholdIds = new Set(householdGroups.map(g => g.household?.id).filter(Boolean) as string[]);
    if (nonHouseholdAccounts.length > 0) {
      allHouseholdIds.add('non-household');
    }
    setExpandedHouseholds(allHouseholdIds);
  }, [householdGroups, nonHouseholdAccounts]);

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

  // Calculate asset allocation
  const assetAllocationData = useMemo(() => {
    return calculateAssetAllocation(selectedAccounts);
  }, [selectedAccounts]);

  // Calculate total portfolio value
  const totalPortfolioValue = useMemo(() => {
    return selectedAccounts.reduce((sum, account) => {
      return sum + (account.balances?.totalValue || 0);
    }, 0);
  }, [selectedAccounts]);

  // Get button label based on active filter
  const getDropdownButtonLabel = () => {
    if (activeFilter === 'all') {
      return 'All accounts';
    }
    if (activeFilter === 'household') {
      return 'Household accounts';
    }
    if (activeFilter === 'non-household') {
      return 'Non-household accounts';
    }
    return `${selectedAccountIds.size} selected`;
  };

  const handleRefresh = (e: React.MouseEvent, isHousehold: boolean) => {
    e.stopPropagation();
    if (isHousehold) {
      setHouseholdRefreshRotation(prev => prev + 360);
    } else {
      setNonHouseholdRefreshRotation(prev => prev + 360);
    }
    // TODO: Implement actual refresh logic
  };

  const handleSeeMoreDetails = () => {
    // TODO: Implement see more details
  };

  const handleToggleAccountSelection = (accountId: string) => {
    setSelectedAccountIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(accountId)) {
        newSet.delete(accountId);
      } else {
        newSet.add(accountId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading client data...</div>
        </div>
      </div>
    );
  }

  if (error || !data?.client) {
    return (
      <div className="min-h-screen w-full p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-destructive">Error: {error || 'Client not found'}</div>
        </div>
      </div>
    );
  }

  const client = data.client;
  const clientName = `${client.firstName} ${client.lastName}`;

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Hero Section */}
      <AdvisorHeroSection clientName={clientName} />

      {/* Main Content */}
      <div className="px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Column - Accounts and Portfolio */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Accounts Section */}
            <AccountsSection
              householdGroups={householdGroups}
              nonHouseholdAccounts={nonHouseholdAccounts}
              expandedHouseholds={expandedHouseholds}
              householdRefreshRotation={householdRefreshRotation}
              nonHouseholdRefreshRotation={nonHouseholdRefreshRotation}
              onToggleHousehold={toggleHousehold}
              onAccountClick={handleAccountClick}
              onRefresh={handleRefresh}
              onSeeMoreDetails={handleSeeMoreDetails}
            />

            {/* Portfolio Details Section */}
            <PortfolioDetailsSection
              householdGroups={householdGroups}
              nonHouseholdAccounts={nonHouseholdAccounts}
              selectedAccountIds={selectedAccountIds}
              isAccountDropdownOpen={isAccountDropdownOpen}
              activeFilter={activeFilter}
              assetAllocationData={assetAllocationData}
              totalPortfolioValue={totalPortfolioValue}
              onSetIsAccountDropdownOpen={setIsAccountDropdownOpen}
              onSelectFilter={setActiveFilter}
              onToggleAccountSelection={handleToggleAccountSelection}
              getDropdownButtonLabel={getDropdownButtonLabel}
            />
          </div>

          {/* Right Column - Profile Card */}
          <ProfileCard client={client} />
        </div>
      </div>
    </div>
  );
}
