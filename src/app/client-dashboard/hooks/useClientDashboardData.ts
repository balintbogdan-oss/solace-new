import { useState, useCallback } from 'react';
import { AccountData } from '@/types/account';
import { HouseholdGroup } from '../components/types';

export function useClientDashboardData() {
  const [householdGroups, setHouseholdGroups] = useState<HouseholdGroup[]>([]);
  const [nonHouseholdAccounts, setNonHouseholdAccounts] = useState<AccountData[]>([]);
  const [expandedHouseholds, setExpandedHouseholds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState('Michael Johnson');

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

