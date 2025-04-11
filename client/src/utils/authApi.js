// client/src/utils/authApi.js
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

// Create a function that returns an authenticated API instance
export function useAuthApi() {
  const { getToken, isAuthenticated } = useAuth();
  
  // Create a base API instance
  const api = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
    withCredentials: true,
  });
  
  // Function to make authenticated requests
  const authRequest = async (method, url, data = null, options = {}) => {
    try {
      // Only attempt to get token if authenticated
      const token = isAuthenticated ? await getToken() : null;
      
      // Set headers
      const headers = {
        ...(options.headers || {}),
      };
      
      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Make the request
      const response = await api({
        method,
        url,
        data,
        headers,
        ...options,
      });
      
      return response.data;
    } catch (error) {
      console.error(`API error (${method} ${url}):`, error);
      throw error;
    }
  };
  
  // Return an object with methods for each HTTP verb
  return {
    get: (url, options = {}) => authRequest('get', url, null, options),
    post: (url, data, options = {}) => authRequest('post', url, data, options),
    put: (url, data, options = {}) => authRequest('put', url, data, options),
    delete: (url, options = {}) => authRequest('delete', url, null, options),
    // Example usage with FormData
    postForm: async (url, formData, options = {}) => {
      const token = isAuthenticated ? await getToken() : null;
      const headers = { 
        ...(options.headers || {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };
      
      return api.post(url, formData, { 
        ...options, 
        headers,
      }).then(response => response.data);
    }
  };
}