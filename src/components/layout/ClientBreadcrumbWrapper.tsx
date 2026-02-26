'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Fragment } from 'react'
import type { BreadcrumbItem } from './Breadcrumb'

interface ClientBreadcrumbWrapperProps {
  items: BreadcrumbItem[]
}

export default function ClientBreadcrumbWrapper({ items }: ClientBreadcrumbWrapperProps) {
  return (
    <motion.div
      className="flex items-center"
      key={items.map(i => i.label).join('-')}
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {[{ label: 'Home', href: '/' }, ...items].map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 mr-2 text-gray-400" />
          )}
          <div className="flex items-center mr-2 gap-1 py-2 rounded-full">
            {item.href ? (
              <Link 
                href={item.href}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.label}
              </span>
            )}
          </div>
        </Fragment>
      ))}
    </motion.div>
  )
}