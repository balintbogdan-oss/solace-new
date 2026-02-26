import { ReportData } from './types';

export const buyingPowerReport: ReportData = {
  metadata: {
    title: 'Buying Power',
    description: 'View buying power across all accounts',
    lastUpdated: new Date(),
  },
  columns: [
    {
      key: 'accountNumber',
      header: 'Account Number',
      width: 140,
      align: 'left',
      dataType: 'string'
    },
    {
      key: 'name',
      header: 'Name',
      width: 200,
      align: 'left',
      dataType: 'string'
    },
    {
      key: 'buyingPower',
      header: 'Buying Power',
      width: 160,
      align: 'right',
      dataType: 'number',
      dataCategory: 'Currency'
    },
    {
      key: 'phone',
      header: 'Phone',
      width: 140,
      align: 'left',
      dataType: 'string'
    },
    {
      key: 'busPhone',
      header: 'Bus Phone',
      width: 140,
      align: 'left',
      dataType: 'string'
    },
    {
      key: 'office',
      header: 'Office',
      width: 100,
      align: 'left',
      dataType: 'string'
    },
    {
      key: 'repCode',
      header: 'Rep Code',
      width: 100,
      align: 'left',
      dataType: 'string'
    },
    {
      key: 'ira',
      header: 'IRA',
      width: 80,
      align: 'left',
      dataType: 'string'
    },
    {
      key: 'discretionary',
      header: 'Discretionary',
      width: 120,
      align: 'left',
      dataType: 'string'
    }
  ],
  data: [
    {
      accountNumber: '1SR10541',
      name: 'PIDHERNEYS',
      buyingPower: 4749161.04,
      phone: '(403) 844-0839',
      busPhone: '',
      office: 'SR',
      repCode: 'SR10',
      ira: 'N',
      discretionary: 'N'
    },
    {
      accountNumber: '1SR10041',
      name: 'JOSEPH SULLO',
      buyingPower: 3600706.91,
      phone: '',
      busPhone: '',
      office: 'SR',
      repCode: 'SR10',
      ira: 'N',
      discretionary: 'N'
    },
    {
      accountNumber: '1SR10518',
      name: 'MARTIN B ROWE AND',
      buyingPower: 2035427.88,
      phone: '(618) 273-2492',
      busPhone: '',
      office: 'SR',
      repCode: 'SR10',
      ira: 'N',
      discretionary: 'N'
    },
    {
      accountNumber: '1SR10271',
      name: 'TRACY MAFI',
      buyingPower: 1733503.32,
      phone: '(714) 296-1322',
      busPhone: '',
      office: 'SR',
      repCode: 'SR78',
      ira: 'N',
      discretionary: 'N'
    },
    {
      accountNumber: '1SR10297',
      name: 'DAVID STURM AND',
      buyingPower: 1309247.31,
      phone: '(502) 545-0436',
      busPhone: '',
      office: 'SR',
      repCode: 'SR26',
      ira: 'N',
      discretionary: 'N'
    },
    {
      accountNumber: '1SR10219',
      name: 'DAVID MCCALVIN',
      buyingPower: 1180410.56,
      phone: '(281) 818-7504',
      busPhone: '',
      office: 'SR',
      repCode: 'SR26',
      ira: 'N',
      discretionary: 'N'
    },
    {
      accountNumber: '1SR10040',
      name: 'THOMAS MCCORD',
      buyingPower: 1105098.89,
      phone: '',
      busPhone: '',
      office: 'SR',
      repCode: 'SR10',
      ira: 'N',
      discretionary: 'N'
    },
    {
      accountNumber: '1SR10275',
      name: 'MARZBAN HAYYERI',
      buyingPower: 996288.84,
      phone: '(602) 820-7233',
      busPhone: '',
      office: 'SR',
      repCode: 'SR78',
      ira: 'N',
      discretionary: 'N'
    },
    {
      accountNumber: '1SR10045',
      name: 'TRENT ESS',
      buyingPower: 964011.52,
      phone: '(612) 309-1566',
      busPhone: '',
      office: 'SR',
      repCode: 'SR10',
      ira: 'N',
      discretionary: 'N'
    },
    {
      accountNumber: '1SR10074',
      name: 'DOUGLAS ECKHOFF',
      buyingPower: 876968.62,
      phone: '(866) 660-2323',
      busPhone: '',
      office: 'SR',
      repCode: 'SR10',
      ira: 'N',
      discretionary: 'N'
    }
  ]
}; 