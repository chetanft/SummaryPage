// KPI data with chart configurations and tooltip content
// This file contains mock data for the Summary Page KPIs with Bento grid layout

// KPI dependency map - defines which KPIs depend on others
export const kpiDependencies = {
  // Company Level Dependencies
  orderExecutionTime: ['transitTime', 'unloadingTurnaround', 'cleanPod', 'invoiceSubmission'],
  vehicleUtilization: ['freightCosts', 'weightVolumeMetrics', 'tripCount'],
  placementEfficiency: ['statusFlow'],
  freightCosts: ['otherCharges', 'costPercentage'],
  cleanPod: ['invoiceCycle'],
  invoiceCycle: ['materialInvoices', 'freightInvoices'],

  // Branch Level Dependencies
  statusFlow: ['realTimeTrips', 'transitTimeMonitoring'],
  transitTimeMonitoring: ['unloadingTurnaround'],
  unloadingTurnaround: ['branchCleanPod'],
  branchCleanPod: ['invoiceSubmission'],

  // CXO Level Dependencies
  revenueProfitTrends: [],
  orderToDelivery: ['freightCostTrends'],
  tripCount: ['carbonEmissions']
};

// Helper function to check if a KPI is dependent on another
export const isDependentOn = (dependentId, parentId) => {
  // Direct dependency
  if (kpiDependencies[parentId] && kpiDependencies[parentId].includes(dependentId)) {
    return true;
  }

  // Check for indirect dependencies (dependency chains)
  for (const directDependentId of (kpiDependencies[parentId] || [])) {
    if (isDependentOn(dependentId, directDependentId)) {
      return true;
    }
  }

  return false;
};

// Helper function to generate realistic data points with a trend
const generateDataPoints = (count, min, max, trend = 'up', volatility = 0.2) => {
  // Start with a value in the middle of the range
  let currentValue = (min + max) / 2;

  return Array.from({ length: count }, (_, index) => {
    // Add some randomness
    const randomFactor = (Math.random() * 2 - 1) * volatility;

    // Apply trend (up, down, or flat)
    let trendFactor = 0;
    if (trend === 'up') {
      trendFactor = (index / count) * (max - min) * 0.5; // Gradual increase
    } else if (trend === 'down') {
      trendFactor = -((index / count) * (max - min) * 0.5); // Gradual decrease
    }

    // Update current value
    currentValue = currentValue + trendFactor + randomFactor;

    // Ensure value stays within range
    currentValue = Math.max(min, Math.min(max, currentValue));

    // Return rounded value for integer data
    return Math.round(currentValue * 10) / 10;
  });
};

// Helper function to generate months for x-axis labels
const generateMonths = (count) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.slice(0, count);
};

// Common chart colors using Freight Tiger brand colors
const chartColors = {
  primary: '#003c9b', // Freight Tiger Blue
  secondary: '#04bc15', // Freight Tiger Green
  tertiary: '#ffbe07', // Freight Tiger Yellow
  quaternary: '#ff4d4f', // Custom red
  quinary: '#8b5cf6', // Purple for additional data
  background: 'rgba(0, 60, 155, 0.1)', // Blue with low opacity
  greenBackground: 'rgba(4, 188, 21, 0.1)', // Green with low opacity
  yellowBackground: 'rgba(255, 190, 7, 0.1)' // Yellow with low opacity
};

