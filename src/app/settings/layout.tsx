'use client';

import { usePathname } from 'next/navigation';
import { Settings, Palette } from 'lucide-react';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const sidebarItems = [
    { id: 'navigation', label: 'Navigation', icon: Settings, href: '/settings/navigation' },
    { id: 'appearance', label: 'Appearance', icon: Palette, href: '/settings/appearance' },
  ];

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      {/* Full-width title */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif">Settings</h1>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-8">
        {/* Left column - Menu */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Right column - Main Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
