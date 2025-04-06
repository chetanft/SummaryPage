import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './KpiCard.css';
import Tooltip from './Tooltip';

// Register Chart.js components
Chart.register(...registerables);

const KpiCard = ({ kpi, onClick }) => {
  const {
    name,
    value,
    target,
    trend,
    status,
    chartData,
    tooltipContent,
    tileSize = '1x1' // Default to 1x1 if not specified
  } = kpi;

  const getStatusColor = () => {
    switch (status) {
      case 'good': return '#04bc15'; // Freight Tiger Green
      case 'warning': return '#ffbe07'; // Freight Tiger Yellow
      case 'bad': return '#ff4d4f'; // Custom Red
      default: return '#939393'; // Grey
    }
  };

  // Compare current value with target to determine color
  const getValueColor = () => {
    // Extract numeric values (remove currency symbols, etc.)
    const numericValue = parseFloat(value.toString().replace(/[^0-9.-]+/g, ''));
    const numericTarget = parseFloat(target.toString().replace(/[^0-9.-]+/g, ''));

    if (isNaN(numericValue) || isNaN(numericTarget)) return 'var(--color-text-primary)';

    if (kpi.lowerIsBetter) {
      return numericValue <= numericTarget ? 'var(--color-success)' : 'var(--color-error)';
    } else {
      return numericValue >= numericTarget ? 'var(--color-success)' : 'var(--color-error)';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      case 'stable': return '→';
      default: return '';
    }
  };

  // Determine if value is above or below target
  const isAboveTarget = () => {
    if (!value || !target) return false;

    // Extract numeric values
    const valueNumeric = parseFloat(value.toString().replace(/[^0-9.-]+/g, ''));
    const targetNumeric = parseFloat(target.toString().replace(/[^0-9.-]+/g, ''));

    if (isNaN(valueNumeric) || isNaN(targetNumeric)) return false;

    return valueNumeric >= targetNumeric;
  };

  const isBelowTarget = () => {
    if (!value || !target) return false;

    // Extract numeric values
    const valueNumeric = parseFloat(value.toString().replace(/[^0-9.-]+/g, ''));
    const targetNumeric = parseFloat(target.toString().replace(/[^0-9.-]+/g, ''));

    if (isNaN(valueNumeric) || isNaN(targetNumeric)) return false;

    return valueNumeric < targetNumeric;
  };

  // Determine the appropriate class based on target comparison
  const getTargetComparisonClass = () => {
    if (isAboveTarget()) return 'above-target';
    if (isBelowTarget()) return 'below-target';
    return '';
  };

  // Render chart
  const renderChart = () => {
    if (!chartData || !chartData.datasets || !chartData.datasets[0] || !chartData.datasets[0].data) {
      console.log('No chart data available for KPI:', name);
      return <div className="no-chart-data">No chart data available</div>;
    }

    // Create a deep copy of the chart data to avoid modifying the original
    const lineData = JSON.parse(JSON.stringify(chartData));

    // Basic chart options
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            lineWidth: 1
          },
          ticks: {
            color: 'var(--color-text-secondary)',
            font: {
              size: 10
            }
          },
          border: {
            color: 'var(--color-border)',
            width: 1
          }
        },
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            lineWidth: 1
          },
          ticks: {
            color: 'var(--color-text-secondary)',
            font: {
              size: 10
            }
          },
          border: {
            color: 'var(--color-border)',
            width: 1
          }
        }
      }
    };

    // Style the datasets
    lineData.datasets = lineData.datasets.map(dataset => {
      return {
        ...dataset,
        borderColor: '#003c9b',
        backgroundColor: 'rgba(0, 60, 155, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.4
      };
    });

    try {
      return <Line data={lineData} options={options} />;
    } catch (error) {
      console.error('Error rendering chart:', error);
      return <div className="no-chart-data">Error rendering chart</div>;
    }
  };

  return (
    <div 
      className={`kpi-card ${tileSize}`} 
      onClick={() => onClick && onClick(kpi)}
    >
      <div className="kpi-header">
        <h3 className="kpi-title">
          {status && (
            <span 
              className="status-indicator"
              style={{ backgroundColor: getStatusColor() }}
            ></span>
          )}
          {name}
        </h3>
        {tooltipContent && <Tooltip content={tooltipContent} />}
      </div>
      <div className="kpi-content">
        <div className="kpi-value-container">
          <div 
            className="kpi-value" 
            style={{ color: getValueColor() }}
          >
            {value}
          </div>
          {trend && (
            <div className={`kpi-trend ${trend}`}>
              {getTrendIcon()}
            </div>
          )}
        </div>
        {target && (
          <div className="kpi-target">
            <span className="kpi-target-label">Target:</span>
            <span className="kpi-target-value">{target}</span>
          </div>
        )}
      </div>

      <div className="kpi-chart" style={{
        height: tileSize === '2x2' ? '250px' :
               tileSize === '2x1' ? '180px' :
               tileSize === '1x2' ? '250px' : '160px'
      }}>
        {renderChart()}
      </div>
    </div>
  );
};

export default KpiCard;
