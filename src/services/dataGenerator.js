// Data generator service to create realistic KPI data

// Helper function to generate random number within a range
const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to generate random percentage
const randomPercentage = (base, variance) => {
  const change = (Math.random() * variance * 2) - variance;
  return Math.max(0, Math.min(100, base + change));
};

// Helper function to generate time values (in hours)
const randomTime = (base, variance) => {
  const change = (Math.random() * variance * 2) - variance;
  return Math.max(0.5, (base + change).toFixed(2));
};

// Helper function to generate month names for the last 6 months
const generateLastSixMonths = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  const result = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(today);
    d.setMonth(today.getMonth() - i);
    result.push(months[d.getMonth()]);
  }

  return result;
};

// Helper function to generate six months of trend data
const generateSixMonthsTrendData = (current, min, max, isPercentage = false, trend = 'random') => {
  const data = [];
  let value = current;

  // Generate data for the past 6 months (going backwards)
  for (let i = 0; i < 6; i++) {
    // Add some randomness to create realistic variations
    let variance = isPercentage ? 5 : (max - min) * 0.1;

    // Adjust variance based on trend direction
    let change;
    if (trend === 'up') {
      // For upward trend, bias towards positive changes
      change = (Math.random() * variance * 1.5) - (variance * 0.5);
    } else if (trend === 'down') {
      // For downward trend, bias towards negative changes
      change = (Math.random() * variance * 1.5) - (variance * 1.0);
    } else {
      // For random trend, use unbiased changes
      change = (Math.random() * variance * 2) - variance;
    }

    // Ensure the value stays within the specified range
    value = Math.max(min, Math.min(max, value + change));

    // For percentages, ensure we don't exceed 100%
    if (isPercentage) {
      value = Math.min(100, Math.max(0, value));
    }

    // Round to appropriate precision
    const roundedValue = isPercentage ? Number(value.toFixed(2)) : Number(value.toFixed(2));

    data.push(roundedValue); // Add to the end to have newest data last
  }

  return data;
};



// Generate chart data for a KPI
const generateChartData = (kpi) => {
  // Extract the value for chart generation
  let valueStr = '';
  let targetStr = '';

  // Handle complex values like "₹12.50Cr / ₹2.50Cr"
  if (kpi.value !== undefined) {
    valueStr = kpi.value.toString();
    // If value contains multiple values (e.g., "₹12.50Cr / ₹2.50Cr"), use the first one
    if (valueStr.includes('/')) {
      valueStr = valueStr.split('/')[0].trim();
    }
  } else if (kpi.currentValue !== undefined) {
    valueStr = kpi.currentValue.toString();
  } else {
    console.error('No value found for KPI:', kpi);
    return null;
  }

  if (kpi.target !== undefined) {
    targetStr = kpi.target.toString();
    // If target contains multiple values, use the first one
    if (targetStr.includes('/')) {
      targetStr = targetStr.split('/')[0].trim();
    }
  } else {
    console.warn('No target found for KPI:', kpi);
  }

  // Determine if the value is a percentage, time, or currency
  const isPercentage = valueStr.includes('%');
  const isTime = valueStr.includes('hrs') || valueStr.includes('days');
  const isCurrency = valueStr.includes('₹') || valueStr.includes('$');

  // Extract numeric value
  const numericValue = parseFloat(valueStr.replace(/[^0-9.-]+/g, ''));

  if (isNaN(numericValue)) {
    console.error('Could not parse numeric value from:', valueStr);
    return null;
  }

  // Log the extracted value for debugging
  console.log(`Extracted value for ${kpi.name}: ${numericValue} (from ${valueStr})`);
  console.log(`Type: ${isPercentage ? 'Percentage' : isTime ? 'Time' : isCurrency ? 'Currency' : 'Number'}`);

  let min, max;
  if (isPercentage) {
    // For percentages, stay within 0-100% range
    min = Math.max(0, numericValue - 20);
    max = Math.min(100, numericValue + 20);
  } else if (isTime) {
    // For time values, use smaller variance
    min = Math.max(0, numericValue * 0.8);
    max = numericValue * 1.2;
  } else if (isCurrency) {
    // For currency values, use moderate variance
    min = Math.max(0, numericValue * 0.75);
    max = numericValue * 1.25;
  } else {
    // For other numeric values, use standard variance
    min = Math.max(0, numericValue * 0.7);
    max = numericValue * 1.3;
  }

  // Determine trend direction based on KPI properties
  let trendDirection = 'random';
  if (kpi.lowerIsBetter) {
    // For KPIs where lower is better, we want to show improvement (downward trend)
    trendDirection = 'down';
  } else {
    // For KPIs where higher is better, we want to show improvement (upward trend)
    trendDirection = 'up';
  }

  // Generate six months of data
  const data = generateSixMonthsTrendData(numericValue, min, max, isPercentage, trendDirection);

  // Generate month labels
  const monthLabels = generateLastSixMonths();

  return {
    labels: monthLabels,
    datasets: [
      {
        data: data,
        borderColor: '#003c9b',
        backgroundColor: 'rgba(0, 60, 155, 0.1)',
      }
    ]
  };
};

