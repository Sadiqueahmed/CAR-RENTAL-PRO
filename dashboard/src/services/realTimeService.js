// Real-time service for WebSocket connections and data synchronization
class RealTimeService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.heartbeatInterval = null;
    this.subscribers = new Map();
    this.isConnecting = false;
  }

  // Initialize connection
  connect(store) {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;
    store.getState().setConnectionStatus('connecting');

    // For demo purposes, we'll simulate WebSocket with EventSource-like behavior
    // In production, replace with actual WebSocket URL
    this.simulateWebSocketConnection(store);
  }

  // Simulate WebSocket connection for demo
  simulateWebSocketConnection(store) {
    // Simulate connection delay
    setTimeout(() => {
      this.isConnecting = false;
      store.getState().setConnectionStatus('connected');
      this.reconnectAttempts = 0;
      
      // Start heartbeat
      this.startHeartbeat(store);
      
      // Start simulated real-time updates
      this.startSimulatedUpdates(store);
      
      console.log('Real-time service connected (simulated)');
    }, 1000);
  }

  // Real WebSocket connection (for production)
  connectWebSocket(store, url = 'ws://localhost:8080/ws') {
    try {
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        store.getState().setConnectionStatus('connected');
        this.reconnectAttempts = 0;
        this.startHeartbeat(store);
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data, store);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        store.getState().setConnectionStatus('disconnected');
        this.stopHeartbeat();
        this.scheduleReconnect(store);
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        store.getState().setConnectionStatus('error');
      };
      
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      store.getState().setConnectionStatus('error');
      this.scheduleReconnect(store);
    }
  }

  // Handle incoming messages
  handleMessage(data, store) {
    const { type, payload } = data;
    
    switch (type) {
      case 'VEHICLE_UPDATE':
        store.getState().updateVehicle(payload.id, payload.data);
        break;
        
      case 'VEHICLE_STATUS_CHANGE':
        store.getState().updateVehicleStatus(payload.id, payload.status);
        break;
        
      case 'NEW_BOOKING':
        store.getState().addBooking(payload);
        break;
        
      case 'BOOKING_UPDATE':
        store.getState().updateBooking(payload.id, payload.data);
        break;
        
      case 'BOOKING_STATUS_CHANGE':
        store.getState().updateBookingStatus(payload.id, payload.status);
        break;
        
      case 'CUSTOMER_UPDATE':
        store.getState().updateCustomer(payload.id, payload.data);
        break;
        
      case 'FINANCIAL_TRANSACTION':
        store.getState().addFinancialTransaction(payload);
        break;
        
      case 'HEARTBEAT':
        // Handle heartbeat response
        break;
        
      default:
        console.warn('Unknown message type:', type);
    }
    
    // Notify subscribers
    this.notifySubscribers(type, payload);
  }

  // Start heartbeat to keep connection alive
  startHeartbeat(store) {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'HEARTBEAT' }));
      } else {
        // For simulated connection, just update timestamp
        store.getState().setConnectionStatus('connected');
      }
    }, 30000); // 30 seconds
  }

  // Stop heartbeat
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Schedule reconnection
  scheduleReconnect(store) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
      
      setTimeout(() => {
        this.reconnectAttempts++;
        console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        this.connect(store);
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      store.getState().setConnectionStatus('error');
    }
  }

  // Simulate real-time updates for demo
  startSimulatedUpdates(store) {
    // Simulate vehicle status changes
    setInterval(() => {
      const vehicles = store.getState().vehicles;
      if (vehicles.length > 0) {
        const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
        const statuses = ['available', 'rented', 'maintenance', 'cleaning'];
        const currentStatusIndex = statuses.indexOf(randomVehicle.status);
        const newStatus = statuses[(currentStatusIndex + 1) % statuses.length];
        
        // Only update occasionally to avoid too much noise
        if (Math.random() < 0.1) { // 10% chance
          store.getState().updateVehicleStatus(randomVehicle.id, newStatus);
          console.log(`Simulated: Vehicle ${randomVehicle.id} status changed to ${newStatus}`);
        }
      }
    }, 5000);

    // Simulate booking status changes
    setInterval(() => {
      const bookings = store.getState().bookings;
      const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'active');
      
      if (activeBookings.length > 0 && Math.random() < 0.15) { // 15% chance
        const randomBooking = activeBookings[Math.floor(Math.random() * activeBookings.length)];
        const nextStatus = randomBooking.status === 'confirmed' ? 'active' : 'completed';
        
        store.getState().updateBookingStatus(randomBooking.id, nextStatus);
        console.log(`Simulated: Booking ${randomBooking.id} status changed to ${nextStatus}`);
      }
    }, 8000);

    // Simulate new bookings occasionally
    setInterval(() => {
      if (Math.random() < 0.05) { // 5% chance
        const vehicles = store.getState().vehicles;
        const availableVehicles = vehicles.filter(v => v.status === 'available');
        
        if (availableVehicles.length > 0) {
          const randomVehicle = availableVehicles[Math.floor(Math.random() * availableVehicles.length)];
          const newBooking = {
            id: `BK${Date.now()}`,
            customerId: `CUST${Math.floor(Math.random() * 1000)}`,
            vehicleId: randomVehicle.id,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            totalAmount: Math.floor(Math.random() * 10000) + 5000,
            status: 'confirmed',
            pickupLocation: 'Auto-generated Location',
            dropoffLocation: 'Auto-generated Location',
            paymentStatus: 'pending'
          };
          
          store.getState().addBooking(newBooking);
          console.log(`Simulated: New booking created ${newBooking.id}`);
        }
      }
    }, 15000);
  }

  // Subscribe to specific events
  subscribe(eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType).add(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(eventType);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  // Notify subscribers
  notifySubscribers(eventType, data) {
    const callbacks = this.subscribers.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    }
  }

  // Send message (for production WebSocket)
  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message:', message);
    }
  }

  // Disconnect
  disconnect() {
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.subscribers.clear();
    console.log('Real-time service disconnected');
  }

  // Get connection status
  getStatus() {
    if (this.ws) {
      switch (this.ws.readyState) {
        case WebSocket.CONNECTING:
          return 'connecting';
        case WebSocket.OPEN:
          return 'connected';
        case WebSocket.CLOSING:
          return 'disconnecting';
        case WebSocket.CLOSED:
          return 'disconnected';
        default:
          return 'unknown';
      }
    }
    return 'disconnected';
  }
}

// Export singleton instance
export const realTimeService = new RealTimeService();

// React hook for using real-time service
export const useRealTimeService = () => {
  return realTimeService;
};