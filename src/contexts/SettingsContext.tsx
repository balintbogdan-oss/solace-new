'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface NavigationSettings {
  clients: boolean;
  trade: boolean;
  crm: boolean;
  tools: boolean;
}

interface SettingsContextType {
  navigationSettings: NavigationSettings;
  updateNavigationSetting: (key: keyof NavigationSettings, value: boolean) => void;
  resetSettings: () => void;
  isHydrated: boolean;
}

const defaultSettings: NavigationSettings = {
  clients: false, // Hidden by default
  trade: false,   // Hidden by default
  crm: false,     // Hidden by default
  tools: false,   // Hidden by default
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [navigationSettings, setNavigationSettings] = useState<NavigationSettings>(defaultSettings);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    setIsHydrated(true);
    const savedSettings = localStorage.getItem('navigation-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setNavigationSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved navigation settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('navigation-settings', JSON.stringify(navigationSettings));
    }
  }, [navigationSettings, isHydrated]);

  const updateNavigationSetting = (key: keyof NavigationSettings, value: boolean) => {
    setNavigationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetSettings = () => {
    setNavigationSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{
      navigationSettings,
      updateNavigationSetting,
      resetSettings,
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
