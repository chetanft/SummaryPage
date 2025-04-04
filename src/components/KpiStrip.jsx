import React from 'react';
import { Line } from 'react-chartjs-2';
import './KpiStrip.css';

const KpiStrip = ({ kpis }) => {
  // Function to render a sparkline chart
  const renderSparkline = (kpi) => {
    const { chartData } = kpi;

    // Create simplified options for sparkline
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, // No legend for sparklines
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          titleFont: {
            size: 10,
          },
          bodyFont: {
            size: 10,
          },
          padding: 6,
          displayColors: false,
        },
      },
      scales: {
        x: {
          display: false, // No x-axis for sparklines
        },
        y: {
          display: false, // No y-axis for sparklines
          min: Math.min(...chartData.datasets[0].data) * 0.9, // Add some padding
          max: Math.max(...chartData.datasets[0].data) * 1.1, // Add some padding
        },
      },
      elements: {
        point: {
          radius: 0, // No points by default
          hoverRadius: 2, // Show points on hover
        },
        line: {
          borderWidth: 1.5, // Thin line
          tension: 0.4, // Smooth curve
        },
      },
    };

    // Determine line color based on persona and trend
    const getTrendColor = () => {
      // Extract numeric values
      const data = chartData.datasets[0].data;
      const firstValue = data[0];
      const lastValue = data[data.length - 1];

      // Extract numeric target value if available
      let numericTarget = null;
      if (kpi.target) {
        numericTarget = parseFloat(kpi.target.toString().replace(/[^0-9.-]+/g, ''));
      }

      // Check if below target
      if (numericTarget !== null && lastValue < numericTarget) {
        return '#ff4d4f'; // Custom red for below target
      }

      // Use persona-specific colors for positive/neutral trends
      const persona = kpi.persona || 'cxo'; // Default to cxo if not specified

      switch (persona) {
        case 'cxo':
          return '#003c9b'; // Freight Tiger Blue for CXO
        case 'company':
          return '#04bc15'; // Freight Tiger Green for Company
        case 'branch':
          return '#ffbe07'; // Freight Tiger Yellow for Branch
        default:
          return '#003c9b'; // Default to Freight Tiger Blue
      }
    };

    // Create simplified data for sparkline
    const sparklineData = {
      labels: chartData.labels,
      datasets: [
        {
          ...chartData.datasets[0],
          borderColor: getTrendColor(),
          backgroundColor: 'transparent',
          pointBackgroundColor: getTrendColor(),
          pointBorderColor: getTrendColor(),
        },
      ],
    };

    return (
      <div className="sparkline-container">
        <Line data={sparklineData} options={options} />
      </div>
    );
  };

  // Function to get value color based on comparison with target
  const getValueColor = (kpi) => {
    const { value, target, lowerIsBetter } = kpi;

    // Extract numeric values (remove currency symbols, etc.)
    const numericValue = parseFloat(value.toString().replace(/[^0-9.-]+/g, ''));
    const numericTarget = parseFloat(target.toString().replace(/[^0-9.-]+/g, ''));

    // Check if we have valid numbers to compare
    if (isNaN(numericValue) || isNaN(numericTarget)) {
      return 'inherit'; // Default color if we can't parse the values
    }

    // For metrics where higher is better (default assumption)
    if (!lowerIsBetter) {
      return numericValue >= numericTarget ? '#04bc15' : '#ff4d4f'; // Freight Tiger Green : Custom red
    }
    // For metrics where lower is better (e.g., costs, time)
    else {
      return numericValue <= numericTarget ? '#04bc15' : '#ff4d4f'; // Freight Tiger Green : Custom red
    }
  };

  // Determine if value is above or below target for a KPI
  const isAboveTarget = (kpi) => {
    if (!kpi.value || !kpi.target) return false;

    // Extract numeric values
    const valueNumeric = parseFloat(kpi.value.toString().replace(/[^0-9.-]+/g, ''));
    const targetNumeric = parseFloat(kpi.target.toString().replace(/[^0-9.-]+/g, ''));

    if (isNaN(valueNumeric) || isNaN(targetNumeric)) return false;

    // For KPIs where lower is better, the logic is reversed
    if (kpi.lowerIsBetter) {
      return valueNumeric <= targetNumeric;
    }

    return valueNumeric >= targetNumeric;
  };

  const isBelowTarget = (kpi) => {
    if (!kpi.value || !kpi.target) return false;

    // Extract numeric values
    const valueNumeric = parseFloat(kpi.value.toString().replace(/[^0-9.-]+/g, ''));
    const targetNumeric = parseFloat(kpi.target.toString().replace(/[^0-9.-]+/g, ''));

    if (isNaN(valueNumeric) || isNaN(targetNumeric)) return false;

    // For KPIs where lower is better, the logic is reversed
    if (kpi.lowerIsBetter) {
      return valueNumeric > targetNumeric;
    }

    return valueNumeric < targetNumeric;
  };

  // Get the appropriate class based on target comparison
  const getTargetComparisonClass = (kpi) => {
    if (isAboveTarget(kpi)) return 'above-target';
    if (isBelowTarget(kpi)) return 'below-target';
    return '';
  };

  return (
    <>
      {kpis.map((kpi) => (
        <div key={kpi.id} className={`kpi-strip-item ${getTargetComparisonClass(kpi)}`}>
          <div className="kpi-strip-header">
            <h4>{kpi.name}</h4>
          </div>
          <div className="kpi-strip-content">
            <div className="kpi-strip-values">
              <div className="kpi-strip-value">
                {kpi.value}
              </div>
              <div className="kpi-strip-target">
                <span className="kpi-strip-target-label">Target:</span>
                <span className="kpi-strip-target-value">{kpi.target}</span>
              </div>
            </div>
          </div>
          {renderSparkline(kpi)}
        </div>
      ))}
    </>
  );
};

export default KpiStrip;
