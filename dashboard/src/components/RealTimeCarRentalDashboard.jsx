import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useRealTimeData } from '../hooks/useRealTimeData';

const RealTimeCarRentalDashboard = () => {
  const { vehicles, bookings, customers, lastUpdate } = useRealTimeData();
  
  // Mock financial data since it's not in the hook
  const [financialData] = useState({
    revenue: {
      daily: [
        { date: '2024-08-01', amount: 68000 },
        { date: '2024-08-02', amount: 88800 },
        { date: '2024-08-03', amount: 52500 },
        { date: '2024-08-04', amount: 113800 },
        { date: '2024-08-05', amount: 101400 },
        { date: '2024-08-06', amount: 82720 },
        { date: '2024-08-07', amount: 94960 }
      ],
      monthly: [
        { month: 'Jan', revenue: 2360000, expenses: 1250000 },
        { month: 'Feb', revenue: 2556000, expenses: 1332000 },
        { month: 'Mar', revenue: 2915000, expenses: 1444000 },
        { month: 'Apr', revenue: 3276000, expenses: 1527000 },
        { month: 'May', revenue: 3745000, expenses: 1610000 },
        { month: 'Jun', revenue: 3942000, expenses: 1665000 },
        { month: 'Jul', revenue: 4328000, expenses: 1722000 },
        { month: 'Aug', revenue: 4108000, expenses: 1638000 }
      ]
    },
    expenses: {
      categories: [
        { name: 'Maintenance', amount: 416500, percentage: 25 },
        { name: 'Fuel', amount: 333200, percentage: 20 },
        { name: 'Insurance', amount: 499800, percentage: 30 },
        { name: 'Staff', amount: 277650, percentage: 17 },
        { name: 'Other', amount: 138825, percentage: 8 }
      ]
    }
  });

  // Calculate KPIs from current data
  const totalRevenue = financialData.revenue.monthly.reduce((sum, month) => sum + month.revenue, 0);
  const activeRentals = bookings.filter(booking => booking.status === 'active').length;
  const totalVehicles = vehicles.length || 5; // Default to 5 if no vehicles added yet
  const availableVehicles = vehicles.filter(v => v.status === 'available').length;
  const fleetUtilization = totalVehicles > 0 ? Math.round(((totalVehicles - availableVehicles) / totalVehicles) * 100) : 78;

  const [kpis, setKpis] = useState([
    {
      title: 'Total Revenue',
      value: `₹${(totalRevenue / 100000).toFixed(1)}L`,
      change: '+12.5%',
      trend: 'up',
      icon: '💰',
      color: 'text-green-600'
    },
    {
      title: 'Active Rentals',
      value: activeRentals.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: '🚗',
      color: 'text-blue-600'
    },
    {
      title: 'Fleet Utilization',
      value: `${fleetUtilization}%`,
      change: '+3.1%',
      trend: 'up',
      icon: '📊',
      color: 'text-purple-600'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      trend: 'up',
      icon: '⭐',
      color: 'text-yellow-600'
    }
  ]);

  // Update KPIs when data changes
  useEffect(() => {
    const activeRentalsCount = bookings.filter(booking => booking.status === 'active').length;
    const totalVehiclesCount = vehicles.length || 5;
    const availableVehiclesCount = vehicles.filter(v => v.status === 'available').length;
    const utilization = totalVehiclesCount > 0 ? Math.round(((totalVehiclesCount - availableVehiclesCount) / totalVehiclesCount) * 100) : 78;

    setKpis(prev => [
      { ...prev[0], value: `₹${(totalRevenue / 100000).toFixed(1)}L` },
      { ...prev[1], value: activeRentalsCount.toString() },
      { ...prev[2], value: `${utilization}%` },
      { ...prev[3] }
    ]);
  }, [vehicles, bookings, totalRevenue]);

  const fleetUtilizationData = [
    { vehicle: 'Hatchback', utilized: 85, available: 15 },
    { vehicle: 'Sedan', utilized: 78, available: 22 },
    { vehicle: 'SUV', utilized: 72, available: 28 },
    { vehicle: 'Electric', utilized: 68, available: 32 },
    { vehicle: 'Luxury', utilized: 75, available: 25 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Real-Time Car Rental Dashboard</h1>
            <p className="text-gray-600 mt-1">Live insights and analytics for your fleet</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                <div className={`flex items-center mt-2 ${kpi.color}`}>
                  <span className="text-sm font-medium">{kpi.change}</span>
                  {kpi.trend === 'up' ? (
                    <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="text-3xl">{kpi.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={financialData.revenue.daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Fleet Utilization Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Utilization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fleetUtilizationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vehicle" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="utilized" stackId="a" fill="#8884d8" name="Utilized %" />
              <Bar dataKey="available" stackId="a" fill="#82ca9d" name="Available %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Revenue vs Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={financialData.revenue.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} />
              <Tooltip formatter={(value) => [`₹${(value/100000).toFixed(2)}L`, '']} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} name="Revenue" />
              <Line type="monotone" dataKey="expenses" stroke="#82ca9d" strokeWidth={3} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Categories */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={financialData.expenses.categories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {financialData.expenses.categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Activity Feed</h3>
        <div className="space-y-4">
          {bookings.slice(0, 5).map((booking, index) => (
            <div key={booking.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Booking {booking.id} - Status: {booking.status}
                </p>
                <p className="text-xs text-gray-500">
                  Amount: ₹{booking.totalAmount.toLocaleString()} | {booking.startDate} to {booking.endDate}
                </p>
              </div>
              <div className="text-xs text-gray-400">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTimeCarRentalDashboard;