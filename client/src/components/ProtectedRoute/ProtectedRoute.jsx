// client/src/components/ProtectedRoute/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/hooks/useAuth';

// allowedRoles: array of role strings that can access this route
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, userRoles, user } = useAuth();
  const location = useLocation();

  // Create a detailed loading message for debugging
  const getLoadingMessage = () => {
    if (!user) return "Waiting for user information...";
    if (!userRoles || userRoles.length === 0) return "Waiting for role information...";
    return "Verifying access...";
  };

  // Debug logging
  useEffect(() => {
    console.log('ProtectedRoute render:', {
      path: location.pathname,
      isAuthenticated,
      isLoading,
      userRoles,
      allowedRoles,
      user: user ? `${user.name} (${user.email})` : 'No user'
    });

    if (!isLoading && allowedRoles.length > 0) {
      const hasRole = userRoles.some(role => allowedRoles.includes(role));
      console.log(`Access ${hasRole ? 'GRANTED' : 'DENIED'} - User roles: [${userRoles.join(', ')}], Required roles: [${allowedRoles.join(', ')}]`);
    }
  }, [isAuthenticated, isLoading, userRoles, allowedRoles, location.pathname, user]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3f4f24] mb-4"></div>
        <p className="text-gray-600">{getLoadingMessage()}</p>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to home');
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // If no specific roles are required OR user has at least one of the required roles
  const hasRequiredRole = 
    allowedRoles.length === 0 || 
    userRoles.some(role => allowedRoles.includes(role));
  
  if (!hasRequiredRole) {
    console.log('User lacks required role, redirecting to unauthorized');
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }
  
  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;