import React, { useState, useContext, useEffect } from 'react';
import './SummaryPage.css';
import KpiCard from './KpiCard';
import KpiStrip from './KpiStrip';
import DrillDownPane from './DrillDownPane';
import BranchTabs from './BranchTabs';
import RefreshIndicator from './RefreshIndicator';
import ThemeToggle from './ThemeToggle';
import { DataContext } from '../context/DataContext';

// Define which KPIs should be shown in the main grid (important KPIs)
const mainKpiIds = {
  cxo: ['revenueProfitTrends', 'orderToDelivery', 'freightCostPerKm', 'carbonEmissions', 'regionalPerformance'],
  company: ['orderExecutionTime', 'vehicleWeightVolumeUtilization', 'freightCostsPerUnit', 'transitUnloadingTime', 'invoiceSettlement'],
  branch: ['statusFlow', 'realTimeTrips', 'branchVehicleUtilization', 'transitTimeMonitoring', 'branchOrderExecutionTime']
};

// Define grid area mapping for each KPI
const kpiGridAreaMap = {
  // CXO Level
  revenueProfitTrends: 'main-kpi',
  orderToDelivery: 'kpi-2',
  freightCostPerKm: 'kpi-3',
  carbonEmissions: 'kpi-4',
  regionalPerformance: 'kpi-5',

  // Company Level
  orderExecutionTime: 'main-kpi',
  vehicleWeightVolumeUtilization: 'kpi-2',
  freightCostsPerUnit: 'kpi-3',
  transitUnloadingTime: 'kpi-4',
  invoiceSettlement: 'kpi-5',

  // Branch Level
  statusFlow: 'main-kpi',
  realTimeTrips: 'kpi-2',
  branchVehicleUtilization: 'kpi-3',
  transitTimeMonitoring: 'kpi-4',
  branchOrderExecutionTime: 'kpi-5'
};

const SummaryPage = () => {
  const [selectedPersona, setSelectedPersona] = useState('cxo');
  const [drillDownOpen, setDrillDownOpen] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState(null);

  // Get data from DataContext
  const { data, loading } = useContext(DataContext);

  // Log data for debugging
  useEffect(() => {
    if (data) {
      console.log('Data loaded:', data);
      console.log(`Selected persona: ${selectedPersona}`);
      console.log(`KPIs for ${selectedPersona}:`, data[`${selectedPersona}Kpis`]);
    }
  }, [data, selectedPersona]);

  const handlePersonaChange = (e) => {
    setSelectedPersona(e.target.value);
    setDrillDownOpen(false);
  };

  const handleKpiClick = (kpi) => {
    if (selectedPersona === 'branch') return;

    setSelectedKpi(kpi);
    setDrillDownOpen(true);
  };

  return (
    <div className="summary-page">
      <header className="summary-header">
        <h1>Summary Page</h1>
        <div className="header-right">
          <div className="persona-selector">
            <label htmlFor="persona">User Persona: </label>
            <select
              id="persona"
              value={selectedPersona}
              onChange={handlePersonaChange}
            >
              <option value="cxo">CXO-Level</option>
              <option value="company">Company-Level</option>
              <option value="branch">Branch-Level</option>
            </select>
          </div>
          <RefreshIndicator />
          <ThemeToggle />
        </div>
      </header>

      <main className="main-content">
        {/* Branch-specific tabbed section - only shown for Branch persona */}
        {selectedPersona === 'branch' && (
          <>
            {loading ? (
              <div className="loading-indicator">Loading data...</div>
            ) : (
              data && <BranchTabs operationalMetrics={data.operationalMetrics} />
            )}
            <div className="section-divider">
              <span>Summary KPIs</span>
            </div>
          </>
        )}

        {/* All KPIs in a unified grid layout */}
        <section className="kpi-grid">
          {loading ? (
            <div className="loading-indicator">Loading data...</div>
          ) : (
            <>
              {/* Important KPIs with full charts */}
              {data && data[`${selectedPersona}Kpis`] && data[`${selectedPersona}Kpis`]
                .filter(kpi => mainKpiIds[selectedPersona]?.includes(kpi.id))
                .map(kpi => (
                <div key={kpi.id} className={`tile-${kpiGridAreaMap[kpi.id] || '1x1'}`}>
                  <KpiCard
                    kpi={kpi}
                    onClick={handleKpiClick}
                  />
                </div>
              ))}

              {/* Non-important KPIs integrated into the grid */}
              {data && data[`${selectedPersona}Kpis`] &&
                <KpiStrip kpis={data[`${selectedPersona}Kpis`]} persona={selectedPersona} />
              }
            </>
          )}
        </section>
      </main>

      {drillDownOpen && (
        <DrillDownPane
          persona={selectedPersona}
          kpi={selectedKpi}
          onClose={() => setDrillDownOpen(false)}
        />
      )}
    </div>
  );
};

export default SummaryPage;