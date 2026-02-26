'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { X, Bell, Clock, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useNavigation } from '@/contexts/NavigationContext';
import { useSettings } from '@/contexts/SettingsContext';
import { NavItem } from '@/lib/navigation';
import { getFilteredTopLevelNavItems } from '@/lib/navigation';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { currentSectionItems, currentSectionLabel } = useNavigation();
  const { navigationSettings } = useSettings();
  
  // Get filtered navigation items based on settings
  const filteredNavItems = getFilteredTopLevelNavItems(navigationSettings);

  // Render a navigation item with icon
  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg ${
          isActive ? 'bg-gray-100 dark:bg-gray-800' : ''
        }`}
      >
        {Icon && <Icon className="h-5 w-5" />}
        {item.label}
      </Link>
    );
  };

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 w-screen h-screen md:hidden bg-white dark:bg-gray-900 will-change-transform"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="absolute right-0 top-0 w-full h-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="mt-8 space-y-6">
              {/* Top-level navigation */}
              <div>
                <h3 className="px-4 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Main Navigation
                </h3>
                <div className="space-y-1">
                  {filteredNavItems.map((item) => (
                    <NavItemComponent key={item.href} item={item} />
                  ))}
                </div>
              </div>

              {/* Section-specific sidebar navigation */}
              {currentSectionItems && (
                <div>
                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-4" />
                  <h3 className="px-4 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    {currentSectionLabel}
                  </h3>
                  <div className="space-y-1">
                    {currentSectionItems.map((item) => (
                      <NavItemComponent key={item.href} item={item} />
                    ))}
                  </div>
                </div>
              )}

              {/* Utility icons */}
              <div>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-4" />
                <div className="flex items-center justify-around px-4">
                  <Button variant="ghost" size="icon" className="hover:bg-black/10 dark:hover:bg-white/10">
                    <Bell className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:bg-black/10 dark:hover:bg-white/10">
                    <Clock className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="hover:bg-black/10 dark:hover:bg-white/10"
                  >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}