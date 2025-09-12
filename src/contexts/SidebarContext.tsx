'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface SidebarContextType {
  isMinimized: boolean
  toggleSidebar: () => void
  setMinimized: (minimized: boolean) => void
  resetManualSetting: () => void
  isHydrated: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ 
  children, 
  defaultMinimized 
}: { 
  children: ReactNode
  defaultMinimized?: boolean 
}) {
  const pathname = usePathname()
  
  // Check if we're on a trade page
  const isTradePage = pathname?.includes('/trade/')
  
  // Initialize minimized state based on trade page or defaultMinimized prop (server-side safe)
  const [isMinimized, setIsMinimized] = useState(defaultMinimized ?? (isTradePage ?? false))
  const [isHydrated, setIsHydrated] = useState(false)
  
  // Handle hydration and localStorage on client side
  useEffect(() => {
    setIsHydrated(true)
    const manuallySet = localStorage.getItem('sidebar-manually-set') === 'true'
    if (manuallySet) {
      const savedMinimized = localStorage.getItem('sidebar-minimized') === 'true'
      setIsMinimized(savedMinimized)
    } else {
      setIsMinimized(defaultMinimized ?? (isTradePage ?? false))
    }
  }, [isTradePage, defaultMinimized])
  
  // Update minimized state when pathname changes, but only if not manually set
  useEffect(() => {
    if (!isHydrated) return
    console.log('SidebarContext: pathname changed to:', pathname, 'isTradePage:', isTradePage)
    const manuallySet = localStorage.getItem('sidebar-manually-set') === 'true'
    if (!manuallySet) {
      setIsMinimized(defaultMinimized ?? (isTradePage ?? false))
    }
  }, [isTradePage, pathname, isHydrated, defaultMinimized])

  const toggleSidebar = () => {
    const newState = !isMinimized
    setIsMinimized(newState)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-manually-set', 'true')
      localStorage.setItem('sidebar-minimized', newState.toString())
    }
  }

  const setMinimized = (minimized: boolean) => {
    setIsMinimized(minimized)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-manually-set', 'true')
      localStorage.setItem('sidebar-minimized', minimized.toString())
    }
  }

  const resetManualSetting = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sidebar-manually-set')
      localStorage.removeItem('sidebar-minimized')
    }
  }

  return (
    <SidebarContext.Provider value={{ isMinimized, toggleSidebar, setMinimized, resetManualSetting, isHydrated }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
