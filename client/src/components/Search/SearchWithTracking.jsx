// client/src/components/Search/SearchWithTracking.jsx
import React, { useCallback } from 'react';
import Search from './Search';
import { useActivityTrackingContext } from '@/components/ActivityTracking/ActivityTrackingProvider';
import { useVipBuyer } from '@/utils/VipBuyerContext';

/**
 * Enhanced Search component with VIP buyer activity tracking
 * Tracks search queries and their results
 */
const SearchWithTracking = (props) => {
  const { trackSearch, trackEvent } = useActivityTrackingContext();
  const { isVipBuyer } = useVipBuyer();
  
  // Create a tracked version of the query setter
  const handleSetQuery = useCallback((query) => {
    if (isVipBuyer && query !== props.query) {
      // Track typing in search box
      trackEvent('search_typing', { query });
    }
    
    // Call the original setQuery function
    props.setQuery(query);
  }, [isVipBuyer, props.query, props.setQuery, trackEvent]);
  
  // Create a tracked version of the search submit handler
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (isVipBuyer && props.query) {
      // Get the number of results if available from props or context
      const resultsCount = 
        props.resultsCount || 
        (props.filteredData ? props.filteredData.length : undefined);
      
      // Track the search query
      trackSearch(props.query, resultsCount, props.filters);
    }
    
    // If the original Search component has a submit handler, call it
    if (props.onSubmit) {
      props.onSubmit(e);
    }
  }, [isVipBuyer, props, trackSearch]);
  
  // Pass modified handlers to the original Search component
  return (
    <Search 
      {...props} 
      setQuery={handleSetQuery}
      onSubmit={handleSubmit}
    />
  );
};

export default SearchWithTracking;