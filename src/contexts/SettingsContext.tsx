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
  fontSize: 'sm' | 'base' | 'lg';
  borderRadius: 'none' | 'sm' | 'md' | 'lg';
  logoUrl: string;
  headerBackgroundColor: string;
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
  primaryColor: 'brown', // This will map to the default 142 85 4 color
  fontFamily: 'Inter',
  fontSize: 'base',
  borderRadius: 'md',
  logoUrl: '',
  headerBackgroundColor: '#000000', // Default black header
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
    if (!appearanceVersion || appearanceVersion !== '2') {
      localStorage.removeItem('appearance-settings');
      localStorage.setItem('appearance-settings-version', '2');
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
        // Handle migration from old 'blue' default to new 'brown' default
        if (parsed.primaryColor === 'blue') {
          parsed.primaryColor = 'brown';
        }
        setAppearanceSettings({ ...defaultAppearanceSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved appearance settings:', error);
      }
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
