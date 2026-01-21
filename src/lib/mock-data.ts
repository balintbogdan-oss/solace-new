import { faker } from '@faker-js/faker';

// Define a specific Account type
export interface Account {
  id: string;
  name: string;
  type: string; // Consider making this more specific if needed
  investedValue: string;
  marketValue: string;
  fdicSweep: string;
  availableMargin: string;
}

// Define the Client type here or import if defined elsewhere
interface Client {
  id: string;
  name: string;
  email: string;
  lastContact: string; // Added lastContact here
  // Add other fields from MOCK_CLIENT if they should be part of the type
  phone?: string; 
  address?: string;
  dob?: string;
  age?: string;
  ssn?: string;
  portfolioValue?: string;
  todayGL?: string;
  totalUnrealizedGL?: string;
  accounts: Account[]; // Use the specific Account type here
}

// Define AccountDetails interface
interface AssetAllocationItem {
  name: string;
  value: number;
  color: string;
}

interface AccountDetails extends Account { // Extend the base Account type
  portfolioValue: string;
  todaysGL: { amount: string; percentage: string };
  totalGL: { amount: string; percentage: string };
  positions: {
    long: { amount: string };
    short: { amount: string };
  };
  availableCash: string;
  totalAccountValue: string;
  assetAllocation: AssetAllocationItem[];
}

// Generate a fixed set of clients to ensure consistency between renders
faker.seed(123); // Set a fixed seed for reproducible data

// Apply Client type and add lastContact
export const MOCK_CLIENT: Client = {
  id: 'michael-johnson',
  name: 'Michael Johnson',
  email: 'michael.johnson@example.com',
  lastContact: '2024-03-10', // Added mock last contact
  phone: '(555) 123-4567',
  address: '123 Main St, San Francisco, CA 94105',
  dob: '1975-05-15',
  age: '48',
  ssn: 'XXX-XX-4321',
  portfolioValue: '$4,789,915.56',
  todayGL: '+$12,450.32',
  totalUnrealizedGL: '+$245,670.89',
  accounts: [
    {
      id: '1PB10001',
      name: 'Michael Johnson & Alexa Johnson',
      type: 'Joint',
      investedValue: '$23,932.45',
      marketValue: '$133,155.01',
      fdicSweep: '$2,708.37',
      availableMargin: '$11,507.14'
    },
    {
      id: '1PB10002',
      name: "Michael's 401K BROK",
      type: 'Single',
      investedValue: '$3,091.05',
      marketValue: '$3,091.05',
      fdicSweep: '$3,091.05',
      availableMargin: '$3,091.05'
    },
    {
      id: '1PB10003',
      name: 'Kaiya and Michael Johnson INV LONG',
      type: 'Investment objectives',
      investedValue: '$1,422.04',
      marketValue: '$1,422.04',
      fdicSweep: '$1,422.04',
      availableMargin: '$1,422.04'
    },
    {
      id: '1PB10004',
      name: "Michael's general investment",
      type: 'Investment objectives',
      investedValue: '$7,063.79',
      marketValue: '$7,063.79',
      fdicSweep: '$7,063.79',
      availableMargin: '$7,063.79'
    }
  ]
};

export const MOCK_HOUSEHOLDS = [
  {
    id: 'jim-alexa',
    name: 'Michael and Alexa Johnson household',
    members: ['Michael Johnson', 'Alexa Johnson'],
    portfolioValue: '$2,103,300.04',
    accounts: [
    {
        id: '1PB10001',
        name: 'Michael & Alexa Kids Fund',
        type: 'Joint',
        investedValue: '$23,932.45',
        marketValue: '$133,155.01',
        fdicSweep: '$2,708.37',
        availableMargin: '$11,507.14'
      },
      {
        id: '1PB10002',
        name: "Michael's 401K BROK",
        type: 'Single',
        investedValue: '$3,091.05',
        marketValue: '$3,091.05',
        fdicSweep: '$3,091.05',
        availableMargin: '$3,091.05'
    },
    {
        id: '1PB10003',
        name: 'Kaiya and Michael Johnson INV LONG',
        type: 'Investment objectives',
        investedValue: '$1,422.04',
        marketValue: '$1,422.04',
        fdicSweep: '$1,422.04',
        availableMargin: '$1,422.04'
      }
    ]
  },
  {
    id: 'charlie-alexa',
    name: 'Charlie and Alexa Robinson household',
    members: ['Michael Johnson', 'Alexa Johnson', 'James Johnson'],
    portfolioValue: '$980,840.04',
    accounts: [
      {
        id: '1PB10001',
        name: 'Michael & Alexa account',
        type: 'Joint',
        investedValue: '$23,932.45',
        marketValue: '$133,155.01',
        fdicSweep: '$2,708.37',
        availableMargin: '$11,507.14'
      },
      {
        id: '1PB10002',
        name: "Michael's 401K BROK",
        type: 'Single',
        investedValue: '$3,091.05',
        marketValue: '$3,091.05',
        fdicSweep: '$3,091.05',
        availableMargin: '$3,091.05'
      },
      {
        id: '1PB10008',
        name: 'James BROK',
        type: 'Single',
        investedValue: '$1,422.04',
        marketValue: '$1,422.04',
        fdicSweep: '$1,422.04',
        availableMargin: '$1,422.04'
    }
  ]
  }
];

