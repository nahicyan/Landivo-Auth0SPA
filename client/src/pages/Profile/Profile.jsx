import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, Mail, User, MapPin, LogOut } from 'lucide-react';
import Auth0DebugComponent from '@/components/Auth0/Auth0DebugComponent';

const Profile = () => {
  const { user, isLoading, isAuthenticated, logout } = useAuth0();

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
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="my-4">
                  <Auth0DebugComponent />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Authentication Method</h3>
                  <Badge className="capitalize bg-blue-100 text-blue-800 hover:bg-blue-100">
                    {user.sub?.split('|')[0] || 'auth0'}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Account Created</h3>
                  <div className="flex items-center">
                    <CalendarClock className="w-4 h-4 mr-2 text-gray-400" />
                    <p className="text-gray-700">{createdAt}</p>
                  </div>
                </div>

                {user.updated_at && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Last Updated</h3>
                    <p className="text-gray-700">
                      {new Date(user.updated_at).toLocaleDateString()}
                    </p>
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
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 py-4 border-t">
        <Skeleton className="h-4 w-48" />
      </CardFooter>
    </Card>
  </div>
);

export default Profile;