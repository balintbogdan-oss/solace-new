'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useNavigation } from '@/contexts/NavigationContext'

export function AccountSidebar() {
  const pathname = usePathname()
  const { currentSectionItems } = useNavigation()

  if (!currentSectionItems) {
    return null
  }

  return (
    <nav className="hidden md:block w-[240px] min-h-[calc(100vh-116px)] bg-card-blend dark:bg-card-blend-dark rounded-md">
      <div className="p-3">
        <ul className="space-y-2">
          {currentSectionItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 w-full px-3 py-3 rounded-md text-sm transition-colors',
                    isActive
                      ? 'text-gray-900 dark:text-gray-100 bg-gray-400/20 border-r-[6px] border-[#394DFF]'
                      : 'hover:bg-gray-200/30 dark:hover:bg-gray-200/10'
                  )}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
} 