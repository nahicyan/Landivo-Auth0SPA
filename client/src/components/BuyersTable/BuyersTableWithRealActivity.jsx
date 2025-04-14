// client/src/components/BuyersTable/BuyersTableWithRealActivity.jsx
import React, { useState } from "react";
import BuyersTable from "./BuyersTable";
import ActivityDetailViewReal from "./ActivityDetailViewReal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import RealActivityDataProvider from "@/services/RealActivityDataProvider";

/**
 * Enhanced BuyersTable component that shows real activity data
 * This component wraps the original BuyersTable and handles displaying real activity data
 */
const BuyersTableWithRealActivity = (props) => {
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [selectedBuyerForActivity, setSelectedBuyerForActivity] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  /**
   * Handle viewing buyer activity
   * @param {Object} buyer - Buyer object
   */
  const handleViewActivity = async (buyer) => {
    if (!buyer || !buyer.id) {
      console.error("Cannot view activity: Missing buyer or buyer ID");
      return;
    }
    
    setSelectedBuyerForActivity(buyer);
    setActivityDialogOpen(true);
    setLoading(true);
    
    try {
      // If this buyer is a VIP buyer with an auth0Id, fetch their real activity data
      if (buyer.auth0Id) {
        console.log(`Fetching real activity data for VIP buyer: ${buyer.id}`);
        const activitySummary = await RealActivityDataProvider.getActivitySummary(buyer.id);
        setActivityData(activitySummary);
      } else {
        // For non-VIP buyers or those without auth0Id, use the mock data generation
        // The mock data will now be generated inside ActivityDetailViewReal if no real data is provided
        console.log(`No real activity data for buyer: ${buyer.id}, using mock data`);
        setActivityData(null);
      }
    } catch (error) {
      console.error("Error fetching activity data:", error);
      // Even on error, we still show the activity dialog with a fallback to mock data
      setActivityData(null);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      {/* Original BuyersTable with enhanced onViewActivity prop */}
      <BuyersTable 
        {...props}
        onViewActivity={handleViewActivity}
      />
      
      {/* Activity Detail Dialog with Real Data */}
      <Dialog 
        open={activityDialogOpen} 
        onOpenChange={setActivityDialogOpen}
      >
        <DialogContent className="max-w-4xl">
          <div className="max-h-[70vh] overflow-y-auto">
            {selectedBuyerForActivity && (
              loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-[#324c48] mb-4" />
                  <p className="text-[#324c48]">Loading buyer activity data...</p>
                </div>
              ) : (
                <ActivityDetailViewReal 
                  buyer={selectedBuyerForActivity} 
                  activityData={activityData}
                />
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BuyersTableWithRealActivity;