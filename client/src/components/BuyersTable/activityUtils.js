/**
 * Utility functions for generating and working with buyer activity data
 */

/**
 * Generate mock activity data for a buyer
 * @param {string} buyerId - Buyer's ID
 * @param {string} firstName - Buyer's first name
 * @param {string} lastName - Buyer's last name
 * @returns {Object} Generated activity data
 */
export const generateActivityData = (buyerId, firstName, lastName) => {
    // Generate property IDs and titles
    const properties = [
      { id: "residency1", title: "Modern Apartment", address: "123 Main Street, Metropolis, USA" },
      { id: "residency2", title: "Luxury Villa", address: "456 Ocean Drive, Seaside, USA" },
      { id: "residency3", title: "Mountain Cabin", address: "789 Pine Road, Highland, USA" },
      { id: "residency4", title: "Downtown Loft", address: "101 Urban Ave, Central City, USA" },
      { id: "residency5", title: "Lakefront Property", address: "202 Lake View, Waterside, USA" }
    ];
    
    // Random date generator for the last 30 days
    const randomDate = () => {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      date.setHours(
        Math.floor(Math.random() * 24),
        Math.floor(Math.random() * 60),
        Math.floor(Math.random() * 60)
      );
      return date.toISOString();
    };
    
    // Random duration between 30 seconds and 15 minutes
    const randomDuration = () => Math.floor(Math.random() * (15 * 60 - 30) + 30);
    
    // Random amount between 200,000 and 1,500,000
    const randomAmount = () => Math.floor(Math.random() * (1500000 - 200000) + 200000);
    
    // Generate 3-7 property views
    const propertyViews = Array.from({ length: Math.floor(Math.random() * 5) + 3 }, () => {
      const property = properties[Math.floor(Math.random() * properties.length)];
      return {
        propertyId: property.id,
        propertyTitle: property.title,
        propertyAddress: property.address,
        timestamp: randomDate(),
        duration: randomDuration(),
        details: Math.random() > 0.5 ? "Viewed full property details" : "Viewed property from search results"
      };
    });
    
    // Generate 5-10 click events
    const clickEvents = Array.from({ length: Math.floor(Math.random() * 6) + 5 }, () => {
      const property = properties[Math.floor(Math.random() * properties.length)];
      const elements = [
        "Make Offer Button", 
        "Contact Agent", 
        "View Images", 
        "See Financing Options", 
        "Save to Favorites", 
        "Share Property"
      ];
      return {
        element: elements[Math.floor(Math.random() * elements.length)],
        page: `/properties/${property.id}`,
        timestamp: randomDate()
      };
    });
    
    // Generate 3-5 page visits
    const pageVisits = Array.from({ length: Math.floor(Math.random() * 3) + 3 }, () => {
      const pages = [
        "/properties", 
        "/properties/search", 
        `/properties/${properties[Math.floor(Math.random() * properties.length)].id}`,
        "/financing",
        "/about-us"
      ];
      return {
        url: pages[Math.floor(Math.random() * pages.length)],
        timestamp: randomDate(),
        duration: randomDuration()
      };
    });
    
    // Generate 1-3 searches
    const searchHistory = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
      const queries = [
        "land near Austin", 
        "waterfront property", 
        "investment opportunity", 
        "vacant land Texas", 
        "affordable acreage"
      ];
      return {
        query: queries[Math.floor(Math.random() * queries.length)],
        timestamp: randomDate(),
        results: Math.floor(Math.random() * 20) + 1
      };
    });
    
    // Generate 0-2 offers
    const offerHistory = Array.from({ length: Math.floor(Math.random() * 3) }, () => {
      const property = properties[Math.floor(Math.random() * properties.length)];
      const statuses = ["Pending", "Accepted", "Rejected", "Countered"];
      return {
        propertyId: property.id,
        propertyTitle: property.title,
        propertyAddress: property.address,
        amount: randomAmount(),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        timestamp: randomDate()
      };
    });
    
    // Generate 1-2 email interactions
    const emailInteractions = Array.from({ length: Math.floor(Math.random() * 2) + 1 }, () => {
      const subjects = [
        "March 2025 Property Listings", 
        "Special Land Offer Near You", 
        "New Properties Available", 
        "Your Saved Properties Update"
      ];
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const emailId = `email-${subject.toLowerCase().replace(/\s+/g, '-')}`;
      const openTimestamp = randomDate();
      const property = properties[Math.floor(Math.random() * properties.length)];
      
      return {
        emailId,
        subject,
        opened: Math.random() > 0.2, // 80% chance email was opened
        openTimestamp,
        clicks: Math.random() > 0.4 ? [ // 60% chance they clicked something in the email
          {
            url: `/properties/${property.id}`,
            timestamp: new Date(new Date(openTimestamp).getTime() + Math.random() * 300000).toISOString() // 0-5 minutes after opening
          }
        ] : []
      };
    });
    
    // Generate 1-3 sessions
    const sessionHistory = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
      const loginTime = randomDate();
      const logoutTime = new Date(new Date(loginTime).getTime() + Math.random() * 3600000).toISOString(); // 0-60 minutes after login
      const devices = [
        "Desktop - Chrome on Windows",
        "Desktop - Safari on MacOS",
        "Mobile - Chrome on Android",
        "Mobile - Safari on iOS",
        "Tablet - Chrome on iPadOS"
      ];
      return {
        loginTime,
        logoutTime,
        device: devices[Math.floor(Math.random() * devices.length)],
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      };
    });
    
    // Calculate engagement score based on activity volume
    const calculateEngagementScore = () => {
      // Base the score on the total number of interactions
      const totalInteractions = 
        propertyViews.length + 
        clickEvents.length + 
        pageVisits.length + 
        searchHistory.length + 
        offerHistory.length * 3 + // Weight offers more heavily
        emailInteractions.filter(e => e.opened).length * 2; // Weight email opens more heavily
      
      // Normalize to a 0-100 scale
      return Math.min(100, Math.max(1, Math.floor(totalInteractions * 4)));
    };
    
    return {
      buyerId,
      buyerName: `${firstName} ${lastName}`,
      propertyViews,
      clickEvents,
      pageVisits,
      searchHistory,
      offerHistory,
      emailInteractions,
      sessionHistory,
      engagementScore: calculateEngagementScore(),
      lastActive: propertyViews.length > 0 ? 
        propertyViews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0].timestamp : 
        new Date().toISOString()
    };
  };
  
  /**
   * Format activity duration in minutes and seconds
   * @param {number} seconds - Duration in seconds
   * @returns {string} Formatted duration string
   */
  export const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  /**
   * Get engagement level based on score
   * @param {number} score - Engagement score (0-100)
   * @returns {string} Engagement level description
   */
  export const getEngagementLevel = (score) => {
    if (score >= 80) return "High";
    if (score >= 50) return "Medium";
    return "Low";
  };
  
  /**
   * Sort activity data by timestamp (newest first)
   * @param {Array} items - Array of activity items with timestamp property
   * @returns {Array} Sorted array
   */
  export const sortByTimestamp = (items) => {
    return [...items].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };
  
  /**
   * Generate mock buyers for testing purposes
   * @returns {Array} Array of mock buyer objects
   */
  export const generateMockBuyers = () => {
    // Sample data for building mock buyers
    const firstNames = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Lisa", "James", "Jennifer"];
    const lastNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor"];
    const buyerTypes = ["CashBuyer", "Investor", "Realtor", "Builder", "Developer", "Wholesaler"];
    const sources = ["VIP Buyers List", "Manual Entry", "Property Offer", "Website", "Referral"];
    const areas = ["DFW", "Austin", "Houston", "San Antonio", "Other Areas"];
    const emails = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];
    
    // Generate 20 random buyers
    return Array.from({ length: 20 }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const buyerType = buyerTypes[Math.floor(Math.random() * buyerTypes.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emails[Math.floor(Math.random() * emails.length)]}`;
      
      // Generate 1-3 random preferred areas
      const numAreas = Math.floor(Math.random() * 3) + 1;
      const preferredAreas = [];
      while (preferredAreas.length < numAreas) {
        const area = areas[Math.floor(Math.random() * areas.length)];
        if (!preferredAreas.includes(area)) {
          preferredAreas.push(area);
        }
      }
      
      // Generate a random phone number
      const phone = `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
      
      // Generate a random date in the past year
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 365));
      
      return {
        id: `mock-buyer-${i + 1}`,
        firstName,
        lastName,
        email,
        phone,
        buyerType,
        source,
        preferredAreas,
        createdAt: createdAt.toISOString(),
        updatedAt: createdAt.toISOString(),
        offers: []
      };
    });
  };
  
  export default {
    generateActivityData,
    formatDuration,
    getEngagementLevel,
    sortByTimestamp,
    generateMockBuyers
  };