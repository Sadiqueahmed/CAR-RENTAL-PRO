import { useState, useEffect } from 'react';

export const useRealTimeData = () => {
  // Start with empty vehicles array - only user-added vehicles will appear
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([
    {
      id: 'BK001',
      customerId: 'CUST001',
      vehicleId: 'VH001',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      totalAmount: 12500,
      status: 'confirmed'
    },
    {
      id: 'BK002',
      customerId: 'CUST002',
      vehicleId: 'VH002',
      startDate: '2024-01-18',
      endDate: '2024-01-25',
      totalAmount: 21000,
      status: 'active'
    }
  ]);
  const [customers, setCustomers] = useState([
    {
      id: 'CUST001',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91-9876543210',
      totalBookings: 5,
      totalSpent: 125000
    },
    {
      id: 'CUST002',
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91-9876543211',
      totalBookings: 3,
      totalSpent: 85000
    }
  ]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Remove automatic vehicle status changes - keep vehicles static
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      
      // Only update bookings and customers, not vehicles
      setBookings(prevBookings => 
        prevBookings.map(booking => {
          if (Math.random() < 0.1) { // 10% chance to update
            const statuses = ['confirmed', 'active', 'completed'];
            const currentIndex = statuses.indexOf(booking.status);
            const nextStatus = statuses[(currentIndex + 1) % statuses.length];
            return { ...booking, status: nextStatus };
          }
          return booking;
        })
      );
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const updateVehicleStatus = (vehicleId, newStatus) => {
    setVehicles(prevVehicles =>
      prevVehicles.map(vehicle =>
        vehicle.id === vehicleId ? { ...vehicle, status: newStatus } : vehicle
      )
    );
  };

  const addVehicle = (newVehicle) => {
    setVehicles(prevVehicles => [...prevVehicles, newVehicle]);
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
  };

  return {
    vehicles,
    bookings,
    customers,
    lastUpdate,
    updateVehicleStatus,
    addVehicle,
    updateBookingStatus
  };
};