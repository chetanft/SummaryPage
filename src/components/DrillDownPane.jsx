import React, { useState } from 'react';
import './DrillDownPane.css';

const DrillDownPane = ({ persona, kpi, onClose }) => {
  const [expandedRegion, setExpandedRegion] = useState(null);

  // Mock data for demonstration
  const getRegionData = () => {
    return {
      topRegions: [
        { name: 'North', value: 95 },
        { name: 'West', value: 92 },
        { name: 'South', value: 88 },
        { name: 'East', value: 85 },
        { name: 'Central', value: 82 }
      ],
      bottomRegions: [
        { name: 'Northeast', value: 65 },
        { name: 'Southwest', value: 62 },
        { name: 'Northwest', value: 58 },
        { name: 'Southeast', value: 55 },
        { name: 'Islands', value: 48 }
      ]
    };
  };

  const getBranchData = (region) => {
    // Mock data - in a real app, this would be filtered by region
    return {
      topBranches: [
        { name: `${region} - Delhi`, value: 98 },
        { name: `${region} - Mumbai`, value: 95 },
        { name: `${region} - Bangalore`, value: 92 },
        { name: `${region} - Chennai`, value: 88 },
        { name: `${region} - Hyderabad`, value: 85 }
      ],
      bottomBranches: [
        { name: `${region} - Jaipur`, value: 62 },
        { name: `${region} - Lucknow`, value: 58 },
        { name: `${region} - Bhopal`, value: 55 },
        { name: `${region} - Patna`, value: 52 },
        { name: `${region} - Guwahati`, value: 48 }
      ]
    };
  };

  // These functions are now directly integrated into the JSX

  return (
    <div className="drill-down-pane">
      <div className="pane-header">
        <h2>{kpi.name} Performance</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="pane-content">
        {persona === 'cxo' && !expandedRegion && (
          <div>
            <h3>Top 5 Regions</h3>
            <ul className="performance-list">
              {getRegionData().topRegions.map(region => (
                <li key={region.name} onClick={() => setExpandedRegion(region.name)}>
                  <span>{region.name}</span>
                  <span>{region.value}</span>
                  {persona === 'cxo' && <span className="expand-icon">▶</span>}
                </li>
              ))}
            </ul>

            <h3>Bottom 5 Regions</h3>
            <ul className="performance-list">
              {getRegionData().bottomRegions.map(region => (
                <li key={region.name} onClick={() => setExpandedRegion(region.name)}>
                  <span>{region.name}</span>
                  <span>{region.value}</span>
                  {persona === 'cxo' && <span className="expand-icon">▶</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {persona === 'cxo' && expandedRegion && (
          <div className="branch-list">
            <div className="branch-header">
              <button onClick={() => setExpandedRegion(null)}>◀ Back to Regions</button>
              <h3>{expandedRegion} Region Branches</h3>
            </div>

            <h4>Top 5 Branches</h4>
            <ul className="performance-list">
              {getBranchData(expandedRegion).topBranches.map(branch => (
                <li key={branch.name}>
                  <span>{branch.name}</span>
                  <span>{branch.value}</span>
                </li>
              ))}
            </ul>

            <h4>Bottom 5 Branches</h4>
            <ul className="performance-list">
              {getBranchData(expandedRegion).bottomBranches.map(branch => (
                <li key={branch.name}>
                  <span>{branch.name}</span>
                  <span>{branch.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {persona === 'company' && (
          <div>
            <h3>Top 5 Branches</h3>
            <ul className="performance-list">
              {getBranchData('Your').topBranches.map(branch => (
                <li key={branch.name}>
                  <span>{branch.name}</span>
                  <span>{branch.value}</span>
                </li>
              ))}
            </ul>

            <h3>Bottom 5 Branches</h3>
            <ul className="performance-list">
              {getBranchData('Your').bottomBranches.map(branch => (
                <li key={branch.name}>
                  <span>{branch.name}</span>
                  <span>{branch.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrillDownPane;