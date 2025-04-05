import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { FaSync } from 'react-icons/fa';
import './RefreshIndicator.css';

const RefreshIndicator = () => {
  const { loading, refreshData, formatLastRefreshTime } = useContext(DataContext);
  
  const handleRefresh = () => {
    if (!loading) {
      refreshData();
    }
  };
  
  return (
    <div className="refresh-indicator">
      <span className="refresh-time">
        Last updated: {formatLastRefreshTime()}
      </span>
      <button 
        className={`refresh-button ${loading ? 'refreshing' : ''}`}
        onClick={handleRefresh}
        disabled={loading}
        aria-label="Refresh data"
      >
        <FaSync />
      </button>
    </div>
  );
};

export default RefreshIndicator;
