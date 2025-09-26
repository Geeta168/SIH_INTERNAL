export const auctions = [
  {
    id: '1',
    title: 'Fresh Wheat (500kg)',
    category: 'Grains',
    location: 'Punjab',
    minBid: 12000,
    currentBid: 13500,
    image: '/p1.jpg',
    endsAt: '2025-12-31',
    description: 'High-quality wheat, recently harvested, moisture checked.',
    seller: 'FarmerRaj_Punjab',
    bids: [
      { bidder: 'BuyerA', amount: 12000, time: '2h ago' },
      { bidder: 'BuyerB', amount: 12500, time: '1h ago' },
      { bidder: 'BuyerC', amount: 13500, time: '30m ago' }
    ],
    specifications: {
      'Quality Grade': 'A+',
      'Moisture Content': '12%',
      'Protein Content': '11.5%',
      'Origin': 'Punjab, India',
      'Harvest Date': 'November 2024'
    }
  },
  {
    id: '2',
    title: 'Organic Tomatoes (200kg)',
    category: 'Vegetables',
    location: 'Maharashtra',
    minBid: 8000,
    currentBid: 9200,
    image: '/watering.jpg',
    endsAt: '2025-11-15',
    description: 'Organic, pesticide-free tomatoes from local farm.',
    seller: 'OrganicFarm_MH',
    bids: [
      { bidder: 'RestaurantOwner', amount: 8000, time: '3h ago' },
      { bidder: 'LocalTrader', amount: 8500, time: '2h ago' },
      { bidder: 'SuperMarket', amount: 9200, time: '45m ago' }
    ],
    specifications: {
      'Variety': 'Roma Tomatoes',
      'Organic Certified': 'Yes',
      'Ripeness': '85% Red',
      'Size': 'Medium to Large',
      'Shelf Life': '5-7 days'
    }
  },
  {
    id: '3',
    title: 'Irrigation Pump (2HP)',
    category: 'Equipment',
    location: 'Gujarat',
    minBid: 15000,
    currentBid: 16800,
    image: '/water.jpg',
    endsAt: '2025-10-20',
    description: 'Reliable pump, lightly used, regular maintenance done.',
    seller: 'EquipmentDealer_GJ',
    bids: [
      { bidder: 'SmallFarmer1', amount: 15000, time: '1d ago' },
      { bidder: 'CooperativeFarm', amount: 15500, time: '18h ago' },
      { bidder: 'AgriContractor', amount: 16800, time: '2h ago' }
    ],
    specifications: {
      'Brand': 'Kirloskar',
      'Power': '2 HP',
      'Condition': 'Used - Good',
      'Age': '2 years',
      'Warranty': '6 months'
    }
  },
  {
    id: 'demo',
    title: 'DEMO: Premium Basmati Rice (300kg)',
    category: 'Grains',
    location: 'Haryana',
    minBid: 18000,
    currentBid: 19500,
    image: '/p1.jpg',
    endsAt: new Date(Date.now() + 2 * 60 * 1000).toISOString(), // Ends in 2 minutes for demo
    description: 'Premium Basmati rice for export quality. This is a DEMO auction to help you understand the bidding process.',
    seller: 'DEMO_Farmer',
    isDemoAuction: true,
    bids: [
      { bidder: 'ExportCompany1', amount: 18000, time: '10m ago' },
      { bidder: 'LocalMiller', amount: 18500, time: '8m ago' },
      { bidder: 'RiceTrader', amount: 19500, time: '5m ago' }
    ],
    specifications: {
      'Variety': 'Pusa Basmati 1121',
      'Quality Grade': 'Export Quality',
      'Broken Rice': '<5%',
      'Moisture': '14%',
      'Aroma': 'Strong Basmati'
    },
    demoInstructions: [
      'This is a practice auction to help you learn the bidding process',
      'You can place bids without any real payment',
      'Try bidding different amounts to see how the system works',
      'Notice how the current highest bid updates in real-time',
      'The auction will end in 2 minutes for demonstration purposes'
    ]
  }
];

// Mock bidding history for demo purposes
export const generateMockBid = (currentBid, bidderName = 'DemoUser') => {
  const increment = Math.floor(Math.random() * 500) + 100; // Random increment between 100-600
  return {
    bidder: bidderName,
    amount: currentBid + increment,
    time: 'just now'
  };
};
