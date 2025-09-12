import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Fragment } from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="flex items-center pl-3 md:p-0 font-medium mt-2">
      {[{ label: 'Home', href: '/' }, ...items].map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          {index > 0 && (
            <ChevronRight className="w-4 mr-2 h-4 text-muted-foreground" />
          )}
          <div className="flex items-center mr-2 gap-1 rounded-full">
            {item.href ? (
              <Link 
                href={item.href}
                className="text-sm text-muted-foreground hover:text-black/10 dark:hover:text-white/90"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm text-muted-foreground">
                {item.label}
              </span>
            )}
          </div>
        </Fragment>
      ))}
    </div>
  )
}