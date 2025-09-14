'use client'

import { useState, useEffect } from 'react';
import {
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Landmark, Search } from "lucide-react"
// import { Input } from "@/components/ui/input"
import { searchService, SearchResultItem } from '@/services/searchService'
import { formatAccountType } from '@/lib/utils'

// Account interface for display
interface AccountDisplayItem {
  id: string;
  name: string;
  type: string;
  balance: number;
  clientName?: string;
  isHousehold?: boolean;
  householdName?: string;
}

interface AccountSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAccountSelect: (accountId: string) => void;
  // recentAccountIds?: string[];
}

export function AccountSelectionModal({ 
  isOpen, 
  onOpenChange, 
  onAccountSelect
  // recentAccountIds = []
}: AccountSelectionModalProps) {

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [relatedAccounts, setRelatedAccounts] = useState<AccountDisplayItem[]>([]);

  // Convert search results to display format
  const convertToDisplayItems = (items: SearchResultItem[]): AccountDisplayItem[] => {
    return items.map(item => {
      if (item.type === 'account' && 'data' in item) {
        const accountData = item.data as unknown as Record<string, unknown>; // AccountData type
        
        // Extract client name safely
        let clientName: string | undefined;
        if (accountData.client && typeof accountData.client === 'object' && accountData.client !== null) {
          const client = accountData.client as Record<string, unknown>;
          const firstName = (client.firstName as string) || '';
          const lastName = (client.lastName as string) || '';
          if (firstName || lastName) {
            clientName = `${firstName} ${lastName}`.trim();
          }
        }

        // Determine if account is in a household
        const isHousehold = Boolean(accountData.householdId && accountData.householdId !== null);
        const household = accountData.household as Record<string, unknown> | undefined;
        const householdName = household?.name as string || accountData.householdName as string;
        
        return {
          id: (accountData.accountId as string) || (accountData.id as string) || item.id,
          name: (accountData.accountName as string) || (accountData.name as string) || item.name,
          type: formatAccountType(accountData.accountType as string) || 'Individual',
          balance: (accountData.balances as Record<string, unknown>)?.cash as number || 0,
          clientName: clientName,
          isHousehold: isHousehold,
          householdName: householdName
        };
      }
      return {
        id: item.id,
        name: item.name,
        type: 'Account',
        balance: 0,
        isHousehold: false
      };
    });
  };

  // Load related accounts and recent searches on mount
  useEffect(() => {
    const loadRelatedAccounts = async () => {
      try {
        // For now, we'll use recent searches as a proxy for related accounts
        // In a real implementation, this would fetch accounts from the current client's household
        const recent = await searchService.getRecentSearches();
        const accountItems = recent.filter(item => item.type === 'account');
        const displayItems = convertToDisplayItems(accountItems);
        setRelatedAccounts(displayItems);
      } catch (error) {
        console.error('Error loading related accounts:', error);
        setRelatedAccounts([]);
      }
    };

    const loadRecentSearches = async () => {
      try {
        const recent = await searchService.getRecentSearches();
        setRecentSearches(recent);
      } catch (error) {
        console.error('Error loading recent searches:', error);
        setRecentSearches([]);
      }
    };
    
    if (isOpen) {
      loadRelatedAccounts();
      loadRecentSearches();
    }
  }, [isOpen]);

  // Search for accounts when search term changes
  useEffect(() => {
    const searchAccounts = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchService.search(searchTerm);
        const searchItems = searchService.convertToSearchItems(results);
        // Filter to only show accounts
        const accountItems = searchItems.filter(item => item.type === 'account');
        setSearchResults(accountItems);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchTerm.trim()) {
      searchAccounts();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSelect = (accountId: string) => {
    onAccountSelect(accountId);
    onOpenChange(false); // Close modal after selection
  };

  const displayItems = isSearchMode 
    ? (searchTerm ? convertToDisplayItems(searchResults) : convertToDisplayItems(recentSearches.filter(item => item.type === 'account')))
    : relatedAccounts;

  // Group accounts by household status
  const householdAccounts = displayItems.filter(account => account.isHousehold);
  const nonHouseholdAccounts = displayItems.filter(account => !account.isHousehold);

  const showRecentTitle = isSearchMode && !searchTerm && recentSearches.length > 0;
  const showHouseholdTitle = !isSearchMode && householdAccounts.length > 0;
  const showNonHouseholdTitle = !isSearchMode && nonHouseholdAccounts.length > 0;
  
  // Get the primary client name from the first account being displayed
  const primaryClientName = displayItems.length > 0 ? displayItems[0].clientName : null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[60vh] overflow-y-auto bg-white dark:bg-neutral-900 border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {isSearchMode ? "Search All Accounts" : "Select Account"}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                {isSearchMode 
                  ? "Search all accounts in your book of business." 
                  : "Choose from your related accounts or search all accounts."
                }
              </DialogDescription>
            </div>
            {!isSearchMode && (
              <button
                onClick={() => setIsSearchMode(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
              >
                <Search className="h-4 w-4" />
                Search all accounts
              </button>
            )}
          </div>
        </DialogHeader>

        {isSearchMode && (
          <div className="px-0 pt-2 pb-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search accounts by name, ID, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-md pl-10 pr-4 py-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="px-3 pt-2">
              <button
                onClick={() => {
                  setIsSearchMode(false);
                  setSearchTerm('');
                }}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                ← Back to related accounts
              </button>
            </div>
          </div>
        )}
        <div className="space-y-1 py-4">
          {isLoading ? (
            <div className="px-3 py-4 text-center text-sm text-gray-500">
              Searching accounts...
            </div>
          ) : displayItems.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-gray-500">
              {isSearchMode 
                ? (searchTerm ? 'No accounts found' : 'No recent accounts')
                : 'No related accounts found'
              }
            </div>
          ) : (
            <>
              {/* Client Name Header */}
              {primaryClientName && !isSearchMode && (
                <div className="px-3 py-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {primaryClientName}
                  </h2>
                </div>
              )}
              
              {/* Household Accounts Section */}
              {showHouseholdTitle && (
                <h4 className="px-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Household Accounts
                </h4>
              )}
              {householdAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => handleSelect(account.id)}
                  className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors w-full text-left"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Landmark className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {account.id} • {account.type}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {account.name}
                        {account.householdName && (
                          <span className="ml-2 text-blue-600 dark:text-blue-400">
                            • {account.householdName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </button>
              ))}

              {/* Non-Household Accounts Section */}
              {showNonHouseholdTitle && (
                <h4 className="px-3 text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4">
                  Non-Household Accounts
                </h4>
              )}
              {nonHouseholdAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => handleSelect(account.id)}
                  className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors w-full text-left"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Landmark className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {account.id} • {account.type}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {account.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </button>
              ))}

              {/* Recent Searches Section (only in search mode) */}
              {showRecentTitle && (
                <h4 className="px-3 text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4">
                  Recently Viewed
                </h4>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 