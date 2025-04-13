// client/src/components/hooks/useAuth.js
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
  const [userPermissions, setUserPermissions] = useState([]);
  const [rolesLoaded, setRolesLoaded] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);
  const [token, setToken] = useState(null);
  const [tokenLoaded, setTokenLoaded] = useState(false);

  // Calculate admin/agent status from roles
  const { isAdmin, isAgent } = useMemo(() => {
    return {
      isAdmin: userRoles.includes('Admin'),
      isAgent: userRoles.includes('Agent')
    };
  }, [userRoles]);
  
  // Extract roles from user object
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
      
      // Set roles in state
      setUserRoles(roles);
      setRolesLoaded(true);
    } else if (!auth0Loading) {
      setUserRoles([]);
      setRolesLoaded(true);
    }
  }, [user, auth0Loading]);

  // Get the token and extract permissions from it
  useEffect(() => {
    const fetchTokenAndPermissions = async () => {
      if (isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently();
          setToken(accessToken);
          
          // Extract permissions from the token
          const tokenParts = accessToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('Access token payload:', payload);
            
            // Look for permissions in the token payload
            let permissions = [];
            
            // Check for permissions at root level first (this is where they are in your token)
            if (payload.permissions && Array.isArray(payload.permissions)) {
              permissions = payload.permissions;
              console.log('Found permissions in token payload:', permissions);
            } 
            // Also check namespace locations as fallback
            else {
              const AUTH0_NAMESPACE = 'https://landivo.com';
              if (payload[`${AUTH0_NAMESPACE}/permissions`]) {
                permissions = payload[`${AUTH0_NAMESPACE}/permissions`];
                console.log(`Found permissions in ${AUTH0_NAMESPACE}/permissions:`, permissions);
              } else if (payload[AUTH0_NAMESPACE] && payload[AUTH0_NAMESPACE].permissions) {
                permissions = payload[AUTH0_NAMESPACE].permissions;
                console.log(`Found permissions in ${AUTH0_NAMESPACE}.permissions:`, permissions);
              } else {
                console.log('No permissions found in token payload');
              }
            }
            
            setUserPermissions(permissions);
          }
          
          setTokenLoaded(true);
          setPermissionsLoaded(true);
          console.log('Fetched auth token successfully');
        } catch (error) {
          console.error('Error fetching token:', error);
          setTokenLoaded(true);
          setPermissionsLoaded(true);
        }
      } else if (!auth0Loading) {
        setToken(null);
        setUserPermissions([]);
        setTokenLoaded(true);
        setPermissionsLoaded(true);
      }
    };
    
    fetchTokenAndPermissions();
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
  const isLoading = auth0Loading || !rolesLoaded || !permissionsLoaded || !tokenLoaded;

  return {
    isAuthenticated,
    isLoading,
    user,
    userRoles,
    userPermissions,
    isAdmin,
    isAgent,
    loginWithRedirect,
    logout,
    getToken,
  };
}