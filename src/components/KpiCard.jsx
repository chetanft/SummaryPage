import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './KpiCard.css';
import Tooltip from './Tooltip';

// Register Chart.js components
Chart.register(...registerables);

const KpiCard = ({ kpi, onClick }) => {
  // Get the persona from the KPI or default to 'cxo'
  const selectedPersona = kpi.persona || 'cxo';
  const {
    name,
    value,
    target,
    trend,
    status,
    chartType,
    chartData,
    tooltipContent,
    tileSize = '1x1' // Default to 1x1 if not specified
  } = kpi;

  const getStatusColor = () => {
    switch (status) {
      case 'good': return '#04bc15'; // Freight Tiger Green
      case 'warning': return '#ffbe07'; // Freight Tiger Yellow
      case 'bad': return '#ff4d4f'; // Custom red
      default: return '#003c9b'; // Freight Tiger Blue
    }
  };

  // Compare current value with target to determine color
  const getValueColor = () => {
    // Extract numeric values (remove currency symbols, etc.)
    const numericValue = parseFloat(value.toString().replace(/[^0-9.-]+/g, ''));
    const numericTarget = parseFloat(target.toString().replace(/[^0-9.-]+/g, ''));

    // Check if we have valid numbers to compare
    if (isNaN(numericValue) || isNaN(numericTarget)) {
      return 'inherit'; // Default color if we can't parse the values
    }

    // For metrics where higher is better (default assumption)
    if (!kpi.lowerIsBetter) {
      return numericValue >= numericTarget ? '#04bc15' : '#ff4d4f'; // Freight Tiger Green : Custom red
    }
    // For metrics where lower is better (e.g., costs, time)
    else {
      return numericValue <= numericTarget ? '#04bc15' : '#ff4d4f'; // Freight Tiger Green : Custom red
    }
  };



  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      case 'steady': return '→';
      default: return '-';
    }
  };

  const renderChart = () => {
    // Check if chartData exists
    if (!chartData || !chartData.datasets) {
      console.log('No chart data available for KPI:', name);
      return <div className="no-chart-data">No chart data available</div>;
    }

    // Ensure datasets has data
    if (!chartData.datasets[0] || !chartData.datasets[0].data || chartData.datasets[0].data.length === 0) {
      console.log('Chart data has empty datasets for KPI:', name);
      return <div className="no-chart-data">No chart data available</div>;
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: chartData.datasets.length > 1,
          position: 'bottom',
          labels: {
            font: {
              size: 11 // 11px for legend text
            },
            padding: 10
          }
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: chartData.xAxisLabel || '',
            font: {
              size: 11, // 11px for axis titles
              weight: 'normal'
            }
          },
          ticks: {
            font: {
              size: 10 // 10px for axis labels
            }
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: chartData.yAxisLabel || '',
            font: {
              size: 11, // 11px for axis titles
              weight: 'normal'
            }
          },
          ticks: {
            font: {
              size: 10 // 10px for axis labels
            }
          }
        },
      },
    };

    // Remove axes for "Other Charges Breakdown" KPI
    if (kpi.id === 'otherCharges' && chartType === 'pie') {
      const pieOptions = {
        ...options,
        scales: {}, // Remove all scales/axes
        cutout: '70%', // Make it a donut chart
      };
      return <Pie data={chartData} options={pieOptions} />;
    }

    switch (chartType) {
      case 'line':
        // Extract numeric target value if available
        let numericTarget = null;
        if (target) {
          numericTarget = parseFloat(target.toString().replace(/[^0-9.-]+/g, ''));
        }

        // Create a deep copy of the chart data to avoid modifying the original
        const lineData = JSON.parse(JSON.stringify(chartData));

        // Determine min and max values for y-axis scale
        let minValue = Number.MAX_VALUE;
        let maxValue = Number.MIN_VALUE;

        // Check all datasets for min/max values
        if (lineData.datasets && lineData.datasets.length > 0) {
          lineData.datasets.forEach(dataset => {
            if (dataset.data) {
              dataset.data.forEach(value => {
                if (value < minValue) minValue = value;
                if (value > maxValue) maxValue = value;
              });
            }
          });
        }

        // Ensure target is included in the range calculation
        if (numericTarget !== null) {
          if (numericTarget < minValue) minValue = numericTarget;
          if (numericTarget > maxValue) maxValue = numericTarget;
        }

        // Add padding to the range (10% above and below)
        const range = maxValue - minValue;
        minValue = Math.max(0, minValue - range * 0.1); // Don't go below 0 for most metrics
        maxValue = maxValue + range * 0.1;

        // Update y-axis scale in options
        const lineOptions = { ...options };
        if (!lineOptions.scales) lineOptions.scales = {};
        if (!lineOptions.scales.y) lineOptions.scales.y = {};
        if (!lineOptions.scales.x) lineOptions.scales.x = {};

        // Apply grid and axis styling
        lineOptions.scales.y.grid = {
          color: 'rgba(0, 0, 0, 0.05)',
          lineWidth: 1
        };
        lineOptions.scales.x.grid = {
          color: 'rgba(0, 0, 0, 0.05)',
          lineWidth: 1
        };
        lineOptions.scales.y.ticks = {
          color: '#211f1f', // Brand black
          font: {
            size: 11
          }
        };
        lineOptions.scales.x.ticks = {
          color: '#211f1f', // Brand black
          font: {
            size: 11
          }
        };
        lineOptions.scales.y.border = {
          color: '#939393', // Grey
          width: 1.2
        };
        lineOptions.scales.x.border = {
          color: '#939393', // Grey
          width: 1.2
        };

        lineOptions.scales.y.min = minValue;
        lineOptions.scales.y.max = maxValue;

        // Special handling for Revenue & Profit Trends chart (has multiple datasets by default)
        if (kpi.id === 'revenueProfitTrends') {
          // Ensure both lines are visible with their original colors
          lineData.datasets = lineData.datasets.map(dataset => {
            return {
              ...dataset,
              fill: false, // No fill under the line
              borderWidth: 2.5, // Updated line width
              pointRadius: 4,
              pointHoverRadius: 7,
            };
          });
        }
        // Standard handling for other charts
        else {
          // Add target line as a separate dataset
          if (numericTarget !== null) {
            // Create a horizontal line at the target value
            const targetDataset = {
              label: 'Target',
              data: Array(lineData.labels.length).fill(numericTarget),
              borderColor: '#ffbe07', // Freight Tiger Yellow for target line
              borderWidth: 1.5, // Updated line width
              borderDash: [5, 3], // dashed line
              fill: false, // No fill under the target line
              backgroundColor: 'transparent', // Ensure no fill color
              pointRadius: 0, // Hide points
              tension: 0,
              order: 0, // Draw on top
              spanGaps: true // Connect across any gaps in data
            };

            // Add the target dataset
            lineData.datasets.push(targetDataset);
          }

          lineData.datasets = lineData.datasets.map(dataset => {
            // Skip the target dataset we just added
            if (dataset.label === 'Target') return dataset;

            // Use consistent colors based on persona
            let trendDirection = 'neutral';
            let lineColor;

            // Determine color based on persona
            switch (kpi.persona || selectedPersona) {
              case 'cxo':
                lineColor = '#003c9b'; // Freight Tiger Blue for CXO
                break;
              case 'company':
                lineColor = '#04bc15'; // Freight Tiger Green for Company
                break;
              case 'branch':
                lineColor = '#ffbe07'; // Freight Tiger Yellow for Branch
                break;
              default:
                lineColor = '#003c9b'; // Default to Freight Tiger Blue
            }

            // Check if we need to show negative trend
            if (numericTarget !== null && dataset.data && dataset.data.length > 0) {
              // Get the last data point to compare with target
              const lastValue = dataset.data[dataset.data.length - 1];

              // If the last value is below target, change to red regardless of persona
              if (lastValue < numericTarget) {
                lineColor = '#ff4d4f'; // Custom red when below target
                trendDirection = 'negative';
              } else {
                trendDirection = 'positive';
              }
            }

            // Create gradient fill based on trend direction
            const getFillGradient = (ctx) => {
              if (!ctx.chart.chartArea) {
                return 'transparent';
              }

              const { ctx: context, chartArea } = ctx.chart;
              const gradient = context.createLinearGradient(
                0, chartArea.bottom, 0, chartArea.top
              );

              if (trendDirection === 'negative') {
                // Always use red for negative trends
                gradient.addColorStop(0, 'rgba(255, 77, 79, 0.02)'); // 2% opacity at bottom
                gradient.addColorStop(0.5, 'rgba(255, 77, 79, 0.10)'); // 10% opacity in middle
                gradient.addColorStop(1, 'rgba(255, 77, 79, 0.25)'); // 25% opacity at top
              } else {
                // Use persona-specific colors for positive/neutral trends
                switch (kpi.persona || selectedPersona) {
                  case 'cxo':
                    gradient.addColorStop(0, 'rgba(0, 60, 155, 0.02)'); // Blue - 2% opacity
                    gradient.addColorStop(0.5, 'rgba(0, 60, 155, 0.10)'); // Blue - 10% opacity
                    gradient.addColorStop(1, 'rgba(0, 60, 155, 0.25)'); // Blue - 25% opacity
                    break;
                  case 'company':
                    gradient.addColorStop(0, 'rgba(4, 188, 21, 0.02)'); // Green - 2% opacity
                    gradient.addColorStop(0.5, 'rgba(4, 188, 21, 0.10)'); // Green - 10% opacity
                    gradient.addColorStop(1, 'rgba(4, 188, 21, 0.25)'); // Green - 25% opacity
                    break;
                  case 'branch':
                    gradient.addColorStop(0, 'rgba(255, 190, 7, 0.02)'); // Yellow - 2% opacity
                    gradient.addColorStop(0.5, 'rgba(255, 190, 7, 0.10)'); // Yellow - 10% opacity
                    gradient.addColorStop(1, 'rgba(255, 190, 7, 0.25)'); // Yellow - 25% opacity
                    break;
                  default:
                    gradient.addColorStop(0, 'rgba(0, 60, 155, 0.02)'); // Blue - 2% opacity
                    gradient.addColorStop(0.5, 'rgba(0, 60, 155, 0.10)'); // Blue - 10% opacity
                    gradient.addColorStop(1, 'rgba(0, 60, 155, 0.25)'); // Blue - 25% opacity
                }
              }

              return gradient;
            };

            return {
              ...dataset,
              fill: true, // Enable fill for area charts
              borderColor: lineColor,
              backgroundColor: getFillGradient, // Dynamic gradient fill
              borderWidth: 2.5, // Updated line width
              tension: 0.4,
              pointRadius: 3,
              pointHoverRadius: 6,
            };
          });
        }

        return <Line data={lineData} options={lineOptions} />;
      case 'bar':
        const barData = JSON.parse(JSON.stringify(chartData));

        // Create bar chart options with updated styling
        const barOptions = { ...options };
        if (!barOptions.scales) barOptions.scales = {};
        if (!barOptions.scales.y) barOptions.scales.y = {};
        if (!barOptions.scales.x) barOptions.scales.x = {};

        // Apply grid and axis styling
        barOptions.scales.y.grid = {
          color: 'rgba(0, 0, 0, 0.05)',
          lineWidth: 1
        };
        barOptions.scales.x.grid = {
          color: 'rgba(0, 0, 0, 0.05)',
          lineWidth: 1
        };
        barOptions.scales.y.ticks = {
          color: '#211f1f', // Brand black
          font: {
            size: 11
          }
        };
        barOptions.scales.x.ticks = {
          color: '#211f1f', // Brand black
          font: {
            size: 11
          }
        };
        barOptions.scales.y.border = {
          color: '#939393', // Grey
          width: 1.2
        };
        barOptions.scales.x.border = {
          color: '#939393', // Grey
          width: 1.2
        };

        // Determine if this is a performance chart (might need negative colors)
        const isPerformanceChart = kpi.id.toLowerCase().includes('performance') ||
                                  kpi.name.toLowerCase().includes('performance');

        barData.datasets = barData.datasets.map(dataset => {
          // Determine if we need negative colors
          let colors = [];

          // Get persona-specific color
          let personaColor;
          switch (kpi.persona || selectedPersona) {
            case 'cxo':
              personaColor = '#003c9b'; // Freight Tiger Blue for CXO
              break;
            case 'company':
              personaColor = '#04bc15'; // Freight Tiger Green for Company
              break;
            case 'branch':
              personaColor = '#ffbe07'; // Freight Tiger Yellow for Branch
              break;
            default:
              personaColor = '#003c9b'; // Default to Freight Tiger Blue
          }

          if (isPerformanceChart && dataset.data) {
            // For performance charts, color bars based on values
            colors = dataset.data.map(value => {
              if (value < 0) return '#ff4d4f'; // Negative values in custom red
              return personaColor; // Positive values in persona-specific color
            });
          }

          return {
            ...dataset,
            borderRadius: 4, // Rounded corners
            maxBarThickness: 40,
            backgroundColor: colors.length > 0 ? colors : (dataset.backgroundColor || personaColor), // Persona-specific color
            hoverBackgroundColor: personaColor === '#003c9b' ? 'rgba(0, 60, 155, 0.85)' :
                                 personaColor === '#04bc15' ? 'rgba(4, 188, 21, 0.85)' :
                                 'rgba(255, 190, 7, 0.85)', // Persona-specific color with 85% opacity
            borderWidth: 0, // No border
          };
        });

        // Add target line if applicable
        if (kpi.target) {
          const numericTarget = parseFloat(kpi.target.toString().replace(/[^0-9.-]+/g, ''));
          if (!isNaN(numericTarget)) {
            // Add annotation plugin for target line
            if (!barOptions.plugins) barOptions.plugins = {};
            barOptions.plugins.targetLine = {
              afterDraw: (chart) => {
                const ctx = chart.ctx;
                const yAxis = chart.scales.y;
                const xAxis = chart.scales.x;

                const yPixel = yAxis.getPixelForValue(numericTarget);

                // Draw target line
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(xAxis.left, yPixel);
                ctx.lineTo(xAxis.right, yPixel);
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = '#ffbe07'; // Freight Tiger Yellow
                ctx.setLineDash([5, 3]); // dashed line
                ctx.stroke();
                ctx.restore();
              }
            };
          }
        }

        return <Bar data={barData} options={barOptions} />;
      case 'pie':
        const pieOptions = {
          ...options,
          cutout: '70%', // Make it a donut chart
          plugins: {
            legend: {
              labels: {
                color: '#6b7280',
                font: {
                  size: 11
                },
                padding: 10
              }
            },
            tooltip: {
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              titleColor: '#ffffff',
              bodyColor: '#ffffff',
              padding: 10,
              cornerRadius: 4,
              boxPadding: 4
            }
          },
          // Add hover effects
          elements: {
            arc: {
              hoverOffset: 5,
              borderWidth: 1
            }
          }
        };

        // Update pie chart colors
        const pieData = JSON.parse(JSON.stringify(chartData));
        if (pieData.datasets && pieData.datasets.length > 0) {
          // Set default colors if not specified
          if (!pieData.datasets[0].backgroundColor) {
            pieData.datasets[0].backgroundColor = [
              '#04bc15', // Freight Tiger Green - Good
              '#ffbe07', // Freight Tiger Yellow - Medium
              '#003c9b', // Freight Tiger Blue - Neutral
              '#f97316', // Custom orange - Warning
              '#ff4d4f', // Custom red - Critical
            ];
          }

          // Add border color
          pieData.datasets[0].borderColor = '#ffffff';
          pieData.datasets[0].borderWidth = 1;

          // Add hover effects
          pieData.datasets[0].hoverBackgroundColor = pieData.datasets[0].backgroundColor.map(color => {
            // Slightly brighten the color for hover
            return color;
          });
        }

        // Add hover animation plugin
        if (!pieOptions.plugins) pieOptions.plugins = {};
        pieOptions.plugins.pieHoverEffects = {
          beforeDraw: (chart) => {
            const activeElements = chart.getActiveElements();
            if (activeElements.length > 0) {
              const { ctx } = chart;
              // Get center point (not using coordinates directly but needed for shadow effect)

              // Add subtle shadow
              ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
              ctx.shadowBlur = 4;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 2;
            }
          },
          afterDraw: (chart) => {
            // Reset shadow after drawing
            chart.ctx.shadowColor = 'transparent';
            chart.ctx.shadowBlur = 0;
            chart.ctx.shadowOffsetX = 0;
            chart.ctx.shadowOffsetY = 0;
          }
        };

        return <Pie data={pieData} options={pieOptions} />;
      default:
        return null;
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

  return (
    <div
      className={`kpi-card tile-${tileSize} ${getTargetComparisonClass()}`}
      onClick={() => onClick(kpi)}
    >
      <div className="kpi-header">
        <h3>
          <span
            className="status-indicator"
            style={{ backgroundColor: getStatusColor() }}
          ></span>
          {name}
        </h3>
        <Tooltip content={tooltipContent} />
      </div>

      <div className="kpi-values">
        <div className="current-value">
          <span>Current</span>
          <strong style={{ color: getValueColor() }}>{value}</strong>
        </div>
        <div className="target-value">
          <span>Target</span>
          <strong>{target}</strong>
        </div>
        <div className="trend">
          <span className="trend-icon" style={{ color: getStatusColor() }}>
            {getTrendIcon()}
          </span>
        </div>
      </div>

      <div className="kpi-chart" style={{
        height: tileSize === '2x2' ? '250px' :
               tileSize === '2x1' ? '180px' :
               tileSize === '1x2' ? '250px' : '160px'
      }}>
        {chartData ? renderChart() : <div className="no-chart-data">No chart data available</div>}
      </div>
    </div>
  );
};

export default KpiCard;
