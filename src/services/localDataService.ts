// Local data service - reads from JSON files
import { AccountData, Client, Household } from '@/types/account';

// Load JSON data from public folder (client-side) or from file system (server-side)
async function loadJsonData<T>(path: string): Promise<T | null> {
  try {
    if (typeof window === 'undefined') {
      // Server-side: use fs
      const fs = await import('fs');
      const filePath = process.cwd() + '/src/data/' + path;
      const fileContents = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContents) as T;
    } else {
      // Client-side: use fetch
      const response = await fetch(`/api/data/${path}`);
      if (!response.ok) {
        return null;
      }
      return await response.json() as T;
    }
  } catch (error) {
    console.error(`Error loading ${path}:`, error);
    return null;
  }
}

export class LocalDataService {
  // Get client data by clientId
  async getClientData(clientId: string): Promise<{ client: Client; accounts: AccountData[] } | null> {
    try {
      const clientsData = await loadJsonData<{ clients: Array<{
        id: string;
        firstName: string;
        lastName: string;
        email?: string;
        phone?: string;
        householdId?: string;
        accountIds: string[];
        createdAt: string;
        lastUpdated: string;
      }> }>('clients.json');

      if (!clientsData) {
        return null;
      }

      const clientData = clientsData.clients.find(c => c.id === clientId);
      if (!clientData) {
        return null;
      }

      // Get accounts for this client - load all accounts at once and filter
      const accountsData = await loadJsonData<{ accounts: Array<{
        accountId: string;
        accountName: string;
        accountType: string;
        clientId: string;
        householdId?: string;
        isPrimary?: boolean;
        balances: {
          cash: number;
          margin: number;
          buyingPower: number;
          totalValue: number;
          investedValue: number;
          realizedGL: number;
          lastUpdated: string;
        };
        holdings: Array<{
          symbol: string;
          quantity: number;
          avgPrice: number;
          lastUpdated: string;
        }>;
        securities: Array<{
          symbol: string;
          cusip: string;
          description: string;
          sector: string;
          type: string;
          lastUpdated: string;
        }>;
        trades: unknown[];
        activities: unknown[];
        realizedGL: unknown[];
        commissions: unknown[];
        lastUpdated: string;
      }> }>('accounts.json');

      if (!accountsData) {
        return null;
      }

      // Filter accounts for this client
      const clientAccounts = accountsData.accounts.filter(a => 
        clientData.accountIds.includes(a.accountId)
      );

      // Load household data once if needed
      let householdData: { household: Household } | null = null;
      if (clientData.householdId) {
        const householdResult = await this.getHouseholdData(clientData.householdId);
        if (householdResult) {
          householdData = { household: householdResult.household };
        }
      }

      // Transform accounts to AccountData format
      const accounts: AccountData[] = clientAccounts.map(accountData => {
        const account: AccountData = {
          accountId: accountData.accountId,
          accountName: accountData.accountName,
          accountType: accountData.accountType as AccountData['accountType'],
          clientId: accountData.clientId,
          client: {
            id: clientData.id,
            firstName: clientData.firstName,
            lastName: clientData.lastName,
            email: clientData.email,
            phone: clientData.phone,
            createdAt: clientData.createdAt,
            lastUpdated: clientData.lastUpdated
          },
          householdId: accountData.householdId !== null && accountData.householdId !== undefined 
            ? accountData.householdId 
            : undefined, // Non-household accounts should have undefined, not client's householdId
          household: accountData.householdId && accountData.householdId !== null
            ? householdData?.household 
            : undefined, // Only set household if account has a householdId
          isPrimary: accountData.isPrimary || false,
          securities: accountData.securities.map(s => ({
            symbol: s.symbol,
            cusip: s.cusip,
            description: s.description,
            sector: s.sector,
            type: s.type as AccountData['securities'][0]['type'],
            lastUpdated: s.lastUpdated
          })),
          holdings: accountData.holdings.map(h => ({
            symbol: h.symbol,
            quantity: h.quantity,
            avgPrice: h.avgPrice,
            lastUpdated: h.lastUpdated
          })),
          marketData: [], // Skip market data for faster loading
          trades: accountData.trades as AccountData['trades'],
          activities: accountData.activities as AccountData['activities'],
          balances: accountData.balances,
          realizedGL: accountData.realizedGL as AccountData['realizedGL'],
          unrealizedGL: [],
          commissions: accountData.commissions as AccountData['commissions'],
          lastUpdated: accountData.lastUpdated
        };
        return account;
      });

      const client: Client = {
        id: clientData.id,
        firstName: clientData.firstName,
        lastName: clientData.lastName,
        email: clientData.email,
        phone: clientData.phone,
        createdAt: clientData.createdAt,
        lastUpdated: clientData.lastUpdated
      };

      return { client, accounts };
    } catch (error) {
      console.error('Error in getClientData:', error);
      return null;
    }
  }

