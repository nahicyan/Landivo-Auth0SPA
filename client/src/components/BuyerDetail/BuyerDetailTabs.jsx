import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getProperty } from "@/utils/api";
import { formatPrice } from "@/utils/format";
import { format } from "date-fns";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BarChart } from "@/components/ui/bar-chart";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Activity,
  TrendingUp,
  DollarSign,
  BadgeDollarSign,
  Calendar,
  Mail,
  ArrowRightLeft,
  Building,
  MapPin,
  Eye,
  FileText,
  Download,
} from "lucide-react";

const BuyerDetailTabs = ({ buyer }) => {
  const [activeTab, setActiveTab] = useState("activity");
  const [propertyDetails, setPropertyDetails] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate activity data for visualization (in a real app, this would come from the backend)
  const activityData = generateActivityData(buyer);

  useEffect(() => {
    if (buyer?.offers && buyer.offers.length > 0) {
      const fetchPropertyDetails = async () => {
        setIsLoading(true);
        const details = {};
        const processedTransactions = [];

        for (const offer of buyer.offers) {
          try {
            // Fetch property details
            const property = await getProperty(offer.propertyId);
            details[offer.propertyId] = property;
            
            // Calculate profit for this transaction
            const purchasePrice = property.purchasePrice || 0;
            const sellingPrice = offer.offeredPrice || 0;
            const profit = sellingPrice - purchasePrice;
            const profitMargin = purchasePrice > 0 ? (profit / purchasePrice) * 100 : 0;
            
            // Add transaction
            processedTransactions.push({
              id: offer.id,
              date: new Date(offer.timestamp),
              property,
              offer,
              profit,
              profitMargin,
              status: determineTransactionStatus(offer, property)
            });
          } catch (error) {
            console.error(`Error fetching property ${offer.propertyId}:`, error);
          }
        }
        
        // Sort transactions by date (most recent first)
        processedTransactions.sort((a, b) => b.date - a.date);
        
        setPropertyDetails(details);
        setTransactions(processedTransactions);
        setIsLoading(false);
      };
      
      fetchPropertyDetails();
    } else {
      setIsLoading(false);
    }
  }, [buyer]);

  // Helper function to determine transaction status
  function determineTransactionStatus(offer, property) {
    // In a real app, this would use actual status data
    // For now, we'll simulate some statuses based on date and price
    const offerDate = new Date(offer.timestamp);
    const currentDate = new Date();
    const daysSinceOffer = Math.floor((currentDate - offerDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceOffer < 3) return "pending";
    if (offer.offeredPrice >= property.askingPrice) return "accepted";
    if (offer.offeredPrice < property.minPrice) return "rejected";
    
    // For older offers with price between min and asking, randomly assign status
    const statuses = ["accepted", "rejected", "countered", "closed"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  // Helper function to get status badge color
  function getStatusBadgeClass(status) {
    switch(status) {
      case "accepted": return "bg-green-50 text-green-600 border-green-200";
      case "pending": return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "rejected": return "bg-red-50 text-red-600 border-red-200";
      case "countered": return "bg-blue-50 text-blue-600 border-blue-200";
      case "closed": return "bg-purple-50 text-purple-600 border-purple-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  }

  // Helper function to format profit with color and sign
  function formatProfit(profit) {
    if (profit === null || profit === undefined) return "-";
    
    const formattedValue = formatPrice(Math.abs(profit));
    const isPositive = profit > 0;
    
    return (
      <span className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingUp className="w-4 h-4 mr-1 transform rotate-180" />}
        {isPositive ? '+' : '-'}${formattedValue}
      </span>
    );
  }

  // Helper function to generate activity data for visualization
  function generateActivityData(buyer) {
    if (!buyer) return [];

    // In a real app, this would come from actual activity data
    // For now, we'll generate some sample data
    
    // Use buyer ID to generate consistent random numbers
    const idHash = buyer.id?.substring(0, 8) || "";
    const seed = parseInt(idHash, 16) || Date.now();
    
    // Create date-based activity data for the last 14 days
    const activityData = [];
    const today = new Date();
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate pseudo-random activity count based on buyer ID and date
      const dateHash = date.getDate() + (date.getMonth() + 1) * 31;
      const combinedHash = (seed + dateHash) % 1000;
      const activityCount = Math.max(0, Math.floor((combinedHash % 100) / 10));
      
      activityData.push({
        date: format(date, 'MMM dd'),
        Activity: activityCount
      });
    }
    
    return activityData;
  }

  // Activity metrics
  const totalOffers = buyer?.offers?.length || 0;
  const totalProfit = transactions.reduce((sum, t) => sum + (t.profit || 0), 0);
  const averageProfit = totalOffers > 0 ? totalProfit / totalOffers : 0;
  const successRate = transactions.filter(t => t.status === "accepted" || t.status === "closed").length / (totalOffers || 1) * 100;

  return (
    <Tabs defaultValue="activity" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="activity" className="flex items-center">
          <Activity className="h-4 w-4 mr-2" />
          Activity
        </TabsTrigger>
        <TabsTrigger value="profit" className="flex items-center">
          <BadgeDollarSign className="h-4 w-4 mr-2" />
          Profit & Transactions
        </TabsTrigger>
      </TabsList>
      
      {/* Activity Tab */}
      <TabsContent value="activity" className="space-y-4">
        {/* Activity Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Offers</CardDescription>
              <CardTitle className="text-2xl">{totalOffers}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Success Rate</CardDescription>
              <CardTitle className="text-2xl">{successRate.toFixed(0)}%</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Profit</CardDescription>
              <CardTitle className={`text-2xl ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${formatPrice(Math.abs(totalProfit))}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg. Profit per Offer</CardDescription>
              <CardTitle className={`text-2xl ${averageProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${formatPrice(Math.abs(averageProfit))}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>
              Tracking offers, views, and other interactions over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activityData.length > 0 ? (
              <div className="h-[300px]">
                <BarChart 
                  data={activityData}
                  index="date"
                  categories={["Activity"]}
                  colors={["#4f46e5"]}
                  valueFormatter={(value) => `${value} actions`}
                  showLegend={false}
                />
              </div>
            ) : (
              <div className="flex justify-center items-center h-[300px]">
                <p className="text-gray-500">No activity data available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : transactions.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-start gap-4 pb-4 border-b border-gray-100">
                      <div className="p-2 rounded-full bg-blue-50">
                        {transaction.status === "accepted" || transaction.status === "closed" ? (
                          <BadgeDollarSign className="h-6 w-6 text-blue-600" />
                        ) : transaction.status === "rejected" ? (
                          <ArrowRightLeft className="h-6 w-6 text-red-600" />
                        ) : (
                          <Calendar className="h-6 w-6 text-yellow-600" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">
                          {transaction.status === "accepted" 
                            ? "Offer accepted" 
                            : transaction.status === "rejected"
                            ? "Offer rejected"
                            : transaction.status === "closed"
                            ? "Deal closed"
                            : transaction.status === "countered"
                            ? "Offer countered"
                            : "Offer submitted"}
                          <span className="font-normal text-gray-600"> on </span>
                          {transaction.property.title || transaction.property.streetAddress}
                        </p>
                        <p className="text-sm text-gray-600">
                          Offered ${formatPrice(transaction.offer.offeredPrice)} 
                          {transaction.profit !== 0 && (
                            <span className={transaction.profit > 0 ? "text-green-600" : "text-red-600"}>
                              {" "}({transaction.profit > 0 ? "+" : "-"}${formatPrice(Math.abs(transaction.profit))})
                            </span>
                          )}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(transaction.date, "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex justify-center items-center h-[100px]">
                <p className="text-gray-500">No activity recorded yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Profit & Transactions Tab */}
      <TabsContent value="profit" className="space-y-4">
        {/* Profit Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Transactions</CardDescription>
              <CardTitle className="text-2xl">{totalOffers}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Profit</CardDescription>
              <CardTitle className={`text-2xl ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${formatPrice(Math.abs(totalProfit))}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Highest Profit</CardDescription>
              <CardTitle className="text-2xl text-green-600">
                ${formatPrice(Math.max(...transactions.map(t => t.profit || 0), 0))}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average Profit Margin</CardDescription>
              <CardTitle className="text-2xl">
                {transactions.length > 0 
                  ? (transactions.reduce((sum, t) => sum + (t.profitMargin || 0), 0) / transactions.length).toFixed(1)
                  : "0"}%
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        
        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              Complete history of offers and profits
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
              </div>
            ) : transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cost Price</TableHead>
                      <TableHead>Offered Price</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead>Margin</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {format(transaction.date, "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate">
                            {transaction.property.title || transaction.property.streetAddress}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {transaction.property.city}, {transaction.property.state}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={getStatusBadgeClass(transaction.status)}
                          >
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                            {formatPrice(transaction.property.purchasePrice || 0)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                            {formatPrice(transaction.offer.offeredPrice)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatProfit(transaction.profit)}
                        </TableCell>
                        <TableCell>
                          <span className={transaction.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {transaction.profitMargin.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => window.open(`/properties/${transaction.property.id}`, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => window.open(`/admin/buyers/${buyer.id}/offers`, '_blank')}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-24 text-center">
                <BadgeDollarSign className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions found</h3>
                <p className="text-gray-500">
                  This buyer hasn't made any offers yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default BuyerDetailTabs;