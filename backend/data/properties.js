// Shared properties data store
const mockProperties = [
  {
    id: 1,
    title: "Luxury 3BHK Apartment in Kandivali West",
    description: "Beautiful 3BHK apartment with modern amenities and stunning city views. Located in the heart of Kandivali West with easy access to shopping centers, schools, and hospitals.",
    price: 18000000,
    location: "Kandivali West, Mumbai",
    images: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
    ],
    beds: 3,
    baths: 3,
    area: 1250,
    type: "Sale",
    propertyType: "apartment",
    status: "active",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Elevator"],
    features: ["Modern Kitchen", "Balcony", "Air Conditioning", "Furnished"],
    agent: { 
      name: "Rajesh Patel", 
      phone: "+91 98765 43210",
      email: "rajesh@mumbaiestate.com"
    },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    title: "Modern 2BHK for Rent in Kandivali East",
    description: "Fully furnished 2BHK apartment available for rent in prime location of Kandivali East. Perfect for small families or working professionals.",
    price: 45000,
    location: "Kandivali East, Mumbai", 
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
    ],
    beds: 2,
    baths: 2,
    area: 950,
    type: "Rent",
    propertyType: "apartment",
    status: "active",
    amenities: ["Parking", "Security", "Elevator", "Power Backup"],
    features: ["Furnished", "Balcony", "Modern Kitchen", "Internet Ready"],
    agent: { 
      name: "Priya Shah", 
      phone: "+91 98765 43211",
      email: "priya@mumbaiestate.com"
    },
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-14T14:20:00Z"
  },
  {
    id: 3,
    title: "Spacious 4BHK Villa with Garden in Borivali West",
    description: "Independent villa with beautiful garden, perfect for large families. Located in peaceful residential area with all modern amenities.",
    price: 35000000,
    location: "Borivali West, Mumbai",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop"
    ],
    beds: 4,
    baths: 4,
    area: 2200,
    type: "Sale",
    propertyType: "villa",
    status: "active",
    amenities: ["Garden", "Parking", "Security", "Swimming Pool", "Terrace"],
    features: ["Independent", "Modern Kitchen", "Terrace", "Study Room", "Store Room"],
    agent: { 
      name: "Amit Kumar", 
      phone: "+91 98765 43212",
      email: "amit@mumbaiestate.com"
    },
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z"
  },
  {
    id: 4,
    title: "Commercial Office Space in Malad West",
    description: "Prime commercial office space in business district of Malad West. Ideal for IT companies, startups, and corporate offices.",
    price: 12000000,
    location: "Malad West, Mumbai",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
    ],
    beds: 0,
    baths: 2,
    area: 800,
    type: "Sale",
    propertyType: "commercial",
    status: "active",
    amenities: ["Parking", "Security", "Elevator", "Power Backup", "Conference Room"],
    features: ["Central AC", "Conference Room", "Reception Area", "Cafeteria"],
    agent: { 
      name: "Vikash Gupta", 
      phone: "+91 98765 43214",
      email: "vikash@gujaratestate.com"
    },
    createdAt: "2024-01-12T16:45:00Z",
    updatedAt: "2024-01-12T16:45:00Z"
  },
  {
    id: 5,
    title: "Cozy 1BHK Studio Apartment in Goregaon East",
    description: "Perfect starter home or investment property. Compact yet comfortable 1BHK apartment in a well-maintained building in Goregaon East.",
    price: 28000,
    location: "Goregaon East, Mumbai",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
    ],
    beds: 1,
    baths: 1,
    area: 600,
    type: "Rent",
    propertyType: "apartment",
    status: "active",
    amenities: ["Parking", "Security", "Elevator"],
    features: ["Furnished", "Balcony", "Modern Kitchen"],
    agent: { 
      name: "Sneha Joshi", 
      phone: "+91 98765 43213",
      email: "sneha@gujaratestate.com"
    },
    createdAt: "2024-01-11T11:30:00Z",
    updatedAt: "2024-01-11T11:30:00Z"
  },
  {
    id: 6,
    title: "Premium 3BHK Flat in Andheri West",
    description: "Luxurious 3BHK apartment in prime Andheri West location with excellent connectivity to business districts and entertainment hubs.",
    price: 22000000,
    location: "Andheri West, Mumbai",
    images: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"
    ],
    beds: 3,
    baths: 3,
    area: 1400,
    type: "Sale",
    propertyType: "apartment",
    status: "active",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Elevator", "Club House"],
    features: ["Modern Kitchen", "Balcony", "Air Conditioning", "Semi-Furnished"],
    agent: { 
      name: "Ravi Sharma", 
      phone: "+91 98765 43215",
      email: "ravi@gujaratestate.com"
    },
    createdAt: "2024-01-10T08:20:00Z",
    updatedAt: "2024-01-10T08:20:00Z"
  },
  {
    id: 7,
    title: "Affordable 2BHK in Jogeshwari East",
    description: "Well-designed 2BHK apartment in Jogeshwari East, perfect for first-time home buyers with good connectivity to Western Express Highway.",
    price: 38000,
    location: "Jogeshwari East, Mumbai",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"
    ],
    beds: 2,
    baths: 2,
    area: 850,
    type: "Rent",
    propertyType: "apartment",
    status: "active",
    amenities: ["Parking", "Security", "Elevator", "Power Backup"],
    features: ["Semi-Furnished", "Balcony", "Modern Kitchen"],
    agent: { 
      name: "Meera Patel", 
      phone: "+91 98765 43216",
      email: "meera@gujaratestate.com"
    },
    createdAt: "2024-01-09T12:15:00Z",
    updatedAt: "2024-01-09T12:15:00Z"
  }
];

module.exports = { mockProperties };