'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Star, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from "@/components/ui/button"
import { AnimatedPriceDisplay } from '@/components/ui/AnimatedPriceDisplay'
import { StockInfo } from './StockDetailPanel' // Assuming StockInfo is exported from here
import { MutualFundInfo } from '@/types/account'

interface SecurityHeaderProps {
  symbol: string;
  stock?: StockInfo;
  mutualFund?: MutualFundInfo;
  isPositive: boolean;
  isWatchlisted: boolean;
  onChangeSymbolClick: () => void;
  onAddToWatchlist: () => void;
  onClose?: () => void;
  isDrawer?: boolean;
}

export const SecurityHeader: React.FC<SecurityHeaderProps> = ({
  symbol,
  stock,
  mutualFund,
  isPositive,
  isWatchlisted,
  onChangeSymbolClick,
  onAddToWatchlist,
  onClose,
  isDrawer = false,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Set initial time on client side only - static, no ticking
    setCurrentTime(new Date().toLocaleTimeString());
  }, []);

  // Determine which data to use
  const securityData = mutualFund || stock;
  if (!securityData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-3 md:gap-2">
      {/* Top Row: Exchange Info and Action Buttons */}
      <div className="flex justify-between items-center">
        {/* Exchange Info - Moved here */}
        <p className="text-xs text-muted-foreground">
            {securityData.exchangeInfo}
        </p>
        {/* Right side: Action Buttons - Moved here */}
        <div className="flex items-center gap-2">
          {/* Watchlist Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onAddToWatchlist}
            className="overflow-hidden  dark:border"
          >
              <AnimatePresence initial={false} mode="wait"> 
                <motion.span
                    key={isWatchlisted ? "watchlisted" : "not-watchlisted"} 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center"
                >
                  <Star 
                      className={cn(
                        "h-4 w-4 mr-2 transition-colors duration-200",
                        isWatchlisted ? "fill-blue-400 text-blue-500" : "fill-none"
                      )}
                  />
                  {isWatchlisted ? "In Watchlist" : "Add to Watchlist"}
                </motion.span>
              </AnimatePresence>
          </Button>
          {/* Close Button - Render conditionally */}
          {onClose && (
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={onClose}
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Row: Symbol, Price */}
      <div className="space-y-1"> 
        {/* Exchange Info - Removed from here */}
        {/* Symbol and Search Button */}
        <div className="flex items-center gap-2 mb-1">
          <h2 className={isDrawer ? "text-xl md:text-2xl" : "text-4xl"}>{symbol?.toUpperCase()}</h2>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={onChangeSymbolClick} 
            className="p-2 aspect-square" 
            aria-label="Change symbol"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {/* Price and Change */}
        <div className="flex items-baseline gap-1.5 sm:gap-2 w-full">
          <AnimatedPriceDisplay 
            price={mutualFund ? mutualFund.nav : stock?.price || 0} 
            className="text-lg sm:text-xl md:text-2xl font-medium" 
          />
          <span className={cn(
            "text-sm sm:text-base md:text-lg font-medium", 
            isPositive ? "text-positive" : "text-negative"
          )}>
            {isPositive ? '+' : ''}{securityData.change.toFixed(2)} ({isPositive ? '+' : ''}{securityData.changePercent.toFixed(2)}%)
          </span>
        </div>
        {/* Last Updated Timestamp */}
        <div className="text-xs text-muted-foreground">
          Last updated: {isMounted ? currentTime : '...'}
        </div>
      </div>
    </div>
  );
}; 