// KPI definitions for all personas with tile sizes and importance
const kpiDefinitions = {
  // CXO Level KPIs
  cxo: {
    // Important KPIs - shown prominently with full charts
    important: [
    {
      id: 'revenueProfitTrends',
      name: 'Revenue & Profit Trends',
      value: '₹ 142.8 Cr',
      target: '₹ 150 Cr',
      trend: 'up',
      status: 'warning',
      persona: 'cxo',
      chartType: 'line',
      tileSize: '2x2', // Large tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'Revenue',
            data: generateDataPoints(6, 120, 150, 'up', 0.1),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          },
          {
            label: 'Profit',
            data: generateDataPoints(6, 18, 25, 'up', 0.15),
            borderColor: chartColors.secondary,
            backgroundColor: chartColors.greenBackground,
            tension: 0.4,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Amount (Cr)'
      },
      tooltipContent: {
        definition: 'Trends showing revenue and profit performance over time.',
        calculation: 'Revenue: Sum of all invoiced amounts. Profit: Revenue minus all operational costs.'
      }
    },
    {
      id: 'orderToDelivery',
      name: 'Order to Delivery (OTD)',
      value: '4.2 days',
      target: '3.5 days',
      trend: 'down',
      status: 'warning',
      lowerIsBetter: true,
      persona: 'cxo',
      chartType: 'line',
      tileSize: '2x1', // Medium horizontal tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'OTD Time',
            data: generateDataPoints(6, 3.8, 4.5, 'down', 0.1),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          },
          {
            label: 'Target',
            data: Array(6).fill(3.5),
            borderColor: chartColors.tertiary,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Days'
      },
      tooltipContent: {
        definition: 'Average time taken from order placement to final delivery.',
        calculation: 'Sum of (delivery date - order date) for all orders / Total number of orders'
      }
    },
    {
      id: 'freightCost',
      name: 'Freight Cost per KM/Tonnage',
      value: '₹ 45.2/km',
      target: '₹ 40/km',
      trend: 'down',
      status: 'warning',
      lowerIsBetter: true,
      persona: 'cxo',
      chartType: 'line',
      tileSize: '2x1', // Medium horizontal tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'Cost per KM',
            data: generateDataPoints(6, 44, 46, 'down', 0.1),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          },
          {
            label: 'Cost per Ton',
            data: generateDataPoints(6, 370, 390, 'down', 0.1),
            borderColor: chartColors.secondary,
            backgroundColor: chartColors.greenBackground,
            tension: 0.4,
            yAxisID: 'y1',
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Cost per KM (₹)'
      },
      tooltipContent: {
        definition: 'Analysis of freight costs normalized by distance and weight.',
        calculation: 'Cost per KM: Total freight cost / Total distance traveled. Cost per Tonnage: Total freight cost / Total weight transported.'
      }
    },
    {
      id: 'carbonEmissions',
      name: 'Carbon Emissions',
      value: '125.8 tons',
      target: '100 tons',
      trend: 'down',
      status: 'bad',
      lowerIsBetter: true,
      persona: 'cxo',
      chartType: 'bar',
      tileSize: '1x2', // Medium vertical tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'CO2 Emissions',
            data: generateDataPoints(6, 120, 130, 'down', 0.1),
            backgroundColor: chartColors.primary
          },
          {
            label: 'Target',
            data: Array(6).fill(100),
            type: 'line',
            borderColor: chartColors.tertiary,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'CO2 (tons)'
      },
      tooltipContent: {
        definition: 'Total carbon emissions from logistics operations.',
        calculation: 'Sum of CO2 emissions calculated from fuel consumption and distance traveled.'
      }
    },
    {
      id: 'otif',
      name: 'On-Time In-Full (OTIF)',
      value: '82%',
      target: '90%',
      trend: 'up',
      status: 'warning',
      chartType: 'line',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'OTIF',
            data: generateDataPoints(6, 75, 85),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Percentage (%)'
      },
      tooltipContent: {
        definition: 'On-Time In-Full delivery performance across all shipments.',
        calculation: '(Number of deliveries made on time and in full / Total number of deliveries) × 100'
      }
    },
    {
      id: 'outboundFreightCost',
      name: 'Outbound Freight Cost % of Sales',
      value: '8.2%',
      target: '7.5%',
      trend: 'down',
      status: 'warning',
      chartType: 'line',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'Cost %',
            data: generateDataPoints(6, 7.8, 8.5),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Percentage (%)'
      },
      tooltipContent: {
        definition: 'Outbound freight cost as a percentage of total sales.',
        calculation: '(Total outbound freight cost / Total sales) × 100'
      }
    },
    {
      id: 'inboundFreightCost',
      name: 'Inbound Freight Cost % of Purchases',
      value: '6.8%',
      target: '6.0%',
      trend: 'steady',
      status: 'warning',
      chartType: 'line',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'Cost %',
            data: generateDataPoints(6, 6.5, 7.0),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Percentage (%)'
      },
      tooltipContent: {
        definition: 'Inbound freight cost as a percentage of total purchases.',
        calculation: '(Total inbound freight cost / Total purchases) × 100'
      }
    },
    {
      id: 'fuelEfficiency',
      name: 'Fuel Efficiency',
      value: '4.2 km/L',
      target: '4.5 km/L',
      trend: 'up',
      status: 'warning',
      chartType: 'line',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'Efficiency',
            data: generateDataPoints(6, 4.0, 4.3),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'km/L'
      },
      tooltipContent: {
        definition: 'Average distance traveled per liter of fuel consumed.',
        calculation: 'Total distance traveled / Total fuel consumed'
      }
    },
    {
      id: 'vehicleUtilization',
      name: 'Vehicle Utilization',
      value: '78%',
      target: '85%',
      trend: 'up',
      status: 'warning',
      chartType: 'bar',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: ['FTL', 'PTL', 'LTL', 'Express'],
        datasets: [
          {
            label: 'Utilization %',
            data: [82, 75, 68, 85],
            backgroundColor: chartColors.primary
          }
        ],
        xAxisLabel: 'Vehicle Type',
        yAxisLabel: 'Percentage (%)'
      },
      tooltipContent: {
        definition: 'Percentage of vehicle capacity utilized during operations.',
        calculation: '(Actual load / Maximum vehicle capacity) × 100, averaged across all trips.'
      }
    },
    {
      id: 'trips',
      name: 'Trips (FTL/PTL)',
      value: '1,250',
      target: '1,400',
      trend: 'up',
      status: 'warning',
      chartType: 'bar',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'FTL',
            data: generateDataPoints(6, 700, 800),
            backgroundColor: chartColors.primary
          },
          {
            label: 'PTL',
            data: generateDataPoints(6, 400, 500),
            backgroundColor: chartColors.secondary
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Number of Trips'
      },
      tooltipContent: {
        definition: 'Total number of Full Truck Load (FTL) and Part Truck Load (PTL) trips.',
        calculation: 'Count of all FTL and PTL trips completed in the period.'
      }
    },
    {
      id: 'salesDeliveryOrders',
      name: 'Sales & Delivery Orders',
      value: '3,850',
      target: '4,000',
      trend: 'up',
      status: 'warning',
      chartType: 'line',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'Sales Orders',
            data: generateDataPoints(6, 3700, 4000),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          },
          {
            label: 'Delivery Orders',
            data: generateDataPoints(6, 3600, 3900),
            borderColor: chartColors.secondary,
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            tension: 0.4,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Number of Orders'
      },
      tooltipContent: {
        definition: 'Comparison of sales orders received vs. delivery orders fulfilled.',
        calculation: 'Count of all sales orders and delivery orders in the period.'
      }
    }
    ],

    // Non-important KPIs - shown as mini inline charts
    notImportant: [
      {
        id: 'fuelEfficiency',
        name: 'Fuel Efficiency',
        value: '4.2 km/L',
        target: '4.5 km/L',
        trend: 'up',
        persona: 'cxo',
        lowerIsBetter: false,
        chartType: 'line',
        chartData: {
          labels: generateMonths(6),
          datasets: [
            {
              label: 'Efficiency',
              data: generateDataPoints(6, 4.0, 4.3, 'up', 0.05),
              borderColor: chartColors.primary,
              backgroundColor: 'transparent',
              tension: 0.4,
            }
          ]
        }
      },
      {
        id: 'salesOrders',
        name: 'Sales Orders',
        value: '4,285',
        target: '4,500',
        trend: 'up',
        persona: 'cxo',
        chartType: 'line',
        chartData: {
          labels: generateMonths(6),
          datasets: [
            {
              label: 'Orders',
              data: generateDataPoints(6, 4100, 4300, 'up', 0.05),
              borderColor: chartColors.primary,
              backgroundColor: 'transparent',
              tension: 0.4,
            }
          ]
        }
      },
      {
        id: 'tripCount',
        name: 'Trips (FTL/PTL)',
        value: '1,872',
        target: '2,000',
        trend: 'up',
        persona: 'cxo',
        chartType: 'line',
        chartData: {
          labels: generateMonths(6),
          datasets: [
            {
              label: 'Trips',
              data: generateDataPoints(6, 1800, 1900, 'up', 0.05),
              borderColor: chartColors.primary,
              backgroundColor: 'transparent',
              tension: 0.4,
            }
          ]
        }
      },
      {
        id: 'inboundFreightCost',
        name: 'Inbound Freight Cost %',
        value: '8.4%',
        target: '8.0%',
        trend: 'down',
        lowerIsBetter: true,
        persona: 'cxo',
        chartType: 'line',
        chartData: {
          labels: generateMonths(6),
          datasets: [
            {
              label: 'Cost %',
              data: generateDataPoints(6, 8.3, 8.6, 'down', 0.05).map(val => parseFloat(val.toFixed(1))),
              borderColor: chartColors.primary,
              backgroundColor: 'transparent',
              tension: 0.4,
            }
          ]
        }
      }
    ]
  },

  // Company Level KPIs
  company: {
    // Important KPIs - shown prominently with full charts
    important: [
    {
      id: 'orderExecutionTime',
      name: 'Order Execution Time (OET)',
      value: '3.8 days',
      target: '3.0 days',
      trend: 'down',
      status: 'warning',
      chartType: 'line',
      tileSize: '2x2', // Large tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'Execution Time',
            data: generateDataPoints(6, 3.5, 4.2),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          },
          {
            label: 'Target',
            data: Array(6).fill(3.0),
            borderColor: chartColors.secondary,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Days'
      },
      tooltipContent: {
        definition: 'Average time taken to execute an order from receipt to delivery.',
        calculation: 'Sum of (delivery completion time - order receipt time) for all orders / Total number of orders'
      }
    },
    {
      id: 'vehicleUtilization',
      name: 'Vehicle, Weight, Volume Utilization',
      value: '76%',
      target: '85%',
      trend: 'up',
      status: 'warning',
      chartType: 'bar',
      tileSize: '2x1', // Medium horizontal tile
      chartData: {
        labels: ['Vehicle Space', 'Weight Capacity', 'Volume Capacity'],
        datasets: [
          {
            label: 'Current',
            data: [76, 82, 70],
            backgroundColor: chartColors.primary
          },
          {
            label: 'Target',
            data: [85, 85, 85],
            backgroundColor: chartColors.secondary
          }
        ],
        xAxisLabel: 'Utilization Type',
        yAxisLabel: 'Percentage (%)'
      },
      tooltipContent: {
        definition: 'Utilization metrics for vehicle space, weight capacity, and volume capacity.',
        calculation: 'Vehicle Space: Used space / Total space. Weight: Used weight / Max weight. Volume: Used volume / Max volume.'
      }
    },
    {
      id: 'freightCosts',
      name: 'Freight Costs per KM/Tonnage/Unit',
      value: '₹ 42/km',
      target: '₹ 38/km',
      trend: 'down',
      status: 'warning',
      chartType: 'line',
      tileSize: '2x1', // Medium horizontal tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'Per KM',
            data: generateDataPoints(6, 40, 45),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          },
          {
            label: 'Per Ton',
            data: generateDataPoints(6, 320, 380),
            borderColor: chartColors.secondary,
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            tension: 0.4,
          },
          {
            label: 'Per Unit',
            data: generateDataPoints(6, 15, 22),
            borderColor: chartColors.tertiary,
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            tension: 0.4,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Cost (₹)'
      },
      tooltipContent: {
        definition: 'Analysis of freight costs normalized by distance, weight, and units.',
        calculation: 'Per KM: Total cost / Total KM. Per Ton: Total cost / Total tonnage. Per Unit: Total cost / Total units.'
      }
    },
    {
      id: 'transitUnloadingTime',
      name: 'Transit Time & Unloading Time',
      value: '32 hrs',
      target: '28 hrs',
      trend: 'down',
      status: 'warning',
      chartType: 'bar',
      tileSize: '1x2', // Medium vertical tile
      chartData: {
        labels: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad'],
        datasets: [
          {
            label: 'Transit Time',
            data: [24, 28, 22, 26, 20],
            backgroundColor: chartColors.primary
          },
          {
            label: 'Unloading Time',
            data: [8, 6, 7, 5, 9],
            backgroundColor: chartColors.secondary
          }
        ],
        xAxisLabel: 'Branch',
        yAxisLabel: 'Hours'
      },
      tooltipContent: {
        definition: 'Breakdown of time spent in transit versus time spent unloading at destination.',
        calculation: 'Transit Time: Time from origin departure to destination arrival. Unloading Time: Time from arrival to unloading completion.'
      }
    },
    {
      id: 'placementEfficiency',
      name: 'Placement Efficiency',
      value: '82%',
      target: '90%',
      trend: 'up',
      status: 'warning',
      chartType: 'line',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'Efficiency',
            data: generateDataPoints(6, 78, 85),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Percentage (%)'
      },
      tooltipContent: {
        definition: 'Percentage of vehicles placed at loading points within scheduled time window.',
        calculation: '(Number of on-time placements / Total number of placements) × 100'
      }
    },
    {
      id: 'cleanPod',
      name: 'Clean POD & Invoices',
      value: '78%',
      target: '95%',
      trend: 'up',
      status: 'bad',
      chartType: 'bar',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad'],
        datasets: [
          {
            label: 'Clean POD %',
            data: [85, 75, 65, 80, 70],
            backgroundColor: chartColors.primary
          }
        ],
        xAxisLabel: 'Branch',
        yAxisLabel: 'Percentage (%)'
      },
      tooltipContent: {
        definition: 'Percentage of deliveries with properly documented proof of delivery and correctly processed invoices.',
        calculation: '(Number of deliveries with clean POD and correct invoices / Total number of deliveries) × 100'
      }
    },
    {
      id: 'costPercentage',
      name: 'Cost as % of Sales & Purchases',
      value: '7.5%',
      target: '6.5%',
      trend: 'down',
      status: 'warning',
      chartType: 'line',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: '% of Sales',
            data: generateDataPoints(6, 7.0, 8.0),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          },
          {
            label: '% of Purchases',
            data: generateDataPoints(6, 5.5, 6.5),
            borderColor: chartColors.secondary,
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            tension: 0.4,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Percentage (%)'
      },
      tooltipContent: {
        definition: 'Logistics costs as a percentage of total sales and purchases.',
        calculation: 'Sales %: (Outbound logistics cost / Total sales) × 100. Purchases %: (Inbound logistics cost / Total purchases) × 100.'
      }
    },
    {
      id: 'otherCharges',
      name: 'Other Charges Breakdown',
      value: '₹ 12.5L',
      target: '₹ 10.0L',
      trend: 'down',
      status: 'bad',
      chartType: 'pie',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: ['Detention', 'Damages', 'Extra Labor', 'Toll', 'Others'],
        datasets: [
          {
            data: [35, 25, 20, 15, 5],
            backgroundColor: [
              chartColors.primary,
              chartColors.secondary,
              chartColors.tertiary,
              chartColors.quaternary,
              chartColors.quinary
            ],
            borderWidth: 1
          }
        ]
      },
      tooltipContent: {
        definition: 'Breakdown of additional charges beyond standard freight costs.',
        calculation: 'Sum of all non-standard charges categorized by type.'
      }
    },
    {
      id: 'invoiceCycle',
      name: 'Invoice Cycle Analysis',
      value: '12 days',
      target: '7 days',
      trend: 'down',
      status: 'bad',
      chartType: 'bar',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: ['Raised to Verified', 'Verified to Approved', 'Approved to Settled'],
        datasets: [
          {
            label: 'Days',
            data: [5, 3, 4],
            backgroundColor: chartColors.primary
          }
        ],
        xAxisLabel: 'Stage',
        yAxisLabel: 'Days'
      },
      tooltipContent: {
        definition: 'Analysis of time taken at each stage of the invoice lifecycle.',
        calculation: 'Average time spent at each stage from invoice creation to final settlement.'
      }
    },
    {
      id: 'materialInvoices',
      name: 'Material Invoices',
      value: '1,250',
      target: '1,400',
      trend: 'up',
      status: 'warning',
      chartType: 'line',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'Invoices',
            data: generateDataPoints(6, 1100, 1300),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Count'
      },
      tooltipContent: {
        definition: 'Number of material invoices processed in the period.',
        calculation: 'Count of all material invoices raised in the period.'
      }
    },
    {
      id: 'freightInvoices',
      name: 'Freight Invoices',
      value: '850',
      target: '900',
      trend: 'up',
      status: 'warning',
      chartType: 'line',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'Invoices',
            data: generateDataPoints(6, 800, 900),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Count'
      },
      tooltipContent: {
        definition: 'Number of freight invoices processed in the period.',
        calculation: 'Count of all freight invoices raised in the period.'
      }
    },
    {
      id: 'tripCount',
      name: 'Trip Count (FTL/PTL)',
      value: '650',
      target: '700',
      trend: 'up',
      status: 'warning',
      chartType: 'bar',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'FTL',
            data: generateDataPoints(6, 350, 400),
            backgroundColor: chartColors.primary
          },
          {
            label: 'PTL',
            data: generateDataPoints(6, 200, 250),
            backgroundColor: chartColors.secondary
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Number of Trips'
      },
      tooltipContent: {
        definition: 'Total number of Full Truck Load (FTL) and Part Truck Load (PTL) trips in your region.',
        calculation: 'Count of all FTL and PTL trips completed in the period.'
      }
    }
    ],

    // Non-important KPIs - shown as mini inline charts
    notImportant: [
      {
        id: 'otherCharges',
        name: 'Other Charges %',
        value: '12.5%',
        target: '10.0%',
        trend: 'down',
        lowerIsBetter: true,
        chartType: 'line',
        chartData: {
          labels: generateMonths(6),
          datasets: [
            {
              label: 'Other Charges',
              data: generateDataPoints(6, 11, 13).map(val => val / 10),
              borderColor: chartColors.primary,
              backgroundColor: 'transparent',
              tension: 0.4,
            }
          ]
        }
      },
      {
        id: 'materialInvoices',
        name: 'Material Invoices',
        value: '1,250',
        target: '1,300',
        trend: 'up',
        chartType: 'line',
        chartData: {
          labels: generateMonths(6),
          datasets: [
            {
              label: 'Invoices',
              data: generateDataPoints(6, 1100, 1300),
              borderColor: chartColors.primary,
              backgroundColor: 'transparent',
              tension: 0.4,
            }
          ]
        }
      },
      {
        id: 'freightInvoices',
        name: 'Freight Invoices',
        value: '850',
        target: '900',
        trend: 'up',
        chartType: 'line',
        chartData: {
          labels: generateMonths(6),
          datasets: [
            {
              label: 'Invoices',
              data: generateDataPoints(6, 800, 900),
              borderColor: chartColors.primary,
              backgroundColor: 'transparent',
              tension: 0.4,
            }
          ]
        }
      },
      {
        id: 'companyTripCount',
        name: 'Trip Count',
        value: '650',
        target: '700',
        trend: 'up',
        chartType: 'line',
        chartData: {
          labels: generateMonths(6),
          datasets: [
            {
              label: 'Trips',
              data: generateDataPoints(6, 600, 700),
              borderColor: chartColors.primary,
              backgroundColor: 'transparent',
              tension: 0.4,
            }
          ]
        }
      }
    ]
  },

  // Branch Level KPIs
  branch: {
    // Important KPIs - shown prominently with full charts
    important: [
    {
      id: 'statusFlow',
      name: 'Status Flow (Indent to Gate Out)',
      value: '6.5 hrs',
      target: '5.0 hrs',
      trend: 'down',
      status: 'warning',
      chartType: 'bar',
      tileSize: '2x2', // Large tile
      chartData: {
        labels: ['Indent to Allocation', 'Allocation to Placement', 'Placement to Loading', 'Loading to Gate Out'],
        datasets: [
          {
            label: 'Current (hrs)',
            data: [1.5, 2.0, 2.0, 1.0],
            backgroundColor: chartColors.primary
          },
          {
            label: 'Target (hrs)',
            data: [1.0, 1.5, 1.5, 1.0],
            backgroundColor: chartColors.secondary
          }
        ],
        xAxisLabel: 'Stage',
        yAxisLabel: 'Hours'
      },
      tooltipContent: {
        definition: 'Time taken at each stage of the logistics process from indent creation to gate out.',
        calculation: 'Average time spent at each stage of the process.'
      }
    },
    {
      id: 'realTimeTrips',
      name: 'Real-time FTL/PTL Trips',
      value: '42 active',
      target: '50 active',
      trend: 'up',
      status: 'warning',
      chartType: 'bar',
      tileSize: '2x1', // Medium horizontal tile
      chartData: {
        labels: ['In Transit', 'Loading', 'Unloading', 'Waiting', 'Delayed'],
        datasets: [
          {
            label: 'FTL',
            data: [15, 8, 5, 3, 2],
            backgroundColor: chartColors.primary
          },
          {
            label: 'PTL',
            data: [5, 2, 1, 0, 1],
            backgroundColor: chartColors.secondary
          }
        ],
        xAxisLabel: 'Status',
        yAxisLabel: 'Number of Trips'
      },
      tooltipContent: {
        definition: 'Real-time status of all active trips from your branch.',
        calculation: 'Count of trips currently in each status category.'
      }
    },
    {
      id: 'vehicleUtilization',
      name: 'Vehicle Utilization',
      value: '75%',
      target: '85%',
      trend: 'steady',
      status: 'warning',
      chartType: 'bar',
      tileSize: '2x1', // Medium horizontal tile
      chartData: {
        labels: ['Truck', 'Van', 'Mini-truck', 'Tempo', 'Other'],
        datasets: [
          {
            label: 'Utilization',
            data: [80, 75, 70, 65, 60],
            backgroundColor: chartColors.primary
          },
          {
            label: 'Target',
            data: [85, 85, 85, 85, 85],
            backgroundColor: chartColors.secondary,
            borderWidth: 1,
            borderColor: '#333',
            borderDash: [5, 5],
            type: 'line'
          }
        ],
        xAxisLabel: 'Vehicle Type',
        yAxisLabel: 'Utilization (%)'
      },
      tooltipContent: {
        definition: 'Percentage of vehicle capacity utilized during operations.',
        calculation: '(Actual load / Maximum vehicle capacity) × 100, averaged across all trips.'
      }
    },
    {
      id: 'transitTimeMonitoring',
      name: 'Transit Time Monitoring',
      value: '18.5 hrs',
      target: '16.0 hrs',
      trend: 'down',
      status: 'warning',
      chartType: 'line',
      tileSize: '1x2', // Medium vertical tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'Avg Transit Time',
            data: generateDataPoints(6, 17, 20),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          },
          {
            label: 'Target',
            data: Array(6).fill(16),
            borderColor: chartColors.secondary,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Hours'
      },
      tooltipContent: {
        definition: 'Average time taken for vehicles to travel from origin to destination.',
        calculation: 'Sum of (arrival time - departure time) for all trips / Total number of trips'
      }
    },
    {
      id: 'unloadingTurnaround',
      name: 'Unloading & Turnaround Times',
      value: '4.2 hrs',
      target: '3.5 hrs',
      trend: 'down',
      status: 'warning',
      chartType: 'bar',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Unloading',
            data: [2.5, 2.8, 2.3, 2.6, 2.9, 2.0, 1.8],
            backgroundColor: chartColors.primary
          },
          {
            label: 'Turnaround',
            data: [1.7, 1.9, 1.5, 1.8, 2.0, 1.3, 1.2],
            backgroundColor: chartColors.secondary
          }
        ],
        xAxisLabel: 'Day of Week',
        yAxisLabel: 'Hours'
      },
      tooltipContent: {
        definition: 'Time taken for unloading operations and vehicle turnaround at destinations.',
        calculation: 'Unloading: Time from arrival to unloading completion. Turnaround: Time from unloading completion to departure.'
      }
    },
    {
      id: 'cleanPod',
      name: 'Clean POD',
      value: '82%',
      target: '95%',
      trend: 'up',
      status: 'bad',
      chartType: 'line',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'Clean POD %',
            data: generateDataPoints(6, 75, 85),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Percentage (%)'
      },
      tooltipContent: {
        definition: 'Percentage of deliveries with properly documented and clean proof of delivery in your branch.',
        calculation: '(Number of deliveries with clean POD / Total number of deliveries in your branch) × 100'
      }
    },
    {
      id: 'invoiceSubmission',
      name: 'Invoice Submission to Approval',
      value: '3.8 days',
      target: '2.0 days',
      trend: 'down',
      status: 'bad',
      chartType: 'line',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'Days',
            data: generateDataPoints(6, 3.5, 4.2),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Days'
      },
      tooltipContent: {
        definition: 'Average time taken from invoice submission to approval.',
        calculation: 'Sum of (approval date - submission date) for all invoices / Total number of invoices'
      }
    },
    {
      id: 'weightVolumeMetrics',
      name: 'Weight & Volume Metrics',
      value: '82%',
      target: '90%',
      trend: 'up',
      status: 'warning',
      chartType: 'bar',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Weight Util %',
            data: [85, 80, 83, 78, 82, 75, 70],
            backgroundColor: chartColors.primary
          },
          {
            label: 'Volume Util %',
            data: [80, 75, 78, 73, 77, 70, 65],
            backgroundColor: chartColors.secondary
          }
        ],
        xAxisLabel: 'Day of Week',
        yAxisLabel: 'Percentage (%)'
      },
      tooltipContent: {
        definition: 'Utilization of weight and volume capacity in vehicles.',
        calculation: 'Weight: (Actual weight / Maximum weight capacity) × 100. Volume: (Actual volume / Maximum volume capacity) × 100.'
      }
    },
    {
      id: 'placementEfficiency',
      name: 'Placement Efficiency',
      value: '85%',
      target: '95%',
      trend: 'up',
      status: 'warning',
      chartType: 'line',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'Efficiency',
            data: generateDataPoints(6, 80, 88),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Percentage (%)'
      },
      tooltipContent: {
        definition: 'Percentage of vehicles placed at loading points within scheduled time window.',
        calculation: '(Number of on-time placements / Total number of placements) × 100'
      }
    },
    {
      id: 'orderExecutionTime',
      name: 'Order Execution Time (OET)',
      value: '3.2 days',
      target: '2.5 days',
      trend: 'down',
      status: 'warning',
      chartType: 'line',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'OET',
            data: generateDataPoints(6, 3.0, 3.5),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Days'
      },
      tooltipContent: {
        definition: 'Average time taken to execute an order from receipt to delivery at your branch.',
        calculation: 'Sum of (delivery completion time - order receipt time) for all orders / Total number of orders'
      }
    },
    {
      id: 'salesDeliveryOrders',
      name: 'Sales & Delivery Orders',
      value: '450',
      target: '500',
      trend: 'up',
      status: 'warning',
      chartType: 'line',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'Sales Orders',
            data: generateDataPoints(6, 420, 480),
            borderColor: chartColors.primary,
            backgroundColor: chartColors.background,
            tension: 0.4,
          },
          {
            label: 'Delivery Orders',
            data: generateDataPoints(6, 400, 460),
            borderColor: chartColors.secondary,
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            tension: 0.4,
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Number of Orders'
      },
      tooltipContent: {
        definition: 'Comparison of sales orders received vs. delivery orders fulfilled at your branch.',
        calculation: 'Count of all sales orders and delivery orders in the period.'
      }
    },
    {
      id: 'materialFreightInvoices',
      name: 'Material & Freight Invoices',
      value: '380',
      target: '420',
      trend: 'up',
      status: 'warning',
      chartType: 'bar',
      tileSize: '1x1', // Standard tile
      chartData: {
        labels: generateMonths(6),
        datasets: [
          {
            label: 'Material',
            data: generateDataPoints(6, 220, 260),
            backgroundColor: chartColors.primary
          },
          {
            label: 'Freight',
            data: generateDataPoints(6, 140, 180),
            backgroundColor: chartColors.secondary
          }
        ],
        xAxisLabel: 'Month',
        yAxisLabel: 'Number of Invoices'
      },
      tooltipContent: {
        definition: 'Number of material and freight invoices processed at your branch.',
        calculation: 'Count of all material and freight invoices raised in the period.'
      }
    }
    ],

    // Non-important KPIs - shown as mini inline charts
    notImportant: [
      {
        id: 'unloadingTime',
        name: 'Unloading Time',
        value: '2.5 hrs',
        target: '2.0 hrs',
        trend: 'down',
        lowerIsBetter: true,
        chartType: 'line',
        chartData: {
          labels: generateMonths(6),
          datasets: [
            {
              label: 'Hours',
              data: generateDataPoints(6, 2.3, 2.8),
              borderColor: chartColors.primary,
              backgroundColor: 'transparent',
              tension: 0.4,
            }
          ]
        }
      },
      {
        id: 'branchCleanPod',
        name: 'Clean POD',
        value: '82%',
        target: '90%',
        trend: 'up',
        chartType: 'line',
        chartData: {
          labels: generateMonths(6),
          datasets: [
            {
              label: 'Clean POD %',
              data: generateDataPoints(6, 75, 85),
              borderColor: chartColors.primary,
              backgroundColor: 'transparent',
              tension: 0.4,
            }
          ]
        }
      },
      {
        id: 'placementEfficiency',
        name: 'Placement Efficiency',
        value: '78%',
        target: '85%',
        trend: 'up',
        chartType: 'line',
        chartData: {
          labels: generateMonths(6),
          datasets: [
            {
              label: 'Efficiency',
              data: generateDataPoints(6, 75, 80),
              borderColor: chartColors.primary,
              backgroundColor: 'transparent',
              tension: 0.4,
            }
          ]
        }
      },
      {
        id: 'branchSalesOrders',
        name: 'Sales Orders',
        value: '450',
        target: '500',
        trend: 'up',
        chartType: 'line',
        chartData: {
          labels: generateMonths(6),
          datasets: [
            {
              label: 'Orders',
              data: generateDataPoints(6, 420, 470),
              borderColor: chartColors.primary,
              backgroundColor: 'transparent',
              tension: 0.4,
            }
          ]
        }
      }
    ]
  }
};

export default kpiDefinitions;
