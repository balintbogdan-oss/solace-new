'use client';

import { useState, useRef, useEffect } from 'react';
import { Info, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketDataOverlayProps {
  currentPrice: number;
  change: number;
  changePercent: number;
  bid: number;
  ask: number;
  lastSize: number;
  bidSize: number;
  askSize: number;
  exchange: string;
  timestamp: string;
  className?: string;
}

export function MarketDataOverlay({
  currentPrice,
  change,
  changePercent,
  bid,
  ask,
  lastSize,
  bidSize,
  askSize,
  exchange,
  timestamp,
  className
}: MarketDataOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const overlayWidth = 320; // Approximate width of the overlay
      const overlayHeight = 200; // Approximate height of the overlay
      
      let left = rect.right + 8; // Default: show to the right
      let top = rect.top;

      // Adjust if would go off screen to the right
      if (left + overlayWidth > viewportWidth) {
        left = rect.left - overlayWidth - 8; // Show to the left instead
      }

      // Adjust if would go off screen to the bottom
      if (top + overlayHeight > viewportHeight) {
        top = viewportHeight - overlayHeight - 8;
      }

      // Ensure it doesn't go off screen to the top
      if (top < 8) {
        top = 8;
      }

      setPosition({ top, left });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isOpen]);

  const formatPrice = (price: number) => price.toFixed(2);
  const formatChange = (change: number) => change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2);
  const formatPercent = (percent: number) => percent >= 0 ? `+${percent.toFixed(2)}%` : `${percent.toFixed(2)}%`;

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors",
          className
        )}
      >
        <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Overlay */}
          <div
            ref={overlayRef}
            className="fixed z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-[320px]"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Market Data</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {/* Current Price and Change */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${formatPrice(currentPrice)}
                </div>
                <div className={cn(
                  "text-sm font-medium",
                  change >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {formatChange(change)} ({formatPercent(changePercent)})
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bid</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatPrice(bid)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-1">Ask</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatPrice(ask)}
                </div>
              </div>
            </div>

            {/* Size Information */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Size</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {lastSize}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{exchange}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bid Size</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {bidSize}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{exchange}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ask Size</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {askSize}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{exchange}</div>
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
              <span>{timestamp}</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
