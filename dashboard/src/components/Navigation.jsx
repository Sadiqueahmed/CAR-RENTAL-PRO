import React from 'react';

const Navigation = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Real-Time Dashboard', icon: '📊' },
    { id: 'fleet', name: 'Interactive Fleet', icon: '🚗' },
    { id: 'bookings', name: 'Live Bookings', icon: '📅' },
    { id: 'checkinout', name: 'Check-In/Out', icon: '📷' },
    { id: 'customers', name: 'Customer Management', icon: '👥' },
    { id: 'financial', name: 'Financial Reports', icon: '💰' }
  ];

  return (
    <nav className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🚗</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CarRental Pro</h1>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Live Dashboard</span>
            </div>
          </div>
        </div>

        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
                {activeSection === item.id && (
                  <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">System Status</span>
          </div>
          <div className="text-xs text-gray-600">
            <div className="flex justify-between mb-1">
              <span>Real-time Updates:</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Camera Access:</span>
              <span className="text-green-600 font-medium">Ready</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Data Sync:</span>
              <span className="text-green-600 font-medium">Connected</span>
            </div>
            <div className="flex justify-between">
              <span>Last Update:</span>
              <span className="text-gray-500">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;