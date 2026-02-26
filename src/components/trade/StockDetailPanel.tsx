'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  ResponsiveContainer, 
  XAxis, YAxis, Tooltip, 
  AreaChart, Area
} from 'recharts'
import { cn } from '@/lib/utils'
import { TooltipProps } from 'recharts'
import { Button } from '@/components/ui/button'
import { X, RefreshCw } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAccountData } from '@/contexts/AccountDataContext'
import { MarketData } from '@/types/account'

// Type definition for individual chart data points
type ChartPoint = { time: string; price: number; volume?: number; pe?: number };

// Updated StockInfo type
export type StockInfo = {
    name: string;
    exchangeInfo: string;
    price: number;
    change: number;
    changePercent: number;
    peRatio?: number;
    volume?: number;
    // Allow chartData to be an object keyed by timeframe OR just a simple array
    chartData: Record<string, ChartPoint[]> | ChartPoint[]; 
    marketStats: Record<string, number | string | undefined>; 
};

// Mock data (Should ideally be fetched based on symbol)
// TODO: Replace with actual data fetching logic
export const STOCK_DATA: Record<string, StockInfo> = {
  AAPL: {
    name: 'Apple Inc.',
    exchangeInfo: 'Nasdaq • USD',
    price: 234.35,
    change: -3.53,
    changePercent: -1.48,
    peRatio: 30.5,
    volume: 55_000_000,
    chartData: {
      '1D': [
        { time: '09:30', price: 237.88, volume: 1000000, pe: 30.5 },
        { time: '10:00', price: 238.50, volume: 1200000, pe: 30.6 },
        { time: '10:30', price: 237.20, volume: 1100000, pe: 30.4 },
        { time: '11:00', price: 236.80, volume: 1300000, pe: 30.3 },
        { time: '11:30', price: 235.90, volume: 1400000, pe: 30.2 },
        { time: '12:00', price: 235.20, volume: 1200000, pe: 30.1 },
        { time: '12:30', price: 234.80, volume: 1000000, pe: 30.0 },
        { time: '13:00', price: 234.35, volume: 1500000, pe: 30.0 },
        { time: '13:30', price: 234.10, volume: 1600000, pe: 29.9 },
        { time: '14:00', price: 233.90, volume: 1400000, pe: 29.8 },
        { time: '14:30', price: 234.20, volume: 1300000, pe: 29.9 },
        { time: '15:00', price: 234.35, volume: 1800000, pe: 30.0 },
        { time: '15:30', price: 234.50, volume: 2000000, pe: 30.0 },
        { time: '16:00', price: 234.35, volume: 2500000, pe: 30.0 },
      ],
      '1W': (() => {
        const today = new Date();
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        
        // Generate 5 trading days (Monday to Friday) with actual dates
        return Array.from({ length: 5 }, (_, i) => {
          const date = new Date(oneWeekAgo);
          date.setDate(oneWeekAgo.getDate() + i);
          return {
            time: date.toLocaleDateString('en-US', { 
              month: 'numeric', 
              day: 'numeric' 
            }),
            price: 185.50 + i * 0.75 + Math.random() * 0.5,
            volume: 500000 + i * 30000 + Math.random() * 100000,
            pe: 29.8 + Math.random() * 0.4
          };
        });
      })(),
      '1M': (() => {
        const today = new Date();
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
        
        // Generate 15 data points with 2-day intervals to reduce density
        return Array.from({ length: 15 }, (_, i) => {
          const date = new Date(oneMonthAgo);
          date.setDate(oneMonthAgo.getDate() + (i * 2));
          return {
            time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: 180 + i * 0.5 + Math.random() * 3,
            volume: 400000 + Math.random() * 100000,
            pe: 28 + Math.random() * 2
          };
        });
      })(),
      '6M': Array.from({ length: 26 }, (_, i) => ({ time: `W ${i+1}`, price: 170 + i * 1.5 + Math.random() * 5, volume: 2000000 + Math.random() * 500000, pe: 27 + Math.random() * 3 })),
      'YTD': Array.from({ length: 9 }, (_, i) => ({ time: `M ${i+1}`, price: 175 + i * 2 + Math.random() * 6, volume: 8000000 + Math.random() * 1000000, pe: 27.5 + Math.random() * 2.5 })),
      '1Y': Array.from({ length: 12 }, (_, i) => ({
         time: new Date(new Date().getFullYear(), i, 1).toLocaleString('default', { month: 'short' }),
         price: 160 + i * 2.5 + Math.random() * 7,
         volume: 10000000 + Math.random() * 1500000,
         pe: 26 + Math.random() * 4
      })),
      'MAX': (() => {
          const currentYear = new Date().getFullYear();
          const yearsToShow = 5;
          return Array.from({ length: yearsToShow }, (_, i) => {
              const year = currentYear - yearsToShow + 1 + i;
              return {
                  time: year.toString(),
                  price: 50 + (i * yearsToShow * 3) + Math.random() * 20,
                  volume: 50000000 * (i + 1) + Math.random() * 50000000,
                  pe: 15 + i * 2 + Math.random() * 5
              };
          });
      })(),
    },
    marketStats: {
      open: 188.20, high: 192.00, low: 187.70, prevClose: 184.23,
      weekHigh: 195.58, weekLow: 180.88,
      '52W High': 195.58, '52W Low': 180.88,
      marketStatus: 'Market Open'
    }
  },
  MSFT: {
    name: 'Microsoft Corporation',
    exchangeInfo: 'Nasdaq • USD',
    price: 405.12,
    change: -7.84,
    changePercent: -1.97,
    // Wrap simple chart data in '1D' key for consistency
    chartData: { 
        '1D': [
          { time: '10:00', price: 408.20 }, { time: '11:00', price: 407.15 }, { time: '12:00', price: 406.30 },
          { time: '13:00', price: 405.45 }, { time: '14:00', price: 405.12 },
        ]
    },
    marketStats: {
      open: 408.20, high: 408.45, low: 401.90, prevClose: 412.50,
      weekHigh: 430.00, weekLow: 350.20,
      '52W High': 430.00, '52W Low': 350.20,
    }
  },
  GOOGL: {
    name: 'Alphabet Inc.',
    exchangeInfo: 'Nasdaq • USD',
    price: 142.56,
    change: 2.34,
    changePercent: 1.67,
    // Wrap simple chart data in '1D' key
    chartData: { 
        '1D': [
          { time: '10:00', price: 141.20 }, { time: '11:00', price: 141.85 }, { time: '12:00', price: 142.30 },
          { time: '13:00', price: 142.45 }, { time: '14:00', price: 142.56 },
        ]
    },
    marketStats: {
      open: 141.20, high: 142.56, low: 140.90, prevClose: 140.50,
      weekHigh: 155.00, weekLow: 120.20,
      '52W High': 155.00, '52W Low': 120.20,
    }
  },
  // Added NVDA data
  NVDA: {
    name: 'NVIDIA Corporation',
    exchangeInfo: 'Nasdaq • USD',
    price: 875.28,
    change: 12.55,
    changePercent: 1.45,
    // Wrap simple chart data in '1D' key
    chartData: { 
        '1D': [
          { time: '10:00', price: 865.10 }, { time: '11:00', price: 870.40 }, { time: '12:00', price: 872.80 },
          { time: '13:00', price: 878.15 }, { time: '14:00', price: 875.28 },
        ]
    },
    marketStats: {
      open: 865.10, high: 880.00, low: 860.50, prevClose: 862.73,
      weekHigh: 950.00, weekLow: 400.00,
      '52W High': 950.00, '52W Low': 400.00,
    }
  },
  // Added VTSAX data (Note: ETFs/Mutual Funds might have slightly different data points in reality)
  VTSAX: {
    name: 'Vanguard Total Stock Market Index Fund Admiral Shares',
    exchangeInfo: 'Mutual Fund - NAV • USD',
    price: 125.60, 
    change: 0.85,
    changePercent: 0.68,
    // Wrap simple chart data in '1D' key
    chartData: { 
        '1D': [
          { time: '10:00', price: 125.00 }, { time: '11:00', price: 125.20 }, { time: '12:00', price: 125.45 },
          { time: '13:00', price: 125.50 }, { time: '14:00', price: 125.60 },
        ]
    },
    marketStats: {
      open: 125.00, high: 125.70, low: 124.90, prevClose: 124.75,
      weekHigh: 130.00, weekLow: 105.00,
      '52W High': 130.00, '52W Low': 105.00,
    }
  },
  // Added AMZN data
  AMZN: {
    name: 'Amazon.com Inc.',
    exchangeInfo: 'Nasdaq • USD',
    price: 165.45,
    change: 7.53,
    changePercent: 4.55,
    // Wrap simple chart data in '1D' key
    chartData: { 
        '1D': [
          { time: '10:00', price: 162.10 }, { time: '11:00', price: 163.50 }, { time: '12:00', price: 164.80 },
          { time: '13:00', price: 165.00 }, { time: '14:00', price: 165.45 },
        ]
    },
    marketStats: {
      open: 162.10, high: 166.00, low: 161.50, prevClose: 157.92,
      weekHigh: 190.00, weekLow: 110.00, // Example stats
      '52W High': 190.00, '52W Low': 110.00,
    }
  },
  // Added VFIAX data
  VFIAX: {
    name: 'Vanguard 500 Index Fund Admiral Shares',
    exchangeInfo: 'Mutual Fund - NAV • USD',
    price: 503.56,
    change: 43.76, // Example: Often ETFs track index changes, not single stock price change
    changePercent: 9.52, // Example
    // Wrap simple chart data in '1D' key
    chartData: { 
        '1D': [
          { time: '10:00', price: 490.10 }, { time: '11:00', price: 495.50 }, { time: '12:00', price: 500.80 },
          { time: '13:00', price: 502.00 }, { time: '14:00', price: 503.56 },
        ]
    },
    marketStats: { // Stats for ETFs might be different (e.g., NAV, YTD Return)
      open: 490.10, high: 504.00, low: 489.50, prevClose: 459.80, 
      weekHigh: 510.00, weekLow: 450.00, // Example stats
      '52W High': 510.00, '52W Low': 450.00,
    }
  },
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    // Get the data type from the payload name (set in the <Bar> component)
    const dataType = payload[0].name as DataType || 'Price'; 
    const value = payload[0].value as number;
    let displayValue: string;

    // Format value based on data type (consistent with axis formatter)
    if (dataType === 'Volume') {
      if (value >= 1_000_000_000) displayValue = `${(value / 1_000_000_000).toFixed(1)}B`;
      else if (value >= 1_000_000) displayValue = `${(value / 1_000_000).toFixed(1)}M`;
      else if (value >= 1_000) displayValue = `${(value / 1_000).toFixed(1)}K`;
      else displayValue = value.toString();
    } else if (dataType === 'Price') {
      displayValue = `$${value.toFixed(2)}`;
    } else { // P/E or others
      displayValue = value.toFixed(1);
    }

    // Format time label - add date for 1D charts, enhance 1W charts
    let timeLabel = label;
    if (label && label.includes(':')) {
      // This is a time format (HH:MM), add today's date
      const today = new Date();
      const dateStr = today.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      timeLabel = `${dateStr} ${label}`;
    } else if (label && (label.includes('Mon') || label.includes('Tue') || label.includes('Wed') || label.includes('Thu') || label.includes('Fri'))) {
      // This is a 1W format (e.g., "Mon Sep 10"), add time for more precision
      timeLabel = `${label} 4:00 PM`;
    }

    return (
      <div className="backdrop-blur-xl border p-2 rounded-lg shadow-lg">
        {/* Ensure text-sm is used */}
        <p className="text-sm text-muted-foreground">{timeLabel}</p>
        <p className="text-sm font-medium">{`${dataType}: ${displayValue}`}</p>
      </div>
    );
  }
  return null;
};

