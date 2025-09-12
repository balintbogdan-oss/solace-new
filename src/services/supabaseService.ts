// Supabase implementation for account data
import { createClient } from '@supabase/supabase-js';
import { AccountData, Security, Holding, MarketData, Trade, Activity, Client, Household, RealizedTrade, UnrealizedPosition, CommissionRecord } from '@/types/account';
import { getMarketDataForSymbols } from './marketDataService';

// Get environment variables - these should be available on both client and server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabase client initialized

export class SupabaseAccountService {

  // Get household data by householdId
  async getHouseholdData(householdId: string): Promise<{ household: Household; accounts: AccountData[] } | null> {
    try {
      // First get the household
      const { data: householdData, error: householdError } = await supabase
        .from('households')
        .select('*')
        .eq('id', householdId)
        .single();

      if (householdError) {
        console.error('Error fetching household:', householdError);
        return null;
      }

      if (!householdData) {
        return null;
      }

      // Get all accounts for this household
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select(`
          *,
          clients:client_id (
            id,
            first_name,
            last_name,
            email,
            phone,
            created_at,
            last_updated
          )
        `)
        .eq('household_id', householdId);

      if (accountsError) {
        console.error('Error fetching household accounts:', accountsError);
        return null;
      }

      // Get account data for each account
      const accounts: AccountData[] = [];
      for (const account of accountsData || []) {
        const accountData = await this.getAccountData(account.account_id);
        if (accountData) {
          // Add household info to account data
          accountData.householdId = householdId;
          accountData.household = householdData as Household;
          accountData.isPrimary = account.is_primary || false;
          accounts.push(accountData);
        }
      }

      return {
        household: householdData as Household,
        accounts
      };
    } catch (error) {
      console.error('Error in getHouseholdData:', error);
      return null;
    }
  }

