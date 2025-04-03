import React, { useState } from 'react';
import './SummaryPage.css';
import KpiCard from './KpiCard';
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

      <main className="kpi-grid">
        {kpiDefinitions[selectedPersona].map(kpi => (
          <KpiCard
            key={kpi.id}
            kpi={kpi}
            onClick={handleKpiClick}
          />
        ))}
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