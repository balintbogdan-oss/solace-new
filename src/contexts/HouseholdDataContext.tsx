'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { localDataService } from '@/services/localDataService'
import { Household, AccountData } from '@/types/account'

interface HouseholdData {
  household: Household | null;
  accounts: AccountData[];
}

interface HouseholdDataContextType {
  data: HouseholdData | null;
  loading: boolean;
  error: string | null;
  refreshHouseholdData: () => void;
}

const HouseholdDataContext = createContext<HouseholdDataContextType | undefined>(undefined)

interface HouseholdDataProviderProps {
  children: ReactNode;
  householdId: string;
}

export function HouseholdDataProvider({ children, householdId }: HouseholdDataProviderProps) {
  const [data, setData] = useState<HouseholdData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHouseholdData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const householdData = await localDataService.getHouseholdData(householdId)
      if (householdData) {
        setData(householdData)
      } else {
        setError('Household not found or error fetching data.')
        setData(null)
      }
    } catch (err) {
      console.error('Failed to fetch household data:', err)
      setError('Failed to load household data.')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [householdId])

  useEffect(() => {
    if (householdId) {
      fetchHouseholdData()
    } else {
      setLoading(false)
      setError('No household ID provided.')
      setData(null)
    }
  }, [householdId, fetchHouseholdData])

  const refreshHouseholdData = () => {
    fetchHouseholdData()
  }

  return (
    <HouseholdDataContext.Provider value={{ data, loading, error, refreshHouseholdData }}>
      {children}
    </HouseholdDataContext.Provider>
  )
}

export function useHouseholdData() {
  const context = useContext(HouseholdDataContext)
  if (context === undefined) {
    throw new Error('useHouseholdData must be used within a HouseholdDataProvider')
  }
  return context
}
