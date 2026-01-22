'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type OrderType = 'Equity' | 'Option' | 'Mutual Fund';
export type OrderStatusOpen = 'Pending' | 'Partially filled';
export type OrderStatusHistory = 'Filled' | 'Cancelled' | 'Rejected' | 'Expired';
export type OrderStatus = OrderStatusOpen | OrderStatusHistory;
export type OrderAction = 'Buy' | 'Sell';

export interface OptionOrderDetails {
  underlying: string;
  strike: number;
  optionType: 'Call' | 'Put';
  expirationDate: string;
}

export interface Order {
  id: string;
  orderId: string;
  accountId: string;
  symbol: string;
  description: string;
  cusip?: string;
  type: OrderType;
  action: OrderAction;
  quantity: number;
  price: number;
  amount: number;
  cost: number;
  created: string; // ISO datetime
  expiry: string; // Day, GTC, etc.
  status: OrderStatus;
  orderType?: 'market' | 'limit' | 'stop' | 'stop-limit';
  // History-only fields
  executedPrice?: number;
  filledAt?: string;
  // Partial fill tracking
  filledQuantity?: number;
  // Options-only
  optionDetails?: OptionOrderDetails;
}

interface OrdersContextType {
  openOrders: Order[];
  historyOrders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderId' | 'created'>) => Order;
  cancelOrder: (orderId: string) => void;
  getOrdersByAccount: (accountId: string) => { open: Order[]; history: Order[] };
  clearAllOrders: () => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

// Generate unique order ID
function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [openOrders, setOpenOrders] = useState<Order[]>([]);
  const [historyOrders, setHistoryOrders] = useState<Order[]>([]);

  const addOrder = useCallback((orderData: Omit<Order, 'id' | 'orderId' | 'created'>): Order => {
    const orderId = generateOrderId();
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      orderId,
      created: new Date().toISOString(),
    };

    // If it's a market order that's filled, add to history
    // Otherwise add to open orders
    if (newOrder.status === 'Filled') {
      setHistoryOrders(prev => [newOrder, ...prev]);
    } else {
      setOpenOrders(prev => [newOrder, ...prev]);
    }

    return newOrder;
  }, []);

  const cancelOrder = useCallback((orderId: string) => {
    setOpenOrders(prev => {
      const orderToCancel = prev.find(o => o.orderId === orderId);
      if (!orderToCancel) return prev;

      // Move to history as cancelled
      const cancelledOrder: Order = {
        ...orderToCancel,
        status: 'Cancelled',
        filledAt: new Date().toISOString(),
      };

      setHistoryOrders(hist => [cancelledOrder, ...hist]);
      return prev.filter(o => o.orderId !== orderId);
    });
  }, []);

  const getOrdersByAccount = useCallback((accountId: string) => {
    return {
      open: openOrders.filter(o => o.accountId === accountId),
      history: historyOrders.filter(o => o.accountId === accountId),
    };
  }, [openOrders, historyOrders]);

  const clearAllOrders = useCallback(() => {
    setOpenOrders([]);
    setHistoryOrders([]);
  }, []);

  const value: OrdersContextType = {
    openOrders,
    historyOrders,
    addOrder,
    cancelOrder,
    getOrdersByAccount,
    clearAllOrders,
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
