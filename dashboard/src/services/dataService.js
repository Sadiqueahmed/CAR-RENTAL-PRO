// Data service for API calls and data persistence
class DataService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      return { data: null, error: error.message };
    }
  }

  // Cache management
  getCached(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // Vehicle API methods
  async getVehicles(useCache = true) {
    const cacheKey = 'vehicles';
    
    if (useCache) {
      const cached = this.getCached(cacheKey);
      if (cached) return { data: cached, error: null };
    }

    const result = await this.apiCall('/vehicles');
    
    if (result.data) {
      this.setCache(cacheKey, result.data);
    }
    
    return result;
  }

  async getVehicle(id) {
    return await this.apiCall(`/vehicles/${id}`);
  }

  async createVehicle(vehicleData) {
    const result = await this.apiCall('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData)
    });
    
    if (result.data) {
      this.clearCache('vehicles');
    }
    
    return result;
  }

  async updateVehicle(id, updates) {
    const result = await this.apiCall(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    
    if (result.data) {
      this.clearCache('vehicles');
    }
    
    return result;
  }

  async deleteVehicle(id) {
    const result = await this.apiCall(`/vehicles/${id}`, {
      method: 'DELETE'
    });
    
    if (result.data) {
      this.clearCache('vehicles');
    }
    
    return result;
  }

  // Booking API methods
  async getBookings(useCache = true) {
    const cacheKey = 'bookings';
    
    if (useCache) {
      const cached = this.getCached(cacheKey);
      if (cached) return { data: cached, error: null };
    }

    const result = await this.apiCall('/bookings');
    
    if (result.data) {
      this.setCache(cacheKey, result.data);
    }
    
    return result;
  }

  async getBooking(id) {
    return await this.apiCall(`/bookings/${id}`);
  }

  async createBooking(bookingData) {
    const result = await this.apiCall('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
    
    if (result.data) {
      this.clearCache('bookings');
    }
    
    return result;
  }

  async updateBooking(id, updates) {
    const result = await this.apiCall(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    
    if (result.data) {
      this.clearCache('bookings');
    }
    
    return result;
  }

  async cancelBooking(id) {
    return await this.updateBooking(id, { status: 'cancelled' });
  }

  // Customer API methods
  async getCustomers(useCache = true) {
    const cacheKey = 'customers';
    
    if (useCache) {
      const cached = this.getCached(cacheKey);
      if (cached) return { data: cached, error: null };
    }

    const result = await this.apiCall('/customers');
    
    if (result.data) {
      this.setCache(cacheKey, result.data);
    }
    
    return result;
  }

  async getCustomer(id) {
    return await this.apiCall(`/customers/${id}`);
  }

  async createCustomer(customerData) {
    const result = await this.apiCall('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData)
    });
    
    if (result.data) {
      this.clearCache('customers');
    }
    
    return result;
  }

  async updateCustomer(id, updates) {
    const result = await this.apiCall(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    
    if (result.data) {
      this.clearCache('customers');
    }
    
    return result;
  }

  // Financial data methods
  async getFinancialData(dateRange = null) {
    const cacheKey = `financial_${dateRange ? dateRange.start + '_' + dateRange.end : 'all'}`;
    
    const cached = this.getCached(cacheKey);
    if (cached) return { data: cached, error: null };

    const endpoint = dateRange 
      ? `/financial?start=${dateRange.start}&end=${dateRange.end}`
      : '/financial';
      
    const result = await this.apiCall(endpoint);
    
    if (result.data) {
      this.setCache(cacheKey, result.data);
    }
    
    return result;
  }

  async createTransaction(transactionData) {
    const result = await this.apiCall('/financial/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData)
    });
    
    if (result.data) {
      this.clearCache(); // Clear all financial cache
    }
    
    return result;
  }

  // Analytics methods
  async getAnalytics(type, dateRange = null) {
    const cacheKey = `analytics_${type}_${dateRange ? dateRange.start + '_' + dateRange.end : 'all'}`;
    
    const cached = this.getCached(cacheKey);
    if (cached) return { data: cached, error: null };

    const endpoint = dateRange 
      ? `/analytics/${type}?start=${dateRange.start}&end=${dateRange.end}`
      : `/analytics/${type}`;
      
    const result = await this.apiCall(endpoint);
    
    if (result.data) {
      this.setCache(cacheKey, result.data);
    }
    
    return result;
  }

  // Bulk operations
  async bulkUpdateVehicles(updates) {
    const result = await this.apiCall('/vehicles/bulk', {
      method: 'PUT',
      body: JSON.stringify({ updates })
    });
    
    if (result.data) {
      this.clearCache('vehicles');
    }
    
    return result;
  }

  async bulkUpdateBookings(updates) {
    const result = await this.apiCall('/bookings/bulk', {
      method: 'PUT',
      body: JSON.stringify({ updates })
    });
    
    if (result.data) {
      this.clearCache('bookings');
    }
    
    return result;
  }

  // Search methods
  async searchVehicles(query, filters = {}) {
    const params = new URLSearchParams({
      q: query,
      ...filters
    });
    
    return await this.apiCall(`/vehicles/search?${params}`);
  }

  async searchCustomers(query, filters = {}) {
    const params = new URLSearchParams({
      q: query,
      ...filters
    });
    
    return await this.apiCall(`/customers/search?${params}`);
  }

  async searchBookings(query, filters = {}) {
    const params = new URLSearchParams({
      q: query,
      ...filters
    });
    
    return await this.apiCall(`/bookings/search?${params}`);
  }

  // Export methods
  async exportData(type, format = 'csv', filters = {}) {
    const params = new URLSearchParams({
      format,
      ...filters
    });
    
    const response = await fetch(`${this.baseURL}/export/${type}?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.status}`);
    }
    
    return response.blob();
  }

  // Authentication methods (placeholder)
  getAuthToken() {
    return localStorage.getItem('auth_token');
  }

  setAuthToken(token) {
    localStorage.setItem('auth_token', token);
  }

  clearAuthToken() {
    localStorage.removeItem('auth_token');
  }

  // Health check
  async healthCheck() {
    return await this.apiCall('/health');
  }
}

// Export singleton instance
export const dataService = new DataService();

// React hooks for data operations
export const useDataService = () => {
  return dataService;
};