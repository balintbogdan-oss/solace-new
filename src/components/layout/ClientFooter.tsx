'use client';

import Link from 'next/link';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useEffect, useState } from 'react';

export function ClientFooter() {
  const { role, isHydrated } = useUserRole();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only show footer for clients, and wait for hydration to prevent mismatch
  if (!mounted || !isHydrated || role !== 'client') {
    return null;
  }

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Terms and Conditions', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'My Disclosures', href: '#' },
    { label: 'Security Statement', href: '#' },
    { label: 'User Agreement', href: '#' },
    { label: 'Service Fees', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Member FINRA / SIPC', href: '#' },
  ];

  return (
    <footer className="w-full bg-background flex justify-center items-center py-6">
      <div className="w-full max-w-[1120px] bg-background inline-flex justify-center items-center gap-2.5 px-4">
        <div className="flex-1 h-24 flex items-center justify-center text-center">
          <div className="text-xs font-normal leading-5">
            <span className="text-foreground">
              Copyright © {currentYear} by Wedbush Securities. All Rights Reserved.
              <br />
            </span>
            {footerLinks.map((link, index) => (
              <span key={link.label}>
                <Link
                  href={link.href}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  {link.label}
                </Link>
                {index < footerLinks.length - 1 && (
                  <span className="text-muted-foreground"> | </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

