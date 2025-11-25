'use client'; // Required for useContext

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Check, User, Landmark, Home, ChevronRight, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Account } from "@/lib/mock-data";
import { usePageHeaderContext } from '@/contexts/PageHeaderContext'; // Import the context hook
import { cn, formatAccountType } from "@/lib/utils"; // Import cn for conditional classes and formatAccountType
import { useUserRole } from '@/contexts/UserRoleContext';
import React from 'react'; // Ensure React is imported for Fragment


export interface PageTitleProps {
  title: string
  clientId?: string
  clientName?: string
  clientAccounts?: Account[]
  accountId?: string
  isDropdownOpen?: boolean;
  setIsDropdownOpen?: (isOpen: boolean) => void;
}

export function PageTitle({
  title,
}: PageTitleProps) {
  const { } = usePageHeaderContext(); // Consume the context




  // --- Start: JSX Rendering Logic for original PageTitle --- 
  return (
    <div>
      {/* This is the original PageTitle component, which can now be simplified or just show the title */}
      <h1 className="text-sm font-semibold">{title}</h1>
    </div>
  );
}

// --- NEW FullSizePageTitle with Two-Column Dropdown ---
export function FullSizePageTitle({
  title,
  clientId,
  clientName,
  clientAccounts = [],
  accountId,
  isDropdownOpen,
  setIsDropdownOpen,
}: PageTitleProps) {
  const router = useRouter();
  const { role } = useUserRole();

  const handleOpenChange = (open: boolean) => {
    setIsDropdownOpen?.(open);
  };
  
  // --- Data Structures for Two-Column Layout ---
  // const simulatedStructure = useMemo(() => [
  //   {
  //     id: 'individual-jim',
  //     type: 'individual' as const,
  //     name: "Michael Johnson",
  //     accountIds: ["1PB10002", "1PB10004"],
  //     icon: User
  //   },
  //   {
  //     id: 'hh-jim-alexa',
  //     type: 'household' as const,
  //     name: "Jim and Alexa Robinson household",
  //     members: "Michael Johnson, Alexa Johnson",
  //     accountIds: ["1PB10001", "1PB10003"],
  //     icon: Users
  //   },
  //   {
  //     id: 'hh-charlie-alexa',
  //     type: 'household' as const,
  //     name: "Charlie and Alexa Robinson household",
  //     members: "Michael Johnson, Alexa Johnson, James Johnson",
  //     accountIds: ["1PB10008"],
  //     icon: Users
  //   },
  // ], []);


  const leftPanelItems = useMemo(() => {
    if (!clientName) return [];
    const clientItem = {
      id: 'client-overview',
      name: clientName,
      subtitle: 'Client & Household',
    };
    return [clientItem];
  }, [clientName]);

  const rightPanelSections = useMemo(() => {
    if (!clientAccounts || clientAccounts.length === 0) return [];
    
    // Show all accounts in a single section
    const allAccountsSection = {
      title: 'ACCOUNTS',
      accounts: clientAccounts,
      icon: Landmark,
      summary: {
        title: clientName ? `All ${clientName}'s accounts` : 'All accounts',
        count: clientAccounts.length,
      },
    };

    return [allAccountsSection];
  }, [clientAccounts, clientName]);


  // Show dropdown if we have accounts (for both advisors and clients)
  const showDropdown = clientAccounts.length > 0;
  
  return (
    <div className="flex px-6 items-center gap-2 text-sm h-[54px] bg-card border-b border-gray-200 dark:border-gray-700 min-w-0">
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
        
        {/* Account info with dropdown - only show if we're on an account page */}
        {accountId && showDropdown && (
          <>
            <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <DropdownMenu open={isDropdownOpen} onOpenChange={handleOpenChange}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto p-0 hover:bg-muted/50 dark:hover:bg-muted/30 rounded-md px-2 py-1 transition-colors"
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
                      <span className="text-gray-500 dark:text-gray-500 text-sm truncate min-w-0">{title}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[650px] flex p-0" style={{ zIndex: 51 }}>
                <div className="flex w-full">
                  {/* Left Panel */}
                  <div className="w-[250px] bg-stone-50 dark:bg-stone-900/80 p-2 space-y-1 border-r border-stone-200 dark:border-stone-800">
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
                          "bg-stone-200/60 dark:bg-stone-800/80" 
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
                  <div className="flex-1 space-y-2 overflow-y-auto pr-2 pl-1 py-2">
                    {rightPanelSections.map((section, idx) => (
                      <div key={idx}>
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2 px-2 pt-2">
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                            <section.icon className="h-4 w-4" />
                          </div>
                          <span className="font-semibold tracking-wider">{section.title}</span>
                        </div>
                        {section.summary && (
                          <div className="px-3 pb-2">
                             <h4 className="font-semibold text-foreground">{section.summary.title}</h4>
                             <p className="text-sm text-muted-foreground">{section.summary.count} accounts</p>
                          </div>
                        )}
                        <div className="flex flex-col gap-1">
                          {section.accounts.map(account => (
                             <DropdownMenuItem
                               key={account.id}
                                onSelect={() => {
                                  // Navigate to the selected account
                                  router.push(`/account/${account.id}`);
                                  setIsDropdownOpen?.(false);
                                }}
                               className={cn("cursor-pointer flex flex-col items-start rounded-md p-2", accountId === account.id && "bg-muted")}
                             >
                              <div className="flex w-full justify-between items-center">
                                  <div className="flex flex-col min-w-0 flex-1">
                                      <div className="text-sm text-foreground flex items-center gap-1.5 font-semibold min-w-0">
                                         <span className="flex-shrink-0">{account.id}</span>
                                         <span className="flex-shrink-0">•</span>
                                         <span className="truncate">{formatAccountType(account.type)}</span>
                                      </div>
                                      <span className="font-normal text-sm text-muted-foreground truncate">{account.name}</span>
                                  </div>
                                  {accountId === account.id && (
                                      <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 ml-2">
                                         <Check className="h-4 w-4 text-amber-800" />
                                      </div>
                                  )}
                              </div>
                             </DropdownMenuItem>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* View details link - only show on account pages */}
            <Link href={`/account/${accountId}`} className="ml-auto text-primary hover:text-primary/80 font-medium">
              View details
            </Link>
          </>
        )}
    </div>
  );
}