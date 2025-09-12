'use client'

import { useState, useMemo, useEffect } from 'react'
import { MOCK_CLIENT, MOCK_CLIENTS } from '@/lib/mock-data'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Link from 'next/link'
import { X } from 'lucide-react'
import { Card } from '@/components/ui/card';

interface Client {
  id: string;
  name: string;
  email: string;
  lastContact: string;
}

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');

  // --- Filter States ---
  const [accountValueFilter, setAccountValueFilter] = useState('all');
  const [accountTypeFilter, setAccountTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastContactFilter, setLastContactFilter] = useState('all');
  const [holdingSymbolFilter, setHoldingSymbolFilter] = useState('');

  // --- Calculate Summary Card Data ---
  const totalClients = MOCK_CLIENTS.length;
  const totalAumPlaceholder = 25650120.75; // Placeholder value
  const avgAumPerClient = totalClients > 0 ? totalAumPlaceholder / totalClients : 0;

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const clientsNeedingContact = MOCK_CLIENTS.filter(
    client => new Date(client.lastContact) < ninetyDaysAgo
  ).length;

  const filteredClients = useMemo(() => {
    return MOCK_CLIENTS
      .filter((client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
        true // Keep all clients for now regardless of filter selection
      )
      .sort((a, b) => {
        switch (sortOption) {
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'last-contact-newest':
            return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime();
          case 'last-contact-oldest':
            return new Date(a.lastContact).getTime() - new Date(b.lastContact).getTime();
          case 'email':
            return a.email.localeCompare(b.email);
          case 'accounts':
            return (MOCK_CLIENT.accounts.length || 0) - (MOCK_CLIENT.accounts.length || 0); // placeholder
          default:
            return 0;
        }
      });
  }, [ 
       searchQuery, 
       sortOption 
       // Removed unused filter states from dependencies
     ]);

  // Lock body scroll when bottom sheet is open on mobile
  useEffect(() => {
    if (selectedClient && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedClient]);

  return (
    <div className="min-h-screen py-2">
      <h1 className="text-3xl font-serif mb-4">Clients</h1>
      <section>
        <h2 className="text-lg font-medium mb-4">All clients</h2>
      </section>

      {/* --- Summary Cards Section --- */}
     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Clients Card */}
        <div className="border bg-card-blend dark:bg-card-blend-dark rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Clients</div>
          <div className="text-2xl font-serif">{totalClients}</div>
        </div>
        {/* Total AUM Card */}
        <div className="border bg-card-blend dark:bg-card-blend-dark rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Total AUM</div>
          <div className="text-2xl font-serif">
            {totalAumPlaceholder.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        </div>
        {/* Avg. AUM per Client Card */}
        <div className="border bg-card-blend dark:bg-card-blend-dark  rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Avg. AUM / Client</div>
          <div className="text-2xl font-serif">
            {avgAumPerClient.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        </div>
        {/* Clients Needing Contact Card */}
        <div className="border bg-card-blend dark:bg-card-blend-dark rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Needs Contact (&gt;90d)</div>
          <div className="text-2xl font-serif">{clientsNeedingContact}</div>
        </div>
      </div>
      
      {/* --- End Summary Cards Section --- */}


      <div className="flex flex-col gap-4">
        <Card>
        <div className={cn(
          "rounded-md transition-all",
          selectedClient ? "sm:w-1/2" : "w-full"
        )}>
          {/* --- Filters Section --- */}
          <div className="flex flex-wrap items-center gap-3 mb-4 rounded-md">
            {/* Search Input - Moved first */}
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 border border-input bg-card-blend dark:bg-card-blend-dark px-3 py-2 rounded-md text-sm"
            />
            {/* Account Value Filter */}
            <select 
              id="account-value"
              value={accountValueFilter}
              onChange={(e) => setAccountValueFilter(e.target.value)}
              className="border bg-background rounded-md px-2 py-2 text-sm"
            >
              <option value="all">Acct Value (All)</option>
              <option value="lt100k">Under $100k</option>
              <option value="100k-500k">$100k - $500k</option>
              <option value="500k-1m">$500k - $1M</option>
              <option value="gt1m">Over $1M</option>
            </select>
            {/* Account Type Filter */}
            <select 
              id="account-type"
              value={accountTypeFilter}
              onChange={(e) => setAccountTypeFilter(e.target.value)}
              className="border bg-background rounded-md px-2 py-2 text-sm"
            >
              <option value="all">Acct Type (All)</option>
              <option value="brokerage">Brokerage</option>
              <option value="ira">IRA</option>
              <option value="401k">401k</option>
              <option value="trust">Trust</option>
              {/* Add other types */} 
            </select>
            {/* Client Status Filter */}
            <select 
              id="client-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border bg-background rounded-md px-2 py-2 text-sm"
            >
              <option value="all">Status (All)</option>
              <option value="active">Active</option>
              <option value="prospect">Prospect</option>
              <option value="lead">Lead</option>
              <option value="inactive">Inactive</option>
            </select>
            {/* Last Contact Filter */}
            <select 
              id="last-contact"
              value={lastContactFilter}
              onChange={(e) => setLastContactFilter(e.target.value)}
              className="border  bg-background rounded-md px-2 py-2 text-sm"
            >
              <option value="all">Last Contact (Any)</option>
              <option value="30d">Within 30 Days</option>
              <option value="90d">Within 90 Days</option>
              <option value="1y">Within 1 Year</option>
              <option value="gt1y">Over 1 Year Ago</option>
            </select>
            {/* Holding Symbol Filter */}
            <input 
              id="holding-symbol"
              type="text"
              value={holdingSymbolFilter}
              onChange={(e) => setHoldingSymbolFilter(e.target.value.toUpperCase())}
              placeholder="Holding Symbol (e.g., AAPL)"
              className="border  bg-background rounded-md px-2 py-2 text-sm"
            />
          </div>
          {/* --- End Filters Section --- */}

          {/* Desktop Table View */}
          <div className="hidden sm:block rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    onClick={() => setSortOption(sortOption === 'name-asc' ? 'name-desc' : 'name-asc')}
                    className="cursor-pointer"
                  >
                    Name {sortOption.includes('name') && (sortOption === 'name-asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead
                    onClick={() => setSortOption('email')}
                    className="cursor-pointer"
                  >
                    Email
                  </TableHead>
                  <TableHead
                    onClick={() => setSortOption('accounts')}
                    className="cursor-pointer"
                  >
                    Accounts
                  </TableHead>
                  <TableHead
                    onClick={() =>
                      setSortOption(
                        sortOption === 'last-contact-newest'
                          ? 'last-contact-oldest'
                          : 'last-contact-newest'
                      )
                    }
                    className="cursor-pointer"
                  >
                    Last Contact {sortOption.includes('last-contact') && (sortOption === 'last-contact-newest' ? '▲' : '▼')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={cn(
                      "cursor-pointer transition-colors",
                      selectedClient?.id === client.id
                        ? "hover:bg-black/10 dark:hover:bg-white/10"
                        : "hover:bg-black/10 dark:hover:bg-white/10"
                    )}
                  >
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{MOCK_CLIENT.accounts.length}</TableCell>
                    <TableCell>{client.lastContact}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-2">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className={cn(
                  "cursor-pointer transition-colors p-4 rounded-lg border ",
                  selectedClient?.id === client.id
                    ? "border-blue-500 dark:border-blue-400"
                    : "hover:bg-black/10 dark:hover:bg-white/10 bg-card-blend dark:bg-card-blend-dark"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">{client.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{MOCK_CLIENT.accounts.length} accounts</div>
                  
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </Card>
        {selectedClient && (
          <div className={cn(
            "relative",
            // Mobile bottom sheet
            "sm:hidden fixed bottom-0 left-0 right-0 z-50",
            "h-[80vh] overflow-y-auto",
            "rounded-b-none rounded-t-xl bg-card-blend  backdrop-blur-xl",
            "p-4 pb-6",
            "shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]",
            "border-t ",
            // Tablet/Desktop side panel
            "sm:block sm:static sm:h-auto sm:w-1/2",
            "sm:rounded-xl sm:shadow-none sm:border sm:p-6",
            "sm:bg-card-blend sm:dark:bg-card-blend-dark"
          )}>
            <div className="sm:hidden w-1/4 h-1  rounded-full mx-auto mb-4" />
            <button 
              onClick={() => setSelectedClient(null)}
              className="absolute top-4 right-4 p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div>
              <h3 className="text-lg font-semibold mb-4">{selectedClient.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <div className="break-all">{selectedClient.email}</div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Last Contact</label>
                  <div>{selectedClient.lastContact}</div>
                </div>
              </div>
              
              <h3 className="text-md font-semibold mb-2">Accounts</h3>
              <ul className="space-y-2">
                {(MOCK_CLIENT.accounts || []).map((account) => (
                  <li 
                    key={account.id} 
                    className="bg-card-blend dark:bg-card-blend-dark border rounded-md transition-colors duration-150 ease-in-out"
                  >
                    <Link href={`/account/${account.id}`} className="block p-3">
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-muted-foreground">{account.id} • {account.type}</div>
                      <div className="text-sm mt-1">Market Value: {account.marketValue}</div>
                    </Link>
                  </li>
                ))}
                <li className="bg-card-blend dark:bg-card-blend-dark border  hover:bg-accent/30  rounded-md">
                  <Link href={`/clients/${selectedClient.id}`} className="block p-3 transition">
                    <div className="font-medium">View client</div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}