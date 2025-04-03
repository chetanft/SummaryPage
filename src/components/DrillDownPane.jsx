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
          // Generate realistic values based on region characteristics
          let regionFactor;

          // Assign realistic factors based on region
          switch(region) {
            case 'North':
              regionFactor = 0.85; // Slightly below average
              break;
            case 'South':
              regionFactor = 0.95; // Just below average
              break;
            case 'East':
              regionFactor = 1.15; // Above average
              break;
            case 'West':
              regionFactor = 1.25; // Well above average
              break;
            case 'Central':
              regionFactor = 1.05; // Slightly above average
              break;
            case 'Northeast':
              regionFactor = 0.90; // Below average
              break;
            case 'Northwest':
              regionFactor = 1.10; // Above average
              break;
            case 'Southeast':
              regionFactor = 0.80; // Well below average
              break;
            case 'Southwest':
              regionFactor = 0.75; // Worst performing
              break;
            default:
              regionFactor = 1.0; // Average
          }

          // Add a small random variation
          const randomVariation = 0.95 + (Math.random() * 0.1); // ±5% variation
          const value = (min + (range * 0.5)) * regionFactor * randomVariation;

          // Format based on KPI type
          let formattedValue;
          if (kpi.value.includes('%')) {
            formattedValue = parseFloat(value.toFixed(1));
          } else if (kpi.value.includes('₹')) {
            formattedValue = parseFloat(value.toFixed(0));
          } else if (kpi.value.includes('days')) {
            formattedValue = parseFloat(value.toFixed(1));
          } else {
            formattedValue = parseFloat(value.toFixed(1));
          }

          return {
            name: region,
            value: formattedValue
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
    // Use the standard region names defined above with realistic values

    // Extract numeric value from KPI value
    let numericValue = parseFloat(kpi.value.replace(/[^0-9.]/g, ''));
    if (isNaN(numericValue)) numericValue = 100; // Default if parsing fails

    // Format function based on KPI type
    const formatValue = (value) => {
      if (kpi.value.includes('%')) {
        return parseFloat(value.toFixed(1));
      } else if (kpi.value.includes('₹')) {
        return parseFloat(value.toFixed(0));
      } else if (kpi.value.includes('days')) {
        return parseFloat(value.toFixed(1));
      } else {
        return parseFloat(value.toFixed(1));
      }
    };

    return {
      topRegions: [
        { name: 'West', value: formatValue(numericValue * 1.25) },
        { name: 'East', value: formatValue(numericValue * 1.15) },
        { name: 'Central', value: formatValue(numericValue * 1.08) },
        { name: 'Northwest', value: formatValue(numericValue * 1.05) },
        { name: 'North', value: formatValue(numericValue * 1.02) }
      ],
      bottomRegions: [
        { name: 'South', value: formatValue(numericValue * 0.95) },
        { name: 'Northeast', value: formatValue(numericValue * 0.90) },
        { name: 'South Central', value: formatValue(numericValue * 0.85) },
        { name: 'Southeast', value: formatValue(numericValue * 0.80) },
        { name: 'Southwest', value: formatValue(numericValue * 0.75) }
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
      // Check if the original value includes 'days'
      else if (String(kpi.value).includes('days')) {
        return `${rawValue.toFixed(1)} days`;
      }
      // Default formatting
      else {
        return rawValue.toFixed(1);
      }
    };

    // Generate realistic city names based on region
    const getCitiesForRegion = (region) => {
      const regionCities = {
        'North': ['Delhi', 'Chandigarh', 'Lucknow', 'Dehradun', 'Shimla', 'Amritsar', 'Ludhiana', 'Jammu', 'Srinagar', 'Meerut'],
        'South': ['Chennai', 'Bangalore', 'Hyderabad', 'Kochi', 'Coimbatore', 'Trivandrum', 'Madurai', 'Mysore', 'Visakhapatnam', 'Mangalore'],
        'East': ['Kolkata', 'Bhubaneswar', 'Patna', 'Ranchi', 'Guwahati', 'Siliguri', 'Cuttack', 'Jamshedpur', 'Asansol', 'Dhanbad'],
        'West': ['Mumbai', 'Pune', 'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Nagpur', 'Nashik', 'Aurangabad', 'Jamnagar'],
        'Central': ['Bhopal', 'Indore', 'Jaipur', 'Raipur', 'Jabalpur', 'Gwalior', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
        'Northeast': ['Guwahati', 'Shillong', 'Agartala', 'Imphal', 'Aizawl', 'Kohima', 'Itanagar', 'Dibrugarh', 'Jorhat', 'Tezpur'],
        'Northwest': ['Jaipur', 'Jodhpur', 'Bikaner', 'Ajmer', 'Udaipur', 'Kota', 'Amritsar', 'Ludhiana', 'Chandigarh', 'Shimla'],
        'Southeast': ['Chennai', 'Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Tirupati', 'Pondicherry', 'Nellore', 'Rajahmundry', 'Kakinada', 'Guntur'],
        'Southwest': ['Bangalore', 'Kochi', 'Mangalore', 'Mysore', 'Coimbatore', 'Madurai', 'Trivandrum', 'Kozhikode', 'Thrissur', 'Udupi'],
        'North Central': ['Lucknow', 'Kanpur', 'Allahabad', 'Varanasi', 'Agra', 'Meerut', 'Bareilly', 'Moradabad', 'Aligarh', 'Gorakhpur'],
        'South Central': ['Hyderabad', 'Vijayawada', 'Warangal', 'Tirupati', 'Nellore', 'Kurnool', 'Rajahmundry', 'Kakinada', 'Guntur', 'Nizamabad'],
        'East Central': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia'],
        'West Central': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Ratlam', 'Dewas', 'Rewa', 'Sagar', 'Satna']
      };

      return regionCities[region] || ['City 1', 'City 2', 'City 3', 'City 4', 'City 5', 'City 6', 'City 7', 'City 8', 'City 9', 'City 10'];
    };

    // Get cities for this region
    const cities = getCitiesForRegion(region);

    // Performance factors for top and bottom cities
    const topCityFactors = [1.15, 1.12, 1.08, 1.05, 1.02];
    const bottomCityFactors = [0.85, 0.82, 0.78, 0.75, 0.70];

    // Generate values that are relative to the KPI value
    return {
      topBranches: [
        { name: `${region} - ${cities[0]}`, value: formatValue(topCityFactors[0]) },
        { name: `${region} - ${cities[1]}`, value: formatValue(topCityFactors[1]) },
        { name: `${region} - ${cities[2]}`, value: formatValue(topCityFactors[2]) },
        { name: `${region} - ${cities[3]}`, value: formatValue(topCityFactors[3]) },
        { name: `${region} - ${cities[4]}`, value: formatValue(topCityFactors[4]) }
      ],
      bottomBranches: [
        { name: `${region} - ${cities[5]}`, value: formatValue(bottomCityFactors[0]) },
        { name: `${region} - ${cities[6]}`, value: formatValue(bottomCityFactors[1]) },
        { name: `${region} - ${cities[7]}`, value: formatValue(bottomCityFactors[2]) },
        { name: `${region} - ${cities[8]}`, value: formatValue(bottomCityFactors[3]) },
        { name: `${region} - ${cities[9]}`, value: formatValue(bottomCityFactors[4]) }
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