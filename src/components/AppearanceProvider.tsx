'use client';

import { useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useUserRole } from '@/contexts/UserRoleContext';

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const { appearanceSettings, isHydrated } = useSettings();
  const { role, isHydrated: roleHydrated } = useUserRole();

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

  // Separate useEffect for font application using Next.js font variables
  useEffect(() => {
    if (!isHydrated || !roleHydrated) return;

    console.log('Font settings changed:', {
      headerFontFamily: appearanceSettings.headerFontFamily,
      bodyFontFamily: appearanceSettings.bodyFontFamily,
      role
    });

    // For clients, always use Inter for headers; for advisors, use settings
    const headerFontFamily = role === 'client' 
      ? 'Inter' 
      : (appearanceSettings.headerFontFamily || 'Inter');
    const bodyFontFamily = appearanceSettings.bodyFontFamily || 'Inter';
    
    // Map font names to their CSS variable names
    const getFontVariable = (fontName: string): string => {
      const fontMap: Record<string, string> = {
        'Source Serif 4': '--font-source-serif-4',
        'Source Serif Pro': '--font-source-serif-4', // Alias for backward compatibility
        'Inter': '--font-inter',
        'Schibsted Grotesk': '--font-schibsted-grotesk',
        'Funnel Sans': '--font-funnel-sans',
        'Corben': '--font-corben',
        'Fraunces': '--font-fraunces',
        'IBM Plex Serif': '--font-ibm-plex-serif',
        'Geist': '--font-geist-sans',
      };
      return fontMap[fontName] || '--font-inter';
    };

    // Apply header font
    const headerFontVar = getFontVariable(headerFontFamily);
    const headerFontStack = `var(${headerFontVar}), Inter, system-ui, -apple-system, sans-serif`;
    document.documentElement.style.setProperty('--font-family-headers', headerFontStack);
    console.log('Applied header font:', headerFontFamily, '→', headerFontStack);

    // Apply body font
    const bodyFontVar = getFontVariable(bodyFontFamily);
    const bodyFontStack = `var(${bodyFontVar}), Inter, system-ui, -apple-system, sans-serif`;
    document.documentElement.style.setProperty('--font-family', bodyFontStack);
    console.log('Applied body font:', bodyFontFamily, '→', bodyFontStack);

    // Debug: Check what fonts are actually applied
    setTimeout(() => {
      const computedStyle = getComputedStyle(document.documentElement);
      console.log('Current CSS variables:', {
        '--font-family-headers': computedStyle.getPropertyValue('--font-family-headers'),
        '--font-family': computedStyle.getPropertyValue('--font-family')
      });
      
      // Also check a specific element
      const testElement = document.querySelector('h1');
      if (testElement) {
        const elementStyle = getComputedStyle(testElement);
        console.log('H1 element font-family:', elementStyle.fontFamily);
      }
    }, 100);

  }, [appearanceSettings.headerFontFamily, appearanceSettings.bodyFontFamily, isHydrated, role, roleHydrated]);

  // Set background color based on role
  useEffect(() => {
    if (!isHydrated || !roleHydrated) return;
    
    // Set background color based on role
    // Advisor (Solace): #F5F5F4 (245 245 244)
    // Client: #F1F5F9 (241 245 249)
    const backgroundRgb = role === 'advisor' ? '245 245 244' : '241 245 249';
    document.documentElement.style.setProperty('--background', backgroundRgb);
  }, [role, isHydrated, roleHydrated]);

  // Separate useEffect for other appearance settings
  useEffect(() => {
    if (!isHydrated) return;

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
    // Note: Background color is now controlled by CSS file, not AppearanceProvider
    // if (appearanceSettings.backgroundColor) {
    //   const hexToRgb = (hex: string): string => {
    //     const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    //     if (result) {
    //       const r = parseInt(result[1], 16);
    //       const g = parseInt(result[2], 16);
    //       const b = parseInt(result[3], 16);
    //       return `${r} ${g} ${b}`;
    //     }
    //     return '255 255 255'; // Default white background
    //   };
    //   const backgroundRgb = hexToRgb(appearanceSettings.backgroundColor);
    //   document.documentElement.style.setProperty('--background', backgroundRgb);
    // }
    if (appearanceSettings.cardColor) {
      // Check if dark mode is active
      const isDarkMode = document.documentElement.classList.contains('dark');
      
      // Only apply custom card color in light mode
      // In dark mode, let the CSS handle it
      if (!isDarkMode) {
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
      } else {
        // In dark mode, remove any inline style override to let CSS handle it
        document.documentElement.style.removeProperty('--card');
      }
    }
    if (appearanceSettings.accentColor) {
      // Check if dark mode is active
      const isDarkMode = document.documentElement.classList.contains('dark');
      
      // Only apply custom accent color in light mode
      // In dark mode, let the CSS handle it
      if (!isDarkMode) {
        const hexToRgb = (hex: string): string => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          if (result) {
            const r = parseInt(result[1], 16);
            const g = parseInt(result[2], 16);
            const b = parseInt(result[3], 16);
            return `${r} ${g} ${b}`;
          }
          return '246 246 244'; // Default fallback - light gray with subtle beige undertone
        };
        const accentRgb = hexToRgb(appearanceSettings.accentColor);
        document.documentElement.style.setProperty('--accent', accentRgb);
      } else {
        // In dark mode, remove any inline style override to let CSS handle it
        document.documentElement.style.removeProperty('--accent');
      }
    }

  }, [
    appearanceSettings.fontSize,
    appearanceSettings.borderRadius,
    appearanceSettings.headerBackgroundColor,
    appearanceSettings.chartPositiveColor,
    appearanceSettings.chartNegativeColor,
    appearanceSettings.chartPrimaryColor,
    appearanceSettings.chartSecondaryColor,
    appearanceSettings.positiveColor,
    appearanceSettings.negativeColor,
    appearanceSettings.gradientStartColor,
    appearanceSettings.gradientEndColor,
    appearanceSettings.backgroundColor,
    appearanceSettings.cardColor,
    appearanceSettings.accentColor,
    isHydrated
  ]);

  // Watch for theme changes and update card/accent colors accordingly
  useEffect(() => {
    if (!isHydrated) return;

    const updateColors = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      
      // Update card color
      if (appearanceSettings.cardColor) {
        if (!isDarkMode) {
          const hexToRgb = (hex: string): string => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (result) {
              const r = parseInt(result[1], 16);
              const g = parseInt(result[2], 16);
              const b = parseInt(result[3], 16);
              return `${r} ${g} ${b}`;
            }
            return '255 255 255';
          };
          const cardRgb = hexToRgb(appearanceSettings.cardColor);
          document.documentElement.style.setProperty('--card', cardRgb);
        } else {
          document.documentElement.style.removeProperty('--card');
        }
      }
      
      // Update accent color
      if (appearanceSettings.accentColor) {
        if (!isDarkMode) {
          const hexToRgb = (hex: string): string => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (result) {
              const r = parseInt(result[1], 16);
              const g = parseInt(result[2], 16);
              const b = parseInt(result[3], 16);
              return `${r} ${g} ${b}`;
            }
            return '246 246 244';
          };
          const accentRgb = hexToRgb(appearanceSettings.accentColor);
          document.documentElement.style.setProperty('--accent', accentRgb);
        } else {
          document.documentElement.style.removeProperty('--accent');
        }
      }
    };

    // Initial check
    updateColors();

    // Watch for theme changes
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, [appearanceSettings.cardColor, appearanceSettings.accentColor, isHydrated]);

  // Apply Webush Next blue theme for clients and set data-theme attribute
  useEffect(() => {
    if (!roleHydrated) return;

    // Set data-theme attribute based on role
    if (role === 'client') {
      document.documentElement.setAttribute('data-theme', 'wedbush-next');
      
      // Webush Next blue theme colors
      const webushColors = {
        primary: '44 84 201', // #2c54c9 (blue-500)
        headerBg: '4 19 64', // #041340 (wedbush-next-brand/950)
        avatarBg: '30 58 138', // #1e3a8a (wedbush-next-brand/900)
        welcomeBanner: '16 33 83', // #102153
        accentCyan: '114 202 196', // #72cac4
      };

      // Apply primary blue color
      document.documentElement.style.setProperty('--primary', webushColors.primary);
      
      // Apply header background
      document.documentElement.style.setProperty('--header-bg', webushColors.headerBg);
      
      // Store Webush colors for use in components
      document.documentElement.style.setProperty('--webush-primary', webushColors.primary);
      document.documentElement.style.setProperty('--webush-header-bg', webushColors.headerBg);
      document.documentElement.style.setProperty('--webush-avatar-bg', webushColors.avatarBg);
      document.documentElement.style.setProperty('--webush-welcome-banner', webushColors.welcomeBanner);
      document.documentElement.style.setProperty('--webush-accent-cyan', webushColors.accentCyan);
    } else {
      // Remove data-theme for advisor (Solace theme)
      document.documentElement.removeAttribute('data-theme');
    }
  }, [role, roleHydrated]);

  return <>{children}</>;
}
