import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/theme.css';
import SummaryPage from './components/SummaryPage';
import { KpiProvider } from './context/KpiContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <DataProvider>
        <KpiProvider>
          <SummaryPage />
        </KpiProvider>
      </DataProvider>
    </ThemeProvider>
  </React.StrictMode>
);
