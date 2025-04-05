import React, { createContext, useState, useEffect } from 'react';
import databaseService from '../services/databaseService';

// Create a context for data management
export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize data on component mount
  useEffect(() => {
    // Initialize the database service
    const initialData = databaseService.getData();
    setData(initialData);
    setLastRefresh(databaseService.getLastRefreshTime());
    setLoading(false);
    
    // Subscribe to data updates
    const unsubscribe = databaseService.subscribe((newData, refreshTime) => {
      setData(newData);
      setLastRefresh(refreshTime);
    });
    
    // Clean up on unmount
    return () => {
      unsubscribe();
      databaseService.cleanup();
    };
  }, []);
  
  // Function to manually refresh data
  const refreshData = () => {
    setLoading(true);
    const newData = databaseService.refreshData();
    setData(newData);
    setLastRefresh(databaseService.getLastRefreshTime());
    setLoading(false);
  };
  
  // Format the last refresh time
  const formatLastRefreshTime = () => {
    if (!lastRefresh) return 'Never';
    
    const now = new Date();
    const diffMs = now - lastRefresh;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins === 1) {
      return '1 minute ago';
    } else if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      if (hours === 1) {
        return mins > 0 ? `1 hour ${mins} minutes ago` : '1 hour ago';
      } else {
        return mins > 0 ? `${hours} hours ${mins} minutes ago` : `${hours} hours ago`;
      }
    }
  };
  
  return (
    <DataContext.Provider value={{ 
      data, 
      lastRefresh, 
      loading, 
      refreshData,
      formatLastRefreshTime
    }}>
      {children}
    </DataContext.Provider>
  );
};
