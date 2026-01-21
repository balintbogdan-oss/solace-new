import { Report, PowerBIColumnMetadata } from './types';

export interface MaturityScheduleRecord {
  [key: string]: string | number;
  accountNumber: string;
  clientName: string;
  symbol: string;
  longShort: 'L' | 'S';
  quantity: number;
  maturityDate: string;
  description: string;
  price: number;
  value: number;
  memo: string;
  couponRate: number;
  repCode: string;
  t: number;
}

export const maturityScheduleColumns: PowerBIColumnMetadata[] = [
  {
    key: 'accountNumber',
    header: 'Account #',
    dataType: 'string',
    width: 100,
  },
  {
    key: 'clientName',
    header: 'Client Name',
    dataType: 'string',
    width: 150,
  },
  {
    key: 'symbol',
    header: 'Symbol/Cusip',
    dataType: 'string',
    width: 120,
  },
  {
    key: 'longShort',
    header: 'L/S',
    dataType: 'string',
    width: 60,
  },
  {
    key: 'quantity',
    header: 'Qty',
    dataType: 'number',
    width: 100,
    align: 'right',
    format: '0,0',
  },
  {
    key: 'maturityDate',
    header: 'Mat/Exp Date',
    dataType: 'string',
    width: 120,
  },
  {
    key: 'description',
    header: 'Description',
    dataType: 'string',
    width: 200,
  },
  {
    key: 'price',
    header: 'Price',
    dataType: 'number',
    dataCategory: 'Currency',
    width: 100,
    align: 'right',
  },
  {
    key: 'value',
    header: 'Value',
    dataType: 'number',
    dataCategory: 'Currency',
    width: 120,
    align: 'right',
  },
  {
    key: 'memo',
    header: 'Memo',
    dataType: 'string',
    width: 150,
  },
  {
    key: 'couponRate',
    header: 'Coupon Rate',
    dataType: 'number',
    width: 120,
    align: 'right',
    format: '0.00',
  },
  {
    key: 'repCode',
    header: 'Rep Code',
    dataType: 'string',
    width: 100,
  },
  {
    key: 't',
    header: 'T',
    dataType: 'number',
    width: 60,
    align: 'right',
  },
];

export const maturityScheduleData: MaturityScheduleRecord[] = [
  {
    accountNumber: '120001',
    clientName: 'John Smith',
    symbol: 'QCOM2226H170',
    longShort: 'L',
    quantity: 100,
    maturityDate: '8/26/2022',
    description: 'Call Qual Com...',
    price: 0.25,
    value: 134.95,
    memo: '-',
    couponRate: 3.00,
    repCode: 'AHAT',
    t: 1,
  },
  {
    accountNumber: '120002',
    clientName: 'Mathew Smith',
    symbol: 'SKYK2216230',
    longShort: 'L',
    quantity: 23,
    maturityDate: '8/26/2022',
    description: 'Conagra Foods...',
    price: 0.90,
    value: 134.95,
    memo: '-',
    couponRate: 4.00,
    repCode: 'AHAT',
    t: 1,
  },
  {
    accountNumber: '120003',
    clientName: 'Laura Goldsmith',
    symbol: 'SKYK2216230',
    longShort: 'L',
    quantity: 34,
    maturityDate: '8/26/2022',
    description: 'Call Stryker Co...',
    price: 0.25,
    value: 134.95,
    memo: '-',
    couponRate: 3.30,
    repCode: 'AHAT',
    t: 1,
  },
  {
    accountNumber: '120004',
    clientName: 'Yangping Li',
    symbol: 'AMZN',
    longShort: 'L',
    quantity: 563,
    maturityDate: '8/26/2022',
    description: 'Call Stryker Co...',
    price: 0.25,
    value: 134.95,
    memo: '-',
    couponRate: 5.00,
    repCode: 'AHAT',
    t: 1,
  },
  {
    accountNumber: '120005',
    clientName: 'Jessica M Wong',
    symbol: 'QCOM2226H170',
    longShort: 'L',
    quantity: 124,
    maturityDate: '8/26/2022',
    description: 'Call AMZN $130...',
    price: 0.25,
    value: 134.95,
    memo: '-',
    couponRate: 12.950,
    repCode: 'AHAT',
    t: 1,
  },
  {
    accountNumber: '120006',
    clientName: 'Julian B Nolan',
    symbol: 'QCOM2226H170',
    longShort: 'L',
    quantity: 525,
    maturityDate: '8/26/2022',
    description: 'Call Qual Com...',
    price: 0.25,
    value: 134.95,
    memo: 'PUB Date 11/3...',
    couponRate: 4.00,
    repCode: 'AHAT',
    t: 1,
  },
];

export const maturityScheduleReport: Report<MaturityScheduleRecord> = {
  metadata: {
    title: 'Maturity Schedule',
    description: 'View upcoming maturities and expirations across all accounts',
    lastUpdated: new Date('2024-03-14T08:00:00'),
    reportId: 'maturity-schedule',
  },
  columns: maturityScheduleColumns,
  data: maturityScheduleData,
}; 