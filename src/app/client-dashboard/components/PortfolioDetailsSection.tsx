'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AccountData } from '@/types/account';
import { HouseholdGroup } from './types';
import { formatCurrency } from '@/lib/utils';
import { DonutChart } from '@/components/charts/DonutChart';
import { ChevronDown, Check, Building2, Home } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PortfolioDetailsSectionProps {
  householdGroups: HouseholdGroup[];
  nonHouseholdAccounts: AccountData[];
  selectedAccountIds: Set<string>;
  isAccountDropdownOpen: boolean;
  activeFilter: 'all' | 'household' | 'non-household' | 'custom';
  assetAllocationData: Array<{ name: string; value: number; color: string }>;
  totalPortfolioValue: number;
  onSetIsAccountDropdownOpen: (open: boolean) => void;
  onSelectFilter: (filter: 'all' | 'household' | 'non-household' | 'custom') => void;
  onToggleAccountSelection: (accountId: string) => void;
  getDropdownButtonLabel: () => string;
}

export function PortfolioDetailsSection({
  householdGroups,
  nonHouseholdAccounts,
  selectedAccountIds,
  isAccountDropdownOpen,
  activeFilter,
  assetAllocationData,
  totalPortfolioValue,
  onSetIsAccountDropdownOpen,
  onSelectFilter,
  onToggleAccountSelection,
  getDropdownButtonLabel,
}: PortfolioDetailsSectionProps) {
  const getAccountTypeLabel = (accountType: string) => {
    switch (accountType) {
      case 'joint_jtwros':
        return 'Joint account';
      case 'trust':
        return 'Personal trust';
      case 'individual':
      case 'ira':
        return 'Single account';
      default:
        return 'Account';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg sm:text-xl font-medium text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
          Portfolio details
        </h2>
        <DropdownMenu open={isAccountDropdownOpen} onOpenChange={onSetIsAccountDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant={activeFilter === 'all' ? 'outline' : 'active'}
              size="sm"
              className={`flex items-center gap-2 text-sm flex-shrink-0 ${activeFilter === 'all' ? '!bg-white' : ''}`}
            >
              <span className="hidden sm:inline">{getDropdownButtonLabel()}</span>
              <span className="sm:hidden">Filter</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-[402px] max-w-[402px] z-[100] p-0">
            <div className="border-b px-4 py-[18px]">
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">Filter by</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onSelectFilter('all')}
                    className={`h-7 px-3 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      activeFilter === 'all'
                        ? 'bg-accent border border-primary text-primary'
                        : 'bg-card border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => onSelectFilter('household')}
                    className={`h-7 px-3 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      activeFilter === 'household'
                        ? 'bg-accent border border-primary text-primary'
                        : 'bg-card border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    Household
                  </button>
                  <button
                    onClick={() => onSelectFilter('non-household')}
                    className={`h-7 px-3 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      activeFilter === 'non-household'
                        ? 'bg-accent border border-primary text-primary'
                        : 'bg-card border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    Non-household
                  </button>
                  <button
                    onClick={() => onSelectFilter('custom')}
                    className={`h-7 px-3 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      activeFilter === 'custom'
                        ? 'bg-accent border border-primary text-primary'
                        : 'bg-card border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {householdGroups.map((group) => {
                const householdName = group.household?.name?.toUpperCase() || 'HOUSEHOLD';
                return (
                  <div key={group.household?.id || 'household'} className="px-2 py-0">
                    <div className="flex items-center gap-1.5 px-1 py-1.5">
                      <div className="w-6 h-6 rounded-[13.714px] bg-accent flex items-center justify-center">
                        <Home className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-xs font-medium text-muted-foreground uppercase leading-none">
                        {householdName}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {group.accounts.map((account) => {
                        const isSelected = selectedAccountIds.has(account.accountId);
                        const accountType = getAccountTypeLabel(account.accountType);
                        return (
                          <div
                            key={account.accountId}
                            className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => onToggleAccountSelection(account.accountId)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1 mb-1">
                                <p className="text-sm font-medium text-foreground leading-none">
                                  {accountType}
                                </p>
                                {account.isPrimary && (
                                  <div className="h-5 px-1.5 py-0.5 rounded-full bg-[#eaeffc] flex items-center">
                                    <p className="text-xs font-medium text-[#2c54c9] leading-5">
                                      Primary
                                    </p>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate leading-6">
                                {account.accountId} • {account.accountName}
                              </p>
                            </div>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'bg-primary' : 'bg-card border opacity-0'
                            }`}>
                              {isSelected && (
                                <Check className="h-4 w-4 text-white" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {nonHouseholdAccounts.length > 0 && (
                <div className="px-2 py-0">
                  <div className="flex items-center gap-1.5 px-1 py-1.5">
                    <div className="w-6 h-6 rounded-[13.714px] bg-accent flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground uppercase leading-none">
                      Non-household
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {nonHouseholdAccounts.map((account) => {
                      const isSelected = selectedAccountIds.has(account.accountId);
                      const accountType = getAccountTypeLabel(account.accountType);
                      return (
                        <div
                          key={account.accountId}
                          className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => onToggleAccountSelection(account.accountId)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-1">
                              <p className="text-sm font-medium text-foreground leading-none">
                                {accountType}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground truncate leading-6">
                              {account.accountId} • {account.accountName}
                            </p>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-primary' : 'bg-card border opacity-0'
                          }`}>
                            {isSelected && (
                              <Check className="h-4 w-4 text-white" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="rounded-2xl shadow-[0px_0px_2px_1px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-foreground leading-6">Asset Allocation</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-16">
            <div className="w-[200px] h-[200px] flex-shrink-0 mx-auto sm:mx-0">
              <DonutChart 
                key={Array.from(selectedAccountIds).sort().join(',')}
                data={assetAllocationData} 
                portfolioValue={totalPortfolioValue}
                size="large"
              />
            </div>

            <div className="flex-1 w-full sm:w-auto flex flex-col sm:flex-row items-start overflow-hidden gap-0 sm:gap-0">
              <div className="w-full sm:w-[134px] flex flex-col overflow-hidden">
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

              <div className="flex-1 w-full sm:w-auto flex flex-col overflow-hidden">
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
                      className={`min-w-[85px] px-2 py-2.5 flex items-center justify-between sm:justify-start gap-2 ${
                        index < assetAllocationData.length - 1 ? 'border-b' : ''
                      }`}
                    >
                      <div className="text-sm font-medium text-foreground leading-6 line-clamp-1 sm:text-right">
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
        <div className="px-4 sm:px-6 py-2 border-t flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            <span className="hidden sm:inline">Updated </span>
            <span className="sm:hidden">Upd. </span>
            {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} ET
          </div>
        </div>
      </Card>
    </div>
  );
}

