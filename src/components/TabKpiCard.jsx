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

  // Determine if value is above or below target
  const isAboveTarget = () => {
    if (!kpi.currentValue || !kpi.target) return false;

    // Extract numeric values
    const valueNumeric = parseFloat(kpi.currentValue.toString().replace(/[^0-9.-]+/g, ''));
    const targetNumeric = parseFloat(kpi.target.toString().replace(/[^0-9.-]+/g, ''));

    if (isNaN(valueNumeric) || isNaN(targetNumeric)) return false;

    // For KPIs where lower is better, the logic is reversed
    if (kpi.lowerIsBetter) {
      return valueNumeric <= targetNumeric;
    }

    return valueNumeric >= targetNumeric;
  };

  const isBelowTarget = () => {
    if (!kpi.currentValue || !kpi.target) return false;

    // Extract numeric values
    const valueNumeric = parseFloat(kpi.currentValue.toString().replace(/[^0-9.-]+/g, ''));
    const targetNumeric = parseFloat(kpi.target.toString().replace(/[^0-9.-]+/g, ''));

    if (isNaN(valueNumeric) || isNaN(targetNumeric)) return false;

    // For KPIs where lower is better, the logic is reversed
    if (kpi.lowerIsBetter) {
      return valueNumeric > targetNumeric;
    }

    return valueNumeric < targetNumeric;
  };

  // Determine the appropriate class based on target comparison
  const getTargetComparisonClass = () => {
    if (isAboveTarget()) return 'above-target';
    if (isBelowTarget()) return 'below-target';
    return '';
  };

  // Determine the appropriate class based on trend direction
  const getTrendDirectionClass = () => {
    if (!calculateTrendPercentage()) return '';
    if (isTrendPositive()) return 'trend-up';
    return 'trend-down';
  };

  return (
    <div className={`tab-kpi-card ${getTargetComparisonClass()} ${getTrendDirectionClass()}`}>
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
            <div className="target-value">
              <span className="target-label">Target:</span>
              <span className="target-value-number">{kpi.target || 'N/A'}</span>
            </div>
            <div className="last-week">
              <span className="last-week-label">Last Week:</span>
              <span className="last-week-value">{kpi.lastWeekValue || 'N/A'}</span>
            </div>
            {calculateTrendPercentage() !== 0 && (
              <div className="trend-indicator">
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