interface StockDetailPanelProps {
  symbol: string;
  onTradeAction?: (symbol: string, action: 'buy' | 'sell') => void;
  onClose?: () => void;
  className?: string;
  dataSource?: 'live' | 'mock';
}

type TimeFrame = '1D' | '1W' | '1M' | '6M' | 'YTD' | '1Y' | 'MAX';
type DataType = 'Price' | 'P/E' | 'Volume';

const timeFrames: TimeFrame[] = ['1D', '1W', '1M', '6M', 'YTD', '1Y', 'MAX'];

// Helper function to format date
const formatCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short' // e.g., EST, PST
    }).replace(',', ''); // Remove comma after day
};

// Function to generate realistic 1D data based on real market data
const generateRealistic1DData = (marketData: Record<string, unknown> | MarketData) => {
  const points = [];
  
  // Use real market data values
  const currentPrice = Number(marketData?.currentPrice) || 0;
  const volume = Number(marketData?.volume) || 0;
  const dayChange = Number(marketData?.dayChange) || 0;
  
  // Calculate the opening price based on current price and day change
  const open = currentPrice - dayChange;
  
  // Use market data high/low if available, otherwise calculate reasonable bounds
  const high = Number(marketData?.high) || Math.max(open, currentPrice) + Math.abs(dayChange) * 0.5;
  const low = Number(marketData?.low) || Math.min(open, currentPrice) - Math.abs(dayChange) * 0.5;
  
  
  // If we have real OHLC data, use it to create a more realistic intraday pattern
  if (open > 0 && high > 0 && low > 0) {
    const priceRange = high - low;
    const startTime = 9 * 60 + 30; // 9:30 AM in minutes
    const endTime = 16 * 60; // 4:00 PM in minutes
    const interval = 30; // 30 minutes for better readability
    
    // Create a realistic intraday pattern that respects OHLC
    for (let minutes = startTime; minutes <= endTime; minutes += interval) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Calculate progress through the day (0 to 1)
      const progress = (minutes - startTime) / (endTime - startTime);
      
      // Create a realistic price pattern that starts at open, respects high/low, ends at current
      let price;
      if (progress < 0.1) {
        // Opening volatility - start exactly at open
        price = open + (Math.random() - 0.5) * (priceRange * 0.05);
      } else if (progress < 0.3) {
        // Early morning - create realistic movement based on day trend
        const trendFactor = Math.min(progress * 3, 1);
        if (dayChange > 0) {
          // Positive day - trend toward high
          price = open + (high - open) * trendFactor + (Math.random() - 0.5) * (priceRange * 0.05);
        } else {
          // Negative day - trend toward low, but with some volatility
          const downwardTrend = (low - open) * trendFactor;
          price = open + downwardTrend + (Math.random() - 0.5) * (priceRange * 0.1);
        }
      } else if (progress < 0.7) {
        // Midday - more volatile, but respect the overall trend
        const midPrice = (high + low) / 2;
        const volatility = priceRange * 0.15;
        const trendBias = dayChange > 0 ? 0.2 : -0.2; // Stronger bias based on day trend
        price = midPrice + (Math.random() - 0.5 + trendBias) * volatility;
      } else {
        // Afternoon - trending toward current price with strong bias
        const trendFactor = (progress - 0.7) / 0.3;
        const targetPrice = currentPrice;
        const trendBias = dayChange > 0 ? 0.3 : -0.3; // Strong bias toward final price
        price = (high + low) / 2 + (targetPrice - (high + low) / 2) * trendFactor + (Math.random() - 0.5 + trendBias) * (priceRange * 0.1);
      }
      
      // For the very last point, ensure it's exactly the current price
      if (progress >= 0.99) {
        price = currentPrice;
      }
      
      // Ensure price stays within high/low bounds
      price = Math.max(low, Math.min(high, price));
      
      // Distribute volume throughout the day (higher at open/close)
      const timeFactor = 1 + Math.sin(progress * Math.PI) * 0.5; // Higher at start/end
      const volumeAtTime = Math.round((volume / 26) * timeFactor * (0.8 + Math.random() * 0.4));
      
      points.push({ 
        time, 
        price: parseFloat(price.toFixed(2)), 
        volume: volumeAtTime,
        pe: 30.5 // Use a consistent PE ratio
      });
    }
  } else {
    // Fallback to simple generation if no real data
    let price = currentPrice;
    const startTime = 9 * 60 + 30;
    const endTime = 16 * 60;
    const interval = 30; // 30 minutes for better readability
    
    for (let minutes = startTime; minutes <= endTime; minutes += interval) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      const priceChange = (Math.random() - 0.48) * (currentPrice * 0.005);
      price += priceChange;
      price = Math.max(currentPrice * 0.96, Math.min(currentPrice * 1.04, price));
      
      points.push({ 
        time, 
        price: parseFloat(price.toFixed(2)), 
        volume: Math.round(volume / 13),
        pe: 30.5
      });
    }
  }
  
  return points;
};

