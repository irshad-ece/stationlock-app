// Preset lockers and initial state for StationLock Bus Station Luggage Storage

const now = Date.now();

export const INITIAL_LOCKERS = [
  {
    id: 'A101',
    label: 'Box A-101',
    terminal: 'Terminal 1 - Main Concourse',
    size: 'Small',
    dimensions: '35 x 45 x 50 cm (Handbag / Laptop bag)',
    hourlyRate: 2.00,
    status: 'available', // available | occupied | maintenance
    activeSession: null,
  },
  {
    id: 'A102',
    label: 'Box A-102',
    terminal: 'Terminal 1 - Main Concourse',
    size: 'Medium',
    dimensions: '45 x 60 x 70 cm (Backpack / Duffle)',
    hourlyRate: 3.50,
    status: 'available',
    activeSession: null,
  },
  {
    id: 'A103',
    label: 'Box A-103',
    terminal: 'Terminal 1 - Main Concourse',
    size: 'Large',
    dimensions: '60 x 85 x 90 cm (Large Suitcase / Multi-bag)',
    hourlyRate: 5.00,
    status: 'available',
    activeSession: null,
  },
  {
    id: 'A104',
    label: 'Box A-104',
    terminal: 'Terminal 1 - Main Concourse',
    size: 'Medium',
    dimensions: '45 x 60 x 70 cm (Backpack / Duffle)',
    hourlyRate: 3.50,
    status: 'occupied',
    activeSession: {
      sessionCode: 'STATIONLOCK-PASS-A104',
      passengerName: 'Sarah Jenkins',
      passengerPhone: '+1 (555) 014-9921',
      busNumber: 'Express Bus #402 (Seattle Terminal)',
      scheduledBusTime: '22:30',
      startTime: now - 50 * 60 * 1000, // started 50 mins ago
      endTime: now + 70 * 60 * 1000,   // 1h 10m remaining
      originalDurationHours: 2,
      extendedHours: 0,
      pin: '5924',
      initialPaymentAmount: 7.00,
      totalPaid: 7.00,
      paymentMethod: 'GPay / UPI Instant',
      history: [
        {
          id: 1,
          type: 'CHECKIN',
          timestamp: new Date(now - 50 * 60 * 1000).toISOString(),
          title: 'Storage Initialized',
          detail: 'Reserved Box A-104 for 2 hrs @ $3.50/hr ($7.00 paid)'
        }
      ]
    }
  },
  {
    id: 'A105',
    label: 'Box A-105',
    terminal: 'Terminal 1 - Main Concourse',
    size: 'Small',
    dimensions: '35 x 45 x 50 cm (Handbag / Laptop bag)',
    hourlyRate: 2.00,
    status: 'available',
    activeSession: null,
  },
  {
    id: 'A106',
    label: 'Box A-106',
    terminal: 'Terminal 1 - Main Concourse',
    size: 'Large',
    dimensions: '60 x 85 x 90 cm (Large Suitcase / Multi-bag)',
    hourlyRate: 5.00,
    status: 'available',
    activeSession: null,
  },
  {
    id: 'B201',
    label: 'Box B-201',
    terminal: 'Terminal 2 - Express Platform',
    size: 'Medium',
    dimensions: '45 x 60 x 70 cm (Backpack / Duffle)',
    hourlyRate: 3.50,
    status: 'available',
    activeSession: null,
  },
  {
    id: 'B202',
    label: 'Box B-202',
    terminal: 'Terminal 2 - Express Platform',
    size: 'Small',
    dimensions: '35 x 45 x 50 cm (Handbag / Laptop bag)',
    hourlyRate: 2.00,
    status: 'available',
    activeSession: null,
  },
  {
    id: 'B203',
    label: 'Box B-203',
    terminal: 'Terminal 2 - Express Platform',
    size: 'Large',
    dimensions: '60 x 85 x 90 cm (Large Suitcase / Multi-bag)',
    hourlyRate: 5.00,
    status: 'available',
    activeSession: null,
  },
  {
    id: 'B204',
    label: 'Box B-204',
    terminal: 'Terminal 2 - Express Platform',
    size: 'Medium',
    dimensions: '45 x 60 x 70 cm (Backpack / Duffle)',
    hourlyRate: 3.50,
    status: 'available',
    activeSession: null,
  },
  {
    id: 'B205',
    label: 'Box B-205',
    terminal: 'Terminal 2 - Express Platform',
    size: 'Small',
    dimensions: '35 x 45 x 50 cm (Handbag / Laptop bag)',
    hourlyRate: 2.00,
    status: 'available',
    activeSession: null,
  },
  {
    id: 'B206',
    label: 'Box B-206',
    terminal: 'Terminal 2 - Express Platform',
    size: 'Large',
    dimensions: '60 x 85 x 90 cm (Large Suitcase / Multi-bag)',
    hourlyRate: 5.00,
    status: 'maintenance',
    activeSession: null,
  }
];
