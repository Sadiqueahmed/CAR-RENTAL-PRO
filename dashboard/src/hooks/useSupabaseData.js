import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const useSupabaseData = () => {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicleEntries, setVehicleEntries] = useState([]);
  const [checkInOuts, setCheckInOuts] = useState([]);
  const [financialTransactions, setFinancialTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Fetch all data from Supabase
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch vehicles
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (vehiclesError) throw vehiclesError;
      setVehicles(vehiclesData || []);

      // Fetch bookings with customer and vehicle details
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          customers(first_name, last_name, email, phone),
          vehicles(make, model, license_plate)
        `)
        .order('created_at', { ascending: false });
      
      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);

      // Fetch customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (customersError) throw customersError;
      setCustomers(customersData || []);

      // Fetch vehicle entries/exits
      const { data: entriesData, error: entriesError } = await supabase
        .from('vehicle_entries_exits')
        .select(`
          *,
          vehicles(make, model, license_plate)
        `)
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (entriesError) throw entriesError;
      setVehicleEntries(entriesData || []);

      // Fetch check-ins/check-outs
      const { data: checkInOutsData, error: checkInOutsError } = await supabase
        .from('check_ins_check_outs')
        .select(`
          *,
          bookings(booking_id),
          vehicles(make, model, license_plate),
          customers(first_name, last_name)
        `)
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (checkInOutsError) throw checkInOutsError;
      setCheckInOuts(checkInOutsData || []);

      // Fetch financial transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('financial_transactions')
        .select('*')
        .order('transaction_date', { ascending: false })
        .limit(100);
      
      if (transactionsError) throw transactionsError;
      setFinancialTransactions(transactionsData || []);

      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    const vehiclesSubscription = supabase
      .channel('vehicles_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, () => {
        fetchData();
      })
      .subscribe();

    const bookingsSubscription = supabase
      .channel('bookings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchData();
      })
      .subscribe();

    const entriesSubscription = supabase
      .channel('entries_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicle_entries_exits' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      vehiclesSubscription.unsubscribe();
      bookingsSubscription.unsubscribe();
      entriesSubscription.unsubscribe();
    };
  }, []);

  // Add new vehicle
  const addVehicle = async (vehicleData) => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([{
          vehicle_id: vehicleData.id,
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
          license_plate: vehicleData.licensePlate,
          vin: vehicleData.vin,
          fuel_type: vehicleData.fuelType,
          transmission: vehicleData.transmission,
          category: vehicleData.category,
          color: vehicleData.color,
          daily_rate: vehicleData.dailyRate,
          mileage: vehicleData.mileage || 0,
          status: vehicleData.status || 'available',
          location: vehicleData.location
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error('Error adding vehicle:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update vehicle status
  const updateVehicleStatus = async (vehicleId, newStatus) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('vehicle_id', vehicleId);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating vehicle status:', err);
      setError(err.message);
      throw err;
    }
  };

  // Add vehicle entry/exit record
  const addVehicleEntry = async (entryData) => {
    try {
      // First get the vehicle UUID from vehicle_id
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select('id')
        .eq('vehicle_id', entryData.vehicleId)
        .single();

      if (vehicleError) throw vehicleError;

      const { data, error } = await supabase
        .from('vehicle_entries_exits')
        .insert([{
          vehicle_id: vehicleData.id,
          entry_type: entryData.type, // 'entry' or 'exit'
          location: entryData.location,
          mileage_reading: entryData.mileage,
          fuel_level: entryData.fuelLevel,
          condition_notes: entryData.notes,
          staff_member: entryData.staffMember
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error('Error adding vehicle entry:', err);
      setError(err.message);
      throw err;
    }
  };

  // Add check-in/check-out record
  const addCheckInOut = async (checkData) => {
    try {
      // Get UUIDs for foreign keys
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select('id')
        .eq('license_plate', checkData.licensePlate)
        .single();

      if (vehicleError) throw vehicleError;

      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('id, customer_id')
        .eq('booking_id', checkData.bookingId)
        .single();

      if (bookingError) throw bookingError;

      const { data, error } = await supabase
        .from('check_ins_check_outs')
        .insert([{
          booking_id: bookingData.id,
          vehicle_id: vehicleData.id,
          customer_id: bookingData.customer_id,
          transaction_type: checkData.type, // 'check_in' or 'check_out'
          mileage_reading: checkData.mileage,
          fuel_level: checkData.fuelLevel,
          vehicle_condition: checkData.condition,
          damage_notes: checkData.damageNotes,
          additional_charges: checkData.additionalCharges || 0,
          staff_member: checkData.staffMember,
          license_plate_scanned: checkData.licensePlate,
          scan_method: checkData.scanMethod || 'manual'
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error('Error adding check-in/out:', err);
      setError(err.message);
      throw err;
    }
  };

  // Add booking
  const addBooking = async (bookingData) => {
    try {
      // Get customer and vehicle UUIDs
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('customer_id', bookingData.customerId)
        .single();

      if (customerError) throw customerError;

      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select('id')
        .eq('vehicle_id', bookingData.vehicleId)
        .single();

      if (vehicleError) throw vehicleError;

      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          booking_id: bookingData.id,
          customer_id: customerData.id,
          vehicle_id: vehicleData.id,
          start_date: bookingData.startDate,
          end_date: bookingData.endDate,
          pickup_location: bookingData.pickupLocation,
          dropoff_location: bookingData.dropoffLocation,
          total_amount: bookingData.totalAmount,
          status: bookingData.status || 'confirmed',
          payment_status: bookingData.paymentStatus || 'pending',
          notes: bookingData.notes
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error('Error adding booking:', err);
      setError(err.message);
      throw err;
    }
  };

  return {
    vehicles,
    bookings,
    customers,
    vehicleEntries,
    checkInOuts,
    financialTransactions,
    loading,
    error,
    lastUpdate,
    addVehicle,
    updateVehicleStatus,
    addVehicleEntry,
    addCheckInOut,
    addBooking,
    refreshData: fetchData
  };
};