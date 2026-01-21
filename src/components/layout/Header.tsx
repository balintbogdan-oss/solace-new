'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from "next-themes";
import {
  Bell,
  Sun,
  Moon,
  Menu,
  Search,
  History,
  User,
  Users,
  Landmark
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useSettings } from "@/contexts/SettingsContext";
import { getFilteredTopLevelNavItems } from "@/lib/navigation";
import { useSearch } from "@/hooks/useSearch";
import Image from "next/image";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { theme, setTheme } = useTheme();
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchFilter, setSearchFilter] = useState<'all' | 'clients' | 'accounts'>('all');
  const { navigationSettings, appearanceSettings } = useSettings();
  
  // Use the search hook
  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    results: searchResults,
    recentSearches,
    isLoading: isSearchLoading,
    showResults: showSearchResults,
    setShowResults: setShowSearchResults,
    handleSearchItemClick
  } = useSearch();
  
  // Get filtered navigation items based on settings
  const filteredNavItems = getFilteredTopLevelNavItems(navigationSettings);

  // Filter search results based on selected filter
  const filteredSearchResults = searchResults.filter(item => {
    if (searchFilter === 'all') return true;
    if (searchFilter === 'clients') return item.type === 'client';
    if (searchFilter === 'accounts') return item.type === 'account';
    return true;
  });

  // Helper function to highlight search term in text
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="font-semibold bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">
          {part}
        </span>
      ) : part
    );
  };

  // Reset filter when search query changes
  useEffect(() => {
    setSearchFilter('all');
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.getElementById('search-container');
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSearchResults]);
  
  // Don't render header on login page
  if (pathname === '/login') {
    return null;
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && searchResults.length > 0) {
      // Navigate to first result
      const firstResult = searchResults[0];
      handleSearchItemClick(firstResult);
    }
  };

  return (
    <header 
      className="dark:border-b sticky top-0 z-50 h-14 px-6 dark:backdrop-blur-xl"
      style={{ backgroundColor: appearanceSettings.headerBackgroundColor || '#000000' }}
    >
      <div className="grid grid-cols-3 items-center h-full">
        {/* Column 1: Logo and Menu */}
        <div className="flex items-center gap-2 z-10">
          {appearanceSettings.logoUrl ? (
            <Image 
              src={appearanceSettings.logoUrl} 
              alt="Custom logo" 
              width={120}
              height={40}
              className="max-w-[120px] max-h-[40px] object-contain"
            />
          ) : (
            <svg width="28" height="17" viewBox="0 0 28 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path fillRule="evenodd" clipRule="evenodd" d="M19.2158 1.93618C19.7433 0 21.326 0 21.326 0H27.3634L22.9672 14.492C22.4397 16.4282 20.857 16.4282 20.857 16.4282H14.8196L19.2158 1.93618ZM13.0025 1.64266C13.0025 1.64266 11.5957 1.64266 11.0682 3.40282L7.08228 16.428H12.4749C12.4749 16.428 13.8817 16.428 14.4093 14.6679L18.3952 1.58398L13.0025 1.64266ZM5.441 3.75516C5.441 3.75516 4.21006 3.75516 3.79975 5.28063L0.400024 16.4283H5.03069C5.03069 16.4283 6.26162 16.4283 6.67194 14.9028L10.0717 3.69649L5.441 3.75516Z" fill="currentColor"/>
            </svg>
          )}
          <nav className="hidden md:flex items-center text-white">
            {filteredNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "text-sm font-medium hover:bg-white/10 cursor-pointer", 
                    (pathname === item.href || 
                      (item.href !== '/' && pathname?.startsWith(item.href)) ||
                     (item.href === '/crm' && pathname?.includes('/crm'))) && 
                    'bg-black/10 dark:bg-white/10'
                  )}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        {/* Column 2: Search Bar - Centered */}
        <div className="flex justify-center">
        {/* Mobile search icon button */}
        {!showSearchInput && (
          <button
            onClick={() => setShowSearchInput(true)}
            className="md:hidden p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10"
          >
            <Search className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        )}
        
        {/* Mobile and desktop search input */}
        {(showSearchInput || (
          <span className="hidden md:block" />
        )) && (
          <div
            id="search-container"
            className={cn(
              "relative w-full w-[600px] md:block",
              showSearchInput ? "block" : "hidden md:block"
            )}
          >
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => {
                  console.log('Search input focused, showing results');
                  setShowSearchResults(true);
                }}
                placeholder="Search by account name, account number or client name"
                className="bg-white/20 w-full border-0 rounded-md pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/60 focus:ring-0 focus:outline-none backdrop-blur-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            </form>

            {showSearchResults && (
              <div className="absolute mt-2 w-[600px] bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl z-50 max-h-96 overflow-y-auto">
                {/* Show recent searches when no query */}
                {!searchQuery && (
                  <div className="p-4">
                    {recentSearches.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recently viewed</div>
                        </div>
                        <div className="space-y-1">
                          {recentSearches.map((item) => {
                            const getIcon = () => {
                              switch (item.type) {
                                case 'account':
                                  return <Landmark className="h-4 w-4 text-primary" />;
                                case 'client':
                                  return <User className="h-4 w-4 text-primary" />;
                                case 'household':
                                  return <Users className="h-4 w-4 text-primary" />;
                                default:
                                  return <History className="h-4 w-4 text-gray-400" />;
                              }
                            };

                            const getAccountValue = () => {
                              if (item.type === 'account' && 'data' in item) {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const accountData = item.data as any;
                                return accountData.balances?.totalValue ? 
                                  `$${accountData.balances.totalValue.toLocaleString()}` : 
                                  null;
                              }
                              return null;
                            };

                            return (
                              <div
                                key={`${item.type}-${item.id}`}
                                className="relative group"
                              >
                                <Link
                                  href={item.href}
                                  onClick={() => handleSearchItemClick(item)}
                                  className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition-colors group cursor-pointer"
                                  style={{ cursor: 'pointer' }}
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    {getIcon()}
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {item.name}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.subtitle}
                                      </div>
                                    </div>
                                  </div>
                                  {getAccountValue() && (
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      {getAccountValue()}
                                    </div>
                                  )}
                                </Link>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                        No recent searches. Start typing to search for clients, accounts, or households.
                      </div>
                    )}
                  </div>
                )}

                {/* Show search results when there's a query */}
                {searchQuery && (
                  <>
                    {/* Sticky header section for search results */}
                    <div className="sticky top-0 bg-white dark:bg-neutral-800 z-10 p-4 pb-0">
                      {/* Filter buttons */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-sm font-medium text-muted-foreground">Filter by</div>
                        <div className="flex gap-2">
                          <button
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                              searchFilter === 'all'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                            onClick={() => setSearchFilter('all')}
                          >
                            All
                          </button>
                          <button
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                              searchFilter === 'clients'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                            onClick={() => setSearchFilter('clients')}
                          >
                            <User className="h-3 w-3" />
                            Clients
                          </button>
                          <button
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                              searchFilter === 'accounts'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                            onClick={() => setSearchFilter('accounts')}
                          >
                            <Landmark className="h-3 w-3" />
                            Accounts
                          </button>
                        </div>
                      </div>

                      {/* Results header */}
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Results
                        </div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Total account value
                        </div>
                      </div>
                    </div>

                    {/* Scrollable results content */}
                    <div className="p-4 pt-0">
                      {isSearchLoading ? (
                        <div className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                          Searching...
                        </div>
                      ) : filteredSearchResults.length > 0 ? (
                        <div className="space-y-1">
                          {filteredSearchResults.map((item) => {
                          const getIcon = () => {
                            switch (item.type) {
                              case 'account':
                                return <Landmark className="h-4 w-4 text-primary" />;
                              case 'client':
                                return <User className="h-4 w-4 text-primary" />;
                              case 'household':
                                return <Users className="h-4 w-4 text-primary" />;
                              default:
                                return <Search className="h-4 w-4 text-gray-400" />;
                            }
                          };

                          const getAccountValue = () => {
                            if (item.type === 'account' && 'data' in item) {
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              const accountData = item.data as any;
                              return accountData.balances?.totalValue ? 
                                `$${accountData.balances.totalValue.toLocaleString()}` : 
                                null;
                            }
                            return null;
                          };

                          return (
                            <Link
                              key={`${item.type}-${item.id}`}
                              href={item.href}
                              onClick={() => handleSearchItemClick(item)}
                              className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                {getIcon()}
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {highlightSearchTerm(item.name, searchQuery)}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {item.subtitle}
                                  </div>
                                </div>
                              </div>
                              {getAccountValue() && (
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {getAccountValue()}
                                </div>
                              )}
                            </Link>
                          );
                        })}
                        </div>
                      ) : (
                        <div className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                          No {searchFilter === 'all' ? '' : searchFilter} results found for &quot;{searchQuery}&quot;
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        </div>

        {/* Column 3: Notifications, Theme Toggle, and Profile */}
        <div className="flex items-center justify-end gap-4 z-10">
          {/* Icons for tablet and desktop*/}
          <div className="hidden md:flex items-center gap-2 text-white">
          <Button variant="ghost" size="icon" className="hover:bg-black/10 dark:hover:bg-white/10">
            <Bell className="h-4 w-4" />
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
         
        <div className="relative ">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="h-8 w-8 rounded-full bg-white dark:bg-white/30 flex items-center justify-center text-sm hover:bg-white/80 dark:hover:bg-white/50 hover:scale-105 transition-all duration-200"
          >
            D
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {/* User info section */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    David Chen
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    david.chen@wedbush.com
                  </div>
                </div>
                
                {/* Menu items */}
                <Link
                  href="/profile"
                  onClick={() => setShowDropdown(false)}
                  className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  Profile & Settings
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setShowDropdown(false)}
                  className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  App Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  Log out
                </button>
              </div>
            </div>
          )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black dark:focus:ring-white"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
    </header>
  );
}