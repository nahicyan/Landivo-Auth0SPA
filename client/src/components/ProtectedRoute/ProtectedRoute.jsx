// client/src/components/ProtectedRoute/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/hooks/useAuth';

// allowedRoles: array of role strings that can access this route
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, userRoles } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3f4f24]"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // If no specific roles are required OR user has at least one of the required roles
  const hasRequiredRole = 
    allowedRoles.length === 0 || 
    userRoles.some(role => allowedRoles.includes(role));
  
  if (!hasRequiredRole) {
    // Redirect to unauthorized page or home
    return <Navigate to="/unauthorized" replace />;
  }
  
  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;