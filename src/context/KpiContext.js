import React, { createContext, useState } from 'react';
import { isDependentOn } from '../data/kpiData';

// Create the context
export const KpiContext = createContext();

// Create a provider component
export const KpiProvider = ({ children }) => {
  // State to track underperforming parent KPIs
  const [underperformingKpis, setUnderperformingKpis] = useState([]);

  // Function to check if a KPI is underperforming
  const isUnderperforming = (kpi) => {
    if (!kpi.value || !kpi.target) return false;

    // Extract numeric values
    const numericValue = parseFloat(kpi.value.toString().replace(/[^0-9.-]+/g, ''));
    const numericTarget = parseFloat(kpi.target.toString().replace(/[^0-9.-]+/g, ''));

    if (isNaN(numericValue) || isNaN(numericTarget)) return false;

    // Check if the KPI is underperforming
    if (kpi.lowerIsBetter) {
      return numericValue > numericTarget;
    } else {
      return numericValue < numericTarget;
    }
  };

  // Function to add an underperforming KPI
  const addUnderperformingKpi = (kpiId) => {
    if (!underperformingKpis.includes(kpiId)) {
      setUnderperformingKpis(prev => [...prev, kpiId]);
    }
  };

  // Function to remove a KPI from the underperforming list
  const removeUnderperformingKpi = (kpiId) => {
    setUnderperformingKpis(prev => prev.filter(id => id !== kpiId));
  };

  // Function to check if a KPI should be highlighted
  const shouldHighlight = (kpiId) => {
    // Check if this KPI is directly underperforming
    if (underperformingKpis.includes(kpiId)) {
      return true;
    }

    // Check if this KPI depends on any underperforming KPI
    for (const parentId of underperformingKpis) {
      if (isDependentOn(kpiId, parentId)) {
        return true;
      }
    }

    return false;
  };

  // Provide the context value
  const contextValue = {
    underperformingKpis,
    addUnderperformingKpi,
    removeUnderperformingKpi,
    isUnderperforming,
    shouldHighlight
  };

  return (
    <KpiContext.Provider value={contextValue}>
      {children}
    </KpiContext.Provider>
  );
};
