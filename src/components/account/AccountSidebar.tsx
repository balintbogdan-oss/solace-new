'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Home,
  Clock,
  ArrowUpDown,
  FileText,
  Bell,
  Settings,
  Folders,
  ChevronDown,
} from 'lucide-react'
import { useUserRole } from '@/contexts/UserRoleContext'

const getNavigationItems = (isAdvisor: boolean) => [
  {
    name: 'Overview',
    href: '',
    icon: Home,
  },
  {
    name: 'Account financials',
    href: 'financials',
    icon: Clock,
    subItems: [
      { name: 'Holdings', href: 'holdings' },
      { name: 'Activity', href: 'activity' },
      { name: 'Balances', href: 'balances' },
      { name: 'Realized G/L', href: 'realized-gl' },
      // Only show Commission for advisors
      ...(isAdvisor ? [{ name: 'Commission', href: 'commission' }] : []),
    ],
  },
  {
    name: 'Trade',
    href: 'trade',
    icon: ArrowUpDown,
  },
  {
    name: 'Account documents',
    href: 'documents',
    icon: FileText,
  },
  {
    name: 'Account notifications',
    href: 'notifications',
    icon: Bell,
  },
  {
    name: 'Account maintenance',
    href: 'maintenance',
    icon: Settings,
  },
  {
    name: 'Partner tools',
    href: 'partner-tools',
    icon: Folders,
  },
]

export function AccountSidebar() {
  const pathname = usePathname()
  const accountId = pathname?.split('/')[2]
  const { role } = useUserRole()
  const isAdvisor = role === 'advisor'
  const navigationItems = getNavigationItems(isAdvisor)
  const [expandedItems, setExpandedItems] = useState<string[]>(['financials']) // Default expanded state

  const toggleExpand = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }

  return (
    <nav className="w-[240px] min-h-[calc(100vh-116px)] bg-card-blend dark:bg-card-blend-dark  rounded-md"> <div className="p-3">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname?.endsWith(item.href)
            const isExpanded = expandedItems.includes(item.href)
            const hasSubItems = item.subItems && item.subItems.length > 0
            const href = `/account/${accountId}/${item.href}`
            const Icon = item.icon
            
            return (
              <li key={item.name}>
                <div className="relative">
                  <Link
                    href={hasSubItems ? '#' : href}
                    onClick={hasSubItems ? (e) => {
                      e.preventDefault()
                      toggleExpand(item.href)
                    } : undefined}
                    className={`flex items-center justify-between w-full px-3 py-3 rounded-md transition-colors group ${
                      isActive
                        ? 'bg-white/5 border-r-[6px] border-[#394DFF] text-white'
                        : 'text-white hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    {hasSubItems && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </Link>
                  {hasSubItems && isExpanded && (
                    <ul className="pl-9 mt-0.5 space-y-0.5">
                      {item.subItems.map((subItem) => {
                        const subHref = `/account/${accountId}/${subItem.href}`
                        const isSubActive = pathname?.endsWith(subItem.href)
                        
                        return (
                          <li key={subItem.name}>
                            <Link
                              href={subHref}
                              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                                isSubActive
                                  ? 'bg-[#1D2433] text-white'
                                  : ' hover:text-white hover:bg-white/10'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
} 