import React, { useState, useContext, useEffect } from 'react';
import './SummaryPage.css';
import KpiCard from './KpiCard';
import KpiStrip from './KpiStrip';
import DrillDownPane from './DrillDownPane';
import BranchTabs from './BranchTabs';
import RefreshIndicator from './RefreshIndicator';
import { DataContext } from '../context/DataContext';

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
        <div className="header-controls">
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

        {/* Important KPIs with full charts */}
        <section className="kpi-grid">
          {loading ? (
            <div className="loading-indicator">Loading data...</div>
          ) : (
            data && data[`${selectedPersona}Kpis`] && data[`${selectedPersona}Kpis`].map(kpi => (
              <div key={kpi.id} className={`tile-${kpi.tileSize || '1x1'}`}>
                <KpiCard
                  kpi={kpi}
                  onClick={handleKpiClick}
                />
              </div>
            ))
          )}
        </section>

        {/* Not-so-important KPIs in a horizontal strip at the bottom */}
        <section className="kpi-strip-section">
          {loading ? (
            <div className="loading-indicator">Loading data...</div>
          ) : (
            data && data[`${selectedPersona}Kpis`] && <KpiStrip kpis={data[`${selectedPersona}Kpis`]} />
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