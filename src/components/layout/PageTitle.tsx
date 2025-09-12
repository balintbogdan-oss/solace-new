'use client'; // Required for useContext

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Check, User, Users, Landmark, Home, ChevronRight, ChevronDown } from 'lucide-react'
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
import { cn } from "@/lib/utils"; // Import cn for conditional classes
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

  const handleOpenChange = (open: boolean) => {
    setIsDropdownOpen?.(open);
  };
  
  // --- Data Structures for Two-Column Layout ---
  const simulatedStructure = useMemo(() => [
    {
      id: 'individual-jim',
      type: 'individual' as const,
      name: "Jim Robinson",
      accountIds: ["1PB10002", "1PB10004"],
      icon: User
    },
    {
      id: 'hh-jim-alexa',
      type: 'household' as const,
      name: "Jim and Alexa Robinson household",
      members: "Jim Robinson, Alexa Robinson",
      accountIds: ["1PB10001", "1PB10003"],
      icon: Users
    },
    {
      id: 'hh-charlie-alexa',
      type: 'household' as const,
      name: "Charlie and Alexa Robinson household",
      members: "Jim Robinson, Alexa Robinson, James Robinson",
      accountIds: ["1PB10008"],
      icon: Users
    },
  ], []);


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
    if (!clientAccounts) return [];

    const createSection = (group: (typeof simulatedStructure)[0]) => ({
      title: group.name.toUpperCase(),
      accounts: clientAccounts.filter(acc => group.accountIds.includes(acc.id)),
      icon: group.type === 'household' ? Users : Landmark,
      summary: null,
    });
    
    const householdSections = simulatedStructure
      .filter(g => g.type === 'household')
      .map(createSection);

    const individualSections = simulatedStructure
      .filter(g => g.type === 'individual')
      .map(createSection);

    const allGroupedAccountIds = new Set(
      simulatedStructure.flatMap(g => g.accountIds)
    );
    const nonHouseholdAccounts = clientAccounts.filter(acc => !allGroupedAccountIds.has(acc.id));
    
    const nonHouseholdSection = {
      title: 'NON-HOUSEHOLD',
      accounts: nonHouseholdAccounts,
      icon: Landmark,
      summary: {
        title: `All ${clientName}'s accounts`,
        count: nonHouseholdAccounts.length,
      },
    };

    return [...householdSections, ...individualSections, nonHouseholdSection].filter(s => s.accounts.length > 0);
  }, [clientAccounts, clientName, simulatedStructure]);


  const showDropdown = !!clientId && !!clientName && clientAccounts.length > 0;
  
  return (
    <div className="flex px-6 items-center gap-2 text-sm h-[54px] bg-card border-b border-gray-200 dark:border-gray-700">
        {/* Home breadcrumb - always show */}
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        
        {/* Client breadcrumb - show if we have client info */}
        {clientId && clientName && (
          <>
            <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Link href={`/clients/${clientId}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              <User className="h-4 w-4" />
              <span>{clientName}</span>
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
                  className="h-auto p-0 hover:bg-transparent"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-600 dark:bg-amber-700 flex items-center justify-center">
                        <Landmark className="h-3 w-3 text-white dark:text-amber-100" />
                      </div>
                      <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-xs font-medium">
                        {accountId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white text-sm font-medium">
                        {(() => {
                          const account = clientAccounts.find(acc => acc.id === accountId);
                          return account?.type ? account.type.charAt(0).toUpperCase() + account.type.slice(1) : 'Individual';
                        })()}
                      </span>
                      <span className="text-gray-400 dark:text-gray-500">•</span>
                      <span className="text-gray-500 dark:text-gray-500 text-sm">{title}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
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
                                  // Handle account selection
                                  console.log('Selected account:', account.id);
                                }}
                               className={cn("cursor-pointer flex flex-col items-start rounded-md p-2", accountId === account.id && "bg-muted")}
                             >
                              <div className="flex w-full justify-between items-center">
                                  <div className="flex flex-col">
                                      <div className="text-sm text-foreground flex items-center gap-1.5 font-semibold">
                                         <span>{account.id}</span>
                                         <span>•</span>
                                         <span>{account.type}</span>
                                      </div>
                                      <span className="font-normal text-sm text-muted-foreground">{account.name}</span>
                                  </div>
                                  {accountId === account.id && (
                                      <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0">
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
            <Link href={`/account/${accountId}`} className="ml-auto text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium">
              View details
            </Link>
          </>
        )}
    </div>
  );
}