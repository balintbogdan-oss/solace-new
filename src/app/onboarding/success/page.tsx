'use client';

import React, { useEffect, useState } from 'react';
import { BookmarkCheck, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function OnboardingSuccessPage() {
  const [checkmarkVisible, setCheckmarkVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [rippleVisible, setRippleVisible] = useState(false);

  useEffect(() => {
    // Trigger animations in sequence
    const timer2 = setTimeout(() => setCheckmarkVisible(true), 300);
    const timer3 = setTimeout(() => setRippleVisible(true), 500);
    const timer4 = setTimeout(() => setTextVisible(true), 600);
    const timer5 = setTimeout(() => setButtonVisible(true), 900);

    return () => {
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-1 h-3 bg-white"></div>
            <div className="w-1 h-4 bg-white"></div>
            <div className="w-1 h-5 bg-white"></div>
          </div>
        </div>
        
        {/* Page Title */}
        <h1 className="text-lg font-medium">Create account</h1>
        
        {/* Close Button */}
        <button className="flex items-center space-x-1 text-white hover:text-gray-300 transition-colors">
          <X className="w-4 h-4" />
          <span>Close</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="text-center max-w-md mx-auto">
          {/* Success Icon with Ripple Effect */}
          <div className="relative mx-auto mb-6 w-16 h-16 flex items-center justify-center">
            {/* Ripple Circles */}
            <div className={cn(
              "absolute inset-0 rounded-full transition-all duration-1000 ease-out",
              rippleVisible ? "opacity-0 scale-150 border-2 border-[#4D7C0F]" : "opacity-30 scale-100"
            )}></div>
            <div className={cn(
              "absolute inset-0 rounded-full transition-all duration-1000 ease-out",
              rippleVisible ? "opacity-0 scale-200 border-2 border-[#4D7C0F]" : "opacity-20 scale-100"
            )}></div>
            <div className={cn(
              "absolute inset-0 rounded-full transition-all duration-1000 ease-out",
              rippleVisible ? "opacity-0 scale-250 border-2 border-[#4D7C0F]" : "opacity-10 scale-100"
            )}></div>
            
            {/* Main Icon */}
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ease-out relative z-10",
              checkmarkVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
            )} style={{ backgroundColor: '#ECFCCB' }}>
              <BookmarkCheck className="w-8 h-8" style={{ color: '#4D7C0F' }} />
            </div>
          </div>

          {/* Heading */}
          <h2 className={cn(
            "text-3xl font-normal text-gray-900 mb-4 transition-all duration-500 ease-out",
            textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            Application received
          </h2>

          {/* Description */}
          <p className={cn(
            "text-gray-700 mb-8 leading-relaxed transition-all duration-500 ease-out delay-200",
            textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            The signature request has been sent to the client. Once the client signs, we&apos;ll review the application. No further action is needed on your end at this time.
          </p>

          {/* Return to Home Button */}
          <Link href="/">
            <button className={cn(
              "bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 ease-out",
              buttonVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              Return to Home
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