  // Get household data by householdId
  async getHouseholdData(householdId: string): Promise<{ household: Household; accounts: AccountData[] } | null> {
    try {
      const householdsData = await loadJsonData<{ households: Array<{
        id: string;
        name: string;
        description?: string;
        createdAt: string;
        lastUpdated: string;
      }> }>('households.json');

      if (!householdsData) {
        return null;
      }

      const householdData = householdsData.households.find(h => h.id === householdId);
      if (!householdData) {
        return null;
      }

      const household: Household = {
        id: householdData.id,
        name: householdData.name,
        description: householdData.description,
        createdAt: householdData.createdAt,
        lastUpdated: householdData.lastUpdated
      };

      // Get accounts for this household (from clients.json)
      const clientsData = await loadJsonData<{ clients: Array<{
        id: string;
        householdId?: string;
        accountIds: string[];
      }> }>('clients.json');

      const accounts: AccountData[] = [];
      if (clientsData) {
        const householdClients = clientsData.clients.filter(c => c.householdId === householdId);
        for (const client of householdClients) {
          for (const accountId of client.accountIds) {
            const accountData = await this.getAccountData(accountId);
            if (accountData) {
              accountData.householdId = householdId;
              accountData.household = household;
              accounts.push(accountData);
            }
          }
        }
      }

      return { household, accounts };
    } catch (error) {
      console.error('Error in getHouseholdData:', error);
      return null;
    }
  }

  // Get account data by accountId
  async getAccountData(accountId: string): Promise<AccountData | null> {
    try {
      // Load account data from accounts.json
      const accountsData = await loadJsonData<{ accounts: Array<{
        accountId: string;
        accountName: string;
        accountType: string;
        clientId: string;
        householdId?: string;
        isPrimary?: boolean;
        balances: {
          cash: number;
          margin: number;
          buyingPower: number;
          totalValue: number;
          investedValue: number;
          realizedGL: number;
          lastUpdated: string;
        };
        holdings: Array<{
          symbol: string;
          quantity: number;
          avgPrice: number;
          lastUpdated: string;
        }>;
        securities: Array<{
          symbol: string;
          cusip: string;
          description: string;
          sector: string;
          type: string;
          lastUpdated: string;
        }>;
        trades: unknown[];
        activities: unknown[];
        realizedGL: unknown[];
        commissions: unknown[];
        lastUpdated: string;
      }> }>('accounts.json');

      if (!accountsData) {
        return null;
      }

      const accountData = accountsData.accounts.find(a => a.accountId === accountId);
      if (!accountData) {
        return null;
      }

      // Get client data
      const clientsData = await loadJsonData<{ clients: Array<{
        id: string;
        firstName: string;
        lastName: string;
        email?: string;
        phone?: string;
        createdAt: string;
        lastUpdated: string;
      }> }>('clients.json');

      const clientData = clientsData?.clients.find(c => c.id === accountData.clientId);
      if (!clientData) {
        return null;
      }

      // Get market data for holdings (skip for faster loading - can be loaded on demand)
      // const symbols = accountData.holdings.map(h => h.symbol);
      const marketData: unknown[] = [];
      // Skip market data loading for now to improve dashboard performance
      // Market data can be loaded on-demand when viewing account details
      // if (symbols.length > 0) {
      //   try {
      //     marketData = await getMarketDataForSymbols(symbols);
      //   } catch (error) {
      //     console.warn('Market data fetch failed, continuing without it:', error);
      //     marketData = [];
      //   }
      // }

      // Transform to AccountData format
      const account: AccountData = {
        accountId: accountData.accountId,
        accountName: accountData.accountName,
        accountType: accountData.accountType as AccountData['accountType'],
        clientId: accountData.clientId,
        client: {
          id: clientData.id,
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          email: clientData.email,
          phone: clientData.phone,
          createdAt: clientData.createdAt,
          lastUpdated: clientData.lastUpdated
        },
        householdId: accountData.householdId,
        isPrimary: accountData.isPrimary || false,
        securities: accountData.securities.map(s => ({
          symbol: s.symbol,
          cusip: s.cusip,
          description: s.description,
          sector: s.sector,
          type: s.type as AccountData['securities'][0]['type'],
          lastUpdated: s.lastUpdated
        })),
        holdings: accountData.holdings.map(h => ({
          symbol: h.symbol,
          quantity: h.quantity,
          avgPrice: h.avgPrice,
          lastUpdated: h.lastUpdated
        })),
        marketData: marketData as AccountData['marketData'],
        trades: accountData.trades as AccountData['trades'],
        activities: accountData.activities as AccountData['activities'],
        balances: accountData.balances,
        realizedGL: accountData.realizedGL as AccountData['realizedGL'],
        unrealizedGL: [], // Will be calculated
        commissions: accountData.commissions as AccountData['commissions'],
        lastUpdated: accountData.lastUpdated
      };

      return account;
    } catch (error) {
      console.error('Error in getAccountData:', error);
      return null;
    }
  }

  // Get all clients
  async getAllClients(): Promise<Client[]> {
    try {
      const clientsData = await loadJsonData<{ clients: Array<{
        id: string;
        firstName: string;
        lastName: string;
        email?: string;
        phone?: string;
        createdAt: string;
        lastUpdated: string;
      }> }>('clients.json');

      if (!clientsData) {
        return [];
      }

      return clientsData.clients.map(c => ({
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone,
        createdAt: c.createdAt,
        lastUpdated: c.lastUpdated
      }));
    } catch (error) {
      console.error('Error in getAllClients:', error);
      return [];
    }
  }

  // Save account data (no-op for read-only local data)
  async saveAccountData(): Promise<boolean> {
    // Since we're read-only, this is a no-op
    // In a real implementation, you might want to log this or show a warning
    console.warn('saveAccountData called but local data service is read-only');
    return true;
  }
}

// Export singleton instance
export const localDataService = new LocalDataService();

