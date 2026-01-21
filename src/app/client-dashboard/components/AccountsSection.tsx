'use client';

import { Card } from '@/components/ui/card';
import { AccountData } from '@/types/account';
import { HouseholdGroup } from './types';
import { formatCurrency } from '@/lib/utils';
import { ChevronUp, ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface AccountsSectionProps {
  householdGroups: HouseholdGroup[];
  nonHouseholdAccounts: AccountData[];
  expandedHouseholds: Set<string>;
  householdRefreshRotation: number;
  nonHouseholdRefreshRotation: number;
  onToggleHousehold: (householdId: string | null) => void;
  onAccountClick: (accountId: string) => void;
  onRefresh: (e: React.MouseEvent, isHousehold: boolean) => void;
  onSeeMoreDetails: () => void;
}

export function AccountsSection({
  householdGroups,
  nonHouseholdAccounts,
  expandedHouseholds,
  householdRefreshRotation,
  nonHouseholdRefreshRotation,
  onToggleHousehold,
  onAccountClick,
  onRefresh,
  onSeeMoreDetails,
}: AccountsSectionProps) {
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
          Accounts
        </h2>
        <button 
          onClick={onSeeMoreDetails}
          className="text-sm font-medium text-primary hover:underline px-1.5 py-0.5 rounded flex-shrink-0"
        >
          <span className="hidden sm:inline">See more details</span>
          <span className="sm:hidden">More</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Household Accounts */}
        {householdGroups.map((group) => {
          const isExpanded = expandedHouseholds.has(group.household?.id || '');
          const householdName = group.household?.name || 'Household';
          const householdSubtitle = group.household?.description || group.accounts
            .map(acc => `${acc.client.firstName} ${acc.client.lastName}`)
            .filter((v, i, a) => a.indexOf(v) === i)
            .join(' & ');

          return (
            <Card key={group.household?.id || 'household'} className="overflow-hidden p-0">
              <div
                className="flex items-center justify-between px-4 sm:px-6 py-4 border-b cursor-pointer hover:bg-muted/50 transition-colors gap-4"
                onClick={() => onToggleHousehold(group.household?.id || null)}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground leading-none">
                    {householdName}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {householdSubtitle}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right hidden sm:block min-w-[120px]">
                    <p className="text-xs text-muted-foreground">Total value</p>
                    <p className="text-sm font-semibold text-foreground leading-none">
                      {formatCurrency(group.totalValue)}
                    </p>
                  </div>
                  <div className="text-right sm:hidden">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-sm font-semibold text-foreground leading-none">
                      {formatCurrency(group.totalValue)}
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-6">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-foreground" />
                    )}
                  </div>
                </div>
              </div>

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
                        className="flex items-center px-4 sm:px-6 py-4 border-b hover:bg-muted/30 cursor-pointer transition-colors gap-4"
                        onClick={() => onAccountClick(account.accountId)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className="text-sm font-medium text-foreground">
                              {getAccountTypeLabel(account.accountType)}
                            </span>
                            {account.isPrimary && (
                              <span 
                                className="px-1.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                                style={{ 
                                  backgroundColor: '#eaeffc',
                                  color: '#2c54c9'
                                }}
                              >
                                Primary
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {account.accountId} • {account.accountName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-sm font-semibold text-foreground text-right hidden sm:block min-w-[100px]">
                            {formatCurrency(account.balances?.totalValue || 0)}
                          </span>
                          <span className="text-sm font-semibold text-foreground text-right sm:hidden">
                            {formatCurrency(account.balances?.totalValue || 0)}
                          </span>
                          <div className="flex-shrink-0 w-6 flex justify-center">
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="px-4 sm:px-6 py-2 border-t flex justify-start items-center">
                      <div className="flex items-center gap-0.5 flex-wrap">
                        <span className="text-xs font-normal text-muted-foreground leading-5">
                          <span className="hidden sm:inline">Updated </span>
                          <span className="sm:hidden">Upd. </span>
                          {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} ET
                        </span>
                        <button
                          type="button"
                          className="w-6 h-6 bg-card rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border flex items-center justify-center hover:bg-muted transition-colors flex-shrink-0"
                          onClick={(e) => onRefresh(e, true)}
                        >
                          <motion.div
                            animate={{ rotate: householdRefreshRotation }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                          >
                            <RefreshCw className="h-4 w-4 text-muted-foreground" />
                          </motion.div>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}

        {/* Non-Household Accounts */}
        {nonHouseholdAccounts.length > 0 && (
          <Card className="overflow-hidden p-0">
            <div
              className="flex items-center justify-between border-b cursor-pointer hover:bg-muted/50 transition-colors px-4 sm:px-6 py-4 gap-4"
              style={{ 
                borderColor: '#ebebeb'
              }}
              onClick={() => onToggleHousehold(null)}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground leading-none">
                  Non-household
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right hidden sm:block min-w-[120px]">
                  <p className="text-xs text-muted-foreground">Total value</p>
                  <p className="text-sm font-semibold text-foreground leading-none">
                    {formatCurrency(
                      nonHouseholdAccounts.reduce((sum, acc) => sum + (acc.balances?.totalValue || 0), 0)
                    )}
                  </p>
                </div>
                <div className="text-right sm:hidden">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-sm font-semibold text-foreground leading-none">
                    {formatCurrency(
                      nonHouseholdAccounts.reduce((sum, acc) => sum + (acc.balances?.totalValue || 0), 0)
                    )}
                  </p>
                </div>
                <div className="flex-shrink-0 w-6">
                  {expandedHouseholds.has('non-household') ? (
                    <ChevronUp className="h-4 w-4 text-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-foreground" />
                  )}
                </div>
              </div>
            </div>

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
                      className="flex items-center px-4 sm:px-6 py-4 border-b hover:bg-muted/30 cursor-pointer transition-colors gap-4"
                      style={{ 
                        borderColor: '#ebebeb',
                        borderLeft: '4px solid #0e00d0'
                      }}
                      onClick={() => onAccountClick(account.accountId)}
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-foreground">
                          Single account
                        </span>
                        <p className="text-sm text-muted-foreground truncate">
                          {account.accountId} • {account.accountName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm font-semibold text-foreground text-right hidden sm:block min-w-[100px]">
                          {formatCurrency(account.balances?.totalValue || 0)}
                        </span>
                        <span className="text-sm font-semibold text-foreground text-right sm:hidden">
                          {formatCurrency(account.balances?.totalValue || 0)}
                        </span>
                        <div className="flex-shrink-0 w-6 flex justify-center">
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="px-4 sm:px-6 py-2 border-t flex justify-between items-center">
                    <div className="flex-1 flex justify-start items-center gap-0.5 flex-wrap">
                      <span className="text-xs font-normal text-muted-foreground leading-5">
                        <span className="hidden sm:inline">Updated </span>
                        <span className="sm:hidden">Upd. </span>
                        {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} ET
                      </span>
                      <button
                        type="button"
                        className="w-6 h-6 bg-card rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border flex items-center justify-center hover:bg-muted transition-colors flex-shrink-0"
                        onClick={(e) => onRefresh(e, false)}
                      >
                        <motion.div
                          animate={{ rotate: nonHouseholdRefreshRotation }}
                          transition={{ duration: 0.5, ease: 'easeInOut' }}
                        >
                          <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        </motion.div>
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
  );
}

