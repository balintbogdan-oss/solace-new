// Search service for clients and accounts
import { supabase } from './supabaseService';
import { Client, AccountData, Household } from '@/types/account';
import { formatAccountType } from '@/lib/utils';

// Using pre-configured Supabase client from supabaseService

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
  async search(query: string): Promise<SearchResult> {
    if (!query.trim()) {
      return { clients: [], accounts: [], households: [] };
    }

    const searchTerm = `%${query.toLowerCase()}%`;

    try {
      // Search clients
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},email.ilike.${searchTerm}`)
        .limit(5);

      if (clientsError) {
        console.error('Error searching clients:', clientsError);
      }

      // Search accounts
      const { data: accounts, error: accountsError } = await supabase
        .from('accounts')
        .select(`
          *,
          clients:client_id (
            id,
            first_name,
            last_name,
            email,
            phone
          ),
          households:household_id (
            id,
            name,
            description
          ),
          balances (
            total_value,
            buying_power,
            invested_value,
            cash,
            margin
          )
        `)
        .or(`account_id.ilike.${searchTerm},account_name.ilike.${searchTerm}`)
        .limit(5);

      if (accountsError) {
        console.error('Error searching accounts:', accountsError);
      }


      // Transform accounts data to match AccountData interface
      const transformedAccounts: AccountData[] = (accounts || [])
        .filter(account => account.clients) // Only include accounts with client data
        .map(account => {
          const balance = account.balances?.[0] || {};
          const client = account.clients!; // We know it exists due to filter above
          return {
            accountId: account.account_id,
            accountName: account.account_name,
            accountType: account.account_type,
            clientId: account.client_id,
            client: {
              id: client.id,
              firstName: client.first_name,
              lastName: client.last_name,
              email: client.email,
              phone: client.phone,
              createdAt: new Date().toISOString(),
              lastUpdated: new Date().toISOString()
            },
            householdId: account.household_id,
            household: undefined,
            isPrimary: account.is_primary || false,
            securities: [], // Will be populated if needed
            holdings: [],
            marketData: [],
            trades: [],
            activities: [],
            balances: {
              buyingPower: balance.buying_power || 0,
              investedValue: balance.invested_value || 0,
              totalValue: balance.total_value || 0,
              cash: balance.cash || 0,
              margin: balance.margin || 0,
              realizedGL: 0,
              lastUpdated: new Date().toISOString()
            },
            realizedGL: [],
            unrealizedGL: [],
            commissions: [],
            lastUpdated: new Date().toISOString()
          };
        });

      // Transform clients data to match Client interface
      const transformedClients: Client[] = (clients || []).map(client => ({
        id: client.id,
        firstName: client.first_name,
        lastName: client.last_name,
        email: client.email,
        phone: client.phone,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }));

      return {
        clients: transformedClients,
        accounts: transformedAccounts,
        households: []
      };
    } catch (error) {
      console.error('Error in search service:', error);
      return { clients: [], accounts: [], households: [] };
    }
  }

  // Get recent searches from database - only clients and accounts
  async getRecentSearches(): Promise<SearchResultItem[]> {
    try {
      // Using imported supabase client
      
      // Fetch recent clients (limit 3)
      const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .limit(3);

      // Fetch recent accounts (simplified query first)
      const { data: accounts, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .order('account_id', { ascending: false })
        .limit(4);

      if (accountsError) {
        console.error('Error fetching accounts:', accountsError);
        console.error('Error details:', JSON.stringify(accountsError, null, 2));
      }

      // Fetch client and balance data separately if accounts exist
      let clientsData: Client[] = [];
      let balancesData: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any

      if (accounts && accounts.length > 0) {
        // Get client data for these accounts
        const clientIds = [...new Set(accounts.map(acc => acc.client_id))];
        const { data: accountClients } = await supabase
          .from('clients')
          .select('*')
          .in('id', clientIds);
        clientsData = accountClients || [];

        // Get balance data for these accounts
        const accountIds = accounts.map(acc => acc.account_id);
        const { data: balances } = await supabase
          .from('balances')
          .select('*')
          .in('account_id', accountIds);
        balancesData = balances || [];
      }

      const results: SearchResultItem[] = [];

      console.log('Fetched accounts:', accounts?.length || 0);
      console.log('Fetched clients:', clients?.length || 0);

      // Add accounts first (most important)
      if (accounts && accounts.length > 0) {
        console.log('Processing accounts:', accounts.map(a => a.account_id));
        accounts
          .filter(account => {
            const client = clientsData.find(c => c.id === account.client_id);
            return client; // Only include accounts with client data
          })
          .forEach(account => {
            console.log('Processing account:', account.account_id, account.account_name);
            
            // Find related data from separately fetched arrays
            const client = clientsData.find(c => c.id === account.client_id)!; // We know it exists due to filter
            const balances = balancesData.find(b => b.account_id === account.account_id);

            results.push({
              type: 'account',
              id: account.account_id,
              name: `${account.account_id} • ${formatAccountType(account.account_type)}`,
              subtitle: account.account_name,
              href: `/account/${account.account_id}`,
              data: {
                accountId: account.account_id,
                accountName: account.account_name,
                accountType: account.account_type,
                clientId: account.client_id,
                client: {
                  id: client.id,
                  firstName: client.firstName,
                  lastName: client.lastName,
                  email: client.email,
                  phone: client.phone,
                  createdAt: new Date().toISOString(),
                  lastUpdated: new Date().toISOString()
                },
                householdId: account.household_id,
                household: undefined,
                isPrimary: account.is_primary,
                securities: [],
                holdings: [],
                marketData: [],
                trades: [],
                activities: [],
                balances: balances ? {
                  buyingPower: balances.buying_power,
                  investedValue: balances.invested_value,
                  totalValue: balances.total_value,
                  cash: balances.cash,
                  margin: balances.margin,
                  realizedGL: 0,
                  lastUpdated: new Date().toISOString()
                } : {
                  buyingPower: 0,
                  investedValue: 0,
                  totalValue: 0,
                  cash: 0,
                  margin: 0,
                  realizedGL: 0,
                  lastUpdated: new Date().toISOString()
                },
                realizedGL: [],
                unrealizedGL: [],
                commissions: [],
                lastUpdated: new Date().toISOString()
              }
            });
          });
      }

      // Add clients
      if (clients) {
        clients.forEach(client => {
          results.push({
            type: 'client',
            id: client.id,
            name: `${client.first_name} ${client.last_name}`,
            subtitle: client.email,
            href: `/clients/${client.id}`,
            data: {
              id: client.id,
              firstName: client.first_name,
              lastName: client.last_name,
              email: client.email,
              phone: client.phone,
              createdAt: client.created_at,
              lastUpdated: client.last_updated
            }
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

  // Save search to recent searches (no-op since we're using database data)
  saveRecentSearch(item: SearchResultItem): void {
    // No-op since we're fetching recent searches from database
    // This method is kept for compatibility but doesn't actually save anything
    console.log('Recent search clicked:', item.name);
  }

  // Clear all recent searches (no-op since we're using database data)
  clearRecentSearches(): void {
    // No-op since we're fetching recent searches from database
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
