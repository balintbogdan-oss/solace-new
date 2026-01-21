import React from 'react';

export interface WidgetHeader {
  title: string;
  value?: string | number;
  subtitle?: React.ReactNode;
}

export interface Widget {
  id: string;
  title: string;
  description: string;
  colSpan: 1 | 2;
  defaultEnabled?: boolean;
  category: 'performance' | 'clients' | 'trading' | 'market' | 'compliance';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
} 