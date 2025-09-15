'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useSettings } from '@/contexts/SettingsContext';
import { RotateCcw, Upload, X } from 'lucide-react';

export default function AppearanceSettingsPage() {
  const { 
    appearanceSettings, 
    updateAppearanceSetting, 
    resetAppearanceSettings 
  } = useSettings();

  const handleAppearanceChange = (key: keyof typeof appearanceSettings, value: string) => {
    updateAppearanceSetting(key, value);
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
  };

  const primaryColors = [
    { value: 'brown', label: 'Brown', color: 'bg-amber-700' },
    { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
    { value: 'green', label: 'Green', color: 'bg-green-500' },
    { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
    { value: 'red', label: 'Red', color: 'bg-red-500' },
    { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
    { value: 'pink', label: 'Pink', color: 'bg-pink-500' },
    { value: 'indigo', label: 'Indigo', color: 'bg-indigo-500' },
    { value: 'teal', label: 'Teal', color: 'bg-teal-500' },
  ];

  const fontFamilies = [
    { value: 'Inter', label: 'Inter', preview: 'font-sans' },
    { value: 'Roboto', label: 'Roboto', preview: 'font-sans' },
    { value: 'Open Sans', label: 'Open Sans', preview: 'font-sans' },
    { value: 'Lato', label: 'Lato', preview: 'font-sans' },
    { value: 'Montserrat', label: 'Montserrat', preview: 'font-sans' },
    { value: 'Source Sans Pro', label: 'Source Sans Pro', preview: 'font-sans' },
    { value: 'Source Serif 4', label: 'Source Serif 4', preview: 'font-serif' },
    { value: 'Poppins', label: 'Poppins', preview: 'font-sans' },
    { value: 'Nunito', label: 'Nunito', preview: 'font-sans' },
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
      <div className="space-y-6">
        {/* Primary Color */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Primary Color
            </CardTitle>
            <CardDescription>
              Choose the primary color theme for your application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {primaryColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleAppearanceChange('primaryColor', color.value)}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    appearanceSettings.primaryColor === color.value
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${color.color}`} />
                  <span className="text-sm font-medium">{color.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Header Background Color */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Header Background Color
            </CardTitle>
            <CardDescription>
              Choose the background color for the application header.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div 
                    className="w-12 h-12 rounded-lg border-2 border-muted cursor-pointer hover:border-primary/50 transition-colors"
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
                <div className="text-sm text-muted-foreground">
                  {appearanceSettings.headerBackgroundColor}
                </div>
              </div>
              
              {/* Quick color presets */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Quick presets:</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { name: 'Black', value: '#000000' },
                    { name: 'Dark Gray', value: '#1f2937' },
                    { name: 'Blue', value: '#1e40af' },
                    { name: 'Green', value: '#059669' },
                    { name: 'Purple', value: '#7c3aed' },
                    { name: 'Red', value: '#dc2626' },
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => handleAppearanceChange('headerBackgroundColor', preset.value)}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        appearanceSettings.headerBackgroundColor === preset.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Font Families */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Font Families
            </CardTitle>
            <CardDescription>
              Select font families for headings and body text.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Header Font</label>
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
                <label className="text-sm font-medium">Body Font</label>
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
            <CardTitle className="text-lg">Font Size</CardTitle>
            <CardDescription>
              Adjust the base font size for better readability.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => handleAppearanceChange('fontSize', size.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
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
            <CardTitle className="text-lg">Border Radius</CardTitle>
            <CardDescription>
              Choose the corner rounding style for UI elements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {borderRadiusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAppearanceChange('borderRadius', option.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
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
            <CardTitle className="text-lg">
              Logo
            </CardTitle>
            <CardDescription>
              Upload a custom logo for your application. Accepts PNG and SVG files (max 2MB).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appearanceSettings.logoUrl ? (
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={appearanceSettings.logoUrl} 
                      alt="Custom logo" 
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
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
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

      <div className="mt-6 flex justify-end">
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset All to Default
        </Button>
      </div>

    </>
  );
}
