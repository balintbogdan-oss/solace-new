import { Report } from './types';

interface FundsAvailableRow {
  accountNumber: string;
  name: string;
  moneyMarket: number;
  netMargin: number;
  totalAvailable: number;
  phone?: string;
  busPhone?: string;
  repCode: string;
}

// Helper function to generate random data
function generateRandomData(index: number): FundsAvailableRow {
  const companies = [
    'CAPITAL PARTNERS LLC',
    'ASSET MANAGEMENT INC',
    'INVESTMENTS LLC',
    'FINANCIAL LLC',
    'PROPERTIES LLC',
    'HOLDINGS LLC',
    'CAPITAL LLC',
    'PLACE ASSOCIATES',
    'GLOBAL CAP LIMITED INC',
    'MAINSTREET INVESTMENTS LLC'
  ];

  const firstNames = [
    'JAMES', 'EDWARD', 'THOMAS', 'ROBERT', 'WILLIAM',
    'MICHAEL', 'DAVID', 'RICHARD', 'CHARLES', 'JOSEPH',
    'RAYMOND', 'DONALD', 'GEORGE', 'KENNETH', 'STEVEN',
    'STEPHEN', 'PAUL', 'KEVIN', 'BRIAN', 'RONALD'
  ];

  const lastNames = [
    'MCGLYNN', 'QUINN', 'JACKSON', 'SMITH', 'JOHNSON',
    'WILLIAMS', 'BROWN', 'JONES', 'MILLER', 'DAVIS',
    'WILSON', 'MOORE', 'TAYLOR', 'ANDERSON', 'THOMAS',
    'MARTIN', 'THOMPSON', 'WHITE', 'HARRIS', 'SANCHEZ'
  ];

  const suffixes = ['', '', '', 'TTEE', 'CUSTODIAN', 'EXECUTOR', 'ADMIN', '&'];

  // Generate account number
  const series = ['1TR', '1TR', '1TR', '1TR', '2TR', '4TR']; // Weight towards 1TR
  const accountNumber = `${series[Math.floor(Math.random() * series.length)]}${String(10000 + index).padStart(5, '0')}`;

  // Generate name
  const isCompany = Math.random() > 0.7;
  let name;
  if (isCompany) {
    name = `${lastNames[Math.floor(Math.random() * lastNames.length)]} ${companies[Math.floor(Math.random() * companies.length)]}`;
  } else {
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}${suffix ? ' ' + suffix : ''}`;
  }

  // Generate financial data
  const netMargin = Math.random() > 0.3 
    ? Math.floor(Math.random() * 800000)
    : Math.floor(Math.random() * 5000);

  const moneyMarket = 0; // Based on the example, all money market values are 0.00

  const totalAvailable = Math.floor(netMargin * (1 + Math.random() * 0.2)); // Slightly higher than net margin

  // Generate phone numbers (only some entries have them)
  const hasPhone = Math.random() > 0.8;
  const hasBusPhone = Math.random() > 0.8;
  const areaCodes = ['908', '516', '239', '305', '212', '347', '646'];
  
  const phone = hasPhone 
    ? `(${areaCodes[Math.floor(Math.random() * areaCodes.length)]}) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`
    : undefined;
  
  const busPhone = hasBusPhone
    ? `(${areaCodes[Math.floor(Math.random() * areaCodes.length)]}) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`
    : undefined;

  return {
    accountNumber,
    name,
    moneyMarket,
    netMargin,
    totalAvailable,
    phone,
    busPhone,
    repCode: 'TR50' // Based on the example, all rep codes are TR50
  };
}

export const fundsAvailableReport: Report<FundsAvailableRow> = {
  metadata: {
    title: "Funds Available",
    description: "View available funds across all accounts",
    lastUpdated: new Date(),
    reportId: "funds-available"
  },
  columns: [
    {
      key: "accountNumber",
      header: "Account Number",
      dataType: "string",
      width: 120,
      align: "left"
    },
    {
      key: "name",
      header: "Name",
      dataType: "string",
      width: 300,
      align: "left"
    },
    {
      key: "moneyMarket",
      header: "Money Market",
      dataType: "number",
      dataCategory: "Currency",
      width: 120,
      align: "right"
    },
    {
      key: "netMargin",
      header: "Net Margin",
      dataType: "number",
      dataCategory: "Currency",
      width: 120,
      align: "right"
    },
    {
      key: "totalAvailable",
      header: "Total Available",
      dataType: "number",
      dataCategory: "Currency",
      width: 120,
      align: "right"
    },
    {
      key: "phone",
      header: "Phone",
      dataType: "string",
      dataCategory: "PhoneNumber",
      width: 150,
      align: "left"
    },
    {
      key: "busPhone",
      header: "Bus Phone",
      dataType: "string",
      dataCategory: "PhoneNumber",
      width: 150,
      align: "left"
    },
    {
      key: "repCode",
      header: "Rep Code",
      dataType: "string",
      width: 100,
      align: "left"
    }
  ],
  data: Array.from({ length: 100 }, (_, i) => generateRandomData(i))
}; 