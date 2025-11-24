// Search service for clients and accounts - using local data
import { localDataService } from './localDataService';
import { Client, AccountData, Household } from '@/types/account';
import { formatAccountType } from '@/lib/utils';

export interface SearchResult {
  clients: Client[];
  accounts: AccountData[];
  households: Household[];
}

export interface SearchResultItem {
  type: 'client' | 'account' | 'household';
  id: string;
  name: string;
  subtitle: string;
  href: string;
  data: Client | AccountData | Household;
}

export class SearchService {
  // Search across clients, accounts, and households
  // If clientId is provided, only return accounts for that client
  async search(query: string, clientId?: string): Promise<SearchResult> {
    if (!query.trim()) {
      return { clients: [], accounts: [], households: [] };
    }

    const searchTerm = query.toLowerCase();

    try {
      // Get all clients and accounts
      const allClients = await localDataService.getAllClients();
      
      // Search clients
      const matchedClients = allClients.filter(client => {
        const firstName = client.firstName?.toLowerCase() || '';
        const lastName = client.lastName?.toLowerCase() || '';
        const email = client.email?.toLowerCase() || '';
        return firstName.includes(searchTerm) || 
               lastName.includes(searchTerm) || 
               email.includes(searchTerm);
      }).slice(0, 5);

      // Get accounts for matched clients
      const accounts: AccountData[] = [];
      for (const client of matchedClients) {
        const clientData = await localDataService.getClientData(client.id);
        if (clientData) {
          accounts.push(...clientData.accounts);
        }
      }

      // Also search accounts directly by account ID or name
      const allAccounts: AccountData[] = [];
      for (const client of allClients) {
        const clientData = await localDataService.getClientData(client.id);
        if (clientData) {
          allAccounts.push(...clientData.accounts);
        }
      }

      const matchedAccounts = allAccounts.filter(account => {
        const accountId = account.accountId?.toLowerCase() || '';
        const accountName = account.accountName?.toLowerCase() || '';
        return accountId.includes(searchTerm) || accountName.includes(searchTerm);
      }).slice(0, 5);

      // Combine and deduplicate accounts
      let uniqueAccounts = Array.from(
        new Map(matchedAccounts.map(acc => [acc.accountId, acc])).values()
      );

      // If clientId is provided, filter to only show accounts for that client
      if (clientId) {
        uniqueAccounts = uniqueAccounts.filter(acc => acc.clientId === clientId);
      }

      return {
        clients: clientId ? [] : matchedClients, // Don't show other clients if filtering by clientId
        accounts: uniqueAccounts,
        households: [] // Households can be added later if needed
      };
    } catch (error) {
      console.error('Error in search service:', error);
      return { clients: [], accounts: [], households: [] };
    }
  }

  // Get recent searches - return recent clients and accounts
  // If clientId is provided, only return accounts for that client
  async getRecentSearches(clientId?: string): Promise<SearchResultItem[]> {
    try {
      const allClients = await localDataService.getAllClients();
      const results: SearchResultItem[] = [];

      // Get accounts for first few clients
      const clientsToShow = allClients.slice(0, 3);
      const accountsToShow: AccountData[] = [];

      for (const client of clientsToShow) {
        const clientData = await localDataService.getClientData(client.id);
        if (clientData && clientData.accounts.length > 0) {
          accountsToShow.push(...clientData.accounts.slice(0, 2));
        }
      }

      // Filter accounts by clientId if provided
      let filteredAccounts = accountsToShow;
      if (clientId) {
        filteredAccounts = accountsToShow.filter(acc => acc.clientId === clientId);
      }

      // Add accounts first
      filteredAccounts.slice(0, 4).forEach(account => {
        results.push({
          type: 'account',
          id: account.accountId,
          name: `${account.accountId} • ${formatAccountType(account.accountType)}`,
          subtitle: account.accountName,
          href: `/account/${account.accountId}`,
          data: account
        });
      });

      // Add clients (only if not filtering by clientId)
      if (!clientId) {
        clientsToShow.forEach(client => {
          results.push({
            type: 'client',
            id: client.id,
            name: `${client.firstName} ${client.lastName}`,
            subtitle: client.email || 'No email',
            href: `/clients/${client.id}`,
            data: client
          });
        });
      }

      // Shuffle the results to mix them up
      return this.shuffleArray(results);
    } catch (error) {
      console.error('Error fetching recent searches:', error);
      return [];
    }
  }

  // Helper function to shuffle array
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Save search to recent searches (no-op for local data)
  saveRecentSearch(item: SearchResultItem): void {
    // No-op since we're using local data
    console.log('Recent search clicked:', item.name);
  }

  // Clear all recent searches (no-op for local data)
  clearRecentSearches(): void {
    // No-op since we're using local data
    console.log('Clear recent searches requested');
  }

  // Convert search results to display items
  convertToSearchItems(results: SearchResult): SearchResultItem[] {
    const items: SearchResultItem[] = [];

    // Add clients
    results.clients.forEach(client => {
      items.push({
        type: 'client',
        id: client.id,
        name: `${client.firstName} ${client.lastName}`,
        subtitle: client.email || 'No email',
        href: `/clients/${client.id}`,
        data: client
      });
    });

    // Add accounts
    results.accounts.forEach(account => {
      items.push({
        type: 'account',
        id: account.accountId,
        name: `${account.accountId} • ${formatAccountType(account.accountType)}`,
        subtitle: account.accountName,
        href: `/account/${account.accountId}`,
        data: account
      });
    });

    // Add households
    results.households.forEach(household => {
      items.push({
        type: 'household',
        id: household.id,
        name: household.name,
        subtitle: household.description || 'Household',
        href: `/households/${household.id}`,
        data: household
      });
    });

    return items;
  }
}

// Export singleton instance
export const searchService = new SearchService();
