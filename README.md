# Summary Page Dashboard

A responsive dashboard prototype for Freight Tiger that displays key performance indicators (KPIs) based on user personas.

## 📊 Overview

This project is a prototype of a Summary Page dashboard that serves as the landing screen for all users of the Freight Tiger platform. The dashboard adapts based on the user's persona (CXO, Company, or Branch level) and provides relevant KPIs with interactive drill-down capabilities.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Summary+Page+Dashboard)

## 🚀 Features

- **Persona-Based Views**: Different dashboard layouts for CXO, Company, and Branch level users
- **Interactive KPI Cards**: Cards display current values, targets, and trends
- **Data Visualization**: Charts and graphs using Chart.js
- **Drill-Down Capability**: Click on KPIs to see more detailed information
- **Responsive Design**: Works on various screen sizes

## 👤 User Personas

### CXO-Level User
- National view across all regions
- KPIs: Revenue & Profit Trends, Order to Delivery (OTD), Freight Cost, Carbon Emissions, etc.
- Drill-down shows Top 5 and Bottom 5 regions, with further drill-down to branches

### Company-Level User
- Regional view for multiple branches
- KPIs: Order Execution Time, Vehicle Utilization, Freight Costs, Transit Time, etc.
- Drill-down shows Top 5 and Bottom 5 branches

### Branch-Level User
- Branch-specific metrics
- KPIs: Status Flow, Real-time Trips, Vehicle Utilization, Transit Time, etc.
- View-only KPIs with no drill-down

## 🛠️ Technologies Used

- **React**: Frontend framework
- **Chart.js**: Data visualization
- **CSS**: Custom styling

## 🏗️ Project Structure

```
src/
├── components/
│   ├── DrillDownPane.jsx    # Slide-out pane for detailed KPI analysis
│   ├── KpiCard.jsx          # Reusable KPI card component
│   ├── SummaryPage.jsx      # Main dashboard page
│   └── Tooltip.jsx          # Tooltip component for KPI information
├── data/
│   └── kpiData.js           # Mock data for KPIs
└── index.js                 # Entry point
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/chetanft/summary_page.git
   cd summary_page
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Usage

1. Use the persona selector in the header to switch between different user views (CXO, Company, Branch)
2. Click on KPI cards to see detailed information (for CXO and Company personas)
3. Explore the different visualizations and metrics available for each persona

## 🔮 Future Enhancements

- Add filtering capabilities by date range
- Implement real-time data updates
- Add user authentication and role-based access
- Enhance mobile responsiveness
- Add export functionality for reports

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- [Chart.js](https://www.chartjs.org/) for data visualization
- [React](https://reactjs.org/) for the UI framework
