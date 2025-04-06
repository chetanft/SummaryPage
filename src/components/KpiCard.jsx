import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import './KpiCard.css';
import Tooltip from './Tooltip';

// Register Chart.js components and plugins
Chart.register(...registerables, annotationPlugin);

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

    // If lowerIsBetter is undefined, default to higher is better
    if (kpi.lowerIsBetter === undefined) {
      return numericValue >= numericTarget ? 'var(--color-success)' : 'var(--color-error)';
    }

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

  // Determine if the KPI is meeting its target based on lowerIsBetter property
  const isMeetingTarget = () => {
    if (!value || !target) return false;

    // Extract numeric values
    const valueNumeric = parseFloat(value.toString().replace(/[^0-9.-]+/g, ''));
    const targetNumeric = parseFloat(target.toString().replace(/[^0-9.-]+/g, ''));

    if (isNaN(valueNumeric) || isNaN(targetNumeric)) return false;

    // If lowerIsBetter is undefined, default to higher is better
    if (kpi.lowerIsBetter === undefined) {
      return valueNumeric >= targetNumeric;
    }

    // For KPIs where lower is better, meeting target means value <= target
    if (kpi.lowerIsBetter) {
      return valueNumeric <= targetNumeric;
    }

    // For KPIs where higher is better, meeting target means value >= target
    return valueNumeric >= targetNumeric;
  };

  // Apply target comparison class to the KPI card
  const getCardClassName = () => {
    let className = `kpi-card ${tileSize}`;

    // Add meeting-target or not-meeting-target class based on the KPI's performance
    if (isMeetingTarget()) {
      className += ' meeting-target';
    } else {
      className += ' not-meeting-target';
    }

    // Keep the above-target and below-target classes for backward compatibility
    if (isAboveTarget()) className += ' above-target';
    if (isBelowTarget()) className += ' below-target';

    return className;
  };

  // Render chart
  const renderChart = () => {
    if (!chartData || !chartData.datasets || !chartData.datasets[0] || !chartData.datasets[0].data) {
      console.log('No chart data available for KPI:', name);
      return <div className="no-chart-data">No chart data available</div>;
    }

    // Create a deep copy of the chart data to avoid modifying the original
    const lineData = JSON.parse(JSON.stringify(chartData));

    // Extract target value for target line
    let targetValue = null;
    if (target) {
      const numericTarget = parseFloat(target.toString().replace(/[^0-9.-]+/g, ''));
      if (!isNaN(numericTarget)) {
        targetValue = numericTarget;
      }
    }

    // Enhanced chart options
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleFont: {
            size: 12,
            weight: 'bold'
          },
          bodyFont: {
            size: 12
          },
          padding: 10,
          cornerRadius: 4,
          displayColors: false
        },
        // Add target line annotation if target value exists
        annotation: targetValue ? {
          annotations: {
            targetLine: {
              type: 'line',
              yMin: targetValue,
              yMax: targetValue,
              borderColor: '#ffbe07', // Yellow
              borderWidth: 2,
              borderDash: [5, 5],
              label: {
                content: 'Target',
                display: true,
                position: 'end',
                backgroundColor: 'rgba(255, 190, 7, 0.8)',
                font: {
                  size: 10,
                  weight: 'bold'
                }
              }
            }
          }
        } : {}
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
              size: 10,
              weight: 'normal'
            },
            padding: 5,
            maxTicksLimit: 5 // Limit the number of ticks for cleaner appearance
          },
          border: {
            color: 'var(--color-border)',
            width: 1
          }
        },
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            lineWidth: 1,
            display: false // Hide vertical grid lines for cleaner look
          },
          ticks: {
            color: 'var(--color-text-secondary)',
            font: {
              size: 10,
              weight: 'normal'
            },
            padding: 5
          },
          border: {
            color: 'var(--color-border)',
            width: 1
          }
        }
      },
      elements: {
        line: {
          tension: 0.2 // Smoother curves
        },
        point: {
          radius: 2,
          hoverRadius: 5,
          hitRadius: 10 // Larger hit area for better interaction
        }
      }
    };

    // Style the datasets
    lineData.datasets = lineData.datasets.map((dataset, index) => {
      // Determine color based on KPI type
      let borderColor = '#003c9b'; // Default blue
      let backgroundColor = 'rgba(0, 60, 155, 0.15)';

      // For Revenue and Profit Trend KPI, use different colors for each line
      if (kpi.id === 'revenueProfitTrends') {
        if (index === 0) { // Revenue line
          borderColor = '#003c9b'; // Blue
          backgroundColor = 'rgba(0, 60, 155, 0.15)';
        } else if (index === 1) { // Profit line
          borderColor = '#10b981'; // Green
          backgroundColor = 'rgba(16, 185, 129, 0.15)';
        }
      } else {
        // Use green when meeting target, red when not meeting target
        if (isMeetingTarget()) {
          borderColor = '#10b981'; // Green
          backgroundColor = 'rgba(16, 185, 129, 0.15)';
        } else {
          borderColor = '#ef4444'; // Red
          backgroundColor = 'rgba(239, 68, 68, 0.15)';
        }
      }

      // For conditional coloring based on target
      if (targetValue && dataset.data) {
        try {
          // Create segment styling for above/below target
          const segmentColors = dataset.data.map((value) => {
            // Extract numeric value
            const numericValue = parseFloat(value.toString());
            const numericTarget = parseFloat(targetValue.toString());

            if (isNaN(numericValue) || isNaN(numericTarget)) {
              return '#939393'; // Grey for invalid values
            }

            // If lowerIsBetter is undefined, default to higher is better
            if (kpi.lowerIsBetter === undefined) {
              return numericValue >= numericTarget ? '#10b981' : '#ef4444';
            }

            // For KPIs where lower is better, meeting target means value <= target
            if (kpi.lowerIsBetter) {
              return numericValue <= numericTarget ? '#10b981' : '#ef4444';
            }

            // For KPIs where higher is better, meeting target means value >= target
            return numericValue >= numericTarget ? '#10b981' : '#ef4444';
          });

          // Create segment background colors
          const segmentBackgroundColors = segmentColors.map(color =>
            color === '#10b981' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'
          );

          // Check if all colors are the same (no segments needed)
          const allSameColor = segmentColors.every(color => color === segmentColors[0]);

          if (allSameColor) {
            // If all segments are the same color, use a single color for better compatibility
            return {
              ...dataset,
              borderColor: segmentColors[0],
              backgroundColor: segmentColors[0] === '#10b981' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              borderWidth: 3,
              pointRadius: 2,
              pointHoverRadius: 5,
              tension: 0.2,
              fill: true
            };
          } else {
            // Use segment coloring when there are different colors
            return {
              ...dataset,
              borderColor: segmentColors,
              backgroundColor: segmentBackgroundColors,
              borderWidth: 3,
              pointRadius: 2,
              pointHoverRadius: 5,
              tension: 0.2,
              fill: true
            };
          }
        } catch (error) {
          console.error('Error applying segment coloring:', error);
          // Fallback to default coloring
          return {
            ...dataset,
            borderColor: borderColor,
            backgroundColor: backgroundColor,
            borderWidth: 3,
            pointRadius: 2,
            pointHoverRadius: 5,
            tension: 0.2,
            fill: true
          };
        }
      }

      return {
        ...dataset,
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        borderWidth: 3,
        pointRadius: 2,
        pointHoverRadius: 5,
        tension: 0.2,
        fill: true,
        borderCapStyle: 'round',
        borderJoinStyle: 'round'
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
      className={getCardClassName()}
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
          <div className="kpi-value-with-trend">
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
      </div>

      <div className="kpi-chart" style={{
        height: tileSize === '2x2' ? '140px' :
               tileSize === '2x1' ? '120px' :
               tileSize === '1x2' ? '140px' : '100px'
      }}>
        {renderChart()}
      </div>
    </div>
  );
};

export default KpiCard;
