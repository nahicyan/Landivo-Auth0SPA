import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`, // Update with your actual backend URL
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
    handleRequestError(error, "Failed to fetch property details");
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
    handleRequestError(error, "Failed to fetch buyer details");
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