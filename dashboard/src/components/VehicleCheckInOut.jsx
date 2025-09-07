import React, { useState, useRef, useEffect } from 'react';
import { useRealTimeData } from '../hooks/useRealTimeData';

const VehicleCheckInOut = () => {
  const { vehicles, bookings, updateVehicleStatus, updateBookingStatus, lastUpdate } = useRealTimeData();
  const [activeTab, setActiveTab] = useState('checkin');
  const [scanMode, setScanMode] = useState(false);
  const [manualPlate, setManualPlate] = useState('');
  const [scannedPlate, setScannedPlate] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Indian license plate patterns
  const platePatterns = [
    /^[A-Z]{2}[-\s]?\d{2}[-\s]?[A-Z]{1,2}[-\s]?\d{4}$/i, // Standard format: MH-12-AB-1234
    /^[A-Z]{2}[-\s]?\d{1,2}[-\s]?[A-Z]{1,2}[-\s]?\d{1,4}$/i, // Variations
  ];

  const validatePlate = (plate) => {
    return platePatterns.some(pattern => pattern.test(plate.replace(/\s+/g, '-')));
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setScanMode(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access denied. Please use manual entry or check camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanMode(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      // Simulate OCR processing (in real app, you'd use OCR library like Tesseract.js)
      simulateOCR();
    }
  };

  const simulateOCR = () => {
    // Simulate OCR processing with random Indian license plates
    const samplePlates = [
      'MH-12-AB-1234', 'DL-08-XY-5678', 'KA-03-MN-9012',
      'TN-09-PQ-3456', 'GJ-01-RS-7890', 'RJ-14-UV-2345'
    ];
    
    setTimeout(() => {
      const randomPlate = samplePlates[Math.floor(Math.random() * samplePlates.length)];
      setScannedPlate(randomPlate);
      
      // Show scanning animation
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = `Scanned: ${randomPlate}`;
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
      
      stopCamera();
    }, 2000);
  };

  const findVehicleByPlate = (plate) => {
    return vehicles.find(v => 
      v.licensePlate.toLowerCase().replace(/[-\s]/g, '') === 
      plate.toLowerCase().replace(/[-\s]/g, '')
    );
  };

  const findActiveBooking = (vehicleId) => {
    return bookings.find(b => 
      b.vehicleId === vehicleId && 
      (b.status === 'confirmed' || b.status === 'active')
    );
  };

  const handlePlateSubmit = (plate) => {
    if (!validatePlate(plate)) {
      alert('Invalid license plate format. Please use format: MH-12-AB-1234');
      return;
    }

    const vehicle = findVehicleByPlate(plate);
    if (!vehicle) {
      alert('Vehicle not found in system. Please check the license plate number.');
      return;
    }

    const booking = findActiveBooking(vehicle.id);
    setSelectedVehicle(vehicle);
    setSelectedBooking(booking);
    setShowConfirmation(true);
  };

  const handleCheckIn = () => {
    if (selectedVehicle && selectedBooking) {
      updateVehicleStatus(selectedVehicle.id, 'rented');
      updateBookingStatus(selectedBooking.id, 'active');
      setActionType('checked-in');
      
      // Success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = `Vehicle ${selectedVehicle.licensePlate} checked in successfully!`;
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
      
      resetForm();
    }
  };

  const handleCheckOut = () => {
    if (selectedVehicle && selectedBooking) {
      updateVehicleStatus(selectedVehicle.id, 'cleaning');
      updateBookingStatus(selectedBooking.id, 'completed');
      setActionType('checked-out');
      
      // Success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = `Vehicle ${selectedVehicle.licensePlate} checked out successfully!`;
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
      
      resetForm();
    }
  };

  const resetForm = () => {
    setManualPlate('');
    setScannedPlate('');
    setSelectedVehicle(null);
    setSelectedBooking(null);
    setShowConfirmation(false);
    setActionType('');
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getCustomerName = (customerId) => {
    // This would typically come from your customer data
    return `Customer ${customerId}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Vehicle Check-In/Out</h1>
          <div className="flex items-center space-x-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live scanning • Last: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('checkin')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'checkin'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-2xl mr-2">🚗</span>
            Check-In Vehicle
          </button>
          <button
            onClick={() => setActiveTab('checkout')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'checkout'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-2xl mr-2">🏁</span>
            Check-Out Vehicle
          </button>
        </div>

        <div className="p-6">
          {/* Camera/Manual Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Camera Scanning */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📷 Scan License Plate
              </h3>
              
              {!scanMode ? (
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-32 h-32 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-4xl">📷</span>
                    </div>
                  </div>
                  <button
                    onClick={startCamera}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Camera Scan
                  </button>
                  <p className="text-sm text-gray-600 mt-2">
                    Point camera at license plate to scan
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="relative mb-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-48 bg-black rounded-lg"
                    />
                    <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-16 border-2 border-red-500 bg-red-500 bg-opacity-10 rounded">
                        <span className="absolute -top-6 left-0 text-xs text-red-600 font-medium">
                          Position license plate here
                        </span>
                      </div>
                    </div>
                  </div>
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  <div className="flex space-x-3">
                    <button
                      onClick={captureImage}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      📸 Capture
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {scannedPlate && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">
                      Scanned: {scannedPlate}
                    </span>
                    <button
                      onClick={() => handlePlateSubmit(scannedPlate)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Use This
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Manual Entry */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                ⌨️ Manual Entry
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Plate Number
                  </label>
                  <input
                    type="text"
                    value={manualPlate}
                    onChange={(e) => setManualPlate(e.target.value.toUpperCase())}
                    placeholder="MH-12-AB-1234"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: State-District-Series-Number (e.g., MH-12-AB-1234)
                  </p>
                </div>

                <button
                  onClick={() => handlePlateSubmit(manualPlate)}
                  disabled={!manualPlate.trim()}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {activeTab === 'checkin' ? 'Find Vehicle for Check-In' : 'Find Vehicle for Check-Out'}
                </button>

                {/* Sample plates for demo */}
                <div className="mt-4">
                  <p className="text-xs text-gray-600 mb-2">Quick test (demo plates):</p>
                  <div className="flex flex-wrap gap-2">
                    {['MH-12-AB-1234', 'DL-08-XY-5678', 'KA-03-MN-9012'].map(plate => (
                      <button
                        key={plate}
                        onClick={() => setManualPlate(plate)}
                        className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition-colors"
                      >
                        {plate}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Confirm {activeTab === 'checkin' ? 'Check-In' : 'Check-Out'}
                  </h2>
                  <p className="text-gray-600">Vehicle: {selectedVehicle.licensePlate}</p>
                </div>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Vehicle Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">License Plate:</span>
                      <span className="font-medium">{selectedVehicle.licensePlate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle:</span>
                      <span className="font-medium">{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedVehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                        selectedVehicle.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {selectedVehicle.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{selectedVehicle.location}</span>
                    </div>
                  </div>
                </div>

                {selectedBooking && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Booking Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booking ID:</span>
                        <span className="font-medium">{selectedBooking.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium">{getCustomerName(selectedBooking.customerId)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Period:</span>
                        <span className="font-medium">{selectedBooking.startDate} to {selectedBooking.endDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium text-green-600">₹{selectedBooking.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  {activeTab === 'checkin' ? (
                    <button
                      onClick={handleCheckIn}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      ✅ Confirm Check-In
                    </button>
                  ) : (
                    <button
                      onClick={handleCheckOut}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      🏁 Confirm Check-Out
                    </button>
                  )}
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Check-ins/Outs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {bookings
              .filter(b => b.status === 'active' || b.status === 'completed')
              .slice(0, 5)
              .map((booking) => {
                const vehicle = vehicles.find(v => v.id === booking.vehicleId);
                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        booking.status === 'active' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {vehicle?.licensePlate} - {vehicle?.make} {vehicle?.model}
                        </p>
                        <p className="text-sm text-gray-600">
                          Booking {booking.id} • {getCustomerName(booking.customerId)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {booking.status === 'active' ? 'Checked In' : 'Checked Out'}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCheckInOut;