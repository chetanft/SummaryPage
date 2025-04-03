import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
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
    chartType, 
    chartData,
    tooltipContent,
    tileSize = '1x1' // Default to 1x1 if not specified
  } = kpi;

  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'green';
      case 'warning': return 'orange';
      case 'bad': return 'red';
      default: return 'gray';
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
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: chartData.datasets.length > 1,
          position: 'bottom',
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: chartData.xAxisLabel || '',
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: chartData.yAxisLabel || '',
          },
        },
      },
    };

    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`kpi-card tile-${tileSize}`} 
      onClick={() => onClick(kpi)}
      style={{ borderTop: `4px solid ${getStatusColor()}` }}
    >
      <div className="kpi-header">
        <h3>{name}</h3>
        <Tooltip content={tooltipContent} />
      </div>
      
      <div className="kpi-values">
        <div className="current-value">
          <span>Current</span>
          <strong>{value}</strong>
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
               tileSize === '1x2' ? '250px' : '150px'
      }}>
        {renderChart()}
      </div>
    </div>
  );
};

export default KpiCard;