// Generate random data for all KPIs
export const generateRandomData = () => {
  // Generate important KPIs data for all personas
  // CXO Level KPIs
  const revenueCr = (randomInRange(120, 150) / 10).toFixed(2);
  const profitCr = (randomInRange(18, 25) / 10).toFixed(2);
  const orderToDelivery = randomTime(4.2, 0.3);
  const freightCostPerKm = (randomInRange(35, 45) / 10).toFixed(2);
  const tripCount = randomInRange(1800, 2200).toFixed(0);
  const carbonEmissions = randomInRange(450, 550).toFixed(0);
  const otif = randomPercentage(88, 4).toFixed(2);
  const outboundFreightCost = randomPercentage(8, 2).toFixed(2);
  const inboundFreightCost = randomPercentage(6, 1).toFixed(2);
  const fuelEfficiency = (randomInRange(38, 45) / 10).toFixed(2);
  const vehicleUtilizationCXO = randomPercentage(82, 3).toFixed(2);
  const salesDeliveryOrders = randomInRange(850, 950).toFixed(0);

  // Company Level KPIs
  const orderExecutionTime = randomTime(5.8, 0.5);
  const vehicleUtilization = randomPercentage(76, 4).toFixed(2);
  const weightUtilization = randomPercentage(78, 3).toFixed(2);
  const volumeUtilization = randomPercentage(74, 5).toFixed(2);
  const transitTime = randomTime(3.2, 0.4);
  const unloadingTurnaround = randomTime(4.5, 0.6);
  const freightCostsPerKm = (randomInRange(35, 45) / 10).toFixed(2);
  const freightCostsPerTon = (randomInRange(120, 150) / 10).toFixed(2);
  const freightCosts = (randomInRange(120, 150) / 10).toFixed(2);
  const weightVolumeMetrics = randomPercentage(82, 3).toFixed(2);
  const companyPlacementEfficiency = randomPercentage(80, 4).toFixed(2);
  const companyCleanPOD = randomPercentage(85, 3).toFixed(2);
  const invoiceSettlement = randomPercentage(78, 5).toFixed(2);
  const costPercentSales = randomPercentage(12, 2).toFixed(2);
  const otherCharges = (randomInRange(25, 35) / 10).toFixed(2);
  const materialInvoices = randomInRange(220, 280).toFixed(0);
  const freightInvoices = randomInRange(180, 220).toFixed(0);
  const companyTripCount = randomInRange(350, 450).toFixed(0);

  // Branch Level KPIs
  const unloadingTime = randomTime(2.5, 0.5);
  const cleanPOD = randomPercentage(82, 5).toFixed(2);
  const placementEfficiency = randomPercentage(78, 5).toFixed(2);
  const salesOrders = randomInRange(420, 480).toFixed(0);
  const statusFlow = randomPercentage(85, 4).toFixed(2);
  const realTimeTrips = randomInRange(85, 95).toFixed(0);
  const transitTimeMonitoring = randomTime(2.8, 0.3);
  const branchCleanPod = randomPercentage(88, 3).toFixed(2);
  const invoiceSubmission = randomPercentage(92, 2).toFixed(2);
  const branchVehicleUtilization = randomPercentage(75, 5).toFixed(2);
  const weightVolumeMetricsBranch = randomPercentage(80, 4).toFixed(2);
  const branchOrderExecutionTime = randomTime(5.5, 0.4);
  const materialFreightInvoices = randomInRange(120, 150).toFixed(0);

  // Generate operational metrics data for Planning tab
  const shipmentsPlanned = randomInRange(230, 260).toFixed(0);
  const shipmentsNotPlanned = randomInRange(25, 40).toFixed(0);
  const plannedOnTime = randomPercentage(88, 3).toFixed(2);
  const planningSLABreached = randomInRange(15, 25).toFixed(0);

  // Generate operational metrics data for Indent tab
  const indentsPublished = randomInRange(165, 190).toFixed(0);
  const indentsAccepted = randomInRange(140, 165).toFixed(0);

  // Generate operational metrics data for FTL tab
  const tripsStarted = randomInRange(110, 125).toFixed(0);
  const tripsNotStarted = randomInRange(10, 20).toFixed(0);
  const onTimeTrips = randomPercentage(78, 5).toFixed(2);
  const trucksArrivingToday = randomInRange(22, 32).toFixed(0);

  // Generate operational metrics data for PTL tab
  const ordersGenerated = randomInRange(310, 340).toFixed(0);
  const ordersAssigned = randomInRange(285, 310).toFixed(0);
  const ordersPickedUp = randomInRange(260, 290).toFixed(0);
  const delayedDeliveries = randomInRange(28, 38).toFixed(0);

  // Generate operational metrics data for Freight Invoicing tab
  const invoicesRaised = randomInRange(135, 150).toFixed(0);
  const invoicesApproved = randomInRange(120, 135).toFixed(0);
  const invoiceApprovalTime = randomTime(2.8, 0.3);
  const rejectedInvoices = randomInRange(5, 12).toFixed(0);

  // Create the data object
  const data = {
    // Organize KPIs by persona
    cxoKpis: [
      {
        id: 'revenueProfitTrends',
        name: 'Revenue & Profit Trends',
        value: `₹${revenueCr}Cr / ₹${profitCr}Cr`,
        target: '₹15.0Cr / ₹2.5Cr',
        lowerIsBetter: false,
        tileSize: '2x2'
      },
      {
        id: 'orderToDelivery',
        name: 'Order to Delivery (OTD)',
        value: `${orderToDelivery} days`,
        target: '3.5 days',
        lowerIsBetter: true,
        tileSize: '2x1'
      },
      {
        id: 'freightCostPerKm',
        name: 'Freight Cost per KM/Tonnage',
        value: `₹${freightCostPerKm}/km`,
        target: '₹3.5/km',
        lowerIsBetter: true,
        tileSize: '2x1'
      },
      {
        id: 'tripCount',
        name: 'Trip Count',
        value: tripCount.toString(),
        target: '2000',
        lowerIsBetter: false,
        tileSize: '1x1'
      },
      {
        id: 'carbonEmissions',
        name: 'Carbon Emissions (tons)',
        value: carbonEmissions.toString(),
        target: '500',
        lowerIsBetter: true,
        tileSize: '1x2'
      },
      {
        id: 'otif',
        name: 'On-Time In-Full (OTIF)',
        value: `${otif}%`,
        target: '90.0%',
        lowerIsBetter: false,
        tileSize: '1x1'
      },
      {
        id: 'outboundFreightCost',
        name: 'Outbound Freight Cost',
        value: `${outboundFreightCost}%`,
        target: '7.5%',
        lowerIsBetter: true,
        tileSize: '1x1'
      },
      {
        id: 'inboundFreightCost',
        name: 'Inbound Freight Cost',
        value: `${inboundFreightCost}%`,
        target: '5.5%',
        lowerIsBetter: true,
        tileSize: '1x1'
      },
      {
        id: 'fuelEfficiency',
        name: 'Fuel Efficiency',
        value: `${fuelEfficiency} km/l`,
        target: '4.0 km/l',
        lowerIsBetter: false,
        tileSize: '1x1'
      },
      {
        id: 'vehicleUtilizationCXO',
        name: 'Vehicle Utilization',
        value: `${vehicleUtilizationCXO}%`,
        target: '85.0%',
        lowerIsBetter: false,
        tileSize: '1x1'
      },
      {
        id: 'salesDeliveryOrders',
        name: 'Sales & Delivery Orders',
        value: salesDeliveryOrders.toString(),
        target: '900',
        lowerIsBetter: false,
        tileSize: '1x1'
      }
    ],
    companyKpis: [
      {
        id: 'orderExecutionTime',
        name: 'Order Execution Time (OET)',
        value: `${orderExecutionTime} days`,
        target: '5.0 days',
        lowerIsBetter: true,
        tileSize: '2x2'
      },
      {
        id: 'vehicleWeightVolumeUtilization',
        name: 'Vehicle, Weight, Volume Utilization',
        value: `${vehicleUtilization}% / ${weightUtilization}% / ${volumeUtilization}%`,
        target: '80.0% / 80.0% / 75.0%',
        lowerIsBetter: false,
        tileSize: '2x1'
      },
      {
        id: 'transitUnloadingTime',
        name: 'Transit Time & Unloading Time',
        value: `${transitTime} days / ${unloadingTurnaround} hrs`,
        target: '3.0 days / 4.0 hrs',
        lowerIsBetter: true,
        tileSize: '1x2'
      },
      {
        id: 'freightCostsPerUnit',
        name: 'Freight Costs per KM/Tonnage/Unit',
        value: `₹${freightCostsPerKm}/km | ₹${freightCostsPerTon}/ton`,
        target: '₹3.5/km | ₹12.0/ton',
        lowerIsBetter: true,
        tileSize: '2x1'
      },
      {
        id: 'weightVolumeMetrics',
        name: 'Weight/Volume Utilization',
        value: `${weightVolumeMetrics}%`,
        target: '85.0%',
        lowerIsBetter: false,
        tileSize: '1x1'
      },
      {
        id: 'placementEfficiency',
        name: 'Placement Efficiency',
        value: `${companyPlacementEfficiency}%`,
        target: '85.0%',
        lowerIsBetter: false,
        tileSize: '1x1'
      },
      {
        id: 'cleanPODInvoices',
        name: 'Clean POD & Invoices',
        value: `${companyCleanPOD}%`,
        target: '90.0%',
        lowerIsBetter: false,
        tileSize: '1x1'
      },
      {
        id: 'costPercentSales',
        name: 'Cost as % of Sales & Purchases',
        value: `${costPercentSales}%`,
        target: '10.0%',
        lowerIsBetter: true,
        tileSize: '1x1'
      },
      {
        id: 'otherChargesBreakdown',
        name: 'Other Charges Breakdown',
        value: `₹${otherCharges}L`,
        target: '₹3.0L',
        lowerIsBetter: true,
        tileSize: '1x1'
      },
      {
        id: 'invoiceSettlement',
        name: 'Invoice Cycle Analysis',
        value: `${invoiceSettlement}%`,
        target: '85.0%',
        lowerIsBetter: false,
        tileSize: '1x1'
      },
      {
        id: 'materialInvoices',
        name: 'Material Invoices',
        value: materialInvoices.toString(),
        target: '250',
        lowerIsBetter: false,
        tileSize: '1x1'
      },
      {
        id: 'freightInvoices',
        name: 'Freight Invoices',
        value: freightInvoices.toString(),
        target: '200',
        lowerIsBetter: false,
        tileSize: '1x1'
      },
      {
        id: 'companyTripCount',
        name: 'Trip Count (FTL/PTL)',
        value: companyTripCount.toString(),
        target: '400',
        lowerIsBetter: false,
        tileSize: '1x1'
      }
    ],
    branchKpis: [
      {
        id: 'unloadingTime',
        name: 'Unloading Time',
        value: `${unloadingTime} hrs`,
        target: '2.0 hrs',
        lowerIsBetter: true,
        tileSize: '1x1'
      },
      {
        id: 'cleanPOD',
        name: 'Clean POD',
        value: `${cleanPOD}%`,
        target: '90%',
        lowerIsBetter: false,
        tileSize: '1x1'
      },
      {
        id: 'placementEfficiency',
        name: 'Placement Efficiency',
        value: `${placementEfficiency}%`,
        target: '85%',
        lowerIsBetter: false,
        tileSize: '1x1'
      },
      {
        id: 'salesOrders',
        name: 'Sales Orders',
        value: salesOrders.toString(),
        target: '500',
        lowerIsBetter: false,
        tileSize: '1x1'
      },
      {
        id: 'statusFlow',
        name: 'Status Flow (Indent to Gate Out)',
        value: `${statusFlow}%`,
        target: '90.0%',
        lowerIsBetter: false,
        tileSize: '2x2'
      },
      {
        id: 'realTimeTrips',
        name: 'Real-time FTL/PTL Trips',
        value: realTimeTrips.toString(),
        target: '90',
        lowerIsBetter: false,
        tileSize: '2x1'
      },
      {
        id: 'branchVehicleUtilization',
        name: 'Vehicle Utilization',
        value: `${branchVehicleUtilization}%`,
        target: '80.0%',
        lowerIsBetter: false,
        tileSize: '2x1'
      },
      {
        id: 'transitTimeMonitoring',
        name: 'Transit Time Monitoring',
        value: `${transitTimeMonitoring} hrs`,
        target: '2.5 hrs',
        lowerIsBetter: true,
        tileSize: '1x2'
      },
      {
        id: 'branchCleanPod',
        name: 'Branch Clean POD %',
        value: `${branchCleanPod}%`,
        target: '90.0%',
        lowerIsBetter: false,
        tileSize: '1x1'
      },
      {
        id: 'invoiceSubmission',
        name: 'Invoice Submission Rate',
        value: `${invoiceSubmission}%`,
        target: '95.0%',
        lowerIsBetter: false,
        tileSize: '1x1'
      },
      {
        id: 'weightVolumeMetricsBranch',
        name: 'Weight & Volume Metrics',
        value: `${weightVolumeMetricsBranch}%`,
        target: '85.0%',
        lowerIsBetter: false,
        tileSize: '1x1'
      },
      {
        id: 'branchOrderExecutionTime',
        name: 'Order Execution Time (OET)',
        value: `${branchOrderExecutionTime} days`,
        target: '5.0 days',
        lowerIsBetter: true,
        tileSize: '1x1'
      },
      {
        id: 'materialFreightInvoices',
        name: 'Material & Freight Invoices',
        value: materialFreightInvoices.toString(),
        target: '130',
        lowerIsBetter: false,
        tileSize: '1x1'
      }
    ],
    // For backward compatibility, keep the importantKpis array with the current persona's KPIs
    importantKpis: [
      {
        id: 'unloadingTime',
        name: 'Unloading Time',
        value: `${unloadingTime} hrs`,
        target: '2.0 hrs',
        lowerIsBetter: true,
        tileSize: '1x1'
      },
      {
        id: 'cleanPOD',
        name: 'Clean POD',
        value: `${cleanPOD}%`,
        target: '90%',
        lowerIsBetter: false,
        tileSize: '1x1'
      },
      {
        id: 'placementEfficiency',
        name: 'Placement Efficiency',
        value: `${placementEfficiency}%`,
        target: '85%',
        lowerIsBetter: false,
        tileSize: '1x1'
      },
      {
        id: 'salesOrders',
        name: 'Sales Orders',
        value: salesOrders.toString(),
        target: '500',
        lowerIsBetter: false,
        tileSize: '1x1'
      }
    ],
    operationalMetrics: {
      planning: [
        {
          id: 'shipmentsPlanned',
          name: 'Shipments Planned',
          currentValue: shipmentsPlanned.toString(),
          lastWeekValue: (shipmentsPlanned - randomInRange(-10, 15)).toString(),
          target: '230',
          lowerIsBetter: false
        },
        {
          id: 'shipmentsNotPlanned',
          name: 'Shipments Not Planned',
          currentValue: shipmentsNotPlanned.toString(),
          lastWeekValue: (shipmentsNotPlanned + randomInRange(-5, 8)).toString(),
          target: '25',
          lowerIsBetter: true
        },
        {
          id: 'plannedOnTime',
          name: 'Planned on Time',
          currentValue: `${plannedOnTime}%`,
          lastWeekValue: `${plannedOnTime - randomInRange(-3, 6)}%`,
          target: '90%',
          lowerIsBetter: false
        },
        {
          id: 'planningSLABreached',
          name: 'Planning SLA Breached',
          currentValue: planningSLABreached.toString(),
          lastWeekValue: (planningSLABreached + randomInRange(-3, 6)).toString(),
          target: '15',
          lowerIsBetter: true
        }
      ],
      indent: [
        {
          id: 'indentsPublished',
          name: 'Indents Published',
          currentValue: indentsPublished.toString(),
          lastWeekValue: (indentsPublished - randomInRange(-5, 10)).toString(),
          target: '170',
          lowerIsBetter: false
        },
        {
          id: 'indentsAccepted',
          name: 'Indents Accepted',
          currentValue: indentsAccepted.toString(),
          lastWeekValue: (indentsAccepted - randomInRange(-5, 10)).toString(),
          target: '160',
          lowerIsBetter: false
        }
      ],
      ftl: [
        {
          id: 'tripsStarted',
          name: 'Trips Started',
          currentValue: tripsStarted.toString(),
          lastWeekValue: (tripsStarted - randomInRange(-5, 8)).toString(),
          target: '115',
          lowerIsBetter: false
        },
        {
          id: 'tripsNotStarted',
          name: 'Trips Not Started',
          currentValue: tripsNotStarted.toString(),
          lastWeekValue: (tripsNotStarted + randomInRange(-2, 4)).toString(),
          target: '10',
          lowerIsBetter: true
        },
        {
          id: 'onTimeTrips',
          name: 'On-Time Trips (%)',
          currentValue: `${onTimeTrips}%`,
          lastWeekValue: `${onTimeTrips - randomInRange(-3, 6)}%`,
          target: '85%',
          lowerIsBetter: false
        },
        {
          id: 'trucksArrivingToday',
          name: 'Trucks Arriving Today',
          currentValue: trucksArrivingToday.toString(),
          lastWeekValue: (trucksArrivingToday - randomInRange(-3, 4)).toString(),
          target: '25',
          lowerIsBetter: false
        }
      ],
      ptl: [
        {
          id: 'ordersGenerated',
          name: 'Orders Generated',
          currentValue: ordersGenerated.toString(),
          lastWeekValue: (ordersGenerated - randomInRange(-10, 15)).toString(),
          target: '300',
          lowerIsBetter: false
        },
        {
          id: 'ordersAssigned',
          name: 'Orders Assigned to Couriers',
          currentValue: ordersAssigned.toString(),
          lastWeekValue: (ordersAssigned - randomInRange(-8, 13)).toString(),
          target: '310',
          lowerIsBetter: false
        },
        {
          id: 'ordersPickedUp',
          name: 'Orders Picked Up',
          currentValue: ordersPickedUp.toString(),
          lastWeekValue: (ordersPickedUp - randomInRange(-8, 15)).toString(),
          target: '290',
          lowerIsBetter: false
        },
        {
          id: 'delayedDeliveries',
          name: 'Delayed Deliveries',
          currentValue: delayedDeliveries.toString(),
          lastWeekValue: (delayedDeliveries + randomInRange(-3, 6)).toString(),
          target: '25',
          lowerIsBetter: true
        }
      ],
      freightInvoicing: [
        {
          id: 'invoicesRaised',
          name: 'Invoices Raised',
          currentValue: invoicesRaised.toString(),
          lastWeekValue: (invoicesRaised - randomInRange(-5, 7)).toString(),
          target: '140',
          lowerIsBetter: false
        },
        {
          id: 'invoicesApproved',
          name: 'Invoices Approved',
          currentValue: invoicesApproved.toString(),
          lastWeekValue: (invoicesApproved - randomInRange(-5, 7)).toString(),
          target: '130',
          lowerIsBetter: false
        },
        {
          id: 'invoiceApprovalTime',
          name: 'Invoice Approval Time',
          currentValue: `${invoiceApprovalTime} days`,
          lastWeekValue: `${(invoiceApprovalTime + randomInRange(0.1, 0.4)).toFixed(1)} days`,
          target: '2.5 days',
          lowerIsBetter: true
        },
        {
          id: 'rejectedInvoices',
          name: 'Rejected Invoices',
          currentValue: rejectedInvoices.toString(),
          lastWeekValue: (rejectedInvoices + randomInRange(-2, 4)).toString(),
          target: '5',
          lowerIsBetter: true
        }
      ]
    }
  };

  // Generate chart data for each KPI in all persona arrays
  ['cxoKpis', 'companyKpis', 'branchKpis', 'importantKpis'].forEach(personaArray => {
    if (data[personaArray]) {
      data[personaArray].forEach(kpi => {
        kpi.chartData = generateChartData(kpi);
      });
    }
  });

  // Generate chart data for operational metrics
  Object.keys(data.operationalMetrics).forEach(tab => {
    data.operationalMetrics[tab].forEach(kpi => {
      // Pass the KPI directly to generateChartData
      kpi.chartData = generateChartData(kpi);
    });
  });

  return data;
};
