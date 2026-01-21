'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useSettings } from '@/contexts/SettingsContext';
import { RotateCcw, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export default function AppearanceSettingsPage() {
  const { 
    appearanceSettings, 
    updateAppearanceSetting, 
    resetAppearanceSettings 
  } = useSettings();
  
  
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  // Default appearance settings for comparison
  const defaultAppearanceSettings = {
    primaryColor: '#8B5504',
    fontFamily: 'Inter',
    headerFontFamily: 'Source Serif 4',
    bodyFontFamily: 'Inter',
    fontSize: 'base' as const,
    borderRadius: 'md' as const,
    logoUrl: '',
    headerBackgroundColor: '#000000',
    chartPositiveColor: '#60a821',
    chartNegativeColor: '#f87171',
    chartPrimaryColor: '#B8860B',
    chartSecondaryColor: '#20b2aa',
    positiveColor: '#22c55e',
    negativeColor: '#ef4444',
    gradientStartColor: '#f3eddc',
    gradientEndColor: '#f9f8f3',
    backgroundColor: '#ffffff',
    cardColor: '#ffffff',
    accentColor: '#f6f6f4',
  };

  // Check if any settings have diverged from defaults
  const hasSettingsChanged = () => {
    return Object.keys(defaultAppearanceSettings).some(key => {
      const currentValue = appearanceSettings[key as keyof typeof appearanceSettings];
      const defaultValue = defaultAppearanceSettings[key as keyof typeof defaultAppearanceSettings];
      return currentValue !== defaultValue;
    });
  };

  const settingsChanged = hasSettingsChanged();

  // Check if a specific setting has changed from default
  const isSettingChanged = (key: keyof typeof appearanceSettings) => {
    const currentValue = appearanceSettings[key];
    const defaultValue = defaultAppearanceSettings[key as keyof typeof defaultAppearanceSettings];
    return currentValue !== defaultValue;
  };

  const handleAppearanceChange = (key: keyof typeof appearanceSettings, value: string) => {
    updateAppearanceSetting(key, value);
    // Clear any selected preset when manually changing colors
    setSelectedPreset(null);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.includes('png') && !file.type.includes('svg')) {
        alert('Please upload a PNG or SVG file');
        return;
      }
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateAppearanceSetting('logoUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    updateAppearanceSetting('logoUrl', '');
  };

  const handleReset = () => {
    resetAppearanceSettings();
    setSelectedPreset(null);
    toast.success('Appearance settings reset to defaults', {
      description: 'All colors, fonts, and layout settings have been restored to their default values.',
      duration: 4000,
    });
  };

  const handlePresetSelect = (preset: typeof colorPresets[0]) => {
    updateAppearanceSetting('primaryColor', preset.primaryColor);
    updateAppearanceSetting('headerBackgroundColor', preset.headerBackgroundColor);
    updateAppearanceSetting('chartPositiveColor', preset.chartPositiveColor);
    updateAppearanceSetting('chartNegativeColor', preset.chartNegativeColor);
    updateAppearanceSetting('chartPrimaryColor', preset.chartPrimaryColor);
    updateAppearanceSetting('chartSecondaryColor', preset.chartSecondaryColor);
    updateAppearanceSetting('positiveColor', preset.positiveColor);
    updateAppearanceSetting('negativeColor', preset.negativeColor);
    updateAppearanceSetting('gradientStartColor', preset.gradientStartColor);
    updateAppearanceSetting('gradientEndColor', preset.gradientEndColor);
    updateAppearanceSetting('backgroundColor', preset.backgroundColor);
    updateAppearanceSetting('cardColor', preset.cardColor);
    updateAppearanceSetting('accentColor', preset.accentColor);
    setSelectedPreset(preset.name);
    
    toast.success(`${preset.name} preset applied`, {
      description: 'All appearance settings have been updated to match this preset.',
      duration: 3000,
    });
  };


  const colorPresets = [
    { 
      name: 'Classic', 
      primaryColor: '#8B5504', 
      headerBackgroundColor: '#000000',
      chartPositiveColor: '#60a821',
      chartNegativeColor: '#f87171',
      chartPrimaryColor: '#B8860B', // DarkGoldenrod - muted golden color
      chartSecondaryColor: '#20b2aa',
      positiveColor: '#22c55e',
      negativeColor: '#ef4444',
      gradientStartColor: '#f3eddc',
      gradientEndColor: '#f9f8f3',
      backgroundColor: '#ffffff',
      cardColor: '#ffffff',
      accentColor: '#f6f6f4',
      description: 'Brown primary with black header'
    },
    { 
      name: 'Ocean', 
      primaryColor: '#3B82F6', 
      headerBackgroundColor: '#1e40af',
      chartPositiveColor: '#10b981',
      chartNegativeColor: '#ef4444',
      chartPrimaryColor: '#3b82f6',
      chartSecondaryColor: '#06b6d4',
      positiveColor: '#10b981',
      negativeColor: '#ef4444',
      gradientStartColor: '#dbeafe',
      gradientEndColor: '#f0f9ff',
      backgroundColor: '#f8fafc',
      cardColor: '#ffffff',
      accentColor: '#dbeafe',
      description: 'Blue primary with blue header'
    },
    { 
      name: 'Forest', 
      primaryColor: '#22C55E', 
      headerBackgroundColor: '#059669',
      chartPositiveColor: '#16a34a',
      chartNegativeColor: '#dc2626',
      chartPrimaryColor: '#22c55e',
      chartSecondaryColor: '#84cc16',
      positiveColor: '#16a34a',
      negativeColor: '#dc2626',
      gradientStartColor: '#dcfce7',
      gradientEndColor: '#f0fdf4',
      backgroundColor: '#f0fdf4',
      cardColor: '#ffffff',
      accentColor: '#dcfce7',
      description: 'Green primary with green header'
    },
    { 
      name: 'Royal', 
      primaryColor: '#A855F7', 
      headerBackgroundColor: '#7c3aed',
      chartPositiveColor: '#10b981',
      chartNegativeColor: '#ef4444',
      chartPrimaryColor: '#a855f7',
      chartSecondaryColor: '#8b5cf6',
      positiveColor: '#10b981',
      negativeColor: '#ef4444',
      gradientStartColor: '#f3e8ff',
      gradientEndColor: '#faf5ff',
      backgroundColor: '#faf5ff',
      cardColor: '#ffffff',
      accentColor: '#f3e8ff',
      description: 'Purple primary with purple header'
    },
    { 
      name: 'Sunset', 
      primaryColor: '#F97316', 
      headerBackgroundColor: '#ea580c',
      chartPositiveColor: '#10b981',
      chartNegativeColor: '#dc2626',
      chartPrimaryColor: '#f97316',
      chartSecondaryColor: '#f59e0b',
      positiveColor: '#10b981',
      negativeColor: '#dc2626',
      gradientStartColor: '#fed7aa',
      gradientEndColor: '#fff7ed',
      backgroundColor: '#fff7ed',
      cardColor: '#ffffff',
      accentColor: '#fed7aa',
      description: 'Orange primary with orange header'
    },
    { 
      name: 'Minimal', 
      primaryColor: '#3B82F6', 
      headerBackgroundColor: '#374151',
      chartPositiveColor: '#10b981',
      chartNegativeColor: '#6b7280',
      chartPrimaryColor: '#6b7280',
      chartSecondaryColor: '#9ca3af',
      positiveColor: '#10b981',
      negativeColor: '#6b7280',
      gradientStartColor: '#f8fafc',
      gradientEndColor: '#ffffff',
      backgroundColor: '#ffffff',
      cardColor: '#f8fafc',
      accentColor: '#f1f5f9',
      description: 'Blue primary with dark gray header'
    },
  ];

  const fontFamilies = [
    { value: 'Source Serif 4', label: 'Source Serif 4', preview: 'font-serif' },
    { value: 'Inter', label: 'Inter', preview: 'font-sans' },
    { value: 'Schibsted Grotesk', label: 'Schibsted Grotesk', preview: 'font-sans' },
    { value: 'Funnel Sans', label: 'Funnel Sans', preview: 'font-sans' },
    { value: 'Corben', label: 'Corben', preview: 'font-serif' },
    { value: 'Fraunces', label: 'Fraunces', preview: 'font-serif' },
    { value: 'IBM Plex Serif', label: 'IBM Plex Serif', preview: 'font-serif' },
    { value: 'Geist', label: 'Geist', preview: 'font-sans' },
  ];

  const fontSizes = [
    { value: 'sm', label: 'Small', description: 'Compact text' },
    { value: 'base', label: 'Medium', description: 'Standard text' },
    { value: 'lg', label: 'Large', description: 'Larger text' },
  ];

  const borderRadiusOptions = [
    { value: 'none', label: 'None', description: 'Sharp corners' },
    { value: 'sm', label: 'Small', description: 'Subtle rounding' },
    { value: 'md', label: 'Medium', description: 'Standard rounding' },
    { value: 'lg', label: 'Large', description: 'Rounded corners' },
  ];

  return (
    <>
      <div className="space-y-4 pb-20">
        {/* Colors */}
        <Card>
          <CardHeader>
            <div className="text-lg font-medium">
              Colors
            </div>
            <CardDescription>
              Customize all colors for your application including primary colors, charts, and indicators.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Color Presets */}
            <div>
              <div className="text-sm font-medium mb-3">Quick Presets</div>
              <div className="flex flex-wrap gap-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handlePresetSelect(preset)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedPreset === preset.name
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <div 
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: preset.primaryColor }}
                      />
                      <div 
                        className="w-3 h-3 rounded border border-white/20"
                        style={{ backgroundColor: preset.headerBackgroundColor }}
                      />
                    </div>
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Individual Color Controls */}
            <div className="space-y-2">
              {/* Primary Color */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">Primary Color</div>
                  {isSettingChanged('primaryColor') && (
                    <div className="w-2 h-2 bg-primary rounded-full" title="Modified from default" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded border-2 border-muted cursor-pointer hover:border-primary/50 transition-colors"
                      style={{ backgroundColor: appearanceSettings.primaryColor }}
                      onClick={() => document.getElementById('primary-color-picker')?.click()}
                    />
                    <Input
                      id="primary-color-picker"
                      type="color"
                  value={appearanceSettings.primaryColor}
                      onChange={(e) => handleAppearanceChange('primaryColor', e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                        </div>
              </div>

              {/* Header Background Color */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">Header Background Color</div>
                  {isSettingChanged('headerBackgroundColor') && (
                    <div className="w-2 h-2 bg-primary rounded-full" title="Modified from default" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded border-2 border-muted cursor-pointer hover:border-primary/50 transition-colors"
                      style={{ backgroundColor: appearanceSettings.headerBackgroundColor }}
                      onClick={() => document.getElementById('header-color-picker')?.click()}
                    />
                    <Input
                      id="header-color-picker"
                      type="color"
                      value={appearanceSettings.headerBackgroundColor}
                      onChange={(e) => handleAppearanceChange('headerBackgroundColor', e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Chart Positive Color */}
              <div className="flex items-center justify-between py-1">
                <div className="text-sm font-medium">Chart Positive Color</div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded border-2 border-muted cursor-pointer hover:border-primary/50 transition-colors"
                      style={{ backgroundColor: appearanceSettings.chartPositiveColor }}
                      onClick={() => document.getElementById('chart-positive-picker')?.click()}
                    />
                    <Input
                      id="chart-positive-picker"
                      type="color"
                      value={appearanceSettings.chartPositiveColor}
                      onChange={(e) => handleAppearanceChange('chartPositiveColor', e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Chart Negative Color */}
              <div className="flex items-center justify-between py-1">
                <div className="text-sm font-medium">Chart Negative Color</div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded border-2 border-muted cursor-pointer hover:border-primary/50 transition-colors"
                      style={{ backgroundColor: appearanceSettings.chartNegativeColor }}
                      onClick={() => document.getElementById('chart-negative-picker')?.click()}
                    />
                    <Input
                      id="chart-negative-picker"
                      type="color"
                      value={appearanceSettings.chartNegativeColor}
                      onChange={(e) => handleAppearanceChange('chartNegativeColor', e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Chart Primary Color */}
              <div className="flex items-center justify-between py-1">
                <div className="text-sm font-medium">Chart Primary Color</div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded border-2 border-muted cursor-pointer hover:border-primary/50 transition-colors"
                      style={{ backgroundColor: appearanceSettings.chartPrimaryColor }}
                      onClick={() => document.getElementById('chart-primary-picker')?.click()}
                    />
                    <Input
                      id="chart-primary-picker"
                      type="color"
                      value={appearanceSettings.chartPrimaryColor}
                      onChange={(e) => handleAppearanceChange('chartPrimaryColor', e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Chart Secondary Color */}
              <div className="flex items-center justify-between py-1">
                <div className="text-sm font-medium">Chart Secondary Color</div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded border-2 border-muted cursor-pointer hover:border-primary/50 transition-colors"
                      style={{ backgroundColor: appearanceSettings.chartSecondaryColor }}
                      onClick={() => document.getElementById('chart-secondary-picker')?.click()}
                    />
                    <Input
                      id="chart-secondary-picker"
                      type="color"
                      value={appearanceSettings.chartSecondaryColor}
                      onChange={(e) => handleAppearanceChange('chartSecondaryColor', e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Positive Indicator Color */}
              <div className="flex items-center justify-between py-1">
                <div className="text-sm font-medium">Positive Indicator Color</div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded border-2 border-muted cursor-pointer hover:border-primary/50 transition-colors"
                      style={{ backgroundColor: appearanceSettings.positiveColor }}
                      onClick={() => document.getElementById('positive-picker')?.click()}
                    />
                    <Input
                      id="positive-picker"
                      type="color"
                      value={appearanceSettings.positiveColor}
                      onChange={(e) => handleAppearanceChange('positiveColor', e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Negative Indicator Color */}
              <div className="flex items-center justify-between py-1">
                <div className="text-sm font-medium">Negative Indicator Color</div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded border-2 border-muted cursor-pointer hover:border-primary/50 transition-colors"
                      style={{ backgroundColor: appearanceSettings.negativeColor }}
                      onClick={() => document.getElementById('negative-picker')?.click()}
                    />
                    <Input
                      id="negative-picker"
                      type="color"
                      value={appearanceSettings.negativeColor}
                      onChange={(e) => handleAppearanceChange('negativeColor', e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Gradient Start Color */}
              <div className="flex items-center justify-between py-1">
                <div className="text-sm font-medium">Gradient Start Color</div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded border-2 border-muted cursor-pointer hover:border-primary/50 transition-colors"
                      style={{ backgroundColor: appearanceSettings.gradientStartColor }}
                      onClick={() => document.getElementById('gradient-start-picker')?.click()}
                    />
                    <Input
                      id="gradient-start-picker"
                      type="color"
                      value={appearanceSettings.gradientStartColor}
                      onChange={(e) => handleAppearanceChange('gradientStartColor', e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Gradient End Color */}
              <div className="flex items-center justify-between py-1">
                <div className="text-sm font-medium">Gradient End Color</div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded border-2 border-muted cursor-pointer hover:border-primary/50 transition-colors"
                      style={{ backgroundColor: appearanceSettings.gradientEndColor }}
                      onClick={() => document.getElementById('gradient-end-picker')?.click()}
                    />
                    <Input
                      id="gradient-end-picker"
                      type="color"
                      value={appearanceSettings.gradientEndColor}
                      onChange={(e) => handleAppearanceChange('gradientEndColor', e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Background Color */}
              <div className="flex items-center justify-between py-1">
                <div className="text-sm font-medium">Background Color</div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded border-2 border-muted cursor-pointer hover:border-primary/50 transition-colors"
                      style={{ backgroundColor: appearanceSettings.backgroundColor }}
                      onClick={() => document.getElementById('background-picker')?.click()}
                    />
                    <Input
                      id="background-picker"
                      type="color"
                      value={appearanceSettings.backgroundColor}
                      onChange={(e) => handleAppearanceChange('backgroundColor', e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Card Color */}
              <div className="flex items-center justify-between py-1">
                <div className="text-sm font-medium">Card Color</div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded border-2 border-muted cursor-pointer hover:border-primary/50 transition-colors"
                      style={{ backgroundColor: appearanceSettings.cardColor }}
                      onClick={() => document.getElementById('card-picker')?.click()}
                    />
                    <Input
                      id="card-picker"
                      type="color"
                      value={appearanceSettings.cardColor}
                      onChange={(e) => handleAppearanceChange('cardColor', e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Accent Color */}
              <div className="flex items-center justify-between py-1">
                <div className="text-sm font-medium">Accent Color</div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded border-2 border-muted cursor-pointer hover:border-primary/50 transition-colors"
                      style={{ backgroundColor: appearanceSettings.accentColor }}
                      onClick={() => document.getElementById('accent-picker')?.click()}
                    />
                    <Input
                      id="accent-picker"
                      type="color"
                      value={appearanceSettings.accentColor}
                      onChange={(e) => handleAppearanceChange('accentColor', e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Font Families */}
        <Card>
          <CardHeader>
            <div className="text-lg font-medium">
              Font Families
            </div>
            <CardDescription>
              Select font families for headings and body text.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Header Font</label>
                  {isSettingChanged('headerFontFamily') && (
                    <div className="w-2 h-2 bg-primary rounded-full" title="Modified from default" />
                  )}
                </div>
                <Select
                  value={appearanceSettings.headerFontFamily}
                  onValueChange={(value) => handleAppearanceChange('headerFontFamily', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <div className="flex items-center gap-2">
                          <span className={font.preview}>{font.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Body Font</label>
                  {isSettingChanged('bodyFontFamily') && (
                    <div className="w-2 h-2 bg-primary rounded-full" title="Modified from default" />
                  )}
                </div>
                <Select
                  value={appearanceSettings.bodyFontFamily}
                  onValueChange={(value) => handleAppearanceChange('bodyFontFamily', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <div className="flex items-center gap-2">
                          <span className={font.preview}>{font.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Font Size */}
        <Card>
          <CardHeader>
            <div className="text-lg font-medium">Font Size</div>
            <CardDescription>
              Adjust the base font size for better readability.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => handleAppearanceChange('fontSize', size.value)}
                  className={`p-2 rounded-lg border-2 text-left transition-all ${
                    appearanceSettings.fontSize === size.value
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium">{size.label}</div>
                  <div className="text-sm text-muted-foreground">{size.description}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Border Radius */}
        <Card>
          <CardHeader>
            <div className="text-lg font-medium">Border Radius</div>
            <CardDescription>
              Choose the corner rounding style for UI elements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {borderRadiusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAppearanceChange('borderRadius', option.value)}
                  className={`p-2 rounded-lg border-2 text-left transition-all ${
                    appearanceSettings.borderRadius === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <div className="text-lg font-medium">
              Logo
            </div>
            <CardDescription>
              Upload a custom logo for your application. Accepts PNG and SVG files (max 2MB).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appearanceSettings.logoUrl ? (
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Image 
                      src={appearanceSettings.logoUrl} 
                      alt="Custom logo" 
                      width={200}
                      height={60}
                      className="max-w-[200px] max-h-[60px] object-contain"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeLogo}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Remove Logo
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    No logo uploaded. Using default branding.
                  </p>
                  <Input
                    type="file"
                    accept=".png,.svg,image/png,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="max-w-xs mx-auto"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Sticky Reset Button - Only shows when settings have changed */}
      {settingsChanged && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 z-50">
          <div className="max-w-7xl mx-auto flex justify-end">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2 shadow-lg"
            >
              <RotateCcw className="h-4 w-4" />
              Reset All to Default
            </Button>
          </div>
        </div>
      )}

    </>
  );
}
