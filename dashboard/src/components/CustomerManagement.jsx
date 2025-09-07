import React, { useState } from 'react';
import { customers, bookings } from '../data/carRentalData';

const CustomerManagement = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCustomerBookings = (customerId) => {
    return bookings.filter(booking => booking.customerId === customerId);
  };

  const getLoyaltyColor = (status) => {
    switch (status) {
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Silver': return 'bg-gray-100 text-gray-800';
      case 'Bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Add New Customer
        </button>
      </div>

      {/* Customer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{customers.length}</div>
          <div className="text-sm text-gray-600">Total Customers</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            {customers.filter(c => c.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Active Customers</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            {customers.filter(c => c.loyaltyStatus === 'Gold').length}
          </div>
          <div className="text-sm text-gray-600">Gold Members</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            ₹{(customers.reduce((sum, c) => sum + c.lifetimeValue, 0)/100000).toFixed(1)}L
          </div>
          <div className="text-sm text-gray-600">Total Lifetime Value</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <input
          type="text"
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedCustomer(customer)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {customer.firstName} {customer.lastName}
                </h3>
                <p className="text-sm text-gray-600">{customer.email}</p>
                <p className="text-sm text-gray-600">{customer.phone}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLoyaltyColor(customer.loyaltyStatus)}`}>
                {customer.loyaltyStatus}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Rentals:</span>
                <span className="font-medium">{customer.totalRentals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lifetime Value:</span>
                <span className="font-medium text-green-600">₹{(customer.lifetimeValue/1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Credit Score:</span>
                <span className="font-medium">{customer.creditScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Rental:</span>
                <span className="font-medium">{customer.lastRental}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Member since: {customer.joinDate}</span>
                <span className={`font-medium ${customer.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                  {customer.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </h2>
                  <p className="text-gray-600">Customer ID: {selectedCustomer.id}</p>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">License Number:</span>
                      <span className="font-medium">{selectedCustomer.licenseNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loyalty Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLoyaltyColor(selectedCustomer.loyaltyStatus)}`}>
                        {selectedCustomer.loyaltyStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Rental History</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Rentals:</span>
                      <span className="font-medium">{selectedCustomer.totalRentals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lifetime Value:</span>
                      <span className="font-medium text-green-600">₹{(selectedCustomer.lifetimeValue/1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credit Score:</span>
                      <span className="font-medium">{selectedCustomer.creditScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Join Date:</span>
                      <span className="font-medium">{selectedCustomer.joinDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Bookings</h3>
                <div className="space-y-2">
                  {getCustomerBookings(selectedCustomer.id).map((booking) => (
                    <div key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{booking.id}</span>
                        <span className="text-gray-600 ml-2">{booking.startDate} - {booking.endDate}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">₹{booking.totalAmount.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{booking.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Edit Customer
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    New Booking
                  </button>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                    Send Message
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

export default CustomerManagement;