'use client';

import { useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const { appearanceSettings, isHydrated } = useSettings();

  // Set primary color immediately, even before hydration
  useEffect(() => {
    // Convert hex color to RGB format
    const hexToRgb = (hex: string): string => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (result) {
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        return `${r} ${g} ${b}`;
      }
      return '142 85 4'; // Default brown color
    };
    
    const primaryColorRgb = hexToRgb(appearanceSettings.primaryColor);
    document.documentElement.style.setProperty('--primary', primaryColorRgb);
  }, [appearanceSettings.primaryColor]);

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

    // Primary color is now set in the separate useEffect above

    // Apply header background color
    if (appearanceSettings.headerBackgroundColor) {
      document.documentElement.style.setProperty('--header-bg', appearanceSettings.headerBackgroundColor);
    }

    // Apply chart colors
    if (appearanceSettings.chartPositiveColor) {
      document.documentElement.style.setProperty('--chart-positive', appearanceSettings.chartPositiveColor);
    }
    if (appearanceSettings.chartNegativeColor) {
      document.documentElement.style.setProperty('--chart-negative', appearanceSettings.chartNegativeColor);
    }
    if (appearanceSettings.chartPrimaryColor) {
      document.documentElement.style.setProperty('--chart-primary', appearanceSettings.chartPrimaryColor);
    }
    if (appearanceSettings.chartSecondaryColor) {
      document.documentElement.style.setProperty('--chart-secondary', appearanceSettings.chartSecondaryColor);
    }

    // Apply positive/negative colors
    if (appearanceSettings.positiveColor) {
      document.documentElement.style.setProperty('--positive', appearanceSettings.positiveColor);
    }
    if (appearanceSettings.negativeColor) {
      document.documentElement.style.setProperty('--negative', appearanceSettings.negativeColor);
    }

    // Apply gradient colors
    if (appearanceSettings.gradientStartColor) {
      const hexToRgb = (hex: string): string => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
          const r = parseInt(result[1], 16);
          const g = parseInt(result[2], 16);
          const b = parseInt(result[3], 16);
          return `${r} ${g} ${b}`;
        }
        return '243 237 220'; // Default gradient start
      };
      const startRgb = hexToRgb(appearanceSettings.gradientStartColor);
      document.documentElement.style.setProperty('--gradient-start', startRgb);
    }
    if (appearanceSettings.gradientEndColor) {
      const hexToRgb = (hex: string): string => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
          const r = parseInt(result[1], 16);
          const g = parseInt(result[2], 16);
          const b = parseInt(result[3], 16);
          return `${r} ${g} ${b}`;
        }
        return '249 248 243'; // Default gradient end
      };
      const endRgb = hexToRgb(appearanceSettings.gradientEndColor);
      document.documentElement.style.setProperty('--gradient-end', endRgb);
    }

    // Apply background and card colors
    if (appearanceSettings.backgroundColor) {
      const hexToRgb = (hex: string): string => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
          const r = parseInt(result[1], 16);
          const g = parseInt(result[2], 16);
          const b = parseInt(result[3], 16);
          return `${r} ${g} ${b}`;
        }
        return '255 255 255'; // Default white background
      };
      const backgroundRgb = hexToRgb(appearanceSettings.backgroundColor);
      document.documentElement.style.setProperty('--background', backgroundRgb);
    }
    if (appearanceSettings.cardColor) {
      const hexToRgb = (hex: string): string => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
          const r = parseInt(result[1], 16);
          const g = parseInt(result[2], 16);
          const b = parseInt(result[3], 16);
          return `${r} ${g} ${b}`;
        }
        return '255 255 255'; // Default white card
      };
      const cardRgb = hexToRgb(appearanceSettings.cardColor);
      document.documentElement.style.setProperty('--card', cardRgb);
    }
    if (appearanceSettings.accentColor) {
      // Apply accent color to --accent CSS variable
      const hexToRgb = (hex: string): string => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
          const r = parseInt(result[1], 16);
          const g = parseInt(result[2], 16);
          const b = parseInt(result[3], 16);
          return `${r} ${g} ${b}`;
        }
        return '246 245 244'; // Default fallback
      };
      const accentRgb = hexToRgb(appearanceSettings.accentColor);
      document.documentElement.style.setProperty('--accent', accentRgb);
    }

  }, [appearanceSettings, isHydrated]);

  return <>{children}</>;
}
