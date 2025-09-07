import React, { useState } from 'react';
import { vehicles } from '../data/carRentalData';

const FleetManagement = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredVehicles = statusFilter === 'all' 
    ? vehicles 
    : vehicles.filter(vehicle => vehicle.status === statusFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'cleaning': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statusCounts = {
    all: vehicles.length,
    available: vehicles.filter(v => v.status === 'available').length,
    rented: vehicles.filter(v => v.status === 'rented').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
    cleaning: vehicles.filter(v => v.status === 'cleaning').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Fleet Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Add New Vehicle
        </button>
      </div>

      {/* Fleet Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              statusFilter === status ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-gray-900">{count}</div>
            <div className="text-sm text-gray-600 capitalize">
              {status === 'all' ? 'Total Vehicles' : status.replace('_', ' ')}
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedVehicle(vehicle)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-sm text-gray-600">{vehicle.licensePlate}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                {vehicle.status.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{vehicle.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mileage:</span>
                <span className="font-medium">{vehicle.mileage.toLocaleString()} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Rate:</span>
                <span className="font-medium text-green-600">₹{vehicle.dailyRate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Utilization:</span>
                <span className="font-medium">{vehicle.utilization}%</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Next Service: {vehicle.nextMaintenance}</span>
                <span>Revenue: ₹{(vehicle.totalRevenue/100000).toFixed(1)}L</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                  </h2>
                  <p className="text-gray-600">Vehicle ID: {selectedVehicle.id}</p>
                </div>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Vehicle Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">VIN:</span>
                      <span className="font-medium">{selectedVehicle.vin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">License Plate:</span>
                      <span className="font-medium">{selectedVehicle.licensePlate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Color:</span>
                      <span className="font-medium">{selectedVehicle.color}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fuel Type:</span>
                      <span className="font-medium">{selectedVehicle.fuelType}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Performance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Utilization:</span>
                      <span className="font-medium">{selectedVehicle.utilization}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Revenue:</span>
                      <span className="font-medium text-green-600">₹{(selectedVehicle.totalRevenue/100000).toFixed(1)}L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Maintenance:</span>
                      <span className="font-medium">{selectedVehicle.lastMaintenance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Maintenance:</span>
                      <span className="font-medium">{selectedVehicle.nextMaintenance}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Edit Vehicle
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Schedule Maintenance
                  </button>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                    View History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetManagement;