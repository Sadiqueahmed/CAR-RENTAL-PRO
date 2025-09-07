import React, { useState } from 'react';
import Navigation from './components/Navigation';
import RealTimeCarRentalDashboard from './components/RealTimeCarRentalDashboard';
import InteractiveFleetManagement from './components/InteractiveFleetManagement';
import LiveBookingSystem from './components/LiveBookingSystem';
import VehicleCheckInOut from './components/VehicleCheckInOut';
import CustomerManagement from './components/CustomerManagement';
import FinancialReports from './components/FinancialReports';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <RealTimeCarRentalDashboard />;
      case 'fleet':
        return <InteractiveFleetManagement />;
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
    <div className="flex min-h-screen bg-gray-50">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {renderActiveSection()}
        </div>
      </main>
    </div>
  );
}

export default App;