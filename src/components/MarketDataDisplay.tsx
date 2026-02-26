'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface MarketDataSummary {
  totalStocks: number;
  totalOptions: number;
  lastUpdated: string;
}

interface SampleMarketData {
  symbol: string;
  currentPrice: number;
  previousClose: number;
  dayChange: number;
  dayChangePercent: number;
  volume: number;
  marketCap: number;
  lastUpdated: string;
}

export default function MarketDataDisplay() {
  const [summary, setSummary] = useState<MarketDataSummary | null>(null);
  const [sampleData, setSampleData] = useState<SampleMarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/test-market-data');
      const data = await response.json();
      
      if (response.ok) {
        setSummary(data.summary);
        setSampleData(data.sampleData);
      } else {
        setError(data.error || 'Failed to load market data');
      }
    } catch {
      setError('Network error loading market data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading market data...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Button onClick={loadData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Market Data Summary</h3>
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Total Stocks</div>
            <div className="text-2xl font-bold">{summary?.totalStocks.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total Options</div>
            <div className="text-2xl font-bold">{summary?.totalOptions.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Last Updated</div>
            <div className="text-sm">{summary?.lastUpdated ? new Date(summary.lastUpdated).toLocaleString() : 'N/A'}</div>
          </div>
        </div>
      </Card>

      {/* Sample Data */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sample Stock Data</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Symbol</th>
                <th className="text-right py-2">Current Price</th>
                <th className="text-right py-2">Previous Close</th>
                <th className="text-right py-2">Day Change</th>
                <th className="text-right py-2">Day Change %</th>
                <th className="text-right py-2">Volume</th>
                <th className="text-right py-2">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((stock) => (
                <tr key={stock.symbol} className="border-b">
                  <td className="py-2 font-medium">{stock.symbol}</td>
                  <td className="py-2 text-right">${stock.currentPrice.toFixed(2)}</td>
                  <td className="py-2 text-right">${stock.previousClose.toFixed(2)}</td>
                  <td className={`py-2 text-right ${stock.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.dayChange >= 0 ? '+' : ''}${stock.dayChange.toFixed(2)}
                  </td>
                  <td className={`py-2 text-right ${stock.dayChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.dayChangePercent >= 0 ? '+' : ''}{stock.dayChangePercent.toFixed(2)}%
                  </td>
                  <td className="py-2 text-right">{stock.volume.toLocaleString()}</td>
                  <td className="py-2 text-right">${(stock.marketCap / 1000000000).toFixed(1)}B</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
