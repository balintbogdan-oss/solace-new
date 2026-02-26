'use client'

import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedDigitProps {
  digit: string;
  direction: 'up' | 'down';
  className?: string;
}

// Memoized component for animating a single digit
const AnimatedDigit: React.FC<AnimatedDigitProps> = memo(({ digit, direction, className }) => {
  const variants = {
    initial: (dir: number) => ({ y: dir * 20, opacity: 0 }),
    animate: { y: 0, opacity: 1 },
    exit: (dir: number) => ({ y: dir * -20, opacity: 0 }),
  };

  return (
    <div 
        style={{ position: 'relative', lineHeight: 1.2 }} 
        className={className}
    >
      <AnimatePresence initial={false} custom={direction === 'up' ? 1 : -1}>
        <motion.span
          key={digit} 
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          custom={direction === 'up' ? 1 : -1}
          transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }} 
          style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
      {/* Placeholder for layout sizing - Apply className */}
      <span style={{ visibility: 'hidden' }} className={className}>{digit}</span>
    </div>
  );
});

AnimatedDigit.displayName = 'AnimatedDigit';

interface AnimatedPriceDisplayProps {
  price: number;
  className?: string; // Allow passing Tailwind classes
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

// Main component to display the animated price
export const AnimatedPriceDisplay: React.FC<AnimatedPriceDisplayProps> = ({
  price,
  className = '',
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
}) => {
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [direction, setDirection] = useState<'up' | 'down'>('up');

  useEffect(() => {
    if (previousPrice !== null) {
      setDirection(price > previousPrice ? 'up' : 'down');
    }
    setPreviousPrice(price);
  }, [price, previousPrice]);

  const formatOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD', // Assuming USD, make this dynamic if needed
    minimumFractionDigits,
    maximumFractionDigits,
  };

  const formattedPrice = price.toLocaleString('en-US', formatOptions);
  const prevFormattedPrice = previousPrice?.toLocaleString('en-US', formatOptions) || formattedPrice;

  // Ensure strings are the same length for comparison (pad if necessary)
  const maxLength = Math.max(formattedPrice.length, prevFormattedPrice.length);
  const currentChars = formattedPrice.padStart(maxLength, ' ').split('');
  const prevChars = prevFormattedPrice.padStart(maxLength, ' ').split('');

  return (
    <h3 className={`flex ${className}`}>
      {currentChars.map((char, index) => {
        const prevChar = prevChars[index];
        const isDigit = /\d/.test(char);
        const digitChanged = isDigit && char !== prevChar;

        if (digitChanged) {
          return (
            <AnimatedDigit
              key={index}
              digit={char}
              direction={direction}
              className="relative" // Needed for absolute positioning inside
            />
          );
        } else {
          // Render static characters ($, ., comma, or unchanged digits)
          return <span key={index}>{char}</span>;
        }
      })}
    </h3>
  );
}; 