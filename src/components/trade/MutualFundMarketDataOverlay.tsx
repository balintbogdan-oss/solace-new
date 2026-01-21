'use client';

import { useState, useRef, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';

interface MutualFundMarketDataOverlayProps {
  symbol: string;
  name: string;
  nav: number;
  change: number;
  changePercent: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  yearHigh: number;
  yearLow: number;
  expenseRatio: number;
  netAssets: number;
  timestamp: string;
  ytdReturn?: number;
  category?: string;
  yield?: number;
  frontLoad?: string;
  inceptionDate?: string;
}

export function MutualFundMarketDataOverlay({
  symbol,
  name,
  nav,
  change,
  changePercent,
  previousClose,
  expenseRatio,
  netAssets,
  timestamp,
  ytdReturn = 12.30,
  category = 'US Equity Large Cap Blend',
  yield: fundYield = 1.45,
  frontLoad = '-',
  inceptionDate = '13 Nov 2000',
}: MutualFundMarketDataOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);


  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const overlayWidth = 320; // w-80 = 320px
      const overlayHeight = 500; // Approximate overlay height
      const padding = 16; // 16px padding from viewport edges

      let left = rect.right + 10;
      let top = rect.top;

      // Adjust if overlay would go off the right edge
      if (left + overlayWidth > viewportWidth - padding) {
        left = rect.left - overlayWidth - 10;
      }

      // Adjust if overlay would go off the left edge
      if (left < padding) {
        left = padding;
      }

      // Adjust if overlay would go off the bottom edge
      if (top + overlayHeight > viewportHeight - padding) {
        top = viewportHeight - overlayHeight - padding;
      }

      // Ensure overlay doesn't go off the top edge
      if (top < padding) {
        top = padding;
      }

      // Final check: if overlay still doesn't fit, center it
      if (left + overlayWidth > viewportWidth - padding || top + overlayHeight > viewportHeight - padding) {
        left = Math.max(padding, (viewportWidth - overlayWidth) / 2);
        top = Math.max(padding, (viewportHeight - overlayHeight) / 2);
      }

      setPosition({ top, left });
    }
    setIsOpen(!isOpen);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(1)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(1)}K`;
    }
    return formatCurrency(value);
  };

  return (
    <div>
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted hover:bg-muted/80 cursor-pointer transition-colors border"
      >
        <span className="text-xs font-medium text-muted-foreground">i</span>
      </div>

      {isOpen && (
        <>
          {/* 25% black overlay background */}
          <div 
            className="fixed inset-0 z-40 bg-black/25"
            onClick={() => setIsOpen(false)}
          />
          {/* Modal content */}
          <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed z-50 bg-background border rounded-lg shadow-lg p-4 w-80 max-h-[80vh] overflow-y-auto"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              maxWidth: 'calc(100vw - 32px)',
              maxHeight: 'calc(100vh - 32px)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-md font-semibold">{symbol}</div>
                <p className="text-sm text-muted-foreground">{name}</p>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {/* Current NAV */}
              <div className="pb-3 border-b">
                <h2 className="text-2xl font-normal">{formatCurrency(nav)}</h2>
                <div className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
                </div>
              </div>

              {/* Fund Data */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-left">
                  <div className="text-muted-foreground">Previous Close</div>
                  <div className="font-medium">{formatCurrency(previousClose)}</div>
                </div>
                <div className="text-left">
                  <div className="text-muted-foreground">YTD Return</div>
                  <div className="font-medium">{ytdReturn.toFixed(2)}%</div>
                </div>
                <div className="text-left">
                  <div className="text-muted-foreground">Expense Ratio</div>
                  <div className="font-medium">{expenseRatio.toFixed(2)}%</div>
                </div>
                <div className="text-left">
                  <div className="text-muted-foreground">Category</div>
                  <div className="font-medium">{category}</div>
                </div>
                <div className="text-left">
                  <div className="text-muted-foreground">Net Assets</div>
                  <div className="font-medium">{netAssets >= 1000 ? formatLargeNumber(netAssets) : `$${netAssets}B`}</div>
                </div>
                <div className="text-left">
                  <div className="text-muted-foreground">Yield</div>
                  <div className="font-medium">{fundYield.toFixed(2)}%</div>
                </div>
                <div className="text-left">
                  <div className="text-muted-foreground">Front Load</div>
                  <div className="font-medium">{frontLoad}</div>
                </div>
                <div className="text-left">
                  <div className="text-muted-foreground">Inception Date</div>
                  <div className="font-medium">{inceptionDate}</div>
                </div>
              </div>


              {/* Timestamp */}
              <div className="text-xs text-muted-foreground pt-2 border-t">
                {timestamp}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}