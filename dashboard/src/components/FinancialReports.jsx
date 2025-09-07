import React from 'react';
import { financialData } from '../data/carRentalData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

const FinancialReports = () => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const totalRevenue = financialData.revenue.monthly.reduce((sum, month) => sum + month.revenue, 0);
  const totalExpenses = financialData.revenue.monthly.reduce((sum, month) => sum + month.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Financial Reports</h1>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Export Report
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Generate Invoice
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">₹{(totalRevenue/10000000).toFixed(1)}Cr</div>
          <div className="text-sm text-gray-600">Total Revenue (YTD)</div>
          <div className="text-xs text-green-600 mt-1">+15.2% vs last year</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">₹{(totalExpenses/10000000).toFixed(1)}Cr</div>
          <div className="text-sm text-gray-600">Total Expenses (YTD)</div>
          <div className="text-xs text-red-600 mt-1">+8.1% vs last year</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">₹{(netProfit/10000000).toFixed(1)}Cr</div>
          <div className="text-sm text-gray-600">Net Profit (YTD)</div>
          <div className="text-xs text-green-600 mt-1">+22.4% vs last year</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{profitMargin}%</div>
          <div className="text-sm text-gray-600">Profit Margin</div>
          <div className="text-xs text-green-600 mt-1">+2.1% vs last year</div>
        </div>
      </div>

      {/* Revenue vs Expenses Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue vs Expenses</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={financialData.revenue.monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`₹${(value/100000).toFixed(1)}L`, '']} />
            <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
            <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Revenue Trend (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={financialData.revenue.daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString('en-IN')}
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="amount" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Expense Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={financialData.expenses.categories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {financialData.expenses.categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Financial Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Monthly Financial Summary</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expenses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Profit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit Margin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {financialData.revenue.monthly.map((month, index) => {
                const profit = month.revenue - month.expenses;
                const margin = ((profit / month.revenue) * 100).toFixed(1);
                const prevMonth = index > 0 ? financialData.revenue.monthly[index - 1] : null;
                const growth = prevMonth ? (((month.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1) : 0;
                
                return (
                  <tr key={month.month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {month.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      ₹{(month.revenue/100000).toFixed(1)}L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      ₹{(month.expenses/100000).toFixed(1)}L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{(profit/100000).toFixed(1)}L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {margin}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {growth >= 0 ? '+' : ''}{growth}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense Categories Detail */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Expense Categories</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {financialData.expenses.categories.map((category, index) => (
              <div key={category.name} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                </div>
                <div className="text-2xl font-bold text-gray-900">₹{(category.amount/1000).toFixed(0)}K</div>
                <div className="text-sm text-gray-600">{category.percentage}% of total expenses</div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${category.percentage}%`, 
                      backgroundColor: COLORS[index % COLORS.length] 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;