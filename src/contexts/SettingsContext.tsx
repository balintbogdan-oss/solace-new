'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface NavigationSettings {
  clients: boolean;
  trade: boolean;
  crm: boolean;
  tools: boolean;
}

export interface AppearanceSettings {
  primaryColor: string;
  fontFamily: string;
  headerFontFamily: string;
  bodyFontFamily: string;
  fontSize: 'sm' | 'base' | 'lg';
  borderRadius: 'none' | 'sm' | 'md' | 'lg';
  logoUrl: string;
  headerBackgroundColor: string;
  // Chart and data visualization colors
  chartPositiveColor: string;
  chartNegativeColor: string;
  chartPrimaryColor: string;
  chartSecondaryColor: string;
  // Positive/negative indicators
  positiveColor: string;
  negativeColor: string;
  // Background gradient colors
  gradientStartColor: string;
  gradientEndColor: string;
  // Background and card colors
  backgroundColor: string;
  cardColor: string;
  accentColor: string;
}

interface SettingsContextType {
  navigationSettings: NavigationSettings;
  appearanceSettings: AppearanceSettings;
  updateNavigationSetting: (key: keyof NavigationSettings, value: boolean) => void;
  updateAppearanceSetting: (key: keyof AppearanceSettings, value: string) => void;
  resetSettings: () => void;
  resetAppearanceSettings: () => void;
  isHydrated: boolean;
}

const defaultSettings: NavigationSettings = {
  clients: false, // Hidden by default
  trade: false,   // Hidden by default
  crm: false,     // Hidden by default
  tools: false,   // Hidden by default
};

const defaultAppearanceSettings: AppearanceSettings = {
  primaryColor: '#8B5504', // Classic brown primary
  fontFamily: 'Inter',
  headerFontFamily: 'Source Serif 4',
  bodyFontFamily: 'Inter',
  fontSize: 'base',
  borderRadius: 'md',
  logoUrl: '',
  headerBackgroundColor: '#000000', // Classic black header
  // Chart and data visualization colors - Classic preset
  chartPositiveColor: '#60a821', // Green for positive values
  chartNegativeColor: '#f87171', // Red for negative values
  chartPrimaryColor: '#B8860B', // DarkGoldenrod for primary chart color (muted golden)
  chartSecondaryColor: '#20b2aa', // Teal for secondary chart color
  // Positive/negative indicators
  positiveColor: '#22c55e', // Green for positive indicators
  negativeColor: '#ef4444', // Red for negative indicators
  // Background gradient colors - Classic preset
  gradientStartColor: '#f3eddc', // Light warm color
  gradientEndColor: '#f9f8f3', // Very light warm color
  // Background and card colors - Classic preset
  backgroundColor: '#F1F5F9', // Light gray background
  cardColor: '#ffffff', // White cards
  accentColor: '#f6f6f4', // Light gray with subtle beige undertone
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [navigationSettings, setNavigationSettings] = useState<NavigationSettings>(defaultSettings);
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>(defaultAppearanceSettings);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    setIsHydrated(true);
    
    // One-time migration: clear old appearance settings to force new defaults
    const appearanceVersion = localStorage.getItem('appearance-settings-version');
    if (!appearanceVersion || appearanceVersion !== '6') {
      localStorage.removeItem('appearance-settings');
      localStorage.setItem('appearance-settings-version', '6');
    }
    
    const savedNavigationSettings = localStorage.getItem('navigation-settings');
    const savedAppearanceSettings = localStorage.getItem('appearance-settings');
    
    if (savedNavigationSettings) {
      try {
        const parsed = JSON.parse(savedNavigationSettings);
        setNavigationSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved navigation settings:', error);
      }
    }
    
    if (savedAppearanceSettings) {
      try {
        const parsed = JSON.parse(savedAppearanceSettings);
        // Convert old Source Serif Pro to Source Serif 4
        if (parsed.headerFontFamily === 'Source Serif Pro') {
          parsed.headerFontFamily = 'Source Serif 4';
        }
        
        // Convert old string color names to hex values
        const colorNameToHex = {
          brown: '#8B5504',
          blue: '#3B82F6',
          green: '#22C55E',
          purple: '#A855F7',
          red: '#EF4444',
          orange: '#F97316',
          pink: '#EC4899',
          indigo: '#6366F1',
          teal: '#14B8A6',
        };
        
        if (parsed.primaryColor && colorNameToHex[parsed.primaryColor as keyof typeof colorNameToHex]) {
          parsed.primaryColor = colorNameToHex[parsed.primaryColor as keyof typeof colorNameToHex];
        }
        
        setAppearanceSettings({ ...defaultAppearanceSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved appearance settings:', error);
        // If parsing fails, use defaults
        setAppearanceSettings(defaultAppearanceSettings);
      }
    } else {
      // If no saved settings, use defaults
      setAppearanceSettings(defaultAppearanceSettings);
    }
  }, []);

  // Save settings to localStorage whenever they change (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('navigation-settings', JSON.stringify(navigationSettings));
    }
  }, [navigationSettings, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('appearance-settings', JSON.stringify(appearanceSettings));
    }
  }, [appearanceSettings, isHydrated]);

  const updateNavigationSetting = (key: keyof NavigationSettings, value: boolean) => {
    setNavigationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateAppearanceSetting = (key: keyof AppearanceSettings, value: string) => {
    setAppearanceSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetSettings = () => {
    setNavigationSettings(defaultSettings);
  };

  const resetAppearanceSettings = () => {
    setAppearanceSettings(defaultAppearanceSettings);
  };

  return (
    <SettingsContext.Provider value={{
      navigationSettings,
      appearanceSettings,
      updateNavigationSetting,
      updateAppearanceSetting,
      resetSettings,
      resetAppearanceSettings,
      isHydrated
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
