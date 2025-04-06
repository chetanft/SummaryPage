import React from 'react';
import { Line } from 'react-chartjs-2';
import './KpiStrip.css';

// Define which KPIs should be shown in the strip (non-important KPIs)
const stripKpiIds = {
  cxo: ['fuelEfficiency', 'salesDeliveryOrders', 'tripCount', 'inboundFreightCost', 'otif', 'outboundFreightCost'],
  company: ['otherChargesBreakdown', 'materialInvoices', 'freightInvoices', 'companyTripCount', 'placementEfficiency', 'cleanPODInvoices'],
  branch: ['unloadingTime', 'cleanPOD', 'placementEfficiency', 'salesOrders', 'invoiceSubmission', 'materialFreightInvoices']
};

// Define grid area mapping for non-important KPIs
const nonImportantGridAreaMap = {
  // First row of non-important KPIs
  fuelEfficiency: 'non-1',
  salesDeliveryOrders: 'non-2',
  tripCount: 'non-3',
  inboundFreightCost: 'non-4',
  otif: 'non-5',
  outboundFreightCost: 'non-6',

  // Company level
  otherChargesBreakdown: 'non-1',
  materialInvoices: 'non-2',
  freightInvoices: 'non-3',
  companyTripCount: 'non-4',
  placementEfficiency: 'non-5',
  cleanPODInvoices: 'non-6',

  // Branch level
  unloadingTime: 'non-1',
  cleanPOD: 'non-2',
  placementEfficiency: 'non-3',
  salesOrders: 'non-4',
  invoiceSubmission: 'non-5',
  materialFreightInvoices: 'non-6'
};

const KpiStrip = ({ kpis, persona = 'cxo' }) => {
  // Filter KPIs to only show the ones defined in stripKpiIds for the current persona
  const filteredKpis = kpis.filter(kpi => stripKpiIds[persona]?.includes(kpi.id));
  // Function to determine if a value is above target
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

  // Function to determine if a value is below target
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

  // Function to render a sparkline chart
  const renderSparkline = (kpi) => {
    const { chartData } = kpi;
    if (!chartData || !chartData.datasets || !chartData.datasets[0].data) {
      return null;
    }

    // Determine trend direction
    const data = chartData.datasets[0].data;
    const firstValue = data[0];
    const lastValue = data[data.length - 1];
    const isTrendUp = lastValue > firstValue;

    // Set color based on trend direction
    const trendColor = isTrendUp ? '#10b981' : '#ef4444';

    // Create simplified options for sparkline
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      devicePixelRatio: 2, // Higher resolution
      layout: {
        padding: {
          top: 2,
          bottom: 2,
          left: 2,
          right: 2
        }
      },
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
          grid: {
            display: false,
          },
        },
        y: {
          display: false, // No y-axis for sparklines
          grid: {
            display: false,
          },
          min: 0, // Always start from 0 for better visual comparison
          max: Math.max(...data) * 1.2, // Add more padding at the top
        },
      },
      elements: {
        point: {
          radius: 0, // No points by default
          hoverRadius: 3, // Show points on hover
        },
        line: {
          borderWidth: 2, // Slightly thicker line
          tension: 0.4, // Smooth curve
          fill: false, // No fill under the line
        },
      },
    };

    // Create simplified data for sparkline
    const sparklineData = {
      labels: chartData.labels,
      datasets: [
        {
          ...chartData.datasets[0],
          borderColor: trendColor,
          backgroundColor: 'transparent', // No background color
          pointBackgroundColor: trendColor,
          pointBorderColor: trendColor,
          borderWidth: 2,
        },
      ],
    };

    return (
      <Line data={sparklineData} options={options} />
    );
  };

  return (
    <>
      {filteredKpis.map((kpi, index) => (
        <div key={kpi.id} className={`kpi-strip-item ${getTargetComparisonClass(kpi)} tile-${nonImportantGridAreaMap[kpi.id] || `non-${index + 1}`}`}>
          <div className="kpi-content">
            <h4 className="kpi-title">{kpi.name}</h4>
            <div className="kpi-value-row">
              <div className="kpi-value">
                {kpi.value}
              </div>
              <div className="kpi-target">
                <span className="kpi-target-label">Target</span>
                <span className="kpi-target-value">{kpi.target}</span>
              </div>
            </div>
          </div>
          <div className="kpi-chart-header">
            {renderSparkline(kpi)}
          </div>
        </div>
      ))}
    </>
  );
};

export default KpiStrip;
