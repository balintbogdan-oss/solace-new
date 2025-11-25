'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { HelpCircle, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useUserRole } from '@/contexts/UserRoleContext';
import { Button } from '@/components/ui/button';

export function HeaderClient() {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { switchRole } = useUserRole();
  const isWealthActive = pathname === '/client-dashboard';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('profile-dropdown');
      const button = document.getElementById('profile-button');
      if (dropdown && button && !dropdown.contains(event.target as Node) && !button.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  return (
    <header 
      suppressHydrationWarning
      className="sticky top-0 z-50 h-14 sm:h-16 px-3 sm:px-4 md:px-6 py-2 backdrop-blur-lg"
      style={{ backgroundColor: '#041340' }}
    >
      <div className="flex items-center justify-between h-full gap-2 sm:gap-4">
        {/* Left Section: Logo and Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Wedbush Next Logo */}
          <Link href="/client-dashboard" className="p-1 sm:p-1.5 hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0">
            <div className="flex items-center justify-center h-6 sm:h-8">
              <svg className="w-16 sm:w-[92px] h-5 sm:h-8" viewBox="0 0 92 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.8381 10.1441C16.8381 10.1441 15.5538 10.1441 15.0722 11.7143L11.4335 23.3332H16.3565C16.3565 23.3332 17.6408 23.3332 18.1224 21.7631L21.7611 10.0918L16.8381 10.1441Z" fill="white"/>
                <path d="M9.93535 12.0282C9.93535 12.0282 8.81162 12.0282 8.43704 13.389L5.3334 23.3332H9.56077C9.56077 23.3332 10.6845 23.3332 11.0591 21.9724L14.1627 11.9759L9.93535 12.0282Z" fill="white"/>
                <path d="M24.4368 8.67871C24.4368 8.67871 22.992 8.67871 22.5104 10.4059L18.4971 23.3333H24.0087C24.0087 23.3333 25.4535 23.3333 25.9351 21.6061L29.9484 8.67871H24.4368Z" fill="white"/>
                <path d="M73.5322 11.8844V8.67871H86.386V11.8844H81.9377V23.3333H77.9804V11.8844H73.5322Z" fill="white"/>
                <path d="M48.2288 23.3333V8.67871H58.8585V11.8844H52.233V14.4032H58.3112V17.6088H52.233V20.1276H58.8297V23.3333H48.2288Z" fill="white"/>
                <path d="M46.3513 8.67871V23.3333H43.0007L37.6569 15.6339H37.5703V23.3333H33.5553V8.67871H36.9637L42.2208 16.3495H42.3363V8.67871H46.3513Z" fill="white"/>
                <path d="M68.8903 8.66667H72.8301L63.8561 23.198H59.9163L68.8903 8.66667Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M65.699 10.9989L64.2938 8.66667H60.354L63.7048 14.2281L65.699 10.9989ZM64.5695 15.6633L69.1091 23.198H73.0489L66.5637 12.4341L64.5695 15.6633Z" fill="white"/>
              </svg>
            </div>
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/client-dashboard"
              className={`h-9 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isWealthActive 
                  ? 'bg-white/10 text-white' 
                  : 'text-white hover:bg-white/10 hover:text-white'
              }`}
            >
              Wealth
            </Link>
            <Button 
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
              onClick={() => {
                // TODO: Navigate to banking section when implemented
                console.log('Banking clicked');
              }}
            >
              Banking
            </Button>
          </div>
        </div>

        {/* Right Section: Support, Profile */}
        <div className="flex items-center justify-end gap-1 sm:gap-2 flex-shrink-0">
          {/* Support */}
          <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white gap-1 sm:gap-2 px-2 sm:px-3">
            <HelpCircle className="h-4 w-4 flex-shrink-0 text-white" />
            <span className="hidden sm:inline text-white">Support</span>
          </Button>

          {/* Separator */}
          <div className="h-5 w-px bg-white opacity-20 mx-1 sm:mx-2 hidden sm:block" />

          {/* Profile Section */}
          <div className="relative">
            {/* Combined clickable profile button */}
            <Button
              id="profile-button"
              variant="ghost"
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-white hover:bg-white/10 flex items-center gap-1 sm:gap-2 px-2 sm:px-4 h-auto py-1.5 sm:py-2"
            >
              {/* Avatar */}
              <div 
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg shrink-0"
                style={{ backgroundColor: '#1e3a8a' }}
              >
                J
              </div>
              
              {/* My profile text - Hidden on mobile */}
              <span className="hidden md:inline text-sm font-medium text-white">My profile</span>

              {/* Dropdown icon */}
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 text-white" />
            </Button>

            {/* Dropdown menu */}
            {showDropdown && (
              <div
                id="profile-dropdown"
                className="absolute right-0 top-full mt-2 w-56 sm:w-64 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
              >
                <div className="py-1">
                  {/* Switch to advisor */}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      switchRole();
                      setShowDropdown(false);
                      // Preserve current route - refresh to re-render with new role
                      router.refresh();
                    }}
                    className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Switch to advisor
                  </Button>
                  
                  {/* Profile & Settings */}
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 gap-2"
                  >
                    <Link
                      href="/profile"
                      onClick={() => setShowDropdown(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile & Settings
                    </Link>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 gap-2"
                  >
                    <Link
                      href="/settings"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Settings className="h-4 w-4" />
                      App Settings
                    </Link>
                  </Button>
                  
                  {/* Logout */}
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

