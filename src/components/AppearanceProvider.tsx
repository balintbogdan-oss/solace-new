'use client';

import { useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const { appearanceSettings, isHydrated } = useSettings();

  useEffect(() => {
    if (!isHydrated) return;

    // Apply font families
    const headerFontFamily = appearanceSettings.headerFontFamily || 'Inter';
    const bodyFontFamily = appearanceSettings.bodyFontFamily || 'Inter';
    
    // Load Google Fonts for both header and body (skip fonts already loaded by Next.js)
    const fontsToLoad = new Set([headerFontFamily, bodyFontFamily]);
    
    fontsToLoad.forEach(fontFamily => {
      // Skip fonts that are already loaded by Next.js
      if (fontFamily && fontFamily !== 'Inter' && fontFamily !== 'Source Serif 4') {
        // Check if font is already loaded to avoid duplicates
        const fontName = fontFamily.replace(/\s+/g, '+');
        const existingLink = document.querySelector(`link[href*="${fontName}"]`);
        if (!existingLink) {
          const link = document.createElement('link');
          link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@300;400;500;600;700&display=swap`;
          link.rel = 'stylesheet';
          link.crossOrigin = 'anonymous';
          
          // Wait for font to load before applying
          link.onload = () => {
            // Force a re-render to apply the new font
            const event = new Event('fontloaded');
            window.dispatchEvent(event);
          };
          
          link.onerror = () => {
            console.error('Failed to load font:', fontFamily);
          };
          
          document.head.appendChild(link);
        }
      }
    });

    // Apply fonts to document with fallbacks
    const applyFonts = () => {
      // Use Next.js font variables when available, otherwise fall back to dynamic loading
      if (headerFontFamily === 'Source Serif 4' || headerFontFamily === 'Source Serif Pro') {
        document.documentElement.style.setProperty('--font-family-headers', 'var(--font-source-serif-4), Inter, sans-serif');
      } else {
        document.documentElement.style.setProperty('--font-family-headers', `"${headerFontFamily}", Inter, sans-serif`);
      }
      
      if (bodyFontFamily === 'Inter') {
        document.documentElement.style.setProperty('--font-family', 'var(--font-inter), Inter, sans-serif');
      } else {
        document.documentElement.style.setProperty('--font-family', `"${bodyFontFamily}", Inter, sans-serif`);
      }
    };
    
    applyFonts();
    
    // Listen for font loaded events to reapply fonts
    const handleFontLoaded = () => {
      applyFonts();
    };
    
    window.addEventListener('fontloaded', handleFontLoaded);
    
    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('fontloaded', handleFontLoaded);
    };

    // Apply font size
    const fontSizeMap = {
      sm: '14px',
      base: '16px',
      lg: '18px',
    };
    document.documentElement.style.setProperty('--font-size-base', fontSizeMap[appearanceSettings.fontSize]);

    // Apply border radius
    const borderRadiusMap = {
      none: '0px',
      sm: '4px',
      md: '8px',
      lg: '12px',
    };
    document.documentElement.style.setProperty('--border-radius', borderRadiusMap[appearanceSettings.borderRadius]);

    // Apply primary color (RGB format for Tailwind alpha support)
    const colorMap = {
      brown: '142 85 4', // Default brown color
      blue: '59 130 246', // blue-500
      green: '34 197 94', // green-500
      purple: '168 85 247', // purple-500
      red: '239 68 68', // red-500
      orange: '249 115 22', // orange-500
      pink: '236 72 153', // pink-500
      indigo: '99 102 241', // indigo-500
      teal: '20 184 166', // teal-500
    };
    document.documentElement.style.setProperty('--primary', colorMap[appearanceSettings.primaryColor as keyof typeof colorMap] || '142 85 4');

    // Apply header background color
    if (appearanceSettings.headerBackgroundColor) {
      document.documentElement.style.setProperty('--header-bg', appearanceSettings.headerBackgroundColor);
    }

  }, [appearanceSettings, isHydrated]);

  return <>{children}</>;
}
