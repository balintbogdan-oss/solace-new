import { useState, useCallback } from 'react';
import { AccountData } from '@/types/account';
import { HouseholdGroup } from '../components/types';

// Global cache for client dashboard data
const clientDashboardCache: {
  data: {
    householdGroups: HouseholdGroup[];
    nonHouseholdAccounts: AccountData[];
    clientName: string;
  } | null;
  timestamp: number;
} = { data: null, timestamp: 0 };
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useClientDashboardData() {
  const [householdGroups, setHouseholdGroups] = useState<HouseholdGroup[]>(() => {
    // Initialize with cached data if available
    if (clientDashboardCache.data && Date.now() - clientDashboardCache.timestamp < CACHE_DURATION) {
      return clientDashboardCache.data.householdGroups;
    }
    return [];
  });
  const [nonHouseholdAccounts, setNonHouseholdAccounts] = useState<AccountData[]>(() => {
    // Initialize with cached data if available
    if (clientDashboardCache.data && Date.now() - clientDashboardCache.timestamp < CACHE_DURATION) {
      return clientDashboardCache.data.nonHouseholdAccounts;
    }
    return [];
  });
  const [expandedHouseholds, setExpandedHouseholds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(() => {
    // If we have cached data, don't show loading
    return !(clientDashboardCache.data && Date.now() - clientDashboardCache.timestamp < CACHE_DURATION);
  });
  const [clientName, setClientName] = useState(() => {
    // Initialize with cached data if available
    if (clientDashboardCache.data && Date.now() - clientDashboardCache.timestamp < CACHE_DURATION) {
      return clientDashboardCache.data.clientName;
    }
    return 'Michael Johnson';
  });

  const fetchClientDataInternal = useCallback(async () => {
    try {
      const response = await fetch('/api/client-dashboard?clientId=client-1');
      if (!response.ok) {
        throw new Error('Failed to fetch client data');
      }
      const data = await response.json();
      
      const newClientName = `${data.client.firstName} ${data.client.lastName}`;
      
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
      
      // Cache the data
      clientDashboardCache.data = {
        householdGroups: groups,
        nonHouseholdAccounts: nonHousehold,
        clientName: newClientName
      };
      clientDashboardCache.timestamp = Date.now();
      
      setHouseholdGroups(groups);
      setNonHouseholdAccounts(nonHousehold);
      setClientName(newClientName);
      
      // Expand all households by default
      const allHouseholdIds = new Set(groups.map(g => g.household?.id).filter(Boolean) as string[]);
      if (nonHousehold.length > 0) {
        allHouseholdIds.add('non-household');
      }
      setExpandedHouseholds(allHouseholdIds);
    } catch (error) {
      console.error('Error fetching client data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClientData = useCallback(async () => {
    try {
      // Check cache first - if we have cached data, show it immediately
      if (clientDashboardCache.data && Date.now() - clientDashboardCache.timestamp < CACHE_DURATION) {
        setHouseholdGroups(clientDashboardCache.data.householdGroups);
        setNonHouseholdAccounts(clientDashboardCache.data.nonHouseholdAccounts);
        setClientName(clientDashboardCache.data.clientName);
        setLoading(false);
        
        // Expand all households by default
        const allHouseholdIds = new Set(clientDashboardCache.data.householdGroups.map(g => g.household?.id).filter(Boolean) as string[]);
        if (clientDashboardCache.data.nonHouseholdAccounts.length > 0) {
          allHouseholdIds.add('non-household');
        }
        setExpandedHouseholds(allHouseholdIds);
        
        // Refresh in background (non-blocking)
        setTimeout(() => {
          fetchClientDataInternal();
        }, 0);
        return;
      }
      
      // No cache - fetch data
      setLoading(true);
      await fetchClientDataInternal();
    } catch (error) {
      console.error('Error fetching client data:', error);
      setLoading(false);
    }
  }, [fetchClientDataInternal]);

  const refreshData = useCallback(async () => {
    try {
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
      console.error('Error refreshing client data:', error);
    }
  }, []);

  return {
    householdGroups,
    nonHouseholdAccounts,
    expandedHouseholds,
    setExpandedHouseholds,
    loading,
    clientName,
    fetchClientData,
    refreshData,
  };
}

