// client/src/components/Offer/OfferWithTracking.jsx
import React, { useEffect, useRef } from 'react';
import Offer from './Offer';
import { useActivityTrackingContext } from '@/components/ActivityTracking/ActivityTrackingProvider';
import { useVipBuyer } from '@/utils/VipBuyerContext';

/**
 * Enhanced Offer component with VIP buyer activity tracking
 * Tracks offer form interactions and submissions
 */
const OfferWithTracking = (props) => {
  const { trackEvent, trackOfferSubmission } = useActivityTrackingContext();
  const { isVipBuyer } = useVipBuyer();
  const formInteractionTracked = useRef(false);
  
  // Track when the offer form is shown
  useEffect(() => {
    if (!isVipBuyer) return;
    
    const propertyData = props.propertyData || {};
    
    if (propertyData.id) {
      trackEvent('offer_form_view', {
        propertyId: propertyData.id,
        propertyTitle: propertyData.title,
        askingPrice: propertyData.askingPrice
      });
    }
  }, [isVipBuyer, trackEvent, props.propertyData]);
  
  // Create modified handlers to track interactions
  const handleFormInteraction = () => {
    if (!isVipBuyer || formInteractionTracked.current) return;
    
    const propertyData = props.propertyData || {};
    
    if (propertyData.id) {
      trackEvent('offer_form_interaction', {
        propertyId: propertyData.id
      });
      formInteractionTracked.current = true;
    }
  };
  
  const handleSubmit = (offerData) => {
    if (isVipBuyer && offerData) {
      // Track the offer submission
      trackOfferSubmission(offerData);
    }
    
    // Call the original onSubmit handler if it exists
    if (props.onSubmit) {
      props.onSubmit(offerData);
    }
  };
  
  // Pass the additional tracking handlers to the original Offer component
  const enhancedProps = {
    ...props,
    onSubmit: handleSubmit,
    // If Offer component doesn't have these handlers, we'll need to modify it
    // to accept and use them internally, or intercept events differently
    onFormFocus: handleFormInteraction,
    onFormChange: handleFormInteraction
  };
  
  return <Offer {...enhancedProps} />;
};

export default OfferWithTracking;