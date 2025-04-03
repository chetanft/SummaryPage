import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SummaryPage from './components/SummaryPage';
import { KpiProvider } from './context/KpiContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <KpiProvider>
      <SummaryPage />
    </KpiProvider>
  </React.StrictMode>
);
