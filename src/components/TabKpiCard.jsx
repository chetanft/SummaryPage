import React, { useState } from 'react';
import './TabKpiCard.css';
import { FaArrowUp, FaArrowDown, FaInfoCircle } from 'react-icons/fa';

const TabKpiCard = ({ kpi }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Calculate trend percentage
  const calculateTrendPercentage = () => {
    if (!kpi.lastWeekValue || !kpi.currentValue) return 0;

    // Extract numeric values
    const currentNumeric = parseFloat(kpi.currentValue.toString().replace(/[^0-9.-]+/g, ''));
    const lastWeekNumeric = parseFloat(kpi.lastWeekValue.toString().replace(/[^0-9.-]+/g, ''));

    if (isNaN(currentNumeric) || isNaN(lastWeekNumeric) || lastWeekNumeric === 0) return 0;

    return ((currentNumeric - lastWeekNumeric) / lastWeekNumeric) * 100;
  };

  // Determine if trend is positive based on the KPI type
  const isTrendPositive = () => {
    const trendPercentage = calculateTrendPercentage();

    // For KPIs where lower is better (e.g., delays, not planned, etc.)
    if (kpi.lowerIsBetter) {
      return trendPercentage < 0;
    }

    // For regular KPIs where higher is better
    return trendPercentage > 0;
  };

  // Get trend color
  const getTrendColor = () => {
    if (calculateTrendPercentage() === 0) return '#003c9b'; // Neutral - Freight Tiger Blue
    return isTrendPositive() ? '#04bc15' : '#ff4d4f'; // Green for positive, Red for negative
  };

  // Format trend percentage
  const formatTrendPercentage = () => {
    const percentage = calculateTrendPercentage();
    const absPercentage = Math.abs(percentage).toFixed(1);
    return `${absPercentage}%`;
  };

  return (
    <div className="tab-kpi-card">
      <div className="tab-kpi-header">
        <h3>{kpi.name}</h3>
        <div
          className="info-icon"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <FaInfoCircle />
          {showTooltip && (
            <div className="tooltip">
              <div className="tooltip-title">Definition</div>
              <p>{kpi.tooltip.definition}</p>
              <div className="tooltip-title">Calculation</div>
              <p>{kpi.tooltip.calculation}</p>
              <div className="tooltip-title">Importance</div>
              <p>{kpi.tooltip.importance}</p>
              {kpi.tooltip.action && (
                <>
                  <div className="tooltip-title tooltip-action">Suggested Action</div>
                  <p className="action-text">{kpi.tooltip.action}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="tab-kpi-content">
        {kpi.currentValue ? (
          <>
            <div className="current-value">{kpi.currentValue}</div>
            <div className="last-week">
              <span className="last-week-label">Last Week:</span>
              <span className="last-week-value">{kpi.lastWeekValue || 'N/A'}</span>
            </div>
            {calculateTrendPercentage() !== 0 && (
              <div className="trend-indicator" style={{ color: getTrendColor() }}>
                {isTrendPositive() ? <FaArrowUp /> : <FaArrowDown />}
                <span className="trend-percentage">{formatTrendPercentage()}</span>
              </div>
            )}
          </>
        ) : (
          <div className="no-data-message">Data not yet available this week</div>
        )}
      </div>
    </div>
  );
};

export default TabKpiCard;
