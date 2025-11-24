'use client'

import {
  ChevronDown,
  ChevronRight,
  Building2,
  User,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import React from 'react'
import { HouseholdDataProvider, useHouseholdData } from '@/contexts/HouseholdDataContext'
import { AccountData } from '@/types/account'

// Household content component that uses the context
function HouseholdContent() {
  const router = useRouter()
  const { data, loading, error } = useHouseholdData()
  
  // State for collapsed sections
  const [isAccountsCollapsed, setIsAccountsCollapsed] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen w-full p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading household data...</div>
        </div>
      </div>
    )
  }

  if (error || !data?.household) {
    return (
      <div className="min-h-screen w-full p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-destructive">Error: {error || 'Household not found'}</div>
        </div>
      </div>
    )
  }

  const household = data.household
  const accounts = data.accounts || []

  // Calculate total portfolio value from all accounts
  const totalPortfolioValue = accounts.reduce((sum, account) => {
    return sum + (account.balances?.totalValue || 0)
  }, 0)

  // Group accounts by client
  const accountsByClient = accounts.reduce((acc, account) => {
    const clientId = account.clientId
    if (!acc[clientId]) {
      acc[clientId] = {
        client: account.client,
        accounts: []
      }
    }
    acc[clientId].accounts.push(account)
    return acc
  }, {} as Record<string, { client: any; accounts: AccountData[] }>) // eslint-disable-line @typescript-eslint/no-explicit-any

  return (
    <div className="min-h-screen w-full p-6">
      <div className='pb-6'>
        <h2 className="text-3xl font-serif">Household Overview</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Household Info */}
        <Card className="lg:col-span-2 space-y-4 rounded-2xl bg-card p-6 border">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <span className="text-muted-foreground text-sm mb-2">Household Name</span>
              <div className="text-xl md:text-3xl font-serif">{household.name}</div>
              {household.description && (
                <div className="text-sm text-muted-foreground">{household.description}</div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Household</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Total Household Value</span>
              <span className="text-sm text-positive">${totalPortfolioValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Number of Accounts</span>
              <span className="text-sm text-positive">{accounts.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Number of Clients</span>
              <span className="text-sm text-positive">{Object.keys(accountsByClient).length}</span>
            </div>
          </div>
        </Card>

        {/* Right Column - Household Details */}
        <div className="lg:col-span-1 rounded-lg bg-card p-6 md:p-6 border">
          <span className="text-muted-foreground text-sm mb-2">Household Details</span>
          
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
            <h3 className="text-2xl font-serif mb-4 col-span-2">{household.name}</h3>

            <div className="flex items-center gap-3 text-muted-foreground">
              <Building2 className="w-5 h-5" />
              <span>Household ID</span>
            </div>
            <span className="text-left font-mono text-xs">{household.id}</span>

            <div className="flex items-center gap-3 text-muted-foreground">
              <span>Created</span>
            </div>
            <span className="text-left">{new Date(household.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Accounts Section */}
      <Card className="w-full mt-4 md:mt-6">
        <div className="space-y-2">
          <div className="bg-white dark:bg-black rounded-md">
            <h2 className="text-2xl font-serif pb-4">Household Accounts</h2>
            <div className="rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="font-regular border-b border-t">
                      <th className="w-10 p-2"></th>
                      <th className="text-left text-muted-foreground p-2">Client</th>
                      <th className="text-left text-muted-foreground p-2">Account</th>
                      <th className="text-right text-muted-foreground p-2">Type</th>
                      <th className="text-right text-muted-foreground p-2">Primary</th>
                      <th className="text-right text-muted-foreground p-2">Market Value</th>
                      <th className="w-4 pr-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(accountsByClient).map(([clientId, { client, accounts: clientAccounts }]) => (
                      <React.Fragment key={clientId}>
                        {/* Client Header Row */}
                        <tr 
                          className="h-16 bg-muted/30 dark:bg-muted/10 cursor-pointer hover:bg-accent dark:hover:bg-accent transition-colors"
                          onClick={() => setIsAccountsCollapsed(prev => !prev)}
                        >
                          <td className="p-2 align-middle"> 
                            <User className="w-5 h-5 text-primary mx-auto" />
                          </td> 
                          <td colSpan={5} className="p-2"> 
                            <h3 className="text-base font-medium">{client.firstName} {client.lastName}</h3>
                          </td>
                          <td className="p-2 pr-2 align-middle"> 
                            <ChevronDown 
                              className={cn(
                                "h-5 w-5 text-muted-foreground transition-transform duration-200",
                                isAccountsCollapsed ? "rotate-180" : ""
                              )} 
                            />
                          </td>
                        </tr>

                        {/* Client Accounts Data Rows */}
                        {!isAccountsCollapsed && clientAccounts.map((account) => (
                          <tr 
                            key={account.accountId}
                            onClick={() => router.push(`/account/${account.accountId}`)}
                            className="hover:bg-accent dark:hover:bg-accent cursor-pointer transition-colors"
                          >
                            <td></td> 
                            <td className="border-t py-2 border-b dark:border-neutral-800"> 
                              <div className="text-sm text-muted-foreground">{client.firstName} {client.lastName}</div>
                            </td>
                            <td className="border-t py-2 text-left border-b dark:border-neutral-800"> 
                              <div className="font-semibold">{account.accountName}</div>
                              <div className="text-sm text-muted-foreground">{account.accountId}</div>
                            </td>
                            <td className="border-t py-2 text-right text-muted-foreground border-b dark:border-neutral-800">
                              {account.accountType}
                            </td>
                            <td className="border-t py-2 text-right border-b dark:border-neutral-800">
                              {account.isPrimary ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                                  Primary
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="border-t py-2 text-right text-muted-foreground pr-4 border-b dark:border-neutral-800">
                              ${(account.balances?.totalValue || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </td>
                            <td className="border-t py-2 pr-2 border-b dark:border-neutral-800">
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div> 
        </div>
      </Card>    
    </div>
  )
}

// Main component that provides the context
export default function HouseholdDetailPage() {
  const params = useParams()
  const householdId = params?.householdId as string

  if (!householdId) {
    return (
      <div className="min-h-screen w-full p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-destructive">Invalid household ID</div>
        </div>
      </div>
    )
  }

  return (
    <HouseholdDataProvider householdId={householdId}>
      <HouseholdContent />
    </HouseholdDataProvider>
  )
}
