import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Simple in-memory cache with TTL
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute

function getCachedData(key: string): unknown {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

async function loadJsonData(fileName: string) {
  const cacheKey = `json_${fileName}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    return cached;
  }

  const filePath = path.join(process.cwd(), 'src', 'data', fileName);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(fileContents);
  setCachedData(cacheKey, data);
  return data;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId') || 'client-1';

    // Load all JSON files in parallel
    const [clientsData, accountsData, householdsData] = await Promise.all([
      loadJsonData('clients.json'),
      loadJsonData('accounts.json'),
      loadJsonData('households.json'),
    ]);

    if (!clientsData || !accountsData) {
      return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    }

    // Type definitions for JSON data
    interface ClientData {
      id: string;
      accountIds: string[];
      householdId?: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      createdAt: string;
      lastUpdated: string;
    }
    
    interface AccountData {
      accountId: string;
      accountName: string;
      accountType: string;
      clientId: string;
      householdId?: string | null;
      isPrimary?: boolean;
      securities: unknown[];
      holdings: unknown[];
      balances: unknown;
      trades: unknown[];
      activities: unknown[];
      realizedGL: unknown[];
      commissions: unknown[];
      lastUpdated: string;
    }
    
    interface HouseholdData {
      id: string;
      name: string;
      description: string;
      createdAt: string;
      lastUpdated: string;
    }
    
    interface ClientsJson {
      clients: ClientData[];
    }
    
    interface AccountsJson {
      accounts: AccountData[];
    }
    
    interface HouseholdsJson {
      households: HouseholdData[];
    }
    
    const clients = (clientsData as ClientsJson).clients;
    const accounts = (accountsData as AccountsJson).accounts;
    const households = householdsData ? (householdsData as HouseholdsJson).households : undefined;
    
    const clientData = clients.find((c) => c.id === clientId);
    if (!clientData) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Filter accounts for this client
    const clientAccounts = accounts.filter((a) =>
      clientData.accountIds.includes(a.accountId)
    );

    // Load household data if needed
    let household: HouseholdData | null = null;
    if (clientData.householdId && households) {
      const householdData = households.find(
        (h) => h.id === clientData.householdId
      );
      if (householdData) {
        household = {
          id: householdData.id,
          name: householdData.name,
          description: householdData.description,
          createdAt: householdData.createdAt,
          lastUpdated: householdData.lastUpdated,
        };
      }
    }

    // Transform accounts to match AccountData format
    const transformedAccounts = clientAccounts.map((accountData) => ({
      accountId: accountData.accountId,
      accountName: accountData.accountName,
      accountType: accountData.accountType,
      clientId: accountData.clientId,
      client: {
        id: clientData.id,
        firstName: clientData.firstName,
        lastName: clientData.lastName,
        email: clientData.email,
        phone: clientData.phone,
        createdAt: clientData.createdAt,
        lastUpdated: clientData.lastUpdated,
      },
      householdId: accountData.householdId || null,
      household: accountData.householdId && household ? household : null,
      isPrimary: accountData.isPrimary || false,
      securities: accountData.securities || [],
      holdings: accountData.holdings || [],
      balances: accountData.balances,
      trades: accountData.trades || [],
      activities: accountData.activities || [],
      realizedGL: accountData.realizedGL || [],
      commissions: accountData.commissions || [],
      lastUpdated: accountData.lastUpdated,
    }));

    return NextResponse.json({ client: {
      id: clientData.id,
      firstName: clientData.firstName,
      lastName: clientData.lastName,
      email: clientData.email,
      phone: clientData.phone,
      createdAt: clientData.createdAt,
      lastUpdated: clientData.lastUpdated,
    }, accounts: transformedAccounts });
  } catch (error) {
    console.error('Error in client-dashboard API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client data' },
      { status: 500 }
    );
  }
}

