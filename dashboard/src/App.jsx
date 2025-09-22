import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import RealTimeCarRentalDashboard from './components/RealTimeCarRentalDashboard';
import FleetManagement from './components/FleetManagement';
import LiveBookingSystem from './components/LiveBookingSystem';
import CustomerManagement from './components/CustomerManagement';
import FinancialReports from './components/FinancialReports';
import VehicleCheckInOut from './components/VehicleCheckInOut';
import ErrorBoundary from './components/shared/ErrorBoundary';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <RealTimeCarRentalDashboard />;
      case 'fleet':
        return <FleetManagement />;
      case 'bookings':
        return <LiveBookingSystem />;
      case 'checkinout':
        return <VehicleCheckInOut />;
      case 'customers':
        return <CustomerManagement />;
      case 'financial':
        return <FinancialReports />;
      default:
        return <RealTimeCarRentalDashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-100 font-sans">
        <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            {renderSection()}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;