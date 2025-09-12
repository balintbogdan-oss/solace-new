'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/contexts/SettingsContext';
import { Settings, Users, TrendingUp, MessageSquare, Wrench, RotateCcw } from 'lucide-react';

export default function SettingsPage() {
  const { navigationSettings, updateNavigationSetting, resetSettings } = useSettings();
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: keyof typeof navigationSettings, value: boolean) => {
    updateNavigationSetting(key, value);
    setHasChanges(true);
  };

  const handleReset = () => {
    resetSettings();
    setHasChanges(false);
  };

  const navigationItems = [
    {
      key: 'clients' as const,
      label: 'Clients',
      description: 'Access to client management and account overview',
      icon: Users,
      href: '/clients'
    },
    {
      key: 'trade' as const,
      label: 'Trade',
      description: 'Trading interface and order management',
      icon: TrendingUp,
      href: '/trade'
    },
    {
      key: 'crm' as const,
      label: 'CRM',
      description: 'Customer relationship management tools',
      icon: MessageSquare,
      href: '/crm'
    },
    {
      key: 'tools' as const,
      label: 'Tools',
      description: 'Additional tools and utilities',
      icon: Wrench,
      href: '/tools'
    }
  ];

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">App Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Customize your navigation experience by enabling or disabling specific sections.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Navigation Settings</CardTitle>
          <CardDescription>
            Control which sections appear in your main navigation. Changes are saved automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isEnabled = navigationSettings[item.key];
            
            return (
              <div key={item.key}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isEnabled ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-muted'}`}>
                      <Icon className={`h-5 w-5 ${isEnabled ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{item.label}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isEnabled 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {isEnabled ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(checked) => handleSettingChange(item.key, checked)}
                  />
                </div>
                {index < navigationItems.length - 1 && <Separator className="mt-6" />}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {hasChanges && (
        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">About Navigation Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              • <strong>Clients:</strong> Manage client accounts, view portfolios, and access client-specific information.
            </p>
            <p>
              • <strong>Trade:</strong> Execute trades, view market data, and manage orders.
            </p>
            <p>
              • <strong>CRM:</strong> Customer relationship management tools and client communication features.
            </p>
            <p>
              • <strong>Tools:</strong> Additional utilities and administrative functions.
            </p>
            <p className="pt-2 text-xs">
              Your settings are automatically saved and will persist across browser sessions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
