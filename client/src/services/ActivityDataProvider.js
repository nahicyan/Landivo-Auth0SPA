// Updated ActivityDataProvider.js
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
      // Request all data without pagination limit
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
    if (!searchHistory || !Array.isArray(searchHistory)) {
      console.warn('Invalid search history data:', searchHistory);
      return [];
    }
    
    return searchHistory.map(search => {
      const data = search.eventData || {};
      return {
        query: data.query || 'Unknown search',
        timestamp: search.timestamp,
        results: data.resultsCount || 0,
        searchType: data.searchType || 'standard',
        context: data.context || '',
        area: data.area || null,
        filters: data.filters || {}
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
    if (!sessionHistory || !Array.isArray(sessionHistory)) {
      console.warn('Invalid session history data:', sessionHistory);
      return [];
    }
  
    return sessionHistory.map(session => {
      // Ensure timestamps are valid
      let loginTime = session.loginTime;
      let logoutTime = session.logoutTime;
      
      // Validate date strings and ensure they're in ISO format if needed
      if (loginTime && typeof loginTime === 'string') {
        try {
          // Ensure it's a valid date string
          new Date(loginTime).toISOString();
        } catch (e) {
          console.warn('Invalid login time:', loginTime);
          loginTime = null;
        }
      }
      
      if (logoutTime && typeof logoutTime === 'string') {
        try {
          // Ensure it's a valid date string
          new Date(logoutTime).toISOString();
        } catch (e) {
          console.warn('Invalid logout time:', logoutTime);
          logoutTime = null;
        }
      }
      
      return {
        loginTime: loginTime || new Date().toISOString(), // Fallback to current time
        logoutTime: logoutTime || null,
        device: session.eventData?.device || session.device || 
                session.userAgent || session.eventData?.userAgent || 
                'Unknown device',
        ipAddress: session.ipAddress || session.eventData?.ipAddress || 'Unknown'
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
      // Increase the limit to ensure we get all records
      const highLimit = options.limit || 500;
      
      // Fetch specific activity type from API
      const response = await getBuyerActivity(buyerId, {
        type: this._mapActivityTypeToApiType(activityType),
        limit: highLimit,
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
      'searchQuery': 'search_query',
      'offerHistory': 'offer_submission',
      'emailInteractions': 'email_interaction',
      'sessionHistory': 'session_start'
    };
    
    return mapping[activityType] || activityType;
  }
}