// client/src/hooks/useAuth.js
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

export function useAuth() {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();
  
  const [userRoles, setUserRoles] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAgent, setIsAgent] = useState(false);

  useEffect(() => {
    // Extract roles from the user object when it's available
    if (user) {
      const namespace = 'https://landivo.com';
      const roles = user[`${namespace}/roles`] || [];
      
      setUserRoles(roles);
      setIsAdmin(roles.includes('Admin'));
      setIsAgent(roles.includes('Agent'));
    }
  }, [user]);

  // Function to get auth token for API calls
  const getToken = async () => {
    try {
      if (!isAuthenticated) return null;
      
      const token = await getAccessTokenSilently();
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  };

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