'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SidebarContextType {
  isMinimized: boolean
  toggleSidebar: () => void
  setMinimized: (minimized: boolean) => void
  collapseForTrading: () => void // Collapse sidebar when entering trading mode (from search)
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
  // Initialize minimized state from localStorage or default
  const [isMinimized, setIsMinimized] = useState(defaultMinimized ?? false)
  const [isHydrated, setIsHydrated] = useState(false)
  
  // Handle hydration and localStorage on client side
  useEffect(() => {
    setIsHydrated(true)
    // Always restore from localStorage if available
    const savedMinimized = localStorage.getItem('sidebar-minimized')
    if (savedMinimized !== null) {
      setIsMinimized(savedMinimized === 'true')
    } else {
      setIsMinimized(defaultMinimized ?? false)
    }
  }, [defaultMinimized])

  const toggleSidebar = () => {
    const newState = !isMinimized
    setIsMinimized(newState)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-minimized', newState.toString())
    }
  }

  const setMinimized = (minimized: boolean) => {
    setIsMinimized(minimized)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-minimized', minimized.toString())
    }
  }

  // Collapse sidebar when entering trading mode (e.g., from search selecting a stock)
  const collapseForTrading = () => {
    setIsMinimized(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-minimized', 'true')
    }
  }

  const resetManualSetting = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sidebar-minimized')
    }
  }

  return (
    <SidebarContext.Provider value={{ isMinimized, toggleSidebar, setMinimized, collapseForTrading, resetManualSetting, isHydrated }}>
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
