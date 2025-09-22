import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';

// Enhanced store with proper state management
export const useCarRentalStore = create(
  subscribeWithSelector(
    immer((set, get) => ({
      // State
      vehicles: [],
      bookings: [],
      customers: [],
      financialData: {
        revenue: { daily: [], monthly: [] },
        expenses: { categories: [] }
      },
      
      // UI State
      loading: {
        vehicles: false,
        bookings: false,
        customers: false,
        financial: false
      },
      
      errors: {
        vehicles: null,
        bookings: null,
        customers: null,
        financial: null
      },
      
      // Real-time state
      isConnected: false,
      lastUpdate: new Date(),
      connectionStatus: 'disconnected', // 'connecting', 'connected', 'disconnected', 'error'
      
      // Filters and UI state
      filters: {
        vehicles: { status: 'all', category: 'all', location: 'all' },
        bookings: { status: 'all', dateRange: null },
        customers: { status: 'all', loyaltyLevel: 'all' }
      },
      
      selectedItems: {
        vehicle: null,
        booking: null,
        customer: null
      },
      
      // Actions
      setLoading: (key, value) => set((state) => {
        state.loading[key] = value;
      }),
      
      setError: (key, error) => set((state) => {
        state.errors[key] = error;
      }),
      
      clearError: (key) => set((state) => {
        state.errors[key] = null;
      }),
      
      // Vehicle actions
      setVehicles: (vehicles) => set((state) => {
        state.vehicles = vehicles;
        state.lastUpdate = new Date();
      }),
      
      addVehicle: (vehicle) => set((state) => {
        const newVehicle = {
          ...vehicle,
          id: vehicle.id || `VH${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        state.vehicles.push(newVehicle);
        state.lastUpdate = new Date();
      }),
      
      updateVehicle: (vehicleId, updates) => set((state) => {
        const index = state.vehicles.findIndex(v => v.id === vehicleId);
        if (index !== -1) {
          state.vehicles[index] = {
            ...state.vehicles[index],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          state.lastUpdate = new Date();
        }
      }),
      
      updateVehicleStatus: (vehicleId, status) => set((state) => {
        const index = state.vehicles.findIndex(v => v.id === vehicleId);
        if (index !== -1) {
          state.vehicles[index].status = status;
          state.vehicles[index].updatedAt = new Date().toISOString();
          state.lastUpdate = new Date();
        }
      }),
      
      removeVehicle: (vehicleId) => set((state) => {
        state.vehicles = state.vehicles.filter(v => v.id !== vehicleId);
        state.lastUpdate = new Date();
      }),
      
      // Booking actions
      setBookings: (bookings) => set((state) => {
        state.bookings = bookings;
        state.lastUpdate = new Date();
      }),
      
      addBooking: (booking) => set((state) => {
        const newBooking = {
          ...booking,
          id: booking.id || `BK${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        state.bookings.push(newBooking);
        state.lastUpdate = new Date();
      }),
      
      updateBooking: (bookingId, updates) => set((state) => {
        const index = state.bookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
          state.bookings[index] = {
            ...state.bookings[index],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          state.lastUpdate = new Date();
        }
      }),
      
      updateBookingStatus: (bookingId, status) => set((state) => {
        const index = state.bookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
          state.bookings[index].status = status;
          state.bookings[index].updatedAt = new Date().toISOString();
          state.lastUpdate = new Date();
        }
      }),
      
      // Customer actions
      setCustomers: (customers) => set((state) => {
        state.customers = customers;
        state.lastUpdate = new Date();
      }),
      
      addCustomer: (customer) => set((state) => {
        const newCustomer = {
          ...customer,
          id: customer.id || `CU${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        state.customers.push(newCustomer);
        state.lastUpdate = new Date();
      }),
      
      updateCustomer: (customerId, updates) => set((state) => {
        const index = state.customers.findIndex(c => c.id === customerId);
        if (index !== -1) {
          state.customers[index] = {
            ...state.customers[index],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          state.lastUpdate = new Date();
        }
      }),
      
      // Financial data actions
      setFinancialData: (data) => set((state) => {
        state.financialData = data;
        state.lastUpdate = new Date();
      }),
      
      addFinancialTransaction: (transaction) => set((state) => {
        // Add to appropriate category based on transaction type
        if (transaction.type === 'revenue') {
          state.financialData.revenue.daily.push(transaction);
        } else if (transaction.type === 'expense') {
          const categoryIndex = state.financialData.expenses.categories.findIndex(
            c => c.name === transaction.category
          );
          if (categoryIndex !== -1) {
            state.financialData.expenses.categories[categoryIndex].amount += transaction.amount;
          }
        }
        state.lastUpdate = new Date();
      }),
      
      // Filter actions
      setVehicleFilter: (filterKey, value) => set((state) => {
        state.filters.vehicles[filterKey] = value;
      }),
      
      setBookingFilter: (filterKey, value) => set((state) => {
        state.filters.bookings[filterKey] = value;
      }),
      
      setCustomerFilter: (filterKey, value) => set((state) => {
        state.filters.customers[filterKey] = value;
      }),
      
      clearAllFilters: () => set((state) => {
        state.filters = {
          vehicles: { status: 'all', category: 'all', location: 'all' },
          bookings: { status: 'all', dateRange: null },
          customers: { status: 'all', loyaltyLevel: 'all' }
        };
      }),
      
      // Selection actions
      setSelectedVehicle: (vehicle) => set((state) => {
        state.selectedItems.vehicle = vehicle;
      }),
      
      setSelectedBooking: (booking) => set((state) => {
        state.selectedItems.booking = booking;
      }),
      
      setSelectedCustomer: (customer) => set((state) => {
        state.selectedItems.customer = customer;
      }),
      
      clearSelections: () => set((state) => {
        state.selectedItems = {
          vehicle: null,
          booking: null,
          customer: null
        };
      }),
      
      // Connection status actions
      setConnectionStatus: (status) => set((state) => {
        // Only update state if the status has actually changed
        if (state.connectionStatus !== status) {
            state.connectionStatus = status;
            state.isConnected = status === 'connected';
        }
        // Always update the timestamp if connected, to show the connection is alive
        if (status === 'connected') {
            state.lastUpdate = new Date();
        }
      }),
      
      // Computed getters
      getFilteredVehicles: () => {
        const { vehicles, filters } = get();
        return vehicles.filter(vehicle => {
          if (filters.vehicles.status !== 'all' && vehicle.status !== filters.vehicles.status) {
            return false;
          }
          if (filters.vehicles.category !== 'all' && vehicle.category !== filters.vehicles.category) {
            return false;
          }
          if (filters.vehicles.location !== 'all' && vehicle.location !== filters.vehicles.location) {
            return false;
          }
          return true;
        });
      },
      
      getFilteredBookings: () => {
        const { bookings, filters } = get();
        return bookings.filter(booking => {
          if (filters.bookings.status !== 'all' && booking.status !== filters.bookings.status) {
            return false;
          }
          // Add date range filtering if needed
          return true;
        });
      },
      
      getFilteredCustomers: () => {
        const { customers, filters } = get();
        return customers.filter(customer => {
          if (filters.customers.status !== 'all' && customer.status !== filters.customers.status) {
            return false;
          }
          if (filters.customers.loyaltyLevel !== 'all' && customer.loyaltyStatus !== filters.customers.loyaltyLevel) {
            return false;
          }
          return true;
        });
      },
      
      // Statistics getters
      getVehicleStats: () => {
        const vehicles = get().vehicles;
        return {
          total: vehicles.length,
          available: vehicles.filter(v => v.status === 'available').length,
          rented: vehicles.filter(v => v.status === 'rented').length,
          maintenance: vehicles.filter(v => v.status === 'maintenance').length,
          utilization: vehicles.length > 0 ? 
            Math.round(((vehicles.filter(v => v.status === 'rented').length) / vehicles.length) * 100) : 0
        };
      },
      
      getBookingStats: () => {
        const bookings = get().bookings;
        return {
          total: bookings.length,
          confirmed: bookings.filter(b => b.status === 'confirmed').length,
          active: bookings.filter(b => b.status === 'active').length,
          completed: bookings.filter(b => b.status === 'completed').length,
          cancelled: bookings.filter(b => b.status === 'cancelled').length
        };
      },
      
      getRevenueStats: () => {
        const { bookings, financialData } = get();
        const totalRevenue = financialData.revenue.monthly.reduce((sum, month) => sum + month.revenue, 0);
        const totalExpenses = financialData.revenue.monthly.reduce((sum, month) => sum + month.expenses, 0);
        const activeBookingRevenue = bookings
          .filter(b => b.status === 'active' || b.status === 'confirmed')
          .reduce((sum, b) => sum + b.totalAmount, 0);
        
        return {
          totalRevenue,
          totalExpenses,
          netProfit: totalRevenue - totalExpenses,
          activeBookingRevenue,
          profitMargin: totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue * 100).toFixed(1) : 0
        };
      }
    }))
  )
);

// Selectors for better performance
export const useVehicles = () => useCarRentalStore(state => state.vehicles);
export const useBookings = () => useCarRentalStore(state => state.bookings);
export const useCustomers = () => useCarRentalStore(state => state.customers);
export const useFilteredVehicles = () => useCarRentalStore(state => state.getFilteredVehicles());
export const useFilteredBookings = () => useCarRentalStore(state => state.getFilteredBookings());
export const useFilteredCustomers = () => useCarRentalStore(state => state.getFilteredCustomers());
export const useVehicleStats = () => useCarRentalStore(state => state.getVehicleStats());
export const useBookingStats = () => useCarRentalStore(state => state.getBookingStats());
export const useRevenueStats = () => useCarRentalStore(state => state.getRevenueStats());
export const useConnectionStatus = () => useCarRentalStore(state => ({
  isConnected: state.isConnected,
  status: state.connectionStatus,
  lastUpdate: state.lastUpdate
}));