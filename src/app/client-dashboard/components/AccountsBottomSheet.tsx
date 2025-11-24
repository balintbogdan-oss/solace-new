'use client';

import { AccountData } from '@/types/account';
import { HouseholdGroup } from './types';
import { formatCurrency } from '@/lib/utils';
import { AccountTable } from './AccountTable';
import { X, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccountsBottomSheetProps {
  isOpen: boolean;
  householdGroups: HouseholdGroup[];
  nonHouseholdAccounts: AccountData[];
  onClose: () => void;
  onAccountClick: (accountId: string) => void;
}

export function AccountsBottomSheet({
  isOpen,
  householdGroups,
  nonHouseholdAccounts,
  onClose,
  onAccountClick,
}: AccountsBottomSheetProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/25"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-background border-t border-l-0 border-r-0 border-b-0 rounded-t-2xl z-50 flex flex-col max-h-[90vh] overflow-hidden"
          >
            <div className="flex-1 flex flex-col gap-4 px-6 py-12 overflow-y-auto max-w-[1228px] mx-auto w-full">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex items-center gap-1.5">
                  <h2 className="text-xl font-medium text-foreground leading-8 tracking-[-0.2px]" style={{ fontFamily: 'var(--font-family-headers, "Source Serif 4")' }}>
                    Accounts
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 h-9 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span className="text-sm font-medium text-foreground">Close view</span>
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {householdGroups.map((group) => {
                  const householdName = group.household?.name || 'Household';
                  return (
                    <div key={group.household?.id || 'household'} className="bg-card rounded-2xl shadow-[0px_0px_2px_1px_rgba(0,0,0,0.06)] overflow-hidden">
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

                      <div className="bg-card border-l-4 border-primary relative w-full">
                        <div className="flex gap-0 items-start overflow-hidden w-full">
                          <AccountTable 
                            accounts={group.accounts} 
                            onAccountClick={(accountId) => {
                              onClose();
                              onAccountClick(accountId);
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {nonHouseholdAccounts.length > 0 && (
                  <div className="bg-card rounded-2xl shadow-[0px_0px_2px_1px_rgba(0,0,0,0.06)] overflow-hidden">
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

                    <div className="bg-card border-l-4 border-primary relative w-full">
                      <div className="flex gap-0 items-start overflow-hidden w-full">
                        <AccountTable 
                          accounts={nonHouseholdAccounts} 
                          onAccountClick={(accountId) => {
                            onClose();
                            onAccountClick(accountId);
                          }} 
                        />
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
  );
}

