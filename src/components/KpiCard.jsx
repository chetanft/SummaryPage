import React from 'react';
import { Line, Bar, Pie, Doughnut, Radar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import './KpiCard.css';
import Tooltip from './Tooltip';

// Register Chart.js components and plugins
Chart.register(...registerables, annotationPlugin);

// Chart type mapping based on KPI ID
const getChartType = (kpiId) => {
  // Line charts for time-series data
  const lineChartKpis = [
    'revenueProfitTrends',
    'orderToDelivery',
    'freightCostPerKm',
    'transitTimeMonitoring',
    'orderExecutionTime',
    'branchOrderExecutionTime',
    'invoiceSettlement'
  ];

  // Bar charts for comparing categories
  const barChartKpis = [
    'branchVehicleUtilization',
    'tripCount',
    'statusFlow',
    'realTimeTrips',
    'unloadingTime',
    'vehicleWeightVolumeUtilization'
  ];

  // Pie/Doughnut charts for proportions
  const pieChartKpis = [
    'otherChargesBreakdown',
    'carbonEmissions'
  ];

  // Radar charts for multiple variables
  const radarChartKpis = [
    'vehicleUtilizationRadar'
  ];

  // Determine chart type based on KPI ID
  if (lineChartKpis.includes(kpiId)) return 'line';
  if (barChartKpis.includes(kpiId)) return 'bar';
  if (pieChartKpis.includes(kpiId)) return 'pie';
  if (radarChartKpis.includes(kpiId)) return 'radar';

  // Default to line chart if no match
  return 'line';
};

const KpiCard = ({ kpi, onClick, tileSize = '1x1', isNonImportant = false }) => {
  const {
    name,
    value,
    target,
    trend,
    status,
    chartData,
    tooltipContent
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

    // Determine chart type based on KPI ID
    const chartType = getChartType(kpi.id);

    // Create a deep copy of the chart data to avoid modifying the original
    const chartDataCopy = JSON.parse(JSON.stringify(chartData));

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

    // Adjust chart options based on chart type and whether this is a non-important KPI
    let chartOptions = {
      ...options,
      plugins: {
        ...options.plugins,
        legend: {
          display: (!isNonImportant && tileSize === '2x2') || chartType === 'pie' || chartType === 'doughnut' || chartType === 'radar'
        },
        tooltip: {
          ...options.plugins.tooltip,
          enabled: true
        }
      }
    };

    // Add or remove scales based on chart type
    if (chartType === 'line' || chartType === 'bar') {
      chartOptions.scales = {
        x: {
          ...options.scales.x,
          display: !isNonImportant // Hide axes for non-important KPIs
        },
        y: {
          ...options.scales.y,
          display: !isNonImportant // Hide axes for non-important KPIs
        }
      };
    } else if (chartType === 'radar') {
      chartOptions.scales = {
        r: {
          beginAtZero: true,
          ticks: {
            color: 'var(--color-text-secondary)',
            font: {
              size: 10
            },
            backdropColor: 'transparent'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          angleLines: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          pointLabels: {
            color: 'var(--color-text-primary)',
            font: {
              size: 10
            }
          }
        }
      };
    } else {
      // For pie and doughnut charts, remove scales
      delete chartOptions.scales;
    }

    // Style the datasets
    chartDataCopy.datasets = chartDataCopy.datasets.map((dataset, index) => {
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
      }
      // For pie and doughnut charts, use an array of colors
      else if (chartType === 'pie' || chartType === 'doughnut') {
        const colorPalette = [
          '#003c9b', // Blue
          '#10b981', // Green
          '#ef4444', // Red
          '#ffbe07', // Yellow
          '#8b5cf6', // Purple
          '#ec4899', // Pink
          '#06b6d4', // Cyan
          '#f97316'  // Orange
        ];

        // Use a different color for each segment
        borderColor = colorPalette[index % colorPalette.length];
        backgroundColor = colorPalette.map(color => {
          const rgbMatch = color.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
          if (rgbMatch) {
            const r = parseInt(rgbMatch[1], 16);
            const g = parseInt(rgbMatch[2], 16);
            const b = parseInt(rgbMatch[3], 16);
            return `rgba(${r}, ${g}, ${b}, 0.7)`;
          }
          return color;
        });
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

      // For radar charts, use specific styling
      if (chartType === 'radar') {
        return {
          ...dataset,
          borderColor: borderColor,
          backgroundColor: 'rgba(0, 60, 155, 0.2)',
          borderWidth: 2,
          pointBackgroundColor: borderColor,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: borderColor,
          pointRadius: 3,
          pointHoverRadius: 5
        };
      }

      // For bar charts, use specific styling
      if (chartType === 'bar') {
        return {
          ...dataset,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          borderWidth: 1,
          borderRadius: 4,
          barThickness: 'flex',
          maxBarThickness: 40
        };
      }

      // For conditional coloring based on target
      if (targetValue && dataset.data && (chartType === 'line')) {
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

      // For pie/doughnut charts
      if (chartType === 'pie' || chartType === 'doughnut') {
        return {
          ...dataset,
          borderColor: 'white',
          backgroundColor: backgroundColor,
          borderWidth: 1,
          hoverOffset: 10
        };
      }

      // Default styling for line charts
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
      // Render the appropriate chart type based on KPI ID
    switch (chartType) {
      case 'bar':
        return <Bar data={chartDataCopy} options={chartOptions} />;
      case 'pie':
        return <Pie data={chartDataCopy} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={chartDataCopy} options={chartOptions} />;
      case 'radar':
        return <Radar data={chartDataCopy} options={chartOptions} />;
      case 'line':
      default:
        return <Line data={chartDataCopy} options={chartOptions} />;
    }
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
