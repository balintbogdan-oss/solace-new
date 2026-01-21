'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { 
  Home, 
  ChevronDown, 
  User, 
  Lock, 
  Settings,
  FileText,
  Briefcase,
  Users,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    // Auto-expand Profile if we're on a profile page
    if (pathname?.startsWith('/profile')) {
      return ['profile'];
    }
    return [];
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const profileItems = [
    { label: 'Personal information', href: '/profile', icon: User },
    { label: 'Trusted contact', href: '/profile/trusted-contact', icon: User },
    { label: 'Identification', href: '/profile/identification', icon: FileText },
    { label: 'Employment information', href: '/profile/employment', icon: Briefcase },
    { label: 'Association', href: '/profile/association', icon: Users },
    { label: 'Investment profile', href: '/profile/investment-profile', icon: TrendingUp },
    { label: 'Realized G/L', href: '/profile/realized-gl', icon: TrendingUp },
  ];

  const isProfileExpanded = expandedSections.includes('profile');
  const isActive = (href: string) => {
    if (href === '/profile') {
      return pathname === '/profile';
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-background">
      {/* Left Sidebar */}
      <aside className="w-64 flex-shrink-0 px-4 hidden md:block min-h-[calc(100vh-116px)] rounded-md bg-background">
        <nav className="py-3 space-y-1">
          {/* Home */}
          <Link
            href="/"
            className={cn(
              'flex items-center gap-3 w-full rounded-md px-3 py-3 text-sm transition-colors',
              pathname === '/'
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/30 dark:hover:bg-muted/50'
            )}
            style={pathname === '/' ? { backgroundColor: 'var(--sidebar-accent)' } : undefined}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>

          {/* Profile Group */}
          <div className="mt-4">
            <button
              onClick={() => toggleSection('profile')}
              className={cn(
                'flex items-center text-sm transition-colors justify-between w-full rounded-md px-3 py-3',
                isProfileExpanded
                  ? 'text-gray-900 dark:text-gray-100'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/30 dark:hover:bg-muted/50'
              )}
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </div>
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform',
                  isProfileExpanded && 'rotate-180'
                )}
              />
            </button>

            {isProfileExpanded && (
              <ul className="pl-7 mt-1 space-y-1">
                {profileItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center w-full rounded-md px-3 py-3 text-sm transition-colors',
                          active
                            ? 'text-gray-900 dark:text-gray-100'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/30 dark:hover:bg-muted/50'
                        )}
                        style={active ? { backgroundColor: 'var(--sidebar-accent)' } : undefined}
                      >
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Login & security */}
          <Link
            href="/profile/login-security"
            className={cn(
              'flex items-center gap-3 w-full rounded-md px-3 py-3 text-sm transition-colors',
              pathname === '/profile/login-security'
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/30 dark:hover:bg-muted/50'
            )}
            style={pathname === '/profile/login-security' ? { backgroundColor: 'var(--sidebar-accent)' } : undefined}
          >
            <Lock className="w-4 h-4" />
            <span>Login & security</span>
          </Link>

          {/* Account maintenance */}
          <Link
            href="/profile/account-maintenance"
            className={cn(
              'flex items-center gap-3 w-full rounded-md px-3 py-3 text-sm transition-colors',
              pathname === '/profile/account-maintenance'
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/30 dark:hover:bg-muted/50'
            )}
            style={pathname === '/profile/account-maintenance' ? { backgroundColor: 'var(--sidebar-accent)' } : undefined}
          >
            <Settings className="w-4 h-4" />
            <span>Account maintenance</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

