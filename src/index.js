import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/theme.css';
import SummaryPage from './components/SummaryPage';
import { KpiProvider } from './context/KpiContext';
import { ThemeProvider } from './context/ThemeContext';
// ThemeToggle is now included in the SummaryPage component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <KpiProvider>
        <SummaryPage />
      </KpiProvider>
    </ThemeProvider>
  </React.StrictMode>
);
