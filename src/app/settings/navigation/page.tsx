'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/contexts/SettingsContext';
import { Users, TrendingUp, MessageSquare, Wrench, RotateCcw } from 'lucide-react';

export default function NavigationSettingsPage() {
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
    <>
      <Card>
        <CardHeader>
          <div className="text-lg font-medium">Navigation Settings</div>
          <CardDescription>
            Control which sections appear in your main navigation. Changes are saved automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                        <div className="font-medium">{item.label}</div>
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
                {index < navigationItems.length - 1 && <Separator className="mt-4" />}
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
    </>
  );
}
