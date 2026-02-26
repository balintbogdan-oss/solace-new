'use client';

import { useState, useEffect } from 'react';
import { useAccountData } from '@/contexts/AccountDataContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { localDataService } from '@/services/localDataService';
import { FullSizePageTitle } from './PageTitle';

interface DynamicPageTitleProps {
  accountId: string;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isOpen: boolean) => void;
}

export function DynamicPageTitle({
  accountId,
  isDropdownOpen,
  setIsDropdownOpen,
}: DynamicPageTitleProps) {
  const { data: accountData, loading, error } = useAccountData();
  const { role } = useUserRole();
  const [clientAccounts, setClientAccounts] = useState<Array<{
    id: string;
    name: string;
    type: string;
    investedValue: string;
    marketValue: string;
    fdicSweep: string;
    availableMargin: string;
  }>>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);

  // Fetch all client accounts for the dropdown
  useEffect(() => {
    const fetchClientAccounts = async () => {
      if (!accountData) return;
      
      try {
        setAccountsLoading(true);
        // Get all accounts for this client
        const clientData = await localDataService.getClientData(accountData.clientId);
        
        if (clientData) {
          const accounts = clientData.accounts.map(acc => ({
            id: acc.accountId,
            name: acc.accountName,
            type: acc.accountType,
            investedValue: acc.balances?.investedValue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "0",
            marketValue: acc.balances?.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "0",
            fdicSweep: "0",
            availableMargin: acc.balances?.buyingPower?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "0",
          }));
          setClientAccounts(accounts);
        }
      } catch (error) {
        console.error('Error fetching client accounts:', error);
        // Fallback to just the current account
        if (accountData) {
          setClientAccounts([{
            id: accountData.accountId,
            name: accountData.accountName,
            type: accountData.accountType,
            investedValue: accountData.balances?.investedValue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "0",
            marketValue: accountData.balances?.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "0",
            fdicSweep: "0",
            availableMargin: accountData.balances?.buyingPower?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "0",
          }]);
        }
      } finally {
        setAccountsLoading(false);
      }
    };

    if (accountData && !loading) {
      fetchClientAccounts();
    }
  }, [accountData, loading]);

  if (loading || accountsLoading) {
    return (
      <div className="flex px-6 items-center gap-2 text-sm h-[54px] bg-card border-b border-gray-200 dark:border-gray-700">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-32 rounded"></div>
      </div>
    );
  }

  if (error || !accountData) {
    return (
      <div className="flex px-6 items-center gap-2 text-sm h-[54px] bg-card border-b border-gray-200 dark:border-gray-700">
        <span className="text-red-500">Error loading account data</span>
      </div>
    );
  }

  // For clients, don't show client name in breadcrumb - only show Home > Account
  // For advisors, show Home > Client Name > Account
  const clientId = role === 'advisor' ? accountData.clientId : undefined;
  const clientName = role === 'advisor' ? `${accountData.client.firstName} ${accountData.client.lastName}` : undefined;
  
  // Use fetched client accounts, or fallback to current account if still loading
  const accountsToShow = clientAccounts.length > 0 ? clientAccounts : [{
    id: accountData.accountId,
    name: accountData.accountName,
    type: accountData.accountType,
    investedValue: accountData.balances?.investedValue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "0",
    marketValue: accountData.balances?.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "0",
    fdicSweep: "0",
    availableMargin: accountData.balances?.buyingPower?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || "0",
  }];

  return (
    <FullSizePageTitle
      title={accountData.accountName}
      clientId={clientId}
      clientName={clientName}
      clientAccounts={accountsToShow}
      accountId={accountId}
      isDropdownOpen={isDropdownOpen}
      setIsDropdownOpen={setIsDropdownOpen}
    />
  );
}
