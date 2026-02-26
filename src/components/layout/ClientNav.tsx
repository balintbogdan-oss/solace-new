"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutGrid, FileText, Settings, Calculator } from 'lucide-react'

interface ClientNavProps {
  clientId: string
}

const navItems = [
  {
    title: 'Client 360',
    icon: LayoutGrid,
    href: '/clients/:id'
  },
  {
    title: 'Documents',
    icon: FileText,
    href: '/clients/:id/documents'
  },
  {
    title: 'Maintenance',
    icon: Settings,
    href: '/clients/:id/maintenance'
  },
  {
    title: 'View as client',
    icon: Calculator,
    href: '/clients/:id/simulation'
  }
]

export function ClientNav({ clientId }: ClientNavProps) {
  const pathname = usePathname()
  
  return (
    <nav className="w-[240px] min-h-[calc(100vh-116px)] bg-card-blend dark:bg-card-blend-dark  rounded-md p-3"> 
      <div className="py-1 space-y-2">
        {navItems.map((item) => {
          const href = item.href.replace(':id', clientId)
          const isActive = pathname === href
          
          return (
            <Link
              key={item.title}
              href={href}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-md text-sm transition-colors",
                isActive 
                        ? 'bg-white/5 border-r-[6px] border-[#394DFF] text-white'
                        : 'text-white hover:text-white hover:bg-white/10'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
} 