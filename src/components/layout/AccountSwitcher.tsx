'use client'; // Required for useContext

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, User, Landmark, Home, ChevronRight, ChevronDown, Building2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Account } from "@/lib/mock-data";
import { cn, formatAccountType, formatCurrency } from "@/lib/utils"; // Import cn for conditional classes and formatAccountType
import { useUserRole } from '@/contexts/UserRoleContext';
import React from 'react'; // Ensure React is imported for Fragment
import { AccountDetailsDrawer } from './AccountDetailsDrawer';


export interface AccountSwitcherProps {
  accountId?: string
  clientId?: string
  clientName?: string
  clientAccounts?: Account[]
  isDropdownOpen?: boolean;
  setIsDropdownOpen?: (isOpen: boolean) => void;
}

export function AccountSwitcher({
  accountId,
  clientId,
  clientName,
  clientAccounts = [],
  isDropdownOpen,
  setIsDropdownOpen,
}: AccountSwitcherProps) {
  const router = useRouter();
  const { role } = useUserRole();
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsDropdownOpen?.(open);
  };
  
  const leftPanelItems = useMemo(() => {
    if (!clientName) return [];
    const clientItem = {
      id: 'client-overview',
      name: clientName,
      subtitle: 'Client & Household',
    };
    return [clientItem];
  }, [clientName]);

  // Group accounts by household - same logic for both advisors and clients
  const rightPanelSections = useMemo(() => {
    if (!clientAccounts || clientAccounts.length === 0) return [];
    
    // Group accounts by household from clientAccounts prop
    const householdsMap = new Map<string, { household: { id: string; name: string }; accounts: Account[] }>();
    const nonHousehold: Account[] = [];
    
    clientAccounts.forEach(account => {
      const accountWithHousehold = account as Account & { householdId?: string; household?: { id: string; name: string } };
      if (accountWithHousehold.householdId && accountWithHousehold.household) {
        const householdId = accountWithHousehold.householdId;
        if (!householdsMap.has(householdId)) {
          householdsMap.set(householdId, {
            household: { id: accountWithHousehold.household.id, name: accountWithHousehold.household.name },
            accounts: []
          });
        }
        householdsMap.get(householdId)!.accounts.push(account);
      } else {
        nonHousehold.push(account);
      }
    });
    
    const sections: Array<{
      title: string;
      accounts: Account[];
      icon: typeof Landmark;
      isHousehold: boolean;
      householdName?: string;
    }> = [];

    // Add household sections
    householdsMap.forEach(group => {
      sections.push({
        title: group.household.name.toUpperCase(),
        accounts: group.accounts,
        icon: Home,
        isHousehold: true,
        householdName: group.household.name,
      });
    });

    // Add non-household section
    if (nonHousehold.length > 0) {
      sections.push({
        title: 'NON-HOUSEHOLD',
        accounts: nonHousehold,
        icon: Building2,
        isHousehold: false,
      });
    }

    return sections;
  }, [clientAccounts]);

  // Show dropdown if we have accounts (for both advisors and clients)
  const showDropdown = clientAccounts.length > 0;
  
  // Helper to get account balance
  const getAccountBalance = (account: Account): string | null => {
    // Check if account has marketValue (string format from mock-data)
    if ('marketValue' in account && account.marketValue) {
      // If it's already formatted as currency string, return as is
      if (typeof account.marketValue === 'string' && account.marketValue.startsWith('$')) {
        return account.marketValue;
      }
      // If it's a number string, parse and format
      const numValue = parseFloat(account.marketValue.toString().replace(/[^0-9.-]/g, ''));
      if (!isNaN(numValue)) {
        return formatCurrency(numValue);
      }
    }
    // Check if account has balances.totalValue (number format from AccountData)
    const accountWithBalances = account as Account & { balances?: { totalValue?: number } };
    if (accountWithBalances.balances?.totalValue !== undefined) {
      return formatCurrency(accountWithBalances.balances.totalValue);
    }
    return null;
  };
  
  // Dropdown content component - different for client vs advisor
  const DropdownContent = () => {
    const currentRole = role; // Capture role before type narrowing
    if (role === 'client') {
      // Client view: single column, no left panel
      return (
        <DropdownMenuContent align="start" sideOffset={8} className="w-[500px] p-0" style={{ zIndex: 9999 }}>
          <div className="space-y-2 overflow-y-auto p-4">
            {rightPanelSections.map((section, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2 pt-2">
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                    <section.icon className="h-4 w-4" />
                  </div>
                  <span className="font-semibold tracking-wider">{section.title}</span>
                </div>
                <div className="flex flex-col gap-1">
                  {section.accounts.map(account => (
                    <DropdownMenuItem
                      key={account.id}
                      onSelect={() => {
                        router.push(`/account/${account.id}`);
                        setIsDropdownOpen?.(false);
                      }}
                      className={cn(
                        "cursor-pointer flex flex-col items-start rounded-md p-2",
                        accountId === account.id && (
                          role === 'client' 
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : "bg-amber-50 dark:bg-amber-900/20"
                        )
                      )}
                    >
                      <div className="flex w-full justify-between items-center gap-2">
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="text-sm text-foreground flex items-center gap-1.5 font-semibold min-w-0">
                            <span className="flex-shrink-0">{account.id}</span>
                            <span className="flex-shrink-0">•</span>
                            <span className="truncate">{formatAccountType(account.type)}</span>
                          </div>
                          <span className="font-normal text-sm text-muted-foreground truncate">{account.name}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getAccountBalance(account) && (
                            <span className="text-sm font-semibold text-foreground text-right whitespace-nowrap">
                              {getAccountBalance(account)}
                            </span>
                          )}
                          {accountId === account.id && (
                            <div className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                              role === 'client'
                                ? "bg-blue-500"
                                : "bg-amber-600 dark:bg-amber-700"
                            )}>
                              <Check className={cn(
                                "h-4 w-4",
                                role === 'client'
                                  ? "text-white"
                                  : "text-white dark:text-amber-100"
                              )} />
                            </div>
                          )}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      );
    } else {
      // Advisor view: two columns with left panel
      return (
        <DropdownMenuContent align="start" sideOffset={8} className="w-[650px] flex p-0" style={{ zIndex: 9999 }}>
          <div className="flex w-full">
            {/* Left Panel */}
            <div className="w-[250px] bg-card p-2 space-y-1 border-r border">
              <div className="px-2 py-2 text-xs text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>CLIENT & HOUSEHOLD</span>
              </div>
              {leftPanelItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => router.push(`/clients/${clientId}`)}
                  className={cn(
                    "w-full text-left rounded-md p-2 flex items-center justify-between transition-colors",
                    "bg-muted/60 hover:bg-muted/80" 
                  )}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                  </div>
                </button>
              ))}
            </div>
            {/* Right Panel */}
            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              {rightPanelSections.map((section, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2 pt-2">
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                      <section.icon className="h-4 w-4" />
                    </div>
                    <span className="font-semibold tracking-wider">{section.title}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {section.accounts.map(account => (
                      <DropdownMenuItem
                        key={account.id}
                        onSelect={() => {
                          router.push(`/account/${account.id}`);
                          setIsDropdownOpen?.(false);
                        }}
                        className={cn(
                          "cursor-pointer flex flex-col items-start rounded-md p-2",
                          accountId === account.id && (
                            currentRole === 'client' 
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : "bg-amber-50 dark:bg-amber-900/20"
                          )
                        )}
                      >
                        <div className="flex w-full justify-between items-center gap-2">
                          <div className="flex flex-col min-w-0 flex-1">
                            <div className="text-sm text-foreground flex items-center gap-1.5 font-semibold min-w-0">
                              <span className="flex-shrink-0">{account.id}</span>
                              <span className="flex-shrink-0">•</span>
                              <span className="truncate">{formatAccountType(account.type)}</span>
                            </div>
                            <span className="font-normal text-sm text-muted-foreground truncate">{account.name}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getAccountBalance(account) && (
                              <span className="text-sm font-semibold text-foreground text-right whitespace-nowrap">
                                {getAccountBalance(account)}
                              </span>
                            )}
                            {accountId === account.id && (
                              <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                                currentRole === 'client'
                                  ? "bg-blue-500"
                                  : "bg-amber-600 dark:bg-amber-700"
                              )}>
                                <Check className={cn(
                                  "h-4 w-4",
                                  currentRole === 'client'
                                    ? "text-white"
                                    : "text-white dark:text-amber-100"
                                )} />
                              </div>
                            )}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      );
    }
  };

  return (
    <div className="flex px-4 lg:px-6 items-center gap-2 text-sm h-[54px] bg-card border-b border-gray-200 dark:border-gray-700 min-w-0 fixed top-[56px] sm:top-[64px] left-0 right-0 z-20" style={{ pointerEvents: 'auto' }}>
      {/* Single DropdownMenu for both mobile and desktop */}
      {accountId && showDropdown && (
        <DropdownMenu open={isDropdownOpen} onOpenChange={handleOpenChange}>
          {/* Mobile Layout */}
          <div className="flex lg:hidden items-center gap-2 w-full min-w-0">
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-1.5 hover:bg-muted/50 dark:hover:bg-muted/30 rounded-md flex-shrink-0 relative z-30"
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  role === 'client' 
                    ? "bg-lime-300 dark:bg-lime-300" 
                    : "bg-amber-600 dark:bg-amber-700"
                )}>
                  <Landmark className={cn(
                    "h-3 w-3",
                    role === 'client'
                      ? "text-black dark:text-black"
                      : "text-white dark:text-amber-100"
                  )} />
                </div>
              </Button>
            </DropdownMenuTrigger>
            
            {/* Account Name and Number - Mobile */}
            {accountId && (
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium text-foreground",
                  role === 'client'
                    ? "bg-lime-50 dark:bg-green-900"
                    : "bg-amber-100 dark:bg-amber-900"
                )}>
                  {accountId}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                  {(() => {
                    const account = clientAccounts.find(acc => acc.id === accountId);
                    return account?.name || formatAccountType(account?.type || 'individual');
                  })()}
                </span>
              </div>
            )}
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center gap-2 min-w-0 flex-1 w-full">
            {/* Home breadcrumb - always show */}
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 flex-shrink-0">
              <Home className="h-4 w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Home</span>
            </Link>
            
            {/* Client breadcrumb - show if we have client info */}
            {clientId && clientName && (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                <Link href={`/clients/${clientId}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 min-w-0 flex-shrink-0">
                  <User className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate whitespace-nowrap">{clientName}</span>
                </Link>
              </>
            )}
            
            <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-0 hover:bg-muted/50 dark:hover:bg-muted/30 rounded-md px-2 py-1 transition-colors relative z-30"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center",
                      role === 'client' 
                        ? "bg-lime-300 dark:bg-lime-300" 
                        : "bg-amber-600 dark:bg-amber-700"
                    )}>
                      <Landmark className={cn(
                        "h-3 w-3",
                        role === 'client'
                          ? "text-black dark:text-black"
                          : "text-white dark:text-amber-100"
                      )} />
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium text-foreground",
                      role === 'client'
                        ? "bg-lime-50 dark:bg-green-900"
                        : "bg-amber-100 dark:bg-amber-900"
                    )}>
                      {accountId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm font-medium flex-shrink-0">
                      {(() => {
                        const account = clientAccounts.find(acc => acc.id === accountId);
                        return account?.type ? formatAccountType(account.type) : 'Individual';
                      })()}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">•</span>
                    <span className="text-gray-500 dark:text-gray-500 text-sm truncate min-w-0">
                      {(() => {
                        const account = clientAccounts.find(acc => acc.id === accountId);
                        return account?.name || '';
                      })()}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            
            {/* View details link - only show on account pages */}
            <button
              onClick={() => setIsDetailsDrawerOpen(true)}
              className="ml-auto text-primary hover:text-primary/80 font-medium"
            >
              View details
            </button>
          </div>
          
          {/* Shared Dropdown Content - rendered once */}
          <DropdownContent />
        </DropdownMenu>
      )}
      
      {/* Account Details Drawer */}
      <AccountDetailsDrawer
        isOpen={isDetailsDrawerOpen}
        onOpenChange={setIsDetailsDrawerOpen}
      />
    </div>
  );
}

