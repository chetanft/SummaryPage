import React, { useState } from 'react';
import './SummaryPage.css';
import KpiCard from './KpiCard';
import KpiStrip from './KpiStrip';
import DrillDownPane from './DrillDownPane';
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
      </header>

      <main>
        {/* Not-so-important KPIs in a horizontal strip at the top */}
        <section className="kpi-strip-section">
          <KpiStrip kpis={kpiDefinitions[selectedPersona].notImportant.map(kpi => ({ ...kpi, persona: selectedPersona }))} />
        </section>

        {/* Important KPIs with full charts */}
        <section className="kpi-grid">
          {kpiDefinitions[selectedPersona].important.map(kpi => (
            <KpiCard
              key={kpi.id}
              kpi={kpi}
              onClick={handleKpiClick}
            />
          ))}
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