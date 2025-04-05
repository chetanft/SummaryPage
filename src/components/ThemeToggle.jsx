import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <FaMoon /> : <FaSun />}
      {showTooltip && (
        <div className="theme-toggle-tooltip">
          Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </div>
      )}
    </button>
  );
};

export default ThemeToggle;
