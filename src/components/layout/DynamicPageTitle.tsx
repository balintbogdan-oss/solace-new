'use client';

import { useAccountData } from '@/contexts/SupabaseAccountDataContext';
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

  if (loading) {
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

  // For now, we'll use a simplified structure since we only have one client
  // In the future, this would be expanded to handle multiple clients
  const clientId = accountData.clientId;
  const clientName = `${accountData.client.firstName} ${accountData.client.lastName}`;
  
  // Create a mock client accounts array for the dropdown
  // In a real app, this would come from a clients context or API
  const clientAccounts = [
    {
      id: accountData.accountId,
      name: accountData.accountName,
      type: accountData.accountType,
      investedValue: "0",
      marketValue: "0",
      fdicSweep: "0",
      availableMargin: "0",
    }
  ];

  return (
    <FullSizePageTitle
      title={accountData.accountName}
      clientId={clientId}
      clientName={clientName}
      clientAccounts={clientAccounts}
      accountId={accountId}
      isDropdownOpen={isDropdownOpen}
      setIsDropdownOpen={setIsDropdownOpen}
    />
  );
}
