import { useState, useEffect } from 'react';
import { vehicles as initialVehicles, bookings as initialBookings, customers as initialCustomers } from '../data/carRentalData';

export const useRealTimeData = () => {
  // Use the initial data from carRentalData.js
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [bookings, setBookings] = useState(initialBookings);
  const [customers, setCustomers] = useState(initialCustomers);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Keep the real-time update logic for bookings
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      
      setBookings(prevBookings => 
        prevBookings.map(booking => {
          if (Math.random() < 0.1) {
            const statuses = ['confirmed', 'active', 'completed'];
            const currentIndex = statuses.indexOf(booking.status);
            const nextStatus = statuses[(currentIndex + 1) % statuses.length];
            return { ...booking, status: nextStatus };
          }
          return booking;
        })
      );
    }, 8000);

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