// Comprehensive sample data for car rental business dashboard - Indian Market

// Vehicle fleet data
export const vehicles = [
  {
    id: 'VH001',
    make: 'Maruti Suzuki',
    model: 'Swift Dzire',
    year: 2023,
    vin: '1HGBH41JXMN109186',
    licensePlate: 'MH-12-AB-1234',
    mileage: 15420,
    fuelType: 'Petrol',
    transmission: 'Manual',
    status: 'available',
    location: 'Mumbai Central',
    dailyRate: 2500,
    category: 'Sedan',
    color: 'Silver',
    lastMaintenance: '2024-08-15',
    nextMaintenance: '2024-11-15',
    totalRevenue: 345000,
    utilization: 78
  },
  {
    id: 'VH002',
    make: 'Hyundai',
    model: 'i20',
    year: 2022,
    vin: '2HGFC2F59NH123456',
    licensePlate: 'DL-08-XY-5678',
    mileage: 22100,
    fuelType: 'Petrol',
    transmission: 'Manual',
    status: 'rented',
    location: 'Delhi Airport',
    dailyRate: 1800,
    category: 'Hatchback',
    color: 'Blue',
    lastMaintenance: '2024-07-20',
    nextMaintenance: '2024-10-20',
    totalRevenue: 248000,
    utilization: 85
  },
  {
    id: 'VH003',
    make: 'Mahindra',
    model: 'XUV700',
    year: 2023,
    vin: '1FM5K8D84NGA12345',
    licensePlate: 'KA-05-SUV-9012',
    mileage: 8750,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    status: 'maintenance',
    location: 'Bangalore Central',
    dailyRate: 3500,
    category: 'SUV',
    color: 'Black',
    lastMaintenance: '2024-09-01',
    nextMaintenance: '2024-12-01',
    totalRevenue: 520000,
    utilization: 72
  },
  {
    id: 'VH004',
    make: 'Tata',
    model: 'Nexon EV',
    year: 2024,
    vin: '5YJ3E1EA4NF123456',
    licensePlate: 'TN-09-EV-3456',
    mileage: 5200,
    fuelType: 'Electric',
    transmission: 'Automatic',
    status: 'available',
    location: 'Chennai T Nagar',
    dailyRate: 4000,
    category: 'Electric SUV',
    color: 'White',
    lastMaintenance: '2024-08-30',
    nextMaintenance: '2024-11-30',
    totalRevenue: 612000,
    utilization: 68
  },
  {
    id: 'VH005',
    make: 'Honda',
    model: 'City',
    year: 2022,
    vin: '1G1ZD5ST4NF123456',
    licensePlate: 'GJ-01-CHV-7890',
    mileage: 28900,
    fuelType: 'Petrol',
    transmission: 'CVT',
    status: 'cleaning',
    location: 'Ahmedabad SG Highway',
    dailyRate: 2200,
    category: 'Sedan',
    color: 'Red',
    lastMaintenance: '2024-08-10',
    nextMaintenance: '2024-11-10',
    totalRevenue: 312000,
    utilization: 82
  }
];

// Customer data
export const customers = [
  {
    id: 'CU001',
    firstName: 'Rajesh',
    lastName: 'Sharma',
    email: 'rajesh.sharma@email.com',
    phone: '+91-98765-43210',
    licenseNumber: 'MH1420110012345',
    loyaltyStatus: 'Gold',
    totalRentals: 24,
    lifetimeValue: 248500,
    joinDate: '2023-01-15',
    lastRental: '2024-08-25',
    creditScore: 750,
    status: 'active'
  },
  {
    id: 'CU002',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@email.com',
    phone: '+91-87654-32109',
    licenseNumber: 'GJ0520110098765',
    loyaltyStatus: 'Silver',
    totalRentals: 12,
    lifetimeValue: 116500,
    joinDate: '2023-06-10',
    lastRental: '2024-09-01',
    creditScore: 720,
    status: 'active'
  },
  {
    id: 'CU003',
    firstName: 'Amit',
    lastName: 'Kumar',
    email: 'amit.kumar@email.com',
    phone: '+91-76543-21098',
    licenseNumber: 'DL1320110054321',
    loyaltyStatus: 'Bronze',
    totalRentals: 6,
    lifetimeValue: 51400,
    joinDate: '2024-02-20',
    lastRental: '2024-08-15',
    creditScore: 680,
    status: 'active'
  }
];

// Booking/Reservation data
export const bookings = [
  {
    id: 'BK001',
    customerId: 'CU001',
    vehicleId: 'VH002',
    startDate: '2024-09-01',
    endDate: '2024-09-05',
    status: 'active',
    totalAmount: 9000,
    pickupLocation: 'Delhi Airport',
    dropoffLocation: 'Delhi Airport',
    paymentStatus: 'paid',
    bookingDate: '2024-08-25'
  },
  {
    id: 'BK002',
    customerId: 'CU002',
    vehicleId: 'VH001',
    startDate: '2024-09-10',
    endDate: '2024-09-12',
    status: 'confirmed',
    totalAmount: 5000,
    pickupLocation: 'Mumbai Central',
    dropoffLocation: 'Mumbai Central',
    paymentStatus: 'pending',
    bookingDate: '2024-09-01'
  },
  {
    id: 'BK003',
    customerId: 'CU003',
    vehicleId: 'VH004',
    startDate: '2024-08-15',
    endDate: '2024-08-18',
    status: 'completed',
    totalAmount: 12000,
    pickupLocation: 'Chennai T Nagar',
    dropoffLocation: 'Chennai T Nagar',
    paymentStatus: 'paid',
    bookingDate: '2024-08-10'
  }
];

// Financial data
export const financialData = {
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
};

// Dashboard KPIs
export const dashboardKPIs = [
  {
    title: 'Total Revenue',
    value: '₹41,08,500',
    change: '+12.5%',
    trend: 'up',
    icon: '💰'
  },
  {
    title: 'Active Rentals',
    value: '42',
    change: '+8.2%',
    trend: 'up',
    icon: '🚗'
  },
  {
    title: 'Fleet Utilization',
    value: '78%',
    change: '+3.1%',
    trend: 'up',
    icon: '📊'
  },
  {
    title: 'Customer Satisfaction',
    value: '4.8/5',
    change: '+0.2',
    trend: 'up',
    icon: '⭐'
  }
];

// Fleet utilization data for charts
export const fleetUtilization = [
  { vehicle: 'Hatchback', utilized: 85, available: 15 },
  { vehicle: 'Sedan', utilized: 78, available: 22 },
  { vehicle: 'SUV', utilized: 72, available: 28 },
  { vehicle: 'Electric', utilized: 68, available: 32 },
  { vehicle: 'Luxury', utilized: 75, available: 25 }
];

// Recent activity feed
export const recentActivity = [
  {
    id: 1,
    type: 'booking',
    message: 'New booking confirmed for Tata Nexon EV',
    timestamp: '2024-09-03 10:30 AM',
    customer: 'Priya Patel'
  },
  {
    id: 2,
    type: 'maintenance',
    message: 'Mahindra XUV700 maintenance completed',
    timestamp: '2024-09-03 09:15 AM',
    vehicle: 'KA-05-SUV-9012'
  },
  {
    id: 3,
    type: 'payment',
    message: 'Payment received for booking BK001',
    timestamp: '2024-09-03 08:45 AM',
    amount: '₹9,000'
  },
  {
    id: 4,
    type: 'return',
    message: 'Vehicle returned - Hyundai i20',
    timestamp: '2024-09-02 06:20 PM',
    customer: 'Rajesh Sharma'
  }
];