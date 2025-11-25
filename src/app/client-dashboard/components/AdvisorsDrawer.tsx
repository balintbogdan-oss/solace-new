'use client';

import { X, Mail, Phone, MapPin, Building, ChevronDown } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AccountData } from '@/types/account';
import { formatCurrency } from '@/lib/utils';

interface AdvisorsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  accounts?: AccountData[];
}

interface AdvisorInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  avatarInitial: string;
}

const advisorsInfo: AdvisorInfo[] = [
  {
    id: 'samantha',
    firstName: 'Samantha',
    lastName: 'Clement',
    email: 'samanthaclement@wedbush.com',
    phone: '(229) 555-0109',
    location: 'Chicago, IL',
    avatarInitial: 'S',
  },
  {
    id: 'raymond',
    firstName: 'Raymond',
    lastName: 'Clinton',
    email: 'raymondclinton@wedbush.com',
    phone: '(229) 555-0109',
    location: 'New York, NY',
    avatarInitial: 'R',
  },
];

// Helper function to get account type label - matches AccountsSection
const getAccountTypeLabel = (accountType: string): string => {
  switch (accountType) {
    case 'joint_jtwros':
      return 'Joint account';
    case 'trust':
    case 'revocable_trust':
    case 'irrevocable_trust':
    case 'testamentary_trust':
      return 'Personal trust';
    case 'individual':
    case 'ira':
    case 'single_account':
      return 'Single account';
    default:
      return 'Account';
  }
};

// Map accounts to advisors - you can customize this logic
// For now, we'll distribute accounts between advisors
const mapAccountsToAdvisors = (accounts: AccountData[]): Map<string, AccountData[]> => {
  const advisorAccounts = new Map<string, AccountData[]>();
  
  // Initialize advisors
  advisorsInfo.forEach(advisor => {
    advisorAccounts.set(advisor.id, []);
  });
  
  // Distribute accounts - for now, split evenly or by some logic
  // You can customize this based on your business logic
  accounts.forEach((account, index) => {
    // Simple distribution: first half to Samantha, second half to Raymond
    // Or you could use account type, account name patterns, etc.
    const advisorId = index < Math.ceil(accounts.length / 2) ? 'samantha' : 'raymond';
    advisorAccounts.get(advisorId)?.push(account);
  });
  
  return advisorAccounts;
};

export function AdvisorsDrawer({ isOpen, onOpenChange, accounts = [] }: AdvisorsDrawerProps) {
  const [expandedAdvisors, setExpandedAdvisors] = useState<Set<string>>(new Set());
  
  // Map accounts to advisors
  const advisorAccountsMap = useMemo(() => {
    return mapAccountsToAdvisors(accounts);
  }, [accounts]);
  
  const toggleAdvisorAccounts = (advisorId: string) => {
    setExpandedAdvisors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(advisorId)) {
        newSet.delete(advisorId);
      } else {
        newSet.add(advisorId);
      }
      return newSet;
    });
  };

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="h-full w-[512px] max-w-[512px] min-w-[512px] flex flex-col bg-card shadow-xl overflow-hidden [&[data-vaul-drawer-direction=right]]:!w-[512px] [&[data-vaul-drawer-direction=right]]:!max-w-[512px]">
        <div className="px-8 py-8 flex flex-col gap-8 overflow-y-auto">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1.5">
              <DrawerTitle className="text-xl font-medium text-foreground">Contact your advisors</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-9 h-9 p-0.5 bg-card rounded-lg border flex justify-center items-center hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </DrawerClose>
          </div>

          <div className="flex-1 flex flex-col gap-8">
            <div className="flex flex-col gap-8">
              {advisorsInfo.map((advisor, index) => {
                const advisorAccounts = advisorAccountsMap.get(advisor.id) || [];
                const isExpanded = expandedAdvisors.has(advisor.id);
                const isLast = index === advisorsInfo.length - 1;
                const isManagingAccounts = advisorAccounts.length > 0;
                
                return (
                  <div key={advisor.id}>
                    <div className="flex gap-6 items-start">
                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-800 flex items-center justify-center">
                            <span className={`text-card ${advisor.avatarInitial === 'R' ? 'text-lg' : 'text-sm'} font-semibold`}>
                              {advisor.avatarInitial}
                            </span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 rounded-lg shadow-sm flex items-center">
                            <div className="w-2 h-2 bg-card rounded-full" />
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="text-center text-sm font-normal text-foreground">
                            {advisor.firstName}<br/>{advisor.lastName}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col gap-3 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-4 h-4 text-foreground flex-shrink-0" />
                          <a href={`mailto:${advisor.email}`} className="text-sm font-medium text-primary hover:underline truncate">
                            {advisor.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-foreground flex-shrink-0" />
                          <span className="text-sm text-foreground">{advisor.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-foreground flex-shrink-0" />
                          <span className="text-sm text-foreground">{advisor.location}</span>
                        </div>
                        {isManagingAccounts && (
                          <div className="flex items-center justify-between gap-4 min-w-0">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Building className="w-4 h-4 text-foreground flex-shrink-0" />
                              <span className="text-sm text-foreground whitespace-nowrap">
                                Managing {advisorAccounts.length} {advisorAccounts.length === 1 ? 'account' : 'accounts'}
                              </span>
                            </div>
                            <button 
                              onClick={() => toggleAdvisorAccounts(advisor.id)}
                              className="h-9 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-muted transition-colors flex-shrink-0 whitespace-nowrap"
                            >
                              <span className="text-sm font-medium text-primary whitespace-nowrap">
                                {isExpanded ? 'Hide details' : 'Show details'}
                              </span>
                              <ChevronDown className={`w-4 h-4 text-primary transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Accounts List */}
                    {isManagingAccounts && (
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 bg-muted rounded-2xl flex flex-col overflow-hidden">
                              <div className="flex flex-col overflow-hidden">
                                <div className="p-2 border-b flex items-center gap-2">
                                  <div className="flex-1 text-center text-xs font-medium text-muted-foreground">Accounts</div>
                                  <div className="flex-1 text-right text-xs font-medium text-muted-foreground">Total account value</div>
                                </div>

                                {advisorAccounts.map((account, accountIndex) => {
                                  const isLastAccount = accountIndex === advisorAccounts.length - 1;
                                  const accountTypeLabel = getAccountTypeLabel(account.accountType);
                                  const accountValue = formatCurrency(account.balances?.totalValue || 0);
                                  return (
                                    <div key={account.accountId} className={!isLastAccount ? 'border-b' : ''}>
                                      <div className="p-2 flex items-start gap-4">
                                        <div className="w-8 h-8 p-2 bg-chart-1 rounded-2xl flex items-center justify-center">
                                          <Building className="w-4 h-4 text-foreground" />
                                        </div>
                                        <div className="flex-1 flex flex-col gap-2 min-w-0">
                                          <div className="text-sm font-medium text-foreground">{accountTypeLabel}</div>
                                          <div className="text-sm text-muted-foreground truncate">
                                            {account.accountId} • {account.accountName}
                                          </div>
                                        </div>
                                        <div className="flex-1 max-w-40 flex flex-col items-end justify-center">
                                          <div className="text-sm font-medium text-foreground truncate">{accountValue}</div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}

                    {!isLast && <div className="h-px border-t border" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

