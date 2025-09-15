'use client';

import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptionsMarketDataOverlayProps {
  bid: number;
  bidContracts: number;
  ask: number;
  askContracts: number;
  last: number;
  lastContracts: number;
  exchange: string;
  lastTime: string;
  underlyingLast: number;
  className?: string;
}

export function OptionsMarketDataOverlay({
  bid,
  bidContracts,
  ask,
  askContracts,
  last,
  lastContracts,
  exchange,
  lastTime,
  underlyingLast,
  className
}: OptionsMarketDataOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const overlayWidth = 300; // Approximate width of the overlay
      const overlayHeight = 180; // Approximate height of the overlay
      
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
          {/* 25% black overlay background */}
          <div 
            className="fixed inset-0 z-40 bg-black/25" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Overlay */}
          <div
            ref={overlayRef}
            className="fixed z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-[300px]"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            {/* Market Data */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Bid:</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  ${formatPrice(bid)} ({bidContracts} contracts)
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Ask:</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  ${formatPrice(ask)} ({askContracts} contracts)
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last:</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  ${formatPrice(last)} ({lastContracts} contracts, {exchange}) @ {lastTime}
                </span>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Underlying Last:</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  ${formatPrice(underlyingLast)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
