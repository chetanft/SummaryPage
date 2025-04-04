// Branch Tabs KPI Data
export const branchTabsData = {
  // Planning Tab
  planning: [
    {
      id: 'shipmentsPlanned',
      name: 'Shipments Planned',
      currentValue: '245',
      lastWeekValue: '228',
      target: '230',
      lowerIsBetter: false,
      tooltip: {
        definition: 'Total number of shipments that have been planned for the current week.',
        calculation: 'Count of all shipments with status "Planned" in the current week.',
        importance: 'Indicates planning efficiency and helps in resource allocation for the week.'
      }
    },
    {
      id: 'shipmentsNotPlanned',
      name: 'Shipments Not Planned',
      currentValue: '32',
      lastWeekValue: '45',
      target: '25',
      lowerIsBetter: true,
      tooltip: {
        definition: 'Number of shipments that should be planned but are still pending.',
        calculation: 'Count of shipments with status "Not Planned" that have a scheduled date within the current week.',
        importance: 'Highlights potential delays and helps prioritize planning activities.',
        action: 'Review pending shipments and prioritize planning for time-sensitive orders.'
      }
    },
    {
      id: 'plannedOnTime',
      name: 'Planned on Time',
      currentValue: '88%',
      lastWeekValue: '82%',
      target: '90%',
      lowerIsBetter: false,
      tooltip: {
        definition: 'Percentage of shipments that were planned within the required timeframe.',
        calculation: 'Number of shipments planned on time / Total number of shipments planned × 100.',
        importance: 'Measures planning team efficiency and adherence to planning schedules.'
      }
    },
    {
      id: 'planningSLABreached',
      name: 'Planning SLA Breached',
      currentValue: '18',
      lastWeekValue: '24',
      target: '15',
      lowerIsBetter: true,
      tooltip: {
        definition: 'Number of shipments where planning was completed after the SLA deadline.',
        calculation: 'Count of shipments with planning completion timestamp after the SLA deadline.',
        importance: 'Identifies process bottlenecks and helps improve planning efficiency.',
        action: 'Investigate SLA breaches and address common causes to improve planning timeliness.'
      }
    }
  ],

  // Indent Tab
  indent: [
    {
      id: 'indentsPublished',
      name: 'Indents Published',
      currentValue: '178',
      lastWeekValue: '165',
      lowerIsBetter: false,
      tooltip: {
        definition: 'Number of vehicle indents published to transporters this week.',
        calculation: 'Count of indents with status "Published" in the current week.',
        importance: 'Measures the volume of transport requests being processed by the branch.'
      }
    },
    {
      id: 'indentsAccepted',
      name: 'Indents Accepted',
      currentValue: '152',
      lastWeekValue: '140',
      lowerIsBetter: false,
      tooltip: {
        definition: 'Number of published indents that have been accepted by transporters.',
        calculation: 'Count of indents with status "Accepted" in the current week.',
        importance: 'Indicates transporter engagement and availability of vehicles.'
      }
    },
    {
      id: 'vehiclesAssigned',
      name: 'Vehicles Assigned',
      currentValue: '145',
      lastWeekValue: '138',
      lowerIsBetter: false,
      tooltip: {
        definition: 'Number of vehicles that have been assigned to indents.',
        calculation: 'Count of indents with a vehicle assigned in the current week.',
        importance: 'Shows progress in the vehicle assignment process and helps track potential shortfalls.'
      }
    },
    {
      id: 'vehiclesReported',
      name: 'Vehicles Reported at Gate',
      currentValue: '132',
      lastWeekValue: '125',
      lowerIsBetter: false,
      tooltip: {
        definition: 'Number of assigned vehicles that have reported at the loading point.',
        calculation: 'Count of indents with status "Vehicle Reported" in the current week.',
        importance: 'Measures transporter reliability and helps predict loading operations.'
      }
    },
    {
      id: 'delayInVehicleAssignment',
      name: 'Delay in Vehicle Assignment',
      currentValue: '3.2 hrs',
      lastWeekValue: '3.8 hrs',
      lowerIsBetter: true,
      tooltip: {
        definition: 'Average time taken to assign a vehicle after indent is published.',
        calculation: 'Sum of (vehicle assignment time - indent publish time) / Total number of assigned indents.',
        importance: 'Indicates efficiency of the vehicle assignment process and transporter responsiveness.',
        action: 'Follow up with transporters who consistently take longer to assign vehicles.'
      }
    }
  ],

  // FTL Tab
  ftl: [
    {
      id: 'tripsStarted',
      name: 'Trips Started',
      currentValue: '118',
      lastWeekValue: '110',
      lowerIsBetter: false,
      tooltip: {
        definition: 'Number of FTL trips that have started this week.',
        calculation: 'Count of trips with status "Started" in the current week.',
        importance: 'Indicates the volume of active shipments and helps track operational throughput.'
      }
    },
    {
      id: 'tripsNotStarted',
      name: 'Trips Not Started',
      currentValue: '14',
      lastWeekValue: '18',
      lowerIsBetter: true,
      tooltip: {
        definition: 'Number of trips that should have started today but haven\'t.',
        calculation: 'Count of trips with planned start date of today but status is not "Started".',
        importance: 'Highlights potential delays and helps prioritize follow-up actions.',
        action: 'Contact transporters for trips scheduled to start today that haven\'t begun yet.'
      }
    },
    {
      id: 'onTimeTrips',
      name: 'On-Time Trips (%)',
      currentValue: '78%',
      lastWeekValue: '72%',
      lowerIsBetter: false,
      tooltip: {
        definition: 'Percentage of trips that are running on schedule.',
        calculation: 'Number of on-time trips / Total number of active trips × 100.',
        importance: 'Key indicator of delivery performance and customer satisfaction.'
      }
    },
    {
      id: 'delayedTrips',
      name: 'Delayed Trips',
      currentValue: '26',
      lastWeekValue: '25',
      lowerIsBetter: true,
      tooltip: {
        definition: 'Number of trips that are running behind schedule.',
        calculation: 'Count of active trips where actual progress is behind planned progress by more than the allowed buffer.',
        importance: 'Helps identify issues in transit and prioritize intervention.',
        action: 'Check for common delay patterns and contact drivers for trips with significant delays.'
      }
    },
    {
      id: 'trucksArrivingToday',
      name: 'Trucks Arriving Today',
      currentValue: '28',
      lastWeekValue: '24',
      lowerIsBetter: false,
      tooltip: {
        definition: 'Number of trucks expected to arrive at the warehouse today.',
        calculation: 'Count of trips with estimated arrival date of today.',
        importance: 'Critical for dock planning and resource allocation at warehouses.'
      }
    }
  ],

  // PTL Tab
  ptl: [
    {
      id: 'ordersGenerated',
      name: 'Orders Generated',
      currentValue: '325',
      lastWeekValue: '310',
      lowerIsBetter: false,
      tooltip: {
        definition: 'Number of PTL orders generated this week.',
        calculation: 'Count of PTL orders created in the current week.',
        importance: 'Indicates the volume of partial load shipments being processed.'
      }
    },
    {
      id: 'ordersAssigned',
      name: 'Orders Assigned to Couriers',
      currentValue: '298',
      lastWeekValue: '285',
      lowerIsBetter: false,
      tooltip: {
        definition: 'Number of PTL orders assigned to courier partners.',
        calculation: 'Count of PTL orders with status "Assigned" in the current week.',
        importance: 'Measures the progress of order assignment and courier engagement.'
      }
    },
    {
      id: 'ordersPickedUp',
      name: 'Orders Picked Up',
      currentValue: '275',
      lastWeekValue: '260',
      lowerIsBetter: false,
      tooltip: {
        definition: 'Number of PTL orders that have been picked up by couriers.',
        calculation: 'Count of PTL orders with status "Picked Up" in the current week.',
        importance: 'Indicates the efficiency of the pickup process and courier reliability.'
      }
    },
    {
      id: 'ordersInTransit',
      name: 'Orders In Transit',
      currentValue: '215',
      lastWeekValue: '205',
      lowerIsBetter: false,
      tooltip: {
        definition: 'Number of PTL orders currently in transit.',
        calculation: 'Count of PTL orders with status "In Transit" as of now.',
        importance: 'Shows the volume of active shipments and helps track operational throughput.'
      }
    },
    {
      id: 'ordersDelivered',
      name: 'Orders Delivered',
      currentValue: '185',
      lastWeekValue: '170',
      lowerIsBetter: false,
      tooltip: {
        definition: 'Number of PTL orders delivered this week.',
        calculation: 'Count of PTL orders with status "Delivered" in the current week.',
        importance: 'Key indicator of fulfillment performance and service level achievement.'
      }
    },
    {
      id: 'delayedDeliveries',
      name: 'Delayed Deliveries',
      currentValue: '32',
      lastWeekValue: '38',
      lowerIsBetter: true,
      tooltip: {
        definition: 'Number of PTL orders that were delivered after the promised delivery date.',
        calculation: 'Count of delivered orders where actual delivery date > promised delivery date.',
        importance: 'Critical indicator of service level compliance and customer satisfaction.',
        action: 'Review delayed deliveries to identify common causes and implement preventive measures.'
      }
    }
  ],

  // Freight Invoicing Tab
  freightInvoicing: [
    {
      id: 'invoicesRaised',
      name: 'Invoices Raised',
      currentValue: '142',
      lastWeekValue: '135',
      lowerIsBetter: false,
      tooltip: {
        definition: 'Number of freight invoices raised in the current week.',
        calculation: 'Count of invoices created with status "Raised" in the current week.',
        importance: 'Indicates the volume of completed shipments being processed for payment.'
      }
    },
    {
      id: 'invoicesApproved',
      name: 'Invoices Approved',
      currentValue: '128',
      lastWeekValue: '120',
      lowerIsBetter: false,
      tooltip: {
        definition: 'Number of freight invoices approved for payment this week.',
        calculation: 'Count of invoices with status changed to "Approved" in the current week.',
        importance: 'Measures the efficiency of the invoice approval process and helps predict cash flow.'
      }
    },
    {
      id: 'invoiceApprovalTime',
      name: 'Invoice Approval Time',
      currentValue: '2.8 days',
      lastWeekValue: '3.2 days',
      lowerIsBetter: true,
      tooltip: {
        definition: 'Average time taken to approve an invoice after it is raised.',
        calculation: 'Sum of (approval timestamp - raised timestamp) / Total number of approved invoices.',
        importance: 'Indicates the efficiency of the invoice approval process and impacts vendor payment timelines.',
        action: 'Review invoices pending approval for more than 3 days and expedite the process.'
      }
    },
    {
      id: 'rejectedInvoices',
      name: 'Rejected Invoices',
      currentValue: '8',
      lastWeekValue: '12',
      lowerIsBetter: true,
      tooltip: {
        definition: 'Number of freight invoices rejected in the current week.',
        calculation: 'Count of invoices with status changed to "Rejected" in the current week.',
        importance: 'Highlights issues in the invoicing process and potential disputes with transporters.',
        action: 'Analyze rejection reasons and provide feedback to transporters to reduce future rejections.'
      }
    },
    {
      id: 'pendingInvoices',
      name: 'Pending Invoices',
      currentValue: null,
      lastWeekValue: '15',
      lowerIsBetter: true,
      tooltip: {
        definition: 'Number of invoices pending approval at the end of the week.',
        calculation: 'Count of invoices with status "Raised" but not yet "Approved" or "Rejected".',
        importance: 'Indicates potential bottlenecks in the approval process and helps in workload planning.'
      }
    }
  ]
};
