import React, { useState } from 'react';
import { useRealTimeData } from '../hooks/useRealTimeData';

const LiveBookingSystem = () => {
  const { bookings, customers, vehicles, addBooking, updateBookingStatus, lastUpdate } = useRealTimeData();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [newBookingForm, setNewBookingForm] = useState({
    customerId: '',
    vehicleId: '',
    startDate: '',
    endDate: '',
    pickupLocation: '',
    dropoffLocation: '',
    totalAmount: 0
  });

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer';
  };

  const getVehicleInfo = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle';
  };

  const handleStatusUpdate = (bookingId, newStatus) => {
    updateBookingStatus(bookingId, newStatus);
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = `Booking ${newStatus} successfully!`;
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  };

  const handleNewBooking = (e) => {
    e.preventDefault();
    const vehicle = vehicles.find(v => v.id === newBookingForm.vehicleId);
    const startDate = new Date(newBookingForm.startDate);
    const endDate = new Date(newBookingForm.endDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    const booking = {
      ...newBookingForm,
      totalAmount: vehicle ? vehicle.dailyRate * days : 0,
      paymentStatus: 'pending'
    };
    
    addBooking(booking);
    setShowNewBooking(false);
    setNewBookingForm({
      customerId: '',
      vehicleId: '',
      startDate: '',
      endDate: '',
      pickupLocation: '',
      dropoffLocation: '',
      totalAmount: 0
    });
  };

  const statusCounts = {
    all: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    active: bookings.filter(b => b.status === 'active').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Live Booking System</h1>
          <div className="flex items-center space-x-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Real-time updates • Last: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
        <button 
          onClick={() => setShowNewBooking(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105"
        >
          + New Booking
        </button>
      </div>

      {/* Live Booking Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              statusFilter === status 
                ? 'border-blue-500 bg-blue-50 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className="text-2xl font-bold text-gray-900 transition-all duration-500">{count}</div>
            <div className="text-sm text-gray-600 capitalize">
              {status === 'all' ? 'Total Bookings' : status}
            </div>
          </div>
        ))}
      </div>

      {/* Live Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Live Bookings</h2>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getCustomerName(booking.customerId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getVehicleInfo(booking.vehicleId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.startDate} to {booking.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ₹{booking.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'active')}
                          className="text-green-600 hover:text-green-900 transition-colors"
                        >
                          Start
                        </button>
                      )}
                      {booking.status === 'active' && (
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'completed')}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        View
                      </button>
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Booking Modal */}
      {showNewBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Booking</h2>
                <button
                  onClick={() => setShowNewBooking(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleNewBooking} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                    <select
                      value={newBookingForm.customerId}
                      onChange={(e) => setNewBookingForm({...newBookingForm, customerId: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Customer</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.firstName} {customer.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle</label>
                    <select
                      value={newBookingForm.vehicleId}
                      onChange={(e) => setNewBookingForm({...newBookingForm, vehicleId: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Vehicle</option>
                      {vehicles.filter(v => v.status === 'available').map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.year} {vehicle.make} {vehicle.model} - ₹{vehicle.dailyRate}/day
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={newBookingForm.startDate}
                      onChange={(e) => setNewBookingForm({...newBookingForm, startDate: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={newBookingForm.endDate}
                      onChange={(e) => setNewBookingForm({...newBookingForm, endDate: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                    <input
                      type="text"
                      value={newBookingForm.pickupLocation}
                      onChange={(e) => setNewBookingForm({...newBookingForm, pickupLocation: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter pickup location"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Drop-off Location</label>
                    <input
                      type="text"
                      value={newBookingForm.dropoffLocation}
                      onChange={(e) => setNewBookingForm({...newBookingForm, dropoffLocation: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter drop-off location"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewBooking(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                  <p className="text-gray-600">Booking ID: {selectedBooking.id}</p>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Booking Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium">{getCustomerName(selectedBooking.customerId)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle:</span>
                      <span className="font-medium">{getVehicleInfo(selectedBooking.vehicleId)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{selectedBooking.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium">{selectedBooking.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                        {selectedBooking.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment & Location</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium text-green-600">₹{selectedBooking.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`font-medium ${selectedBooking.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                        {selectedBooking.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pickup Location:</span>
                      <span className="font-medium">{selectedBooking.pickupLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Drop-off Location:</span>
                      <span className="font-medium">{selectedBooking.dropoffLocation}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  {selectedBooking.status === 'confirmed' && (
                    <button 
                      onClick={() => {
                        handleStatusUpdate(selectedBooking.id, 'active');
                        setSelectedBooking({...selectedBooking, status: 'active'});
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Start Rental
                    </button>
                  )}
                  {selectedBooking.status === 'active' && (
                    <button 
                      onClick={() => {
                        handleStatusUpdate(selectedBooking.id, 'completed');
                        setSelectedBooking({...selectedBooking, status: 'completed'});
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Complete Rental
                    </button>
                  )}
                  {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                    <button 
                      onClick={() => {
                        handleStatusUpdate(selectedBooking.id, 'cancelled');
                        setSelectedBooking({...selectedBooking, status: 'cancelled'});
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveBookingSystem;