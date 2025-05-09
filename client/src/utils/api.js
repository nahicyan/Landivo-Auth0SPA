import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`, //
  withCredentials: true, // Enable cookies for cross-origin requests
});

// Helper function to handle errors and provide consistent logging
const handleRequestError = (error, message) => {
  console.error(`${message}:`, error);
  throw error;
};

// Example function to check session status
export const checkSession = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/test-session`, {
      withCredentials: true,
    });
    console.log("Session response:", response.data);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Session failed");
  }
};

// Login function using session-based authentication
export const loginUser = async (loginData) => {
  try {
    const response = await api.post('/user/login', loginData, {
      withCredentials: true, // This ensures cookies are sent and received
    });
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};


// Logout function to end session
export const logoutUser = async () => {
  try {
    // Use the 'api' instance which is configured with baseURL "${import.meta.env.VITE_SERVER_URL}/api"
    // Adjust the endpoint path if needed (e.g., if logout route is at /auth/logout)
    const response = await api.get('/auth/logout');
    console.log("Logout successful:", response.data);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Logout failed");
  }
};

// Register a new user
export const registerUser = async (registerData) => {
  try {
    const response = await api.post('/user/register', registerData);
    console.log("Registration response:", response.data);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Registration failed");
  }
};

// Get all properties
export const getAllProperties = async () => {
  try {
    const response = await api.get('/residency/allresd');
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to fetch properties");
  }
};

// Get a specific property
export const getProperty = async (id) => {
  try {
    const response = await api.get(`/residency/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching property details:", error);
    // Return a basic object instead of throwing to avoid breaking the UI
    return { 
      title: "Unknown Property", 
      streetAddress: "Address not available" 
    };
  }
};

// Make an offer on a property
export const makeOffer = async (offerData) => {
  try {
    const response = await api.post('/buyer/makeOffer', offerData);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to make offer");
  }
};

// Update property
export const updateProperty = async (id, updatedData) => {
  try {
    const response = await api.put(`/residency/update/${id}`, updatedData);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to update property");
  }
};

// Get offers for a specific property
export const getPropertyOffers = async (propertyId) => {
  try {
    const response = await api.get(`/buyer/offers/property/${propertyId}`);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to fetch property offers");
  }
};

// Get offers for a specific buyer
export const getBuyerOffers = async (buyerId) => {
  try {
    // Query parameter approach
    const response = await api.get(`/buyer/offers/buyer?buyerId=${buyerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching buyer offers:", error);
    // Return empty array instead of throwing to avoid breaking the UI
    return { offers: [] };
  }
};

// New
export const createResidencyWithFiles = async (formData) => {
  try {
    const response = await api.post('/residency/createWithFile', formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to create property with files");
  }
};


// Submit qualification data
export const submitQualification = async (qualificationData) => {
  try {
    const response = await api.post('/qualification/create', qualificationData);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to submit qualification");
  }
};

// Get qualifications for a property
export const getPropertyQualifications = async (propertyId) => {
  try {
    const response = await api.get(`/qualification/property/${propertyId}`);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to fetch property qualifications");
  }
};

// Get all qualifications with optional filtering
export const getAllQualifications = async (page = 1, limit = 10, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    
    const response = await api.get(`/qualification/all?${queryParams}`);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to fetch qualifications");
  }
};
// Create A VIP Buyer
export const createVipBuyer = async (buyerData) => {
  try {
    const response = await api.post('/buyer/createVipBuyer', buyerData);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to create VIP buyer");
  }
};

// 9. API Client Function for User Detail

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to fetch user details");
  }
};

// Get All Users
export const getAllUsers = async () => {
  try {
    const response = await api.get('/user/all');
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to fetch users");
  }
};

// Get All Buyers
export const getAllBuyers = async () => {
  try {
    const response = await api.get('/buyer/all');
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to fetch buyers");
  }
};

// Get Buyer by ID
export const getBuyerById = async (id) => {
  try {
    const response = await api.get(`/buyer/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching buyer details:", error);
    throw error;
  }
};

// Update Buyer
export const updateBuyer = async (id, buyerData) => {
  try {
    const response = await api.put(`/buyer/update/${id}`, buyerData);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to update buyer");
  }
};

// Delete Buyer
export const deleteBuyer = async (id) => {
  try {
    const response = await api.delete(`/buyer/delete/${id}`);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to delete buyer");
  }
};

/**
 * Record buyer activity events
 * @param {Array} events - Array of activity events
 * @returns {Promise<Object>} Response data
 */
export const recordBuyerActivity = async (events) => {
  try {
    const response = await api.post('/buyer/activity', { events });
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to record buyer activity");
  }
};


/**
 * Get activity data for a specific buyer
 * @param {string} buyerId - Buyer ID
 * @param {Object} [options] - Query options
 * @param {number} [options.page=1] - Page number
 * @param {number} [options.limit=500] - Results per page (increased from 50)
 * @param {string} [options.type] - Filter by event type
 * @param {string} [options.startDate] - Filter by start date
 * @param {string} [options.endDate] - Filter by end date
 * @param {string} [options.propertyId] - Filter by property ID
 * @returns {Promise<Object>} Activity data
 */
export const getBuyerActivity = async (buyerId, options = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: options.page || 1,
      limit: options.limit || 500, // Increased from 50
      ...(options.type && { type: options.type }),
      ...(options.startDate && { startDate: options.startDate }),
      ...(options.endDate && { endDate: options.endDate }),
      ...(options.propertyId && { propertyId: options.propertyId })
    });
    
    const response = await api.get(`/buyer/activity/${buyerId}?${queryParams}`);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to fetch buyer activity");
  }
};



/**
 * Get a summary of buyer activity
 * @param {string} buyerId - Buyer ID
 * @returns {Promise<Object>} Activity summary
 */
export const getBuyerActivitySummary = async (buyerId) => {
  try {
    const response = await api.get(`/buyer/activity/${buyerId}/summary`);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to fetch buyer activity summary");
  }
};

/**
 * Delete buyer activity records
 * @param {string} buyerId - Buyer ID
 * @param {Object} [options] - Delete options
 * @param {string} [options.before] - Delete records before this date
 * @param {string} [options.type] - Delete records of this type
 * @returns {Promise<Object>} Response data
 */
export const deleteBuyerActivity = async (buyerId, options = {}) => {
  try {
    const queryParams = new URLSearchParams({
      ...(options.before && { before: options.before }),
      ...(options.type && { type: options.type })
    });
    
    const response = await api.delete(`/buyer/activity/${buyerId}?${queryParams}`);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to delete buyer activity");
  }
};

// Get all buyer lists
export const getBuyerLists = async () => {
  try {
    const response = await api.get('/buyer-lists');
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to fetch buyer lists");
  }
};

// Get a specific buyer list with its members
export const getBuyerList = async (id) => {
  try {
    const response = await api.get(`/buyer-lists/${id}`);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to fetch buyer list");
  }
};

// Create a new buyer list
export const createBuyerList = async (listData) => {
  try {
    const response = await api.post('/buyer-lists', listData);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to create buyer list");
  }
};

// Update a buyer list
export const updateBuyerList = async (id, listData) => {
  try {
    const response = await api.put(`/buyer-lists/${id}`, listData);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to update buyer list");
  }
};

// Delete a buyer list
export const deleteBuyerList = async (id) => {
  try {
    const response = await api.delete(`/buyer-lists/${id}`);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to delete buyer list");
  }
};

// Add buyers to a list
export const addBuyersToList = async (listId, buyerIds) => {
  try {
    const response = await api.post(`/buyer-lists/${listId}/add-buyers`, { buyerIds });
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to add buyers to list");
  }
};

// Remove buyers from a list
export const removeBuyersFromList = async (listId, buyerIds) => {
  try {
    const response = await api.post(`/buyer-lists/${listId}/remove-buyers`, { buyerIds });
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to remove buyers from list");
  }
};

// Send email to list members
export const sendEmailToList = async (listId, emailData) => {
  try {
    const response = await api.post(`/buyer-lists/${listId}/send-email`, emailData);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to send email to list");
  }
};


// Create a new deal

export const createDeal = async (dealData) => {
  try {
    console.log("Creating deal with data:", JSON.stringify(dealData, null, 2));
    const response = await api.post('/deal/create', dealData);
    return response.data;
  } catch (error) {
    console.error("Deal creation error details:", error.response?.data);
    handleRequestError(error, "Failed to create deal");
  }
};

// Get all deals
export const getAllDeals = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await api.get(`/deal/all?${queryParams}`);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to fetch deals");
  }
};

// Get deal by ID
export const getDealById = async (id) => {
  try {
    const response = await api.get(`/deal/${id}`);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to fetch deal");
  }
};

// Update deal
export const updateDeal = async (id, dealData) => {
  try {
    const response = await api.put(`/deal/update/${id}`, dealData);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to update deal");
  }
};

// Record a payment
export const recordPayment = async (paymentData) => {
  try {
    const response = await api.post('/deal/payment', paymentData);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to record payment");
  }
};

// Get deal financial summary
export const getDealFinancialSummary = async (id) => {
  try {
    const response = await api.get(`/deal/${id}/summary`);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to fetch deal summary");
  }
};