// import React from 'react';
import React, { useState, useEffect } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '@/components/hooks/useAuth';
import { usePermissions } from '@/components/Auth0/PermissionsContext';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarClock, 
  Mail, 
  User, 
  Shield, 
  Key, 
  Users, 
  Home, 
  FileText, 
  LogOut 
} from 'lucide-react';
import Auth0DebugComponent from '@/components/Auth0/Auth0DebugComponent';
import { useVipBuyer } from '@/utils/VipBuyerContext'; // New import for VIP Buyer hook
import { StarIcon } from '@heroicons/react/24/solid'; // New import for VIP Buyer icon

const Profile = () => {
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    logout, 
    getAccessTokenSilently // Add this
  } = useAuth0();
  const { userRoles, userPermissions } = useAuth();
  const permissions = usePermissions();
  
  // Use the VIP Buyer hook
  const { isVipBuyer, vipBuyerData, isLoading: vipStatusLoading } = useVipBuyer();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold text-gray-700">Not Logged In</h2>
            <p className="mt-2 text-gray-500">Please log in to view your profile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format the date when user signed up (if available)
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : 'Not available';
    
  // Group permissions by category
  const permissionCategories = {
    user: userPermissions.filter(p => p.includes('user')),
    property: userPermissions.filter(p => p.includes('propert')),
    buyer: userPermissions.filter(p => p.includes('buyer')),
    offer: userPermissions.filter(p => p.includes('offer')),
    qualification: userPermissions.filter(p => p.includes('qualification')),
    admin: userPermissions.filter(p => p.includes('admin')),
    other: userPermissions.filter(p => 
      !p.includes('user') && 
      !p.includes('propert') && 
      !p.includes('buyer') && 
      !p.includes('offer') && 
      !p.includes('qualification') && 
      !p.includes('admin')
    )
  };

  // Debug token data
  useEffect(() => {
    const getAndDecodeToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        // Log the raw token
        console.log('Raw token:', token);
        
        // Log the parsed token parts
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const header = JSON.parse(atob(tokenParts[0]));
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Token header:', header);
          console.log('Token payload:', payload);
          
          // Check for permissions in various locations
          const namespace = 'https://landivo.com';
          console.log('Looking for permissions in these locations:');
          console.log(`1. permissions:`, payload.permissions);
          console.log(`2. ${namespace}/permissions:`, payload[`${namespace}/permissions`]);
          console.log(`3. Inside namespace object:`, payload[namespace]?.permissions);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    };
    
    if (isAuthenticated) {
      getAndDecodeToken();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="w-full overflow-hidden">
        {/* Header with background */}
        <div className="h-32 bg-gradient-to-r from-[#3f4f24] to-[#324c48]"></div>

        {/* Profile Main Content */}
        <CardContent className="relative px-6 pt-0 pb-6">
          {/* Profile Picture */}
          <div className="absolute -top-16 left-6">
            <Avatar className="h-32 w-32 border-4 border-white bg-white">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-16 w-16 text-gray-400" />
              )}
            </Avatar>
          </div>

          {/* User Info */}
          <div className="mt-20">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {user.name || user.nickname || 'User'}
                </h1>
                <div className="flex items-center mt-1 text-gray-500">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{user.email}</span>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={() => logout({
                  logoutParams: { returnTo: window.location.origin }
                })}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            <Separator className="my-6" />

            {/* User Details */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Email Verification</h3>
                  {user.email_verified ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      Not Verified
                    </Badge>
                  )}
                </div>

                {user.nickname && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Nickname</h3>
                    <p className="text-gray-700">{user.nickname}</p>
                  </div>
                )}

                {user.locale && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Locale</h3>
                    <p className="text-gray-700">{user.locale}</p>
                  </div>
                )}
                
                {/* Roles */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-[#3f4f24]" />
                      Roles
                    </div>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {userRoles && userRoles.length > 0 ? (
                      userRoles.map((role) => (
                        <Badge 
                          key={role}
                          className="bg-[#e8efdc] text-[#3f4f24] hover:bg-[#e8efdc]"
                        >
                          {role}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm italic">No roles assigned</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Authentication Method</h3>
                  <Badge className="capitalize bg-blue-100 text-blue-800 hover:bg-blue-100">
                    {user.sub?.split('|')[0] || 'auth0'}
                  </Badge>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Account Created</h3>
                  <div className="flex items-center">
                    <CalendarClock className="w-4 h-4 mr-2 text-gray-400" />
                    <p className="text-gray-700">{createdAt}</p>
                  </div>
                </div>

                {user.updated_at && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Last Updated</h3>
                    <p className="text-gray-700">
                      {new Date(user.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* VIP Badge section */}
            {vipStatusLoading ? (
              <div className="mt-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </div>
            ) : isVipBuyer && (
              <div className="mt-4 flex items-center">
                <div className="bg-[#D4A017]/10 border border-[#D4A017] rounded-md px-4 py-2 flex items-center">
                  <StarIcon className="h-5 w-5 text-[#D4A017] mr-2" />
                  <div>
                    <p className="text-[#D4A017] font-semibold">VIP Buyer</p>
                    <p className="text-sm text-[#324c48]">
                      Preferred areas: {vipBuyerData?.preferredAreas?.join(', ') || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Permissions Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                <Key className="w-5 h-5 mr-2 text-[#324c48]" />
                Permissions
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* User Permissions */}
                {permissionCategories.user.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-[#324c48]" />
                      User Management
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {permissionCategories.user.map(perm => (
                        <Badge 
                          key={perm}
                          className="bg-[#f0f5f4] text-[#324c48] hover:bg-[#f0f5f4]"
                        >
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Property Permissions */}
                {permissionCategories.property.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center">
                      <Home className="w-4 h-4 mr-2 text-[#324c48]" />
                      Property Management
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {permissionCategories.property.map(perm => (
                        <Badge 
                          key={perm}
                          className="bg-[#f0f5f4] text-[#324c48] hover:bg-[#f0f5f4]"
                        >
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Buyer Permissions */}
                {permissionCategories.buyer.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center">
                      <User className="w-4 h-4 mr-2 text-[#324c48]" />
                      Buyer Management
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {permissionCategories.buyer.map(perm => (
                        <Badge 
                          key={perm}
                          className="bg-[#f0f5f4] text-[#324c48] hover:bg-[#f0f5f4]"
                        >
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Offer Permissions */}
                {permissionCategories.offer.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-[#324c48]" />
                      Offer Management
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {permissionCategories.offer.map(perm => (
                        <Badge 
                          key={perm}
                          className="bg-[#f0f5f4] text-[#324c48] hover:bg-[#f0f5f4]"
                        >
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Qualification Permissions */}
                {permissionCategories.qualification.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-[#324c48]" />
                      Qualification Management
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {permissionCategories.qualification.map(perm => (
                        <Badge 
                          key={perm}
                          className="bg-[#f0f5f4] text-[#324c48] hover:bg-[#f0f5f4]"
                        >
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Admin Permissions */}
                {permissionCategories.admin.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-[#324c48]" />
                      Admin Access
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {permissionCategories.admin.map(perm => (
                        <Badge 
                          key={perm}
                          className="bg-[#f0f5f4] text-[#324c48] hover:bg-[#f0f5f4]"
                        >
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Other Permissions */}
                {permissionCategories.other.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center">
                      <Key className="w-4 h-4 mr-2 text-[#324c48]" />
                      Other Permissions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {permissionCategories.other.map(perm => (
                        <Badge 
                          key={perm}
                          className="bg-[#f0f5f4] text-[#324c48] hover:bg-[#f0f5f4]"
                        >
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* No Permissions */}
                {userPermissions.length === 0 && (
                  <div className="col-span-2 text-center py-4">
                    <p className="text-gray-500 italic">No permissions assigned</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 py-4 border-t text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>User ID: {user.sub}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

// Loading skeleton 
const ProfileSkeleton = () => (
  <div className="container max-w-4xl mx-auto py-8 px-4">
    <Card className="w-full overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300"></div>
      <CardContent className="relative px-6 pt-0 pb-6">
        <div className="absolute -top-16 left-6">
          <Skeleton className="h-32 w-32 rounded-full border-4 border-white" />
        </div>
        <div className="mt-20">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-6" />
          <Separator className="my-6" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
          <Skeleton className="h-40 w-full mt-8" />
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 py-4 border-t">
        <Skeleton className="h-4 w-48" />
      </CardFooter>
    </Card>
  </div>
);

export default Profile;
