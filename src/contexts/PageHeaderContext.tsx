'use client';

import { createContext, useContext } from 'react';

interface PageHeaderContextProps {
  isSticky: boolean;
}

const PageHeaderContext = createContext<PageHeaderContextProps | undefined>(undefined);

export const usePageHeaderContext = () => {
  const context = useContext(PageHeaderContext);
  if (context === undefined) {
    // Return a default value if context is not found - components might be used outside PageHeader
    // Or throw an error: throw new Error('usePageHeaderContext must be used within a PageHeaderProvider');
    return { isSticky: false }; 
  }
  return context;
};

export const PageHeaderProvider = PageHeaderContext.Provider; 