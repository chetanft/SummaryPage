import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/theme.css';
import SummaryPage from './components/SummaryPage';
import { KpiProvider } from './context/KpiContext';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <KpiProvider>
        <SummaryPage />
        <ThemeToggle />
      </KpiProvider>
    </ThemeProvider>
  </React.StrictMode>
);