// Generate 125 unique clients - Apply Client[] type
export const MOCK_CLIENTS: Client[] = Array.from({ length: 125 }, (_, index) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  
  if (index === 0) {
    return MOCK_CLIENT; // Already typed as Client
  }

  return {
    id: faker.string.numeric(11),
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    lastContact: faker.date.between({ 
      from: '2024-01-01', 
      to: '2024-03-15' 
    }).toISOString().split('T')[0],
    // Fulfill other required Client fields (even if empty/mock)
    accounts: [], 
    // Add defaults for other optional fields if needed by the type
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    // etc...
  };
});

// Helper function to get account by ID from MOCK_CLIENT (original)
export function getAccountById(accountId: string): Account | undefined {
  return MOCK_CLIENT.accounts.find(account => account.id === accountId)
}

// Helper function to get client context for any view
export function getClientContext(accountId?: string) {
  // For now we only have one client, so always return the same client context
  return {
    clientId: MOCK_CLIENT.id,
    clientName: MOCK_CLIENT.name,
    clientAccounts: MOCK_CLIENT.accounts,
    accountId,
    accountName: accountId ? getAccountById(accountId)?.name : undefined
  }
}

const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'Logan'];
const lastNames = ['Smith', 'Johnson', 'Brown', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin'];

export const generateMockClients = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

    return {
      id: `1001238${100 + i}`,
      name,
      email,
      lastContact: `2024-03-${(i % 30 + 1).toString().padStart(2, '0')}`,
    };
  });
};

export const MOCK_CLIENTS_OLD = generateMockClients(100);

// --- Updated Function --- 
// Use the specific AccountDetails type
export function getAccountDetailsById(accountId: string): Promise<AccountDetails | null> {
  return new Promise((resolve) => {
    let foundAccount: Account | undefined = undefined;
    
    // Search through households to find the account
    for (const household of MOCK_HOUSEHOLDS) {
      const account = household.accounts.find(acc => acc.id === accountId);
      if (account) {
        foundAccount = account;
        break;
      }
    }
    
    // Also check MOCK_CLIENT directly just in case
    if (!foundAccount) {
      foundAccount = MOCK_CLIENT.accounts.find(acc => acc.id === accountId);
    }

    if (foundAccount) {
      const accountData = foundAccount; 
      setTimeout(() => {
        const marketValNum = parseFloat(accountData.marketValue.replace(/[^0-9.-]+/g,""));
        // Explicitly type the details object being constructed
        const details: AccountDetails = {
          // Base Account fields
          id: accountData.id,
          name: accountData.name,
          type: accountData.type,
          investedValue: accountData.investedValue, // Ensure all base fields are included
          marketValue: accountData.marketValue,
          fdicSweep: accountData.fdicSweep,
          availableMargin: accountData.availableMargin,
          // Additional Detail fields
          portfolioValue: accountData.marketValue, 
          todaysGL: { 
            amount: `${faker.datatype.boolean() ? '+' : '-'}$${faker.finance.amount({ min: 100, max: 5000, dec: 2 })}`, 
            percentage: `${faker.finance.amount({ min: 0.1, max: 2.5, dec: 2 })}%` 
          },
          totalGL: { 
            amount: `${faker.datatype.boolean() ? '+' : '-'}$${faker.finance.amount({ min: 1000, max: 50000, dec: 2 })}`, 
            percentage: `${faker.finance.amount({ min: 1, max: 25, dec: 2 })}%` 
          },
          positions: { 
            long: { amount: `$${faker.finance.amount({ min: marketValNum * 0.8, max: marketValNum * 1.2, dec: 2 })}` }, 
            short: { amount: `-$${faker.finance.amount({ min: 0, max: marketValNum * 0.1, dec: 2 })}` } 
          }, 
          availableCash: `$${faker.finance.amount({ min: 1000, max: 50000, dec: 2 })}`, 
          totalAccountValue: accountData.marketValue, 
          assetAllocation: [
            { name: 'Mutual funds', value: faker.number.int({ min: 20, max: 40 }), color: '#8B5CF6' },
            { name: 'Equity', value: faker.number.int({ min: 20, max: 40 }), color: '#10B981' },
            { name: 'Options', value: faker.number.int({ min: 5, max: 20 }), color: '#F59E0B' },
            { name: 'Other', value: faker.number.int({ min: 5, max: 20 }), color: '#6B7280' },
          ],
        };
        // Normalize allocation percentages
        const totalAllocation = details.assetAllocation.reduce((sum, item) => sum + item.value, 0);
        if (totalAllocation > 0) {
          details.assetAllocation = details.assetAllocation.map(item => ({ ...item, value: Math.round((item.value / totalAllocation) * 100) }));
          // Adjust last item slightly if rounding caused total != 100
          const currentTotal = details.assetAllocation.reduce((sum, item) => sum + item.value, 0);
          if (currentTotal !== 100 && details.assetAllocation.length > 0) {
            details.assetAllocation[details.assetAllocation.length - 1].value += (100 - currentTotal);
          }
        } else {
            details.assetAllocation = []; // Avoid division by zero if all values are 0
        }
        
        resolve(details);
      }, 500); 
    } else {
      setTimeout(() => {
        resolve(null);
      }, 500);
    }
  });
}