// Generate mock chart data based on current price, high, and low
const generateMockChartData = (currentPrice: number, high: number, low: number): Record<string, ChartPoint[]> => {
  const priceRange = high - low;
  const volatility = priceRange * 0.1; // 10% of the range for intraday volatility
  
  const generateIntradayData = (points: number) => {
    const data: ChartPoint[] = [];
    const startTime = new Date();
    startTime.setHours(9, 30, 0, 0); // Market open
    
    // Use 30-minute intervals instead of 15-minute for better readability
    const intervalMinutes = 30;
    
    for (let i = 0; i < points; i++) {
      const time = new Date(startTime.getTime() + (i * intervalMinutes * 60 * 1000));
      const timeStr = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
      
      // Create realistic price movement within the high/low range
      const progress = i / (points - 1);
      const baseMovement = (high - low) * progress + low;
      const randomVariation = (Math.random() - 0.5) * volatility;
      const price = Math.max(low, Math.min(high, baseMovement + randomVariation));
      
      data.push({
        time: timeStr,
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000) + 100000,
        pe: 30.5
      });
    }
    return data;
  };

  const generateWeeklyData = (points: number) => {
    const data: ChartPoint[] = [];
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    
    for (let i = 0; i < points; i++) {
      const date = new Date(oneWeekAgo);
      date.setDate(oneWeekAgo.getDate() + i);
      const time = date.toLocaleDateString('en-US', { 
        month: 'numeric', 
        day: 'numeric' 
      });
      
      const progress = i / (points - 1);
      const baseMovement = (high - low) * progress + low;
      const randomVariation = (Math.random() - 0.5) * volatility * 2;
      const price = Math.max(low, Math.min(high, baseMovement + randomVariation));
      
      data.push({
        time,
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 5000000) + 1000000,
        pe: 30.5
      });
    }
    return data;
  };

  const generateMonthlyData = (points: number) => {
    const data: ChartPoint[] = [];
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    // Generate data points every 2-3 days to reduce density
    const step = Math.ceil(30 / points); // Calculate step size to get approximately the right number of points
    
    for (let i = 0; i < points; i++) {
      const date = new Date(oneMonthAgo);
      date.setDate(oneMonthAgo.getDate() + (i * step));
      const time = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const progress = i / (points - 1);
      const baseMovement = (high - low) * progress + low;
      const randomVariation = (Math.random() - 0.5) * volatility * 2;
      const price = Math.max(low, Math.min(high, baseMovement + randomVariation));
      
      data.push({
        time,
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 5000000) + 1000000,
        pe: 30.5
      });
    }
    return data;
  };

  const generateSixMonthData = (points: number) => {
    const data: ChartPoint[] = [];
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    
    // Generate data points every 2 weeks to reduce density
    const step = Math.ceil(180 / points); // Calculate step size for 6 months (180 days)
    
    for (let i = 0; i < points; i++) {
      const date = new Date(sixMonthsAgo);
      date.setDate(sixMonthsAgo.getDate() + (i * step));
      const time = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const progress = i / (points - 1);
      const baseMovement = (high - low) * progress + low;
      const randomVariation = (Math.random() - 0.5) * volatility * 2;
      const price = Math.max(low, Math.min(high, baseMovement + randomVariation));
      
      data.push({
        time,
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 5000000) + 1000000,
        pe: 30.5
      });
    }
    return data;
  };

  const generateYTDData = (points: number) => {
    const data: ChartPoint[] = [];
    const today = new Date();
    const yearStart = new Date(today.getFullYear(), 0, 1); // January 1st of current year
    
    // Generate data points monthly for YTD
    const step = Math.ceil((today.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24) / points);
    
    for (let i = 0; i < points; i++) {
      const date = new Date(yearStart);
      date.setDate(yearStart.getDate() + (i * step));
      const time = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const progress = i / (points - 1);
      const baseMovement = (high - low) * progress + low;
      const randomVariation = (Math.random() - 0.5) * volatility * 2;
      const price = Math.max(low, Math.min(high, baseMovement + randomVariation));
      
      data.push({
        time,
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 5000000) + 1000000,
        pe: 30.5
      });
    }
    return data;
  };

  const generateYearlyData = (points: number) => {
    const data: ChartPoint[] = [];
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    // Generate data points monthly for 1Y
    const step = Math.ceil(365 / points); // Calculate step size for 1 year (365 days)
    
    for (let i = 0; i < points; i++) {
      const date = new Date(oneYearAgo);
      date.setDate(oneYearAgo.getDate() + (i * step));
      const time = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const progress = i / (points - 1);
      const baseMovement = (high - low) * progress + low;
      const randomVariation = (Math.random() - 0.5) * volatility * 2;
      const price = Math.max(low, Math.min(high, baseMovement + randomVariation));
      
      data.push({
        time,
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 5000000) + 1000000,
        pe: 30.5
      });
    }
    return data;
  };

  const generateMaxData = (points: number) => {
    const data: ChartPoint[] = [];
    const today = new Date();
    const fiveYearsAgo = new Date(today);
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);
    
    // Generate data points quarterly for MAX (5 years)
    const step = Math.ceil(1825 / points); // Calculate step size for 5 years (1825 days)
    
    for (let i = 0; i < points; i++) {
      const date = new Date(fiveYearsAgo);
      date.setDate(fiveYearsAgo.getDate() + (i * step));
      const time = date.toLocaleDateString('en-US', { 
        year: '2-digit', 
        month: 'short', 
        day: 'numeric' 
      });
      
      const progress = i / (points - 1);
      const baseMovement = (high - low) * progress + low;
      const randomVariation = (Math.random() - 0.5) * volatility * 2;
      const price = Math.max(low, Math.min(high, baseMovement + randomVariation));
      
      data.push({
        time,
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 5000000) + 1000000,
        pe: 30.5
      });
    }
    return data;
  };

  return {
    '1D': generateIntradayData(13), // 9:30 AM to 4:00 PM in 30-min intervals
    '1W': generateWeeklyData(5),
    '1M': generateMonthlyData(15),
    '6M': generateSixMonthData(12),
    'YTD': generateYTDData(8),
    '1Y': generateYearlyData(12),
    'MAX': generateMaxData(20)
  };
};

