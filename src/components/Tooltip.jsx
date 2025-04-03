import React, { useState, useRef, useEffect } from 'react';
import './Tooltip.css';

const Tooltip = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  const containerRef = useRef(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    // Only hide on mouse leave if not clicked
    if (!isVisible) {
      setIsVisible(false);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setIsVisible(!isVisible);
  };

  // Check if content is available
  if (!content || (!content.definition && !content.calculation)) {
    return null;
  }

  return (
    <div className="tooltip-container" ref={containerRef}>
      <span
        className="tooltip-icon"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        aria-label="Show more information"
      >
        ⓘ
      </span>
      {isVisible && (
        <div className="tooltip-content" ref={tooltipRef}>
          {content.definition && (
            <>
              <h4>Definition</h4>
              <p>{content.definition}</p>
            </>
          )}
          {content.calculation && (
            <>
              <h4>Calculation</h4>
              <p>{content.calculation}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Tooltip;