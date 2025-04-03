import React, { useState } from 'react';
import './DrillDownPane.css';

const DrillDownPane = ({ persona, kpi, onClose }) => {
  const [expandedRegion, setExpandedRegion] = useState(null);

  // Generate data based on the KPI
  const getRegionData = () => {
    // Define standard region names
    const standardRegions = [
      'North', 'South', 'East', 'West', 'Central',
      'Northeast', 'Northwest', 'Southeast', 'Southwest',
      'North Central', 'South Central', 'East Central', 'West Central'
    ];

    // Use the KPI's chart data to generate region data if available
    if (kpi.chartData && kpi.chartData.labels && kpi.chartData.datasets && kpi.chartData.datasets[0].data) {
      const labels = kpi.chartData.labels;
      const data = kpi.chartData.datasets[0].data;

      // Check if labels are likely to be months or quarters (time-based)
      const isTimeSeries = labels.some(label =>
        /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Q[1-4]|[0-9]{4})/.test(label)
      );

      if (isTimeSeries) {
        // For time series data, use standard region names instead
        // Generate random but consistent values based on the KPI's data range
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;

        // Create region data with randomized but reasonable values
        const regions = standardRegions.map(region => {
          // Generate a value between min and max, weighted toward the middle
          const randomFactor = 0.5 + (Math.random() * 0.5);
          const value = min + (range * randomFactor);
          return {
            name: region,
            value: parseFloat(value.toFixed(1))
          };
        });

        // Sort by value in descending order
        const sortedRegions = [...regions].sort((a, b) => b.value - a.value);

        // Get top 5 and bottom 5
        const topRegions = sortedRegions.slice(0, 5);
        const bottomRegions = sortedRegions.slice(-5).reverse();

        return { topRegions, bottomRegions };
      } else {
        // If not time series, use the actual labels (likely regions)
        // Create an array of objects with name and value
        const regions = labels.map((label, index) => ({
          name: label,
          value: data[index]
        }));

        // Sort by value in descending order
        const sortedRegions = [...regions].sort((a, b) => b.value - a.value);

        // Get top 5 and bottom 5
        const topRegions = sortedRegions.slice(0, 5);
        const bottomRegions = sortedRegions.slice(-5).reverse();

        return { topRegions, bottomRegions };
      }
    }

    // Fallback data if chart data is not available
    // Use the standard region names defined above
    return {
      topRegions: [
        { name: 'North', value: kpi.value * 1.05 },
        { name: 'West', value: kpi.value * 1.02 },
        { name: 'South', value: kpi.value * 0.98 },
        { name: 'East', value: kpi.value * 0.95 },
        { name: 'Central', value: kpi.value * 0.92 }
      ],
      bottomRegions: [
        { name: 'Northeast', value: kpi.value * 0.85 },
        { name: 'Southwest', value: kpi.value * 0.82 },
        { name: 'Northwest', value: kpi.value * 0.78 },
        { name: 'Southeast', value: kpi.value * 0.75 },
        { name: 'North Central', value: kpi.value * 0.70 }
      ]
    };
  };

  const getBranchData = (region) => {
    // Generate branch data based on the region and KPI value
    // Extract numeric value from KPI value (handling strings with units, percentages, etc.)
    let baseValue = 0;

    if (typeof kpi.value === 'number') {
      baseValue = kpi.value;
    } else if (typeof kpi.value === 'string') {
      // Extract numeric part from string (e.g., "85%" -> 85, "$1,200" -> 1200)
      const numericMatch = kpi.value.toString().match(/[\d,.]+/);
      if (numericMatch) {
        baseValue = parseFloat(numericMatch[0].replace(/,/g, ''));
      }
    }

    // If we couldn't extract a valid number, use a default value
    if (isNaN(baseValue) || baseValue === 0) {
      baseValue = 100; // Default value if we can't parse the KPI value
    }

    // Format values to match the KPI value format (keep % or currency symbols)
    const formatValue = (factor) => {
      const rawValue = baseValue * factor;

      // Check if the original value has a % sign
      if (String(kpi.value).includes('%')) {
        return `${rawValue.toFixed(1)}%`;
      }
      // Check if the original value has a currency symbol
      else if (String(kpi.value).match(/^[\$₹€£¥]/)) {
        const currencySymbol = String(kpi.value).match(/^[\$₹€£¥]/)[0];
        return `${currencySymbol}${rawValue.toFixed(0)}`;
      }
      // Default formatting
      else {
        return rawValue.toFixed(1);
      }
    };

    // Generate values that are relative to the KPI value
    return {
      topBranches: [
        { name: `${region} - Delhi`, value: formatValue(1.08) },
        { name: `${region} - Mumbai`, value: formatValue(1.05) },
        { name: `${region} - Bangalore`, value: formatValue(1.02) },
        { name: `${region} - Chennai`, value: formatValue(0.98) },
        { name: `${region} - Hyderabad`, value: formatValue(0.95) }
      ],
      bottomBranches: [
        { name: `${region} - Jaipur`, value: formatValue(0.82) },
        { name: `${region} - Lucknow`, value: formatValue(0.78) },
        { name: `${region} - Bhopal`, value: formatValue(0.75) },
        { name: `${region} - Patna`, value: formatValue(0.72) },
        { name: `${region} - Guwahati`, value: formatValue(0.68) }
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
                  <span style={{ color: parseFloat(String(region.value).replace(/[^0-9.-]+/g, '')) >= parseFloat(String(kpi.target).replace(/[^0-9.-]+/g, '')) ? '#10b981' : '#ef4444' }}>
                    {typeof region.value === 'number' ? region.value.toFixed(1) : region.value}
                  </span>
                  {persona === 'cxo' && <span className="expand-icon">▶</span>}
                </li>
              ))}
            </ul>

            <h3>Bottom 5 Regions</h3>
            <ul className="performance-list">
              {getRegionData().bottomRegions.map(region => (
                <li key={region.name} onClick={() => setExpandedRegion(region.name)}>
                  <span>{region.name}</span>
                  <span style={{ color: parseFloat(String(region.value).replace(/[^0-9.-]+/g, '')) >= parseFloat(String(kpi.target).replace(/[^0-9.-]+/g, '')) ? '#10b981' : '#ef4444' }}>
                    {typeof region.value === 'number' ? region.value.toFixed(1) : region.value}
                  </span>
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
                  <span style={{ color: parseFloat(String(branch.value).replace(/[^0-9.-]+/g, '')) >= parseFloat(String(kpi.target).replace(/[^0-9.-]+/g, '')) ? '#10b981' : '#ef4444' }}>
                    {branch.value}
                  </span>
                </li>
              ))}
            </ul>

            <h4>Bottom 5 Branches</h4>
            <ul className="performance-list">
              {getBranchData(expandedRegion).bottomBranches.map(branch => (
                <li key={branch.name}>
                  <span>{branch.name}</span>
                  <span style={{ color: parseFloat(String(branch.value).replace(/[^0-9.-]+/g, '')) >= parseFloat(String(kpi.target).replace(/[^0-9.-]+/g, '')) ? '#10b981' : '#ef4444' }}>
                    {branch.value}
                  </span>
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
                  <span style={{ color: parseFloat(String(branch.value).replace(/[^0-9.-]+/g, '')) >= parseFloat(String(kpi.target).replace(/[^0-9.-]+/g, '')) ? '#10b981' : '#ef4444' }}>
                    {branch.value}
                  </span>
                </li>
              ))}
            </ul>

            <h3>Bottom 5 Branches</h3>
            <ul className="performance-list">
              {getBranchData('Your').bottomBranches.map(branch => (
                <li key={branch.name}>
                  <span>{branch.name}</span>
                  <span style={{ color: parseFloat(String(branch.value).replace(/[^0-9.-]+/g, '')) >= parseFloat(String(kpi.target).replace(/[^0-9.-]+/g, '')) ? '#10b981' : '#ef4444' }}>
                    {branch.value}
                  </span>
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