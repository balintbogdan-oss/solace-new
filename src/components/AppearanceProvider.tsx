'use client';

import { useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const { appearanceSettings, isHydrated } = useSettings();

  useEffect(() => {
    if (!isHydrated) return;

    // Apply font family
    const fontFamily = appearanceSettings.fontFamily;
    if (fontFamily && fontFamily !== 'Inter') {
      // Load Google Font
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      // Apply font to document
      document.documentElement.style.setProperty('--font-family', fontFamily);
    } else {
      document.documentElement.style.setProperty('--font-family', 'Inter, sans-serif');
    }

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
