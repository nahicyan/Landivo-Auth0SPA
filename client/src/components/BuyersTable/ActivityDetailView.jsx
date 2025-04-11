import React, { useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  MousePointer,
  Navigation,
  Search,
  DollarSign,
  Mail,
  Smartphone,
  Clock,
  ArrowLeft
} from "lucide-react";

/**
 * Activity Detail Component - Shows a detailed breakdown of a specific activity
 */
const ActivityDetail = ({ activity, onBack }) => {
  const activityTypes = {
    propertyViews: {
      title: "Property Views",
      icon: <Eye className="h-5 w-5 text-blue-500" />,
      render: (item) => (
        <div key={item.timestamp} className="border rounded-md p-3 mb-2 bg-white">
          <div className="font-medium text-[#324c48]">{item.propertyTitle}</div>
          <div className="text-sm text-gray-500">{item.propertyAddress}</div>
          <div className="flex justify-between mt-1 text-sm">
            <span>{format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}</span>
            <span>Duration: {Math.floor(item.duration / 60)}m {item.duration % 60}s</span>
          </div>
          <div className="text-sm italic mt-1">{item.details}</div>
        </div>
      )
    },
    clickEvents: {
      title: "Click Events",
      icon: <MousePointer className="h-5 w-5 text-purple-500" />,
      render: (item) => (
        <div key={item.timestamp} className="border rounded-md p-3 mb-2 bg-white">
          <div className="font-medium text-[#324c48]">{item.element}</div>
          <div className="text-sm text-gray-500">{item.page}</div>
          <div className="text-sm mt-1">{format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}</div>
        </div>
      )
    },
    pageVisits: {
      title: "Page Visits",
      icon: <Navigation className="h-5 w-5 text-green-500" />,
      render: (item) => (
        <div key={item.timestamp} className="border rounded-md p-3 mb-2 bg-white">
          <div className="font-medium text-[#324c48]">{item.url}</div>
          <div className="flex justify-between mt-1 text-sm">
            <span>{format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}</span>
            <span>Duration: {Math.floor(item.duration / 60)}m {item.duration % 60}s</span>
          </div>
        </div>
      )
    },
    searchHistory: {
      title: "Search History",
      icon: <Search className="h-5 w-5 text-orange-500" />,
      render: (item) => (
        <div key={item.timestamp} className="border rounded-md p-3 mb-2 bg-white">
          <div className="font-medium text-[#324c48]">"{item.query}"</div>
          <div className="flex justify-between mt-1 text-sm">
            <span>{format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}</span>
            <span>{item.results} results</span>
          </div>
        </div>
      )
    },
    offerHistory: {
      title: "Offer History",
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      render: (item) => (
        <div key={item.timestamp} className="border rounded-md p-3 mb-2 bg-white">
          <div className="font-medium text-[#324c48]">{item.propertyTitle}</div>
          <div className="text-sm text-gray-500">{item.propertyAddress}</div>
          <div className="flex justify-between mt-1">
            <span className="font-bold">${item.amount.toLocaleString()}</span>
            <Badge className={`
              ${item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
              ${item.status === 'Accepted' ? 'bg-green-100 text-green-800' : ''}
              ${item.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
              ${item.status === 'Countered' ? 'bg-blue-100 text-blue-800' : ''}
            `}>
              {item.status}
            </Badge>
          </div>
          <div className="text-sm mt-1">{format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}</div>
        </div>
      )
    },
    emailInteractions: {
      title: "Email Interactions",
      icon: <Mail className="h-5 w-5 text-indigo-500" />,
      render: (item) => (
        <div key={item.emailId} className="border rounded-md p-3 mb-2 bg-white">
          <div className="font-medium text-[#324c48]">{item.subject}</div>
          <div className="flex mt-1 text-sm">
            <span className={`${item.opened ? 'text-green-600' : 'text-gray-500'}`}>
              {item.opened ? 'Opened' : 'Not opened'}
              {item.opened && ` on ${format(new Date(item.openTimestamp), 'MMM d, yyyy h:mm a')}`}
            </span>
          </div>
          {item.clicks.length > 0 && (
            <div className="mt-2 border-t pt-2">
              <div className="text-sm font-medium">Clicked Links:</div>
              {item.clicks.map((click, idx) => (
                <div key={idx} className="text-sm ml-2">
                  • {click.url} ({format(new Date(click.timestamp), 'h:mm a')})
                </div>
              ))}
            </div>
          )}
        </div>
      )
    },
    sessionHistory: {
      title: "Session History",
      icon: <Smartphone className="h-5 w-5 text-gray-500" />,
      render: (item) => (
        <div key={item.loginTime} className="border rounded-md p-3 mb-2 bg-white">
          <div className="font-medium text-[#324c48]">{item.device}</div>
          <div className="text-sm text-gray-500">IP: {item.ipAddress}</div>
          <div className="flex justify-between mt-1 text-sm">
            <span>Login: {format(new Date(item.loginTime), 'MMM d, yyyy h:mm a')}</span>
            <span>Logout: {format(new Date(item.logoutTime), 'h:mm a')}</span>
          </div>
          <div className="text-sm mt-1">
            Duration: {Math.round((new Date(item.logoutTime) - new Date(item.loginTime)) / 60000)} minutes
          </div>
        </div>
      )
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center">
          {activityTypes[activity.type]?.icon && (
            <span className="mr-2">{activityTypes[activity.type].icon}</span>
          )}
          {activityTypes[activity.type]?.title || "Activity"}
        </h3>
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Summary
        </Button>
      </div>
      
      <div className="space-y-2">
        {activity.data.length > 0 ? (
          activity.data.map(item => activityTypes[activity.type].render(item))
        ) : (
          <div className="text-center p-4 text-gray-500">No data available</div>
        )}
      </div>
    </div>
  );
};

/**
 * Activity Summary Component - Shows an overview of all activity metrics
 */
const ActivitySummary = ({ activity, onViewDetail }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="border border-[#324c48]/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <Eye className="h-4 w-4 mr-2 text-blue-500" />
              Property Engagement
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Properties viewed:</span>
              <Badge variant="outline" className="bg-blue-50">
                {activity.propertyViews.length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total view time:</span>
              <span className="text-sm font-medium">
                {Math.floor(activity.propertyViews.reduce((total, view) => total + view.duration, 0) / 60)} minutes
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Most viewed property:</span>
              {activity.propertyViews.length > 0 ? (
                <span className="text-sm font-medium truncate max-w-[150px]">
                  {activity.propertyViews[0].propertyTitle}
                </span>
              ) : (
                <span className="text-sm text-gray-500">None</span>
              )}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-[#324c48]"
            onClick={() => onViewDetail({
              type: "propertyViews",
              data: activity.propertyViews
            })}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border border-[#324c48]/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-600" />
              Offer Activity
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Offers made:</span>
              <Badge variant="outline" className="bg-green-50">
                {activity.offerHistory.length}
              </Badge>
            </div>
            {activity.offerHistory.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Latest offer:</span>
                  <span className="text-sm font-medium">
                    ${activity.offerHistory[0].amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Latest status:</span>
                  <Badge className={`
                    ${activity.offerHistory[0].status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${activity.offerHistory[0].status === 'Accepted' ? 'bg-green-100 text-green-800' : ''}
                    ${activity.offerHistory[0].status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
                    ${activity.offerHistory[0].status === 'Countered' ? 'bg-blue-100 text-blue-800' : ''}
                  `}>
                    {activity.offerHistory[0].status}
                  </Badge>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500 py-2">No offers made yet</div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-[#324c48]" 
            disabled={activity.offerHistory.length === 0}
            onClick={() => onViewDetail({
              type: "offerHistory",
              data: activity.offerHistory
            })}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border border-[#324c48]/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <MousePointer className="h-4 w-4 mr-2 text-purple-500" />
              Interaction Data
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Click events:</span>
              <Badge variant="outline" className="bg-purple-50">
                {activity.clickEvents.length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Page visits:</span>
              <Badge variant="outline" className="bg-green-50">
                {activity.pageVisits.length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last active:</span>
              <span className="text-sm font-medium">
                {format(new Date(activity.lastActive), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#324c48]"
              onClick={() => onViewDetail({
                type: "clickEvents",
                data: activity.clickEvents
              })}
            >
              Click Details
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#324c48]"
              onClick={() => onViewDetail({
                type: "pageVisits",
                data: activity.pageVisits
              })}
            >
              Visit Details
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-[#324c48]/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <Search className="h-4 w-4 mr-2 text-orange-500" />
              Search Activity
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total searches:</span>
              <Badge variant="outline" className="bg-orange-50">
                {activity.searchHistory.length}
              </Badge>
            </div>
            {activity.searchHistory.length > 0 ? (
              <>
                <div>
                  <div className="text-sm mb-1">Recent searches:</div>
                  <div className="flex flex-wrap gap-1">
                    {activity.searchHistory.slice(0, 2).map((search, idx) => (
                      <Badge key={idx} variant="outline" className="bg-orange-50">
                        {search.query}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500 py-2">No search history</div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-[#324c48]"
            disabled={activity.searchHistory.length === 0}
            onClick={() => onViewDetail({
              type: "searchHistory",
              data: activity.searchHistory
            })}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border border-[#324c48]/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <Mail className="h-4 w-4 mr-2 text-indigo-500" />
              Email Engagement
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Emails received:</span>
              <Badge variant="outline" className="bg-indigo-50">
                {activity.emailInteractions.length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Open rate:</span>
              <span className="text-sm font-medium">
                {activity.emailInteractions.length > 0 
                  ? `${Math.round((activity.emailInteractions.filter(e => e.opened).length / activity.emailInteractions.length) * 100)}%`
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Click rate:</span>
              <span className="text-sm font-medium">
                {activity.emailInteractions.length > 0 
                  ? `${Math.round((activity.emailInteractions.filter(e => e.clicks.length > 0).length / activity.emailInteractions.length) * 100)}%`
                  : "N/A"}
              </span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-[#324c48]"
            disabled={activity.emailInteractions.length === 0}
            onClick={() => onViewDetail({
              type: "emailInteractions",
              data: activity.emailInteractions
            })}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border border-[#324c48]/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <Smartphone className="h-4 w-4 mr-2 text-gray-500" />
              Session Data
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total sessions:</span>
              <Badge variant="outline" className="bg-gray-50">
                {activity.sessionHistory.length}
              </Badge>
            </div>
            {activity.sessionHistory.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last login:</span>
                  <span className="text-sm font-medium">
                    {format(new Date(activity.sessionHistory[0].loginTime), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Device:</span>
                  <span className="text-sm font-medium truncate max-w-[150px]">
                    {activity.sessionHistory[0].device.split(' ')[0]}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500 py-2">No session data</div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-[#324c48]"
            disabled={activity.sessionHistory.length === 0}
            onClick={() => onViewDetail({
              type: "sessionHistory",
              data: activity.sessionHistory
            })}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Main Activity Detail View component
 * Displays a detailed dashboard of buyer activity with both summary and detailed views
 */
const ActivityDetailView = ({ activity, buyer }) => {
  const [viewMode, setViewMode] = useState("summary");
  const [detailActivity, setDetailActivity] = useState(null);

  const handleViewDetail = (activityData) => {
    setDetailActivity(activityData);
    setViewMode("detail");
  };

  const handleBackToSummary = () => {
    setDetailActivity(null);
    setViewMode("summary");
  };

  if (!activity) {
    return (
      <div className="text-center p-8">
        <p>No activity data available for this buyer.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Buyer Activity Dashboard</CardTitle>
            <CardDescription>
              Detailed tracking of user engagement and behavior
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#324c48] px-3 py-1 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Last active: {format(new Date(activity.lastActive), 'MMM d, yyyy')}</span>
            </Badge>
            <div className="flex items-center">
              <div className="font-bold text-lg mr-2">{activity.engagementScore}</div>
              <div className="w-16 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    activity.engagementScore >= 80 ? 'bg-green-500' :
                    activity.engagementScore >= 50 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${activity.engagementScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "summary" ? (
          <ActivitySummary activity={activity} onViewDetail={handleViewDetail} />
        ) : (
          <ActivityDetail activity={detailActivity} onBack={handleBackToSummary} />
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityDetailView;