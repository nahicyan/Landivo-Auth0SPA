// client/src/services/ActivityDataProvider.js
import { getBuyerActivity, getBuyerActivitySummary } from '@/utils/api';

/**
 * Service for fetching buyer activity data for the ActivityDetailView
 */
export default class ActivityDataProvider {
  /**
   * Fetch activity summary for a buyer
   * @param {string} buyerId - Buyer ID
   * @returns {Promise<Object>} Activity summary data
   */
  static async getActivitySummary(buyerId) {
    try {
      const summary = await getBuyerActivitySummary(buyerId);
      
      // Transform the API data into the format expected by ActivityDetailView
      return {
        buyerId: summary.buyerId,
        buyerName: summary.buyerName,
        propertyViews: this._formatPropertyViews(summary.propertyViews),
        clickEvents: this._formatClickEvents(summary.clickEvents),
        pageVisits: this._formatPageVisits(summary.pageViews),
        searchHistory: this._formatSearchHistory(summary.searchHistory),
        offerHistory: this._formatOfferHistory(summary.offerHistory),
        emailInteractions: this._formatEmailInteractions(summary.emailInteractions || []),
        sessionHistory: this._formatSessionHistory(summary.sessionHistory),
        engagementScore: summary.engagementScore || 0,
        lastActive: summary.lastActive || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching activity summary:', error);
      throw error;
    }
  }

  /**
   * Format property views data
   * @private
   * @param {Array} propertyViews - Raw property views data
   * @returns {Array} Formatted property views
   */
  static _formatPropertyViews(propertyViews = []) {
    if (!propertyViews || !Array.isArray(propertyViews)) {
      console.warn('Invalid property views data:', propertyViews);
      return [];
    }
    
    console.log('Formatting property views:', propertyViews);
    
    return propertyViews.map(view => {
      // Extract data from eventData if present, otherwise from the top level
      const data = view.eventData || {};
      
      return {
        propertyId: data.propertyId || view.propertyId,
        propertyTitle: data.propertyTitle || 'Unknown Property',
        propertyAddress: data.propertyAddress || 'Address not available',
        timestamp: view.timestamp || new Date().toISOString(),
        duration: data.duration || 60, // Default to 60 seconds if not available
        details: data.details || 'Viewed property details'
      };
    });
  }
  

  /**
   * Format click events data
   * @private
   * @param {Array} clickEvents - Raw click events data
   * @returns {Array} Formatted click events
   */
  static _formatClickEvents(clickEvents = []) {
    return clickEvents.map(click => {
      const data = click.eventData || {};
      return {
        element: data.elementType || data.element || 'Unknown element',
        page: data.path || data.page || click.page || 'Unknown page',
        timestamp: click.timestamp
      };
    });
  }

  /**
   * Format page visits data
   * @private
   * @param {Array} pageVisits - Raw page visits data
   * @returns {Array} Formatted page visits
   */
  static _formatPageVisits(pageVisits = []) {
    return pageVisits.map(visit => {
      const data = visit.eventData || {};
      return {
        url: data.path || data.url || visit.page || 'Unknown page',
        timestamp: visit.timestamp,
        duration: data.duration || 60 // Default to 60 seconds if not available
      };
    });
  }

  /**
   * Format search history data
   * @private
   * @param {Array} searchHistory - Raw search history data
   * @returns {Array} Formatted search history
   */
  static _formatSearchHistory(searchHistory = []) {
    return searchHistory.map(search => {
      const data = search.eventData || {};
      return {
        query: data.query || 'Unknown search',
        timestamp: search.timestamp,
        results: data.resultsCount || 0
      };
    });
  }

  /**
   * Format offer history data
   * @private
   * @param {Array} offerHistory - Raw offer history data
   * @returns {Array} Formatted offer history
   */
  static _formatOfferHistory(offerHistory = []) {
    return offerHistory.map(offer => {
      const property = offer.property || {};
      return {
        propertyId: offer.propertyId,
        propertyTitle: property.title || 'Unknown Property',
        propertyAddress: property.streetAddress ? 
          `${property.streetAddress}, ${property.city || ''}, ${property.state || ''}` : 
          'Address not available',
        amount: offer.offeredPrice,
        status: offer.status || 'Pending',
        timestamp: offer.timestamp
      };
    });
  }

  /**
   * Format email interactions data
   * @private
   * @param {Array} emailInteractions - Raw email interactions data
   * @returns {Array} Formatted email interactions
   */
  static _formatEmailInteractions(emailInteractions = []) {
    return emailInteractions.map(email => {
      const data = email.eventData || {};
      return {
        emailId: email.id || `email-${Date.now()}`,
        subject: data.subject || 'Email from Landivo',
        opened: data.opened || true,
        openTimestamp: email.timestamp,
        clicks: (data.clicks || []).map(click => ({
          url: click.url,
          timestamp: click.timestamp
        }))
      };
    });
  }

  /**
   * Format session history data
   * @private
   * @param {Array} sessionHistory - Raw session history data
   * @returns {Array} Formatted session history
   */
  static _formatSessionHistory(sessionHistory = []) {
    return sessionHistory.map(session => {
      return {
        loginTime: session.loginTime,
        logoutTime: session.logoutTime,
        device: session.device || 'Unknown device',
        ipAddress: session.ipAddress || 'Unknown IP'
      };
    });
  }

  /**
   * Get detailed activity data for a specific category
   * @param {string} buyerId - Buyer ID
   * @param {string} activityType - Type of activity to fetch
   * @param {Object} options - Fetch options (limit, page, etc.)
   * @returns {Promise<Array>} Detailed activity data
   */
  static async getDetailedActivity(buyerId, activityType, options = {}) {
    try {
      // Fetch specific activity type from API
      const response = await getBuyerActivity(buyerId, {
        type: this._mapActivityTypeToApiType(activityType),
        limit: options.limit || 50,
        page: options.page || 1
      });
      
      // Format the data based on activity type
      switch (activityType) {
        case 'propertyViews':
          return this._formatPropertyViews(response.activities);
        case 'clickEvents':
          return this._formatClickEvents(response.activities);
        case 'pageVisits':
          return this._formatPageVisits(response.activities);
        case 'searchHistory':
          return this._formatSearchHistory(response.activities);
        case 'offerHistory':
          // Offer history might come from a different endpoint
          return response.activities;
        case 'emailInteractions':
          return this._formatEmailInteractions(response.activities);
        case 'sessionHistory':
          return this._formatSessionHistory(response.activities);
        default:
          return response.activities;
      }
    } catch (error) {
      console.error(`Error fetching detailed ${activityType}:`, error);
      throw error;
    }
  }

  /**
   * Map activity type to API event type
   * @private
   * @param {string} activityType - Activity type from UI
   * @returns {string} API event type
   */
  static _mapActivityTypeToApiType(activityType) {
    const mapping = {
      'propertyViews': 'property_view', // Make sure this matches the event type in MongoDB
      'clickEvents': 'click',
      'pageVisits': 'page_view',
      'searchHistory': 'search',
      'offerHistory': 'offer_submission',
      'emailInteractions': 'email_interaction',
      'sessionHistory': 'session_start'
    };
    
    return mapping[activityType] || activityType;
  }
}