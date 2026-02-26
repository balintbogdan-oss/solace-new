'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { localDataService } from '@/services/localDataService'
import { Client, AccountData } from '@/types/account'

interface ClientDataContextType {
  data: {
    client: Client | null
    accounts: AccountData[]
  } | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const ClientDataContext = createContext<ClientDataContextType | undefined>(undefined)

interface ClientDataProviderProps {
  children: ReactNode
  clientId: string
}

export function ClientDataProvider({ children, clientId }: ClientDataProviderProps) {
  const [data, setData] = useState<{ client: Client | null; accounts: AccountData[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClientData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await localDataService.getClientData(clientId)
      
      if (result) {
        setData(result)
      } else {
        setError('Client not found')
      }
    } catch (err) {
      console.error('Error fetching client data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch client data')
    } finally {
      setLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    if (clientId) {
      fetchClientData()
    }
  }, [clientId, fetchClientData])

  const refetch = async () => {
    await fetchClientData()
  }

  return (
    <ClientDataContext.Provider value={{ data, loading, error, refetch }}>
      {children}
    </ClientDataContext.Provider>
  )
}

export function useClientData() {
  const context = useContext(ClientDataContext)
  if (context === undefined) {
    throw new Error('useClientData must be used within a ClientDataProvider')
  }
  return context
}
