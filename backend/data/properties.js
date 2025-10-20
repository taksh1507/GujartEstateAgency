// Shared properties data store
const mockProperties = [
  {
    id: 1,
    title: "Luxury 3BHK Apartment in Ahmedabad",
    description: "Beautiful 3BHK apartment with modern amenities and stunning city views. Located in the heart of Ahmedabad with easy access to shopping centers, schools, and hospitals.",
    price: 15000000,
    location: "Ahmedabad, Gujarat",
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
      email: "rajesh@gujaratestate.com"
    },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    title: "Modern 2BHK for Rent in Surat",
    description: "Fully furnished 2BHK apartment available for rent in prime location of Surat. Perfect for small families or working professionals.",
    price: 35000,
    location: "Surat, Gujarat", 
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
      email: "priya@gujaratestate.com"
    },
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-14T14:20:00Z"
  },
  {
    id: 3,
    title: "Spacious 4BHK Villa with Garden in Vadodara",
    description: "Independent villa with beautiful garden, perfect for large families. Located in peaceful residential area with all modern amenities.",
    price: 25000000,
    location: "Vadodara, Gujarat",
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
      email: "amit@gujaratestate.com"
    },
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z"
  },
  {
    id: 4,
    title: "Commercial Office Space in Ahmedabad",
    description: "Prime commercial office space in business district of Ahmedabad. Ideal for IT companies, startups, and corporate offices.",
    price: 8000000,
    location: "Ahmedabad, Gujarat",
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
    title: "Cozy 1BHK Studio Apartment",
    description: "Perfect starter home or investment property. Compact yet comfortable 1BHK apartment in a well-maintained building.",
    price: 25000,
    location: "Rajkot, Gujarat",
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
  }
];

module.exports = { mockProperties };