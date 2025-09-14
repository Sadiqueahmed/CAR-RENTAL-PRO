import { useEffect } from 'react';
import { useCarRentalStore } from '../store/useCarRentalStore';
import { realTimeService } from '../services/realTimeService';
import { dataService } from '../services/dataService';

// Enhanced hook with proper state management and real-time capabilities
export const useRealTimeData = () => {
  const store = useCarRentalStore();
  
  // Initialize data and real-time connection
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Set loading states
        store.setLoading('vehicles', true);
        store.setLoading('bookings', true);
        store.setLoading('customers', true);
        store.setLoading('financial', true);
        
        // Load initial data (with fallback to sample data if API fails)
        const [vehiclesResult, bookingsResult, customersResult, financialResult] = await Promise.allSettled([
          dataService.getVehicles(),
          dataService.getBookings(),
          dataService.getCustomers(),
          dataService.getFinancialData()
        ]);
        
        // Handle vehicles
        if (vehiclesResult.status === 'fulfilled' && vehiclesResult.value.data) {
          store.setVehicles(vehiclesResult.value.data);
        } else {
          // Fallback to sample data
          store.setVehicles([]);
          store.setError('vehicles', 'Failed to load vehicles from server, using local data');
        }
        
        // Handle bookings
        if (bookingsResult.status === 'fulfilled' && bookingsResult.value.data) {
          store.setBookings(bookingsResult.value.data);
        } else {
          // Fallback to sample data
          store.setBookings([
            {
              id: 'BK001',
              customerId: 'CUST001',
              vehicleId: 'VH001',
              startDate: '2024-01-15',
              endDate: '2024-01-20',
              totalAmount: 12500,
              status: 'confirmed',
              pickupLocation: 'Mumbai Central',
              dropoffLocation: 'Mumbai Central',
              paymentStatus: 'pending'
            },
            {
              id: 'BK002',
              customerId: 'CUST002',
              vehicleId: 'VH002',
              startDate: '2024-01-18',
              endDate: '2024-01-25',
              totalAmount: 21000,
              status: 'active',
              pickupLocation: 'Delhi Airport',
              dropoffLocation: 'Delhi Airport',
              paymentStatus: 'paid'
            }
          ]);
          store.setError('bookings', 'Failed to load bookings from server, using local data');
        }
        
        // Handle customers
        if (customersResult.status === 'fulfilled' && customersResult.value.data) {
          store.setCustomers(customersResult.value.data);
        } else {
          // Fallback to sample data
          store.setCustomers([
            {
              id: 'CUST001',
              firstName: 'Rajesh',
              lastName: 'Kumar',
              email: 'rajesh.kumar@email.com',
              phone: '+91-9876543210',
              totalBookings: 5,
              totalSpent: 125000,
              status: 'active',
              loyaltyStatus: 'Gold'
            },
            {
              id: 'CUST002',
              firstName: 'Priya',
              lastName: 'Sharma',
              email: 'priya.sharma@email.com',
              phone: '+91-9876543211',
              totalBookings: 3,
              totalSpent: 85000,
              status: 'active',
              loyaltyStatus: 'Silver'
            }
          ]);
          store.setError('customers', 'Failed to load customers from server, using local data');
        }
        
        // Handle financial data
        if (financialResult.status === 'fulfilled' && financialResult.value.data) {
          store.setFinancialData(financialResult.value.data);
        } else {
          // Fallback to sample data
          store.setFinancialData({
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
          store.setError('financial', 'Failed to load financial data from server, using local data');
        }
        
      } catch (error) {
        console.error('Error initializing data:', error);
        store.setError('vehicles', 'Failed to initialize data');
        store.setError('bookings', 'Failed to initialize data');
        store.setError('customers', 'Failed to initialize data');
        store.setError('financial', 'Failed to initialize data');
      } finally {
        // Clear loading states
        store.setLoading('vehicles', false);
        store.setLoading('bookings', false);
        store.setLoading('customers', false);
        store.setLoading('financial', false);
      }
    };
    
    // Initialize data
    initializeData();
    
    // Connect to real-time service
    realTimeService.connect(useCarRentalStore);
    
    // Cleanup on unmount
    return () => {
      realTimeService.disconnect();
    };
  }, []);

  // Return store state and actions
  return store;
};