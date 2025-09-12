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
  X
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { MOCK_CLIENT } from "@/lib/mock-data";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useSettings } from "@/contexts/SettingsContext";
import { getFilteredTopLevelNavItems } from "@/lib/navigation";

// Mock recent searches - in a real app this would come from localStorage or backend
const RECENT_SEARCHES = [
  {
    type: 'account',
    id: '1PB10001',
    name: 'Jim & Alexa account',
    accountType: 'Joint'
  },
  {
    type: 'client',
    id: 'jim-robinson',
    name: 'Jim Robinson',
    email: 'jim.robinson@example.com'
  },
  {
    type: 'account',
    id: '1PB10002',
    name: "Jim's 401K BROK",
    accountType: 'Single'
  }
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
  const { navigationSettings } = useSettings();
  
  // Get filtered navigation items based on settings
  const filteredNavItems = getFilteredTopLevelNavItems(navigationSettings);

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
  }, []);

  // Filter search results based on query
  const searchResults = searchQuery ? {
    client: searchQuery.toLowerCase().includes(MOCK_CLIENT.name.toLowerCase()) ? MOCK_CLIENT : null,
    accounts: MOCK_CLIENT.accounts.filter(account => 
      account.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  } : null;
  
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
    setShowSearchResults(false);
    if (searchQuery.trim()) {
      // If exact account match, go to account page
      const exactAccount = MOCK_CLIENT.accounts.find(
        account => account.id.toLowerCase() === searchQuery.toLowerCase()
      );
      if (exactAccount) {
        router.push(`/account/${exactAccount.id}`);
      }
      // If client name match, go to client page
      else if (searchQuery.toLowerCase() === MOCK_CLIENT.name.toLowerCase()) {
        router.push(`/clients/${MOCK_CLIENT.id}`);
      }
    }
  };

  const clearRecentSearch = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRecentSearches(prev => prev.filter((_, i) => i !== index));
  };

  const handleSearchItemClick = (path: string) => {
    setShowSearchResults(false);
    setSearchQuery('');
    router.push(path);
  };

  return (
    <header className="dark:border-b sticky top-0 z-50 h-14 px-6 flex items-center justify-between bg-black dark:bg-black/30 dark:backdrop-blur-xl">
      <div className="flex items-center gap-2 z-10">
        <svg width="28" height="17" viewBox="0 0 28 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
          <path fillRule="evenodd" clipRule="evenodd" d="M19.2158 1.93618C19.7433 0 21.326 0 21.326 0H27.3634L22.9672 14.492C22.4397 16.4282 20.857 16.4282 20.857 16.4282H14.8196L19.2158 1.93618ZM13.0025 1.64266C13.0025 1.64266 11.5957 1.64266 11.0682 3.40282L7.08228 16.428H12.4749C12.4749 16.428 13.8817 16.428 14.4093 14.6679L18.3952 1.58398L13.0025 1.64266ZM5.441 3.75516C5.441 3.75516 4.21006 3.75516 3.79975 5.28063L0.400024 16.4283H5.03069C5.03069 16.4283 6.26162 16.4283 6.67194 14.9028L10.0717 3.69649L5.441 3.75516Z" fill="currentColor"/>
        </svg>
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

      <div className="flex items-center gap-4 z-10 w-[800px]">
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
              " relative w-full max-w-2xl md:block ",
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
                onFocus={() => setShowSearchResults(true)}
                placeholder="Search by account name, account number or client name"
                className="bg-zinc-800 w-full border-0 rounded-md pl-10 pr-4 py-3 text-sm placeholder:text-zinc-400 focus:ring-0 focus:outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            </form>

            {showSearchResults && (
              <div className="absolute mt-2 w-full bg-white dark:bg-black rounded-md border  z-60">
                {/* Show recent searches when no query */}
                {!searchQuery && recentSearches.length > 0 && (
                  <div className="p-2">
                    <div className="flex items-center justify-between px-3 py-1">
                      <div className="text-xs font-medium text-muted-foreground">Recent searches</div>
                      <button
                        onClick={() => setRecentSearches([])}
                        className="text-xs text-muted-foreground hover:text-primary"
                      >
                        Clear all
                      </button>
                    </div>
                    {recentSearches.map((item, index) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        className="relative group"
                      >
                        <Link
                          href={item.type === 'client' ? `/clients/${item.id}` : `/account/${item.id}`}
                          onClick={() => handleSearchItemClick(item.type === 'client' ? `/clients/${item.id}` : `/account/${item.id}`)}
                          className="flex items-center px-3 py-2 hover:bg-accent rounded-md group"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <History className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium text-foreground">{item.name}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.type === 'client' ? item.email : `${item.id} • ${item.accountType}`}
                            </div>
                          </div>
                          <button
                            onClick={(e) => clearRecentSearch(index, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded"
                          >
                            <X className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {/* Show search results when there's a query */}
                {searchQuery && searchResults && (searchResults.client || searchResults.accounts.length > 0) && (
                  <>
                    {searchResults.client && (
                      <div className="p-2">
                        <div className="text-xs font-medium text-muted-foreground px-3 py-1">Client</div>
                        <Link
                          href={`/clients/${searchResults.client?.id}`}
                          onClick={() => handleSearchItemClick(`/clients/${searchResults.client?.id}`)}
                          className="block px-3 py-2 hover:bg-accent rounded-md"
                        >
                          <div className="text-sm font-medium text-foreground">{searchResults.client?.name}</div>
                          <div className="text-xs text-muted-foreground">{searchResults.client?.email}</div>
                        </Link>
                      </div>
                    )}
                    {searchResults.accounts.length > 0 && (
                      <div className="p-2 border-t border-border">
                        <div className="text-xs font-medium text-muted-foreground px-3 py-1">Accounts</div>
                        {searchResults.accounts.map(account => (
                          <Link
                            key={account.id}
                            href={`/account/${account.id}`}
                            onClick={() => handleSearchItemClick(`/account/${account.id}`)}
                            className="block px-3 py-2 hover:bg-accent rounded-md"
                          >
                            <div className="text-sm font-medium text-foreground">{account.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {account.id} • {account.type}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Icons for tablet and desktop*/}
        <div className="hidden md:flex justify-around text-white">
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
            className="h-8 w-8 rounded-full bg-white dark:bg-white/30 flex items-center justify-center text-sm hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
          >
            M
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
              <div className="py-1">
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

      {/* Mobile Navigation */}
      <MobileNav isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
    </header>
  );
}