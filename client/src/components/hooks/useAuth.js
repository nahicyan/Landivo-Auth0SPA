// client/src/hooks/useAuth.js
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState, useCallback, useMemo } from 'react';

export function useAuth() {
  const {
    isAuthenticated,
    isLoading: auth0Loading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();
  
  const [userRoles, setUserRoles] = useState([]);
  const [rolesLoaded, setRolesLoaded] = useState(false);
  const [token, setToken] = useState(null);
  const [tokenLoaded, setTokenLoaded] = useState(false);

  // Calculate admin/agent status from roles - use useMemo for derived state
  const { isAdmin, isAgent } = useMemo(() => {
    return {
      isAdmin: userRoles.includes('Admin'),
      isAgent: userRoles.includes('Agent')
    };
  }, [userRoles]);

  // Extract roles from the user object
  useEffect(() => {
    if (user) {
      console.log('Auth0 user object:', user);
      
      // Find roles in the user object
      const AUTH0_NAMESPACE = 'https://landivo.com';
      let roles = [];
      
      // Try different places where roles might be stored
      if (user[`${AUTH0_NAMESPACE}/roles`]) {
        roles = user[`${AUTH0_NAMESPACE}/roles`];
        console.log(`Found roles in ${AUTH0_NAMESPACE}/roles:`, roles);
      } else if (user.roles) {
        roles = user.roles;
        console.log('Found roles in user.roles:', roles); 
      } else if (user[AUTH0_NAMESPACE] && user[AUTH0_NAMESPACE].roles) {
        roles = user[AUTH0_NAMESPACE].roles;
        console.log(`Found roles in ${AUTH0_NAMESPACE}.roles:`, roles);
      } else {
        console.log('No roles found in user object');
      }
      
      // Set roles in state and mark as loaded
      setUserRoles(roles);
      setRolesLoaded(true);
    } else if (!auth0Loading) {
      // If auth0 is done loading but no user, clear roles
      setUserRoles([]);
      setRolesLoaded(true);
    }
  }, [user, auth0Loading]);

  // Get the token for API calls
  useEffect(() => {
    const fetchToken = async () => {
      if (isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently();
          setToken(accessToken);
          setTokenLoaded(true);
          console.log('Fetched auth token successfully');
        } catch (error) {
          console.error('Error fetching token:', error);
          setTokenLoaded(true);
        }
      } else if (!auth0Loading) {
        setToken(null);
        setTokenLoaded(true);
      }
    };
    
    fetchToken();
  }, [isAuthenticated, getAccessTokenSilently, auth0Loading]);

  // Function to get auth token for API calls
  const getToken = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    try {
      // If we already have a token, return it
      if (token) return token;
      
      // Otherwise, fetch a new one
      const newToken = await getAccessTokenSilently();
      setToken(newToken);
      return newToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }, [isAuthenticated, getAccessTokenSilently, token]);

  // Combined loading state
  const isLoading = auth0Loading || !rolesLoaded || !tokenLoaded;

  return {
    isAuthenticated,
    isLoading,
    user,
    userRoles,
    isAdmin,
    isAgent,
    loginWithRedirect,
    logout,
    getToken,
  };
}