export function StockDetailPanel({ 
  symbol, 
  onTradeAction,
  onClose, 
  className,
  dataSource = 'live'
}: StockDetailPanelProps) {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('1D');
  const [currentTime, setCurrentTime] = useState(formatCurrentTime());
  const [mutedColor, setMutedColor] = useState('#9ca3af'); // Default to dark mode muted color
  const [stock, setStock] = useState<StockInfo | null>(null);
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  // const [positiveColor, setPositiveColor] = useState('#bbf451');
  // const [negativeColor, setNegativeColor] = useState('#fca5a5');
  const accountData = useAccountData();
  const marketData = dataSource === 'live' ? accountData.data?.marketData : null;

  // Debug: Log stock state changes
  useEffect(() => {
    // Stock state updated
  }, [stock]);

  // Fetch stock data when symbol changes
  useEffect(() => {
    const upperSymbol = symbol?.toUpperCase();
    
    
    // Try to get real market data first
    const realMarketData = marketData?.find(m => m.symbol === upperSymbol);
    
    if (realMarketData) {
      // Create StockInfo from real market data
      const stockInfo: StockInfo = {
        name: realMarketData.description || `${upperSymbol} Inc.`,
        exchangeInfo: 'Nasdaq • USD',
        price: realMarketData.currentPrice || 0,
        change: realMarketData.dayChange || 0,
        changePercent: realMarketData.dayChangePercent || 0,
        peRatio: 30.5, // Mock PE ratio
        volume: realMarketData.volume || 0,
        chartData: generateMockChartData(realMarketData.currentPrice || 0, realMarketData.high || 0, realMarketData.low || 0),
        marketStats: {
          open: realMarketData.open || 0,
          high: realMarketData.high || 0,
          low: realMarketData.low || 0,
          prevClose: realMarketData.previousClose || 0,
          '52W High': realMarketData.fiftyTwoWeekHigh || 0,
          '52W Low': realMarketData.fiftyTwoWeekLow || 0
        }
      };
      setStock(stockInfo);
    } else {
      // Fallback to mock data if not found
      const data = STOCK_DATA[upperSymbol] || null;
      setStock(data);
    }
  }, [symbol, marketData]);

  // Get computed muted color on mount and theme change
  useEffect(() => {
    const updateMutedColor = () => {
        if (typeof window !== 'undefined') {
           const color = getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim();
           setMutedColor(color || '#9ca3af'); // Fallback if variable not found
        }
    };

    updateMutedColor(); // Initial calculation

    // Optional: Re-calculate if theme changes (requires theme provider context or other trigger)
    // For now, we assume it gets the correct value on initial load based on the applied theme.

    // Time update interval
    const intervalId = setInterval(() => {
        setCurrentTime(formatCurrentTime());
    }, 60000); 
    return () => clearInterval(intervalId); 
  }, []); // Empty dependency array, runs once on mount

  // --- TEMPORARY: Simulate Price Updates for Animation --- 
  useEffect(() => {
      if (symbol?.toUpperCase() !== 'AAPL') return;

      const simulationInterval = setInterval(() => {
         // TODO: Add logic here to actually refresh stock data if needed
      }, 3000); 

      return () => clearInterval(simulationInterval);
  }, [symbol]);
  // --- END TEMPORARY SIMULATION --- 

  const handleRefresh = () => {
      setCurrentTime(formatCurrentTime());
      // TODO: Add logic here to actually refresh stock data if needed
  };

  // Moved useMemo hook call before the conditional return
  const currentChartData = useMemo(() => {
    const stockDataForChart = stock; // Use the state variable
    if (!stockDataForChart) {
      return []; // Handle null case
    }

    // First check if we have existing chart data for this timeframe
    if (typeof stockDataForChart.chartData === 'object' && !Array.isArray(stockDataForChart.chartData)) {
      const existingData = stockDataForChart.chartData[selectedTimeFrame];
      if (existingData && existingData.length > 0) {
        return existingData;
      }
    }
    
    // If no existing data and timeframe is 1D or 1M, try to generate realistic data
    if (selectedTimeFrame === '1D') {
      // Get the real market data for this stock
      const realMarketData = marketData?.find((md: unknown) => (md as { symbol: string }).symbol === symbol?.toUpperCase());
      if (realMarketData) {
        const data = generateRealistic1DData(realMarketData);
        return data;
      } else {
        // Fallback to using stock price if no market data
        const data = generateRealistic1DData({ currentPrice: stockDataForChart.price });
        return data;
      }
    }
    
    if (selectedTimeFrame === '1M') {
      // Get the real market data for this stock
      const realMarketData = marketData?.find((md: unknown) => (md as { symbol: string }).symbol === symbol?.toUpperCase());
      if (realMarketData) {
        const currentPrice = Number(realMarketData.currentPrice) || stockDataForChart.price;
        const high = Number(realMarketData.high) || currentPrice * 1.05;
        const low = Number(realMarketData.low) || currentPrice * 0.95;
        const data = generateMockChartData(currentPrice, high, low);
        return data[selectedTimeFrame] || [];
      } else {
        // Fallback to using stock price if no market data
        const data = generateMockChartData(stockDataForChart.price, stockDataForChart.price * 1.05, stockDataForChart.price * 0.95);
        return data[selectedTimeFrame] || [];
      }
    }
    
    // Fallback to array data or empty array
    const data = Array.isArray(stockDataForChart.chartData) ? stockDataForChart.chartData : [];
    return data;
  }, [selectedTimeFrame, stock, marketData, symbol]);

  // NEW Effect to get computed chart colors
  useEffect(() => {
    setIsMounted(true); // Set mounted state
  }, []);

  useEffect(() => {
    if (isMounted) { // Run only after mount
      // const style = getComputedStyle(document.documentElement);
      // const posColor = style.getPropertyValue('--chart-positive').trim();
      // const negColor = style.getPropertyValue('--chart-negative').trim();
      
      // Ensure HSL values are wrapped
      // setPositiveColor(posColor.startsWith('hsl') ? posColor : `hsl(${posColor})`);
      // setNegativeColor(negColor.startsWith('hsl') ? negColor : `hsl(${negColor})`);
    }
  }, [isMounted, theme]); // Rerun if theme changes

  // Conditional return AFTER hooks, including the new color effect
  if (!stock || !isMounted) { // Removed color checks - use fallback colors
      // Optional: return a loading skeleton or null
      return <div className="h-[250px] flex items-center justify-center text-muted-foreground">Loading Chart...</div>; 
  }

  // Determine stroke color based on actual day change from market data
  const realMarketData = marketData?.find((md: unknown) => (md as { symbol: string }).symbol === symbol?.toUpperCase());
  const actualDayChange = realMarketData?.dayChange || stock.change || 0;
  const isPositive = actualDayChange >= 0;
  
  // Chart color calculation based on day change
  
  // Use theme-aware colors from globals.css
  const strokeColor = isPositive 
    ? (theme === 'dark' ? '#84cc16' : '#65a30d') // One notch brighter warmer green
    : '#fca5a5'; // Red color remains the same
  const dataKey = 'price'; // Default to price data

  const formatYAxisTick = (value: number) => {
    // Default to price formatting
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className={cn("space-y-4 relative rounded-md focus:outline-none focus-visible:outline-none focus-visible:ring-0", className)}>
      
      {/* Row 1: Exchange Info | Buttons */}
      <div className="flex justify-between items-center">
       
        {/* Top Right Buttons: Close */}
        <div className="flex items-center space-x-2">
        {/* Removed Watchlist Button */}
        {/* <Button 
              variant="outline" 
              onClick={handleAddToWatchlist}
          >
               <Star className="h-4 w-4 mr-2" />
               Watchlist
           </Button> */}
           {onClose && (
             <Button 
                onClick={onClose}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                aria-label="Close stock detail"
              >
                <X className="h-4 w-4" />
              </Button>
           )}
        </div>
      </div>
        {/* Re-added Buy/Sell Buttons Section */}
        {onTradeAction && (
        <div className="flex gap-4">
           <Button
              size="lg"
              onClick={() => onTradeAction(symbol, 'buy')}
              className={cn(
                "bg-lime-500 hover:bg-lime-600 dark:bg-lime-800 dark:hover:bg-lime-700 dark:border dark:border-lime-200",
                "text-white dark:text-white font-semibold"
              )}
           >
             Buy {symbol.toUpperCase()}
           </Button>
           <Button
              size="lg"
              onClick={() => onTradeAction(symbol, 'sell')}
              className={cn(
                "bg-red-600 hover:bg-red-600 dark:bg-red-900 dark:hover:bg-red-700 dark:border dark:border-red-400",
                "text-white dark:text-white font-semibold"
              )}
           >
             Sell {symbol.toUpperCase()}
           </Button>
        </div>
      )}  
      {/* Chart Controls - Using separate layouts for mobile/desktop */}
      
      {/* Mobile Layout (Stacked) - Visible below md */}
      <div className="flex flex-col items-stretch gap-2 md:hidden"> 
        {/* Time Frame Selector */}
        <div className="w-full flex flex-wrap items-center bg-muted p-1 rounded-md space-x-1 gap-y-1">
          {timeFrames.map((frame) => (
            <Button
              key={`${frame}-mobile`}
              variant={selectedTimeFrame === frame ? 'secondary' : 'ghost'}
              onClick={() => setSelectedTimeFrame(frame)}
              className="px-3 h-8"
            >
              {frame}
            </Button>
          ))}
        </div>
        {/* Data Type Selector - Hidden for now */}
        {/* <div className="w-full flex flex-wrap items-center bg-muted p-1 rounded-md space-x-1 gap-y-1">
            {dataTypes.map((type) => (
              <Button
                key={`${type}-mobile`}
                variant="ghost"
                className="px-3 h-8"
              >
                {type}
              </Button>
            ))}
        </div> */}
      </div>

      {/* Desktop Layout (Row) - Visible md and up */}
      <div className="hidden md:flex md:flex-row md:justify-between md:items-center md:gap-2"> 
        {/* Time Frame Selector */}
        <div className="flex items-center bg-muted p-1 rounded-md space-x-1"> {/* Removed flex-wrap, w-full, gap-y */} 
          {timeFrames.map((frame) => (
            <Button
              key={`${frame}-desktop`}
              variant={selectedTimeFrame === frame ? 'secondary' : 'ghost'}
              onClick={() => setSelectedTimeFrame(frame)}
              className="px-3 h-8"
            >
              {frame}
            </Button>
          ))}
        </div>
        {/* Data Type Selector - Hidden for now */}
        {/* <div className="flex items-center bg-muted p-1 rounded-md space-x-1">
            {dataTypes.map((type) => (
              <Button
                key={`${type}-desktop`}
                variant="ghost"
                className="px-3 h-8"
              >
                {type}
              </Button>
            ))}
        </div> */}
      </div>

      {/* Time Info & Refresh Button - Now below controls, above chart */}
      <div className="flex justify-end items-center space-x-2 pt-1 text-muted-foreground text-xs"> {/* Adjusted pt-1 */} 
         <span>{currentTime}</span>
         <span>•</span>
         <span>{typeof stock.marketStats.marketStatus === 'string' && stock.marketStats.marketStatus !== 'Market Open' && ` • ${stock.marketStats.marketStatus}`}</span>
         <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6"
            onClick={handleRefresh}
            aria-label="Refresh data"
         >
             <RefreshCw className="h-3 w-3" />
         </Button>
      </div>

      {/* Chart */} 
      <div className="h-[250px] w-full mt-1 rounded-md"> 
        {currentChartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No chart data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentChartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <defs>
              {/* Gradient for area fill */}
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ strokeDasharray: '3 3', stroke: 'hsl(var(--muted-foreground))' }}
            />
            <XAxis 
               dataKey="time" 
               axisLine={false}
               tickLine={true}
               tick={{ fill: mutedColor, fontSize: 14 }}
               dy={13}
               interval={selectedTimeFrame === '1D' ? 1 : selectedTimeFrame === '1M' ? 2 : selectedTimeFrame === '6M' ? 1 : selectedTimeFrame === 'YTD' ? 1 : selectedTimeFrame === '1Y' ? 1 : selectedTimeFrame === 'MAX' ? 1 : 0}
            /> 
            <YAxis 
               axisLine={false}
               tickLine={false}
               tick={{ fill: mutedColor, fontSize: 14 }}
               tickFormatter={formatYAxisTick}
               domain={['dataMin * 0.995', 'dataMax * 1.005']}
               width={60}
            />
            {/* Use the strokeColor for line and gradient for area */}
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={strokeColor} 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorGradient)" 
              dot={false}
              activeDot={{ r: 4, fill: strokeColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Open</span><span>${typeof stock.marketStats.open === 'number' ? stock.marketStats.open.toFixed(2) : 'N/A'}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">High</span><span>${typeof stock.marketStats.high === 'number' ? stock.marketStats.high.toFixed(2) : 'N/A'}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Low</span><span>${typeof stock.marketStats.low === 'number' ? stock.marketStats.low.toFixed(2) : 'N/A'}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Prev Close</span><span>${typeof stock.marketStats.prevClose === 'number' ? stock.marketStats.prevClose.toFixed(2) : 'N/A'}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">52W High</span><span>${typeof stock.marketStats['52W High'] === 'number' ? stock.marketStats['52W High'].toFixed(2) : 'N/A'}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">52W Low</span><span>${typeof stock.marketStats['52W Low'] === 'number' ? stock.marketStats['52W Low'].toFixed(2) : 'N/A'}</span></div>
      </div>

      
    </div>
  )
}