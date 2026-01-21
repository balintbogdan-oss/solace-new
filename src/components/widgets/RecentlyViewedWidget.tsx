'use client'

import React from 'react';
import Link from 'next/link';
import { User, Briefcase, ChevronRight } from 'lucide-react';

// Mock data for recently viewed items (limit to 5)
const recentlyViewed = [
  {
    type: 'client',
    id: 'michael-johnson',
    name: 'Michael Johnson',
    href: '/clients/michael-johnson'
  },
  {
    type: 'account',
    id: '1PB10001',
    name: 'Michael & Alexa Brokerage',
    accountNumber: '1PB10001',
    href: '/clients/michael-johnson/accounts/1PB10001'
  },
  {
    type: 'client',
    id: 'temp-client-2',
    name: 'Olivia Brown',
    href: '/clients/temp-client-2' // Placeholder
  },
    {
    type: 'account',
    id: '1PB10003',
    name: 'Kaiya and Michael Johnson INV LONG',
    accountNumber: '1PB10003',
    href: '/clients/michael-johnson/accounts/1PB10003' // Placeholder
  },
  {
    type: 'client',
    id: 'temp-client-3',
    name: 'Ethan Smith',
    href: '/clients/temp-client-3' // Placeholder
  }
].slice(0, 5); // Ensure only 5 items

export function RecentlyViewedWidget() {
  return (
    <div className="space-y-3 pt-2">
      {recentlyViewed.map((item) => (
        <Link href={item.href} key={item.id} passHref>
          <div className="flex items-center justify-between p-3 hover:bg-muted/60 transition-colors duration-150 group cursor-pointer border-b">
            {/* Icon and Text */}
            <div className="flex items-center space-x-3 overflow-hidden">
              {item.type === 'client' ? (
                <User className="h-5 w-5 text-primary flex-shrink-0" />
              ) : (
                <Briefcase className="h-5 w-5 text-primary flex-shrink-0" />
              )}
              <div className="space-y-0.5 overflow-hidden">
                <p className="text-sm font-medium leading-tight group-hover:text-primary transition-colors truncate" title={item.name}>
                  {item.name}
                </p>
                {item.type === 'account' && item.accountNumber && (
                  <p className="text-xs text-muted-foreground truncate">
                    Account: {item.accountNumber}
                  </p>
                )}
              </div>
            </div>
            {/* Chevron */}
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0 ml-2" />
          </div>
        </Link>
      ))}
      {recentlyViewed.length === 0 && (
        <div className="text-center text-sm text-muted-foreground py-10">
          No recently viewed items.
        </div>
      )}
    </div>
  );
} 