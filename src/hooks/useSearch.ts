import { useState, useEffect, useCallback, useRef } from 'react';
import { searchService, SearchResultItem } from '@/services/searchService';
import { useUserRole } from '@/contexts/UserRoleContext';

export function useSearch() {
  const { role } = useUserRole();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Get client ID if user is a client (hardcoded for now, should come from auth)
  const clientId = role === 'client' ? 'client-1' : undefined;

  // Load recent searches on mount
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const recent = await searchService.getRecentSearches(clientId);
        console.log('Loaded recent searches:', recent);
        setRecentSearches(recent);
      } catch (error) {
        console.error('Error loading recent searches:', error);
        setRecentSearches([]);
      }
    };
    
    loadRecentSearches();
  }, [clientId]);

  // Search function
  const performSearch = useCallback(async (searchQuery: string) => {
    console.log('Searching for:', searchQuery);
    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchService.search(searchQuery, clientId);
      console.log('Search results:', searchResults);
      const searchItems = searchService.convertToSearchItems(searchResults);
      console.log('Converted search items:', searchItems);
      setResults(searchItems);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  // Create debounced search function with ref to avoid dependency issues
  const debouncedSearchRef = useRef(debounce(performSearch, 300));
  debouncedSearchRef.current = debounce(performSearch, 300);

  // Trigger search when query changes
  useEffect(() => {
    if (query.trim()) {
      debouncedSearchRef.current(query);
    } else {
      setResults([]);
    }
  }, [query, performSearch]);

  // Handle search item click
  const handleSearchItemClick = async (item: SearchResultItem) => {
    searchService.saveRecentSearch(item);
    try {
      const recent = await searchService.getRecentSearches(clientId);
      setRecentSearches(recent);
    } catch (error) {
      console.error('Error refreshing recent searches:', error);
    }
    setShowResults(false);
    setQuery('');
  };

  // Clear recent searches (no-op for hardcoded data)
  const clearRecentSearches = () => {
    // No-op since we're using hardcoded data
  };

  // Clear a specific recent search (no-op for hardcoded data)
  const clearRecentSearch = () => {
    // No-op since we're using hardcoded data
  };

  return {
    query,
    setQuery,
    results,
    recentSearches,
    isLoading,
    showResults,
    setShowResults,
    handleSearchItemClick,
    clearRecentSearches,
    clearRecentSearch
  };
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>( // eslint-disable-line @typescript-eslint/no-explicit-any
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