  // Get client data by clientId
  async getClientData(clientId: string): Promise<{ client: Client; accounts: AccountData[] } | null> {
    try {
      // First get the client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (clientError) {
        console.error('Error fetching client:', clientError);
        return null;
      }

      if (!clientData) {
        return null;
      }

      // Get all accounts for this client
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select(`
          *,
          households:household_id (
            id,
            name,
            description,
            created_at,
            last_updated
          )
        `)
        .eq('client_id', clientId);

      if (accountsError) {
        console.error('Error fetching accounts:', accountsError);
        return null;
      }

      // Get account data for each account
      const accounts: AccountData[] = [];
      for (const account of accountsData || []) {
        const accountData = await this.getAccountData(account.account_id);
        if (accountData) {
          // Add household info to account data
          if (account.household_id) {
            accountData.householdId = account.household_id;
            accountData.household = account.households as Household;
            accountData.isPrimary = account.is_primary || false;
          }
          accounts.push(accountData);
        }
      }

      return {
        client: {
          id: clientData.id,
          firstName: clientData.first_name,
          lastName: clientData.last_name,
          email: clientData.email,
          phone: clientData.phone,
          createdAt: clientData.created_at,
          lastUpdated: clientData.last_updated
        },
        accounts
      };
    } catch (error) {
      console.error('Error in getClientData:', error);
      return null;
    }
  }

  // Get account data by accountId
  async getAccountData(accountId: string): Promise<AccountData | null> {
    try {
      // Fetching account data
      
      // First get the account
      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('*')
        .eq('account_id', accountId)
        .single();

      if (accountError) {
        console.error('Error fetching account:', accountError);
        return null;
      }

      if (!accountData) {
        // No account found
        return null;
      }

      // Get all related data
      const [securitiesResult, holdingsResult, tradesResult, activitiesResult, balancesResult, realizedGlResult, commissionsResult, clientResult] = await Promise.all([
        supabase.from('securities').select('*').eq('account_id', accountId),
        supabase.from('holdings').select('*').eq('account_id', accountId),
        supabase.from('trades').select('*').eq('account_id', accountId),
        supabase.from('activities').select('*').eq('account_id', accountId),
        supabase.from('balances').select('*').eq('account_id', accountId),
        supabase.from('realized_gl').select('*').eq('account_id', accountId),
        supabase.from('commissions').select('*').eq('account_id', accountId),
        supabase.from('clients').select('*').eq('id', accountData.client_id).single()
      ]);

      // Check for errors
      const errors = [securitiesResult.error, holdingsResult.error, tradesResult.error, activitiesResult.error, balancesResult.error, realizedGlResult.error, commissionsResult.error, clientResult.error].filter(Boolean);
      if (errors.length > 0) {
        console.error('Errors fetching related data:', errors);
      }

      // Get market data from local JSON files
      const holdings = holdingsResult.data || [];
      const symbols = holdings.map((h: unknown) => (h as { symbol: string }).symbol); 
      
      // Load market data from local JSON files
      let marketData: MarketData[] = [];
      try {
        marketData = await getMarketDataForSymbols(symbols);
      } catch (error) {
        console.error('Error loading market data:', error);
        marketData = [];
      }

      const data = {
        ...accountData,
        securities: securitiesResult.data || [],
        holdings: holdings,
        trades: tradesResult.data || [],
        activities: activitiesResult.data || [],
        balances: balancesResult.data?.[0] || {
          cash: 0,
          margin: 0,
          buyingPower: 0,
          totalValue: 0,
          investedValue: 0,
          realizedGL: 0,
          lastUpdated: new Date().toISOString()
        },
        realizedGL: realizedGlResult.data || [],
        commissions: commissionsResult.data || [],
        marketData: marketData,
        client: clientResult.data || {
          id: 'unknown',
          firstName: 'Unknown',
          lastName: 'Client',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      };

      return this.transformSupabaseData(data);
    } catch (error) {
      console.error('Error in getAccountData:', error);
      return null;
    }
  }

  // Save account data
  async saveAccountData(accountData: AccountData): Promise<boolean> {
    try {
      // Start a transaction
      const { error: accountError } = await supabase
        .from('accounts')
        .upsert({
          account_id: accountData.accountId,
          account_name: accountData.accountName,
          account_type: accountData.accountType,
          client_id: accountData.clientId,
          last_updated: accountData.lastUpdated
        });

      if (accountError) {
        console.error('Account upsert error:', accountError);
        throw accountError;
      }

      // Save securities
      if (accountData.securities.length > 0) {
        
        // First, delete existing securities for this account
        const { error: deleteError } = await supabase
          .from('securities')
          .delete()
          .eq('account_id', accountData.accountId);
        
        if (deleteError) {
          console.error('Securities delete error:', deleteError);
          throw deleteError;
        }
        
        // Then insert the new securities
        const securitiesToSave = accountData.securities.map(security => ({
          account_id: accountData.accountId,
          symbol: security.symbol,
          cusip: security.cusip,
          description: security.description,
          sector: security.sector,
          type: security.type || 'STOCK', // Default to STOCK if type not provided
          last_updated: security.lastUpdated
        }));
        
        const { error: securitiesError } = await supabase
          .from('securities')
          .insert(securitiesToSave);

        if (securitiesError) {
          console.error('Securities insert error:', securitiesError);
          throw securitiesError;
        }
      }

      // Save holdings
      if (accountData.holdings.length > 0) {
        // First, delete existing holdings for this account
        const { error: deleteHoldingsError } = await supabase
          .from('holdings')
          .delete()
          .eq('account_id', accountData.accountId);
        
        if (deleteHoldingsError) {
          console.error('❌ Holdings delete error:', deleteHoldingsError);
          throw deleteHoldingsError;
        }
        
        // Then insert the new holdings
        const holdingsToSave = accountData.holdings.map(holding => ({
          account_id: accountData.accountId,
          symbol: holding.symbol,
          quantity: holding.quantity,
          avg_price: holding.avgPrice,
          last_updated: holding.lastUpdated || new Date().toISOString()
        }));
        
        const { error: holdingsError } = await supabase
          .from('holdings')
          .insert(holdingsToSave);

        if (holdingsError) {
          console.error('❌ Holdings insert error:', holdingsError);
          throw holdingsError;
        }
      }

      // Save activities
      if (accountData.activities && accountData.activities.length > 0) {
        
        // First, delete existing activities for this account
        const { error: deleteActivitiesError } = await supabase
          .from('activities')
          .delete()
          .eq('account_id', accountData.accountId);
        
        if (deleteActivitiesError) {
          console.error('❌ Activities delete error:', deleteActivitiesError);
          throw deleteActivitiesError;
        }
        
        // Then insert the new activities
        const activitiesToSave = accountData.activities.map(activity => ({
          account_id: accountData.accountId,
          activity_id: activity.id, // Map the id field to activity_id
          type: activity.type,
          description: activity.description,
          amount: activity.amount,
          date: activity.date,
          time: activity.time,
          symbol: activity.symbol || null,
          quantity: activity.quantity || null,
          price: activity.price || null,
          cusip: activity.cusip || null,
          buy_price: activity.buyPrice || null,
          action: activity.action || null,
          settle_date: activity.settleDate || null,
          transaction_type: activity.transactionType || null,
          account_type: activity.accountType || null,
          trade_number: activity.tradeNumber || null,
          last_updated: activity.lastUpdated || new Date().toISOString()
        }));
        
        const { error: activitiesError } = await supabase
          .from('activities')
          .insert(activitiesToSave);

        if (activitiesError) {
          console.error('Activities insert error:', activitiesError);
          throw activitiesError;
        }
      }

      // Save other data similarly...
      return true;
    } catch (error) {
      console.error('Error saving account data:', error);
      return false;
    }
  }

  // Get market data for symbols
  async getMarketData(symbols: string[]): Promise<MarketData[]> {
    try {
      const { data, error } = await supabase
        .from('market_data')
        .select('*')
        .in('symbol', symbols);

      if (error) {
        console.error('Error fetching market data:', error);
        return [];
      }

      return data.map(this.transformMarketData);
    } catch (error) {
      console.error('Error in getMarketData:', error);
      return [];
    }
  }

  // Subscribe to real-time updates
  subscribeToAccountUpdates(accountId: string, callback: (data: AccountData) => void) {
    const subscription = supabase
      .channel(`account-${accountId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'accounts',
          filter: `account_id=eq.${accountId}`
        }, 
        async () => {
          const data = await this.getAccountData(accountId);
          if (data) callback(data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }

  private transformSupabaseData(data: unknown): AccountData {
    const dataObj = data as Record<string, unknown>;

    // Check if data is already in the correct format (from JSON file)
    if (dataObj.accountId && dataObj.accountName) {
      return dataObj as unknown as AccountData;
    }
    
    return {
      accountId: dataObj.account_id as string,
      accountName: (dataObj.account_name as string) || 'Unknown Account',
      accountType: (dataObj.account_type as 'individual' | 'joint' | 'ira' | 'roth_ira' | '401k' | '403b' | 'sep_ira' | 'simple_ira' | 'trust' | 'corporate' | 'partnership' | 'llc' | 'other') || 'individual',
      clientId: (dataObj.client_id as string) || 'unknown',
      client: this.transformClient(dataObj.client),
      isPrimary: (dataObj.is_primary as boolean) || false,
      securities: ((dataObj.securities as unknown[]) || []).map(this.transformSecurity),
      holdings: ((dataObj.holdings as unknown[]) || []).map(this.transformHolding),
      marketData: (dataObj.marketData as MarketData[]) || [],
      trades: ((dataObj.trades as unknown[]) || []).map(this.transformTrade),
      activities: ((dataObj.activities as unknown[]) || []).map(this.transformActivity),
      balances: dataObj.balances ? {
        cash: (dataObj.balances as Record<string, unknown>).cash as number || 0,
        margin: (dataObj.balances as Record<string, unknown>).margin as number || 0,
        buyingPower: (dataObj.balances as Record<string, unknown>).buying_power as number || 0,
        totalValue: (dataObj.balances as Record<string, unknown>).total_value as number || 0,
        investedValue: (dataObj.balances as Record<string, unknown>).invested_value as number || 0,
        realizedGL: (dataObj.balances as Record<string, unknown>).realized_gl as number || 0,
        unrealizedGL: (dataObj.balances as Record<string, unknown>).unrealized_gl as number || 0,
        lastUpdated: (dataObj.balances as Record<string, unknown>).last_updated as string || new Date().toISOString()
      } : {
        cash: 0,
        margin: 0,
        buyingPower: 0,
        totalValue: 0,
        investedValue: 0,
        realizedGL: 0,
        unrealizedGL: 0,
        lastUpdated: new Date().toISOString()
      },
      realizedGL: (dataObj.realizedGL as RealizedTrade[]) || [],
      unrealizedGL: (dataObj.unrealizedGL as UnrealizedPosition[]) || [],
      commissions: (dataObj.commissions as CommissionRecord[]) || [],
      lastUpdated: (dataObj.last_updated as string) || new Date().toISOString()
    };
  }

  private transformClient(data: unknown): Client {
    const d = data as {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      created_at: string;
      last_updated: string;
    };
    return {
      id: d.id,
      firstName: d.first_name,
      lastName: d.last_name,
      email: d.email,
      phone: d.phone,
      createdAt: d.created_at,
      lastUpdated: d.last_updated
    };
  }

  private transformSecurity(data: unknown): Security {
    const d = data as Record<string, unknown>;
    return {
      symbol: d.symbol as string,
      cusip: d.cusip as string,
      description: d.description as string,
      sector: d.sector as string,
      type: d.type as 'equity' | 'option' | 'mutual_fund' | 'etf' | 'bond',
      exchange: d.exchange as string,
      underlying: d.underlying as string,
      strikePrice: d.strike_price as number,
      expirationDate: d.expiration_date as string,
      optionType: d.option_type as 'call' | 'put',
      expenseRatio: d.expense_ratio as number,
      lastUpdated: d.last_updated as string
    };
  }

  private transformHolding(data: unknown): Holding {
    // Holdings table only stores position data
    // All calculated values (market value, unrealized G/L, current price) 
    // come from market data and are calculated dynamically
    const d = data as Record<string, unknown>;
    return {
      symbol: d.symbol as string,
      quantity: d.quantity as number,
      avgPrice: d.avg_price as number,
      lastUpdated: d.last_updated as string
    };
  }

  private transformTrade(data: unknown): Trade {
    const d = data as Record<string, unknown>;
    return {
      id: d.trade_id as string,
      symbol: d.symbol as string,
      cusip: d.cusip as string,
      description: d.description as string,
      action: d.action as 'BUY' | 'SELL',
      quantity: d.quantity as number,
      price: d.price as number,
      totalValue: d.total_value as number,
      commission: d.commission as number,
      date: d.date as string,
      time: d.time as string,
      longShort: d.long_short as 'Long' | 'Short',
      lastUpdated: d.last_updated as string
    };
  }

  private transformActivity(data: unknown): Activity {
    const d = data as Record<string, unknown>;
    return {
      id: d.activity_id as string,
      type: d.type as 'DEPOSIT' | 'WITHDRAWAL' | 'DIVIDEND' | 'TRADE' | 'TRANSFER' | 'EQUITY' | 'MUTUAL_FUNDS' | 'INTEREST' | 'IRA',
      description: d.description as string,
      amount: d.amount as number,
      date: d.date as string,
      time: d.time as string,
      symbol: d.symbol as string || undefined,
      quantity: d.quantity as number || undefined,
      price: d.price as number || undefined,
      cusip: d.cusip as string || undefined,
      buyPrice: d.buy_price as number || undefined,
      action: d.action as 'BUY' | 'SELL' | 'TRADE' || undefined,
      settleDate: d.settle_date as string || undefined,
      transactionType: d.transaction_type as 'MARKET' | 'LIMIT' || undefined,
      accountType: d.account_type as 'CASH' | 'MARGIN' | 'SHORT_MARGIN' | 'LONG_MARGIN' | 'IRA' || undefined,
      tradeNumber: d.trade_number as string || undefined,
      lastUpdated: d.last_updated as string
    };
  }

  private transformMarketData(data: unknown): MarketData {
    const d = data as Record<string, unknown>;
    return {
      symbol: d.symbol as string,
      currentPrice: d.current_price as number,
      previousClose: d.previous_close as number,
      dayChange: d.day_change as number,
      dayChangePercent: d.day_change_percent as number,
      volume: d.volume as number,
      marketCap: d.market_cap as number,
      lastUpdated: d.last_updated as string
    };
  }
}

export const supabaseAccountService = new SupabaseAccountService();
