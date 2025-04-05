import React, { useState } from 'react';
import './BranchTabs.css';
import TabKpiCard from './TabKpiCard';

const BranchTabs = ({ operationalMetrics }) => {
  const [activeTab, setActiveTab] = useState('planning');

  const tabs = [
    { id: 'planning', label: 'Planning' },
    { id: 'indent', label: 'Indent' },
    { id: 'ftl', label: 'FTL' },
    { id: 'ptl', label: 'PTL' },
    { id: 'freightInvoicing', label: 'Freight Invoicing' }
  ];

  return (
    <div className="branch-tabs-container">
      <h2 className="branch-tabs-title">Operational Metrics (Current Week)</h2>
      <p className="branch-tabs-description">
        These metrics reflect current week operations to support your daily planning and decision-making.
      </p>

      <div className="tabs-header">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        <div className="tab-kpi-grid">
          {operationalMetrics && operationalMetrics[activeTab] && operationalMetrics[activeTab].map(kpi => (
            <div key={kpi.id} className="tab-kpi-item">
              <TabKpiCard kpi={kpi} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BranchTabs;
