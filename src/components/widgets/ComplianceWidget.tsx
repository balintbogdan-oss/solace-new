'use client'

import React from 'react';
import Link from 'next/link';

// Mock Data for Alerts (Updated Structure)
interface Alert {
  id: string;
  status: 'action_required' | 'info';
  isHighPriority: boolean;
  category: string;
  accountNumber: string;
  accountDetails: string;
  description: string;
  href: string;
}

const mockAlerts: Alert[] = [
  {
    id: 'alert1',
    status: 'action_required',
    isHighPriority: true,
    category: 'Maturity schedule',
    accountNumber: '120008',
    accountDetails: 'PERSHING LC F/A/O JOHNSON FINANCIAL GROUP',
    description: 'TREASURY BILLDISCOUNT ZERO CPN DUE 08/06/24 US T...\n9826.00',
    href: '#' // Placeholder link
  },
  {
    id: 'alert2',
    status: 'action_required',
    isHighPriority: true,
    category: 'Maturity schedule',
    accountNumber: '120008',
    accountDetails: 'PERSHING LC F/A/O JOHNSON FINANCIAL GROUP',
    description: 'Exp on 12/30 (7 days)\nAction required',
    href: '#'
  },
  {
    id: 'alert3',
    status: 'action_required',
    isHighPriority: false,
    category: 'Deposit',
    accountNumber: '120008',
    accountDetails: 'PERSHING LC F/A/O JOHNSON FINANCIAL GROUP',
    description: 'Funds request\n6,641.25 • IRA',
    href: '#'
  },
  {
    id: 'alert4',
    status: 'action_required',
    isHighPriority: false,
    category: 'Withdrawal',
    accountNumber: '120008',
    accountDetails: 'PERSHING LC F/A/O JOHNSON FINANCIAL GROUP',
    description: 'Funds RECD Antoni Lucas\n500.00 • IRA',
    href: '#'
  },
  {
    id: 'alert5',
    status: 'info',
    isHighPriority: false,
    category: 'Withdrawal',
    accountNumber: '120008',
    accountDetails: 'PERSHING LC F/A/O JOHNSON FINANCIAL GROUP',
    description: 'TREASURY BILLDISCOUNT ZERO CPN DUE 08/06/24 US T...\n500.00 • IRA',
    href: '#'
  },
];

// Define props for ComplianceWidget
interface ComplianceWidgetProps {
  activeView?: 'action_required' | 'all_alerts';
}

export function ComplianceWidget({ activeView = 'action_required' }: ComplianceWidgetProps) {
  
  const alertsToDisplay = activeView === 'action_required'
    ? mockAlerts.filter(alert => alert.status === 'action_required')
    : mockAlerts;
    
  return (
    <div className="flex flex-col h-full">
      {/* Top section with title and counts - Removed switcher buttons */}
      {/* ... (Removed old header with counts/switcher) ... */}

      {/* List of Alerts */}
      <div className="flex-1 overflow-y-auto pr-1">
        {alertsToDisplay.length > 0 ? (
          <ul className="space-y-2">
            {alertsToDisplay.map((alert) => (
              <li key={alert.id} className="border-b border-primary/10 last:border-b-0 pb-2 last:pb-0 pt-1">
                <Link href={alert.href} className="block group">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="text-xs font-medium text-primary group-hover:underline truncate">
                        {alert.category} - {alert.accountNumber} - {alert.accountDetails}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-tight line-clamp-2">
                        {alert.description}
                      </p>
                    </div>
                    {alert.isHighPriority && (
                      <span className="inline-block flex-shrink-0 ml-2 px-1.5 py-0.5 text-xs font-semibold text-red-700 bg-red-100 dark:text-red-200 dark:bg-red-900/50 rounded-full">
                        HIGH
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No {activeView === 'action_required' ? 'action required' : ''} alerts.
          </p>
        )}
      </div>

      {/* Footer - Removed total count */}
      {/* ... (Removed old footer with total count) ... */}
    </div>
  );
} 