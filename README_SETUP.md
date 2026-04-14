/**
 * SiteSafe Admin Panel
 * 
 * Production-ready, enterprise-grade admin panel for device and camera management
 * 
 * Features:
 * - JWT-based authentication
 * - Responsive design with Tailwind CSS
 * - Comprehensive device management
 * - OTP generation and management
 * - User management with CRUD operations
 * - Real-time statistics and activity tracking
 * 
 * Technology Stack:
 * - React 19
 * - React Router for navigation
 * - Tailwind CSS for styling
 * - Lucide React for icons
 * - Axios for API communication
 * 
 * Project Structure:
 * src/
 *   ├── components/          # Reusable UI components
 *   │   ├── Layout/         # Layout components (Sidebar, Header, etc.)
 *   │   ├── Common/         # Common UI components (Button, Card, etc.)
 *   │   └── Auth/           # Authentication components
 *   ├── pages/              # Page components
 *   │   ├── Login/          # Login page
 *   │   ├── Dashboard/      # Dashboard page
 *   │   ├── DeviceManagement/
 *   │   ├── UninstallOTP/
 *   │   └── UserManagement/
 *   ├── contexts/           # React contexts (Auth, etc.)
 *   ├── services/           # API services
 *   ├── constants/          # Constants (routes, colors, etc.)
 *   ├── utils/              # Utility functions
 *   └── App.js              # Main app component
 */

import React from 'react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
