// client/src/pages/Property/PropertyWithTracking.jsx
import React, { useEffect } from 'react';
import Property from './Property';
import { useActivityTrackingContext } from '@/components/ActivityTracking/ActivityTrackingProvider';
import { useVipBuyer } from '@/utils/VipBuyerContext';

/**
 * Enhanced Property page component with VIP buyer activity tracking
 * Tracks property views and other interactions
 */
const PropertyWithTracking = (props) => {
  const { trackPropertyView, trackEvent } = useActivityTrackingContext();
  const { isVipBuyer } = useVipBuyer();
  
  useEffect(() => {
    // Only track for VIP buyers
    if (!isVipBuyer) return;
    
    const propertyData = props.propertyData || {};
    
    // Track property view when the component mounts
    if (propertyData.id) {
      trackPropertyView(propertyData);
      
      // Track additional property details for more comprehensive analytics
      trackEvent('property_details_view', {
        propertyId: propertyData.id,
        propertyTitle: propertyData.title,
        propertyAddress: propertyData.streetAddress,
        area: propertyData.area,
        askingPrice: propertyData.askingPrice,
        financing: propertyData.financing,
        status: propertyData.status,
        type: propertyData.type,
        acreage: propertyData.acre,
        sqft: propertyData.sqft
      });
    }

    // Track when user leaves the property page
    return () => {
      if (propertyData.id) {
        trackEvent('property_exit', {
          propertyId: propertyData.id,
          exitTime: new Date().toISOString()
        });
      }
    };
  }, [isVipBuyer, trackPropertyView, trackEvent, props.propertyData]);

  // Render the original Property component with all original props
  return <Property {...props} />;
};

export default PropertyWithTracking;