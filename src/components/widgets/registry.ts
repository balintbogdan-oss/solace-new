import { Widget } from './types';
import { AUMWidget } from './AUMWidget';
import { ClientsWidget } from './ClientsWidget';
import { ComplianceWidget } from './ComplianceWidget';
import { MarketWidget } from './MarketWidget';
import { Top10HoldingsWidget } from './Top10HoldingsWidget';
import { RecentlyViewedWidget } from './RecentlyViewedWidget';
import { CommissionWidget } from './CommissionWidget';
import { ActivityWidget } from './ActivityWidget';

export const availableWidgets: Widget[] = [
  {
    id: 'commission',
    title: 'Commission',
    description: 'Monthly commission earnings and trends',
    colSpan: 1,
    defaultEnabled: true,
    category: 'performance',
    component: CommissionWidget,
  },
  {
    id: 'aum',
    title: 'Total AUM',
    description: 'Track total assets under management and historical trends',
    colSpan: 2,
    defaultEnabled: true,
    category: 'performance',
    component: AUMWidget,
  },

  {
    id: 'activity',
    title: 'Activity',
    description: 'Summary of trades and deposits',
    colSpan: 1,
    defaultEnabled: true,
    category: 'trading',
    component: ActivityWidget,
  },
  {
    id: 'top10Holdings',
    title: 'Top 10 Holdings',
    description: 'Overview of top holdings by market value',
    colSpan: 1,
    defaultEnabled: true,
    category: 'performance',
    component: Top10HoldingsWidget,
  },
  {
    id: 'recently-viewed',
    title: 'Recently viewed client and accounts',
    description: 'Quick access to recently viewed clients and accounts',
    colSpan: 1,
    defaultEnabled: true,
    category: 'clients',
    component: RecentlyViewedWidget,
  },
  {
    id: 'market',
    title: 'Market',
    description: 'Key market indices and indicators',
    colSpan: 1,
    defaultEnabled: true,
    category: 'market',
    component: MarketWidget,
  },
  {
    id: 'clients',
    title: 'Clients',
    description: 'Client list, AUM, and key details',
    colSpan: 1,
    defaultEnabled: true,
    category: 'clients',
    component: ClientsWidget,
  },
  {
    id: 'compliance',
    title: 'Alerts',
    description: 'Actionable alerts and notifications',
    colSpan: 1,
    defaultEnabled: true,
    category: 'compliance',
    component: ComplianceWidget,
  },
]; 