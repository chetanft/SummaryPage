import React, { useState } from 'react';
import './SummaryPage.css';
import KpiCard from './KpiCard';
import KpiStrip from './KpiStrip';
import DrillDownPane from './DrillDownPane';
import BranchTabs from './BranchTabs';
import ThemeToggle from './ThemeToggle';
import kpiDefinitions from '../data/kpiData';

const SummaryPage = () => {
  const [selectedPersona, setSelectedPersona] = useState('cxo');
  const [drillDownOpen, setDrillDownOpen] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState(null);

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
          <div className="last-updated">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="main-content">
        {/* Branch-specific tabbed section - only shown for Branch persona */}
        {selectedPersona === 'branch' && (
          <>
            <BranchTabs />
            <div className="section-divider">
              <span>Summary KPIs</span>
            </div>
          </>
        )}

        {/* Important KPIs with full charts */}
        <section className="kpi-grid">
          {kpiDefinitions[selectedPersona].important.map(kpi => (
            <div key={kpi.id} className={`tile-${kpi.tileSize || '1x1'}`}>
              <KpiCard
                kpi={kpi}
                onClick={handleKpiClick}
              />
            </div>
          ))}
        </section>

        {/* Not-so-important KPIs in a horizontal strip at the bottom */}
        <section className="kpi-strip-section">
          <KpiStrip kpis={kpiDefinitions[selectedPersona].notImportant.map(kpi => ({ ...kpi, persona: selectedPersona }))} />
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