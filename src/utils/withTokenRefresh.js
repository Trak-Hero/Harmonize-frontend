// utils/withTokenRefresh.js - Updated token refresh utility
const withTokenRefresh = async (apiCall, refreshCall, maxRetries = 1) => {
  try {
    console.log('[withTokenRefresh] Making initial API call...');
    const response = await apiCall();
    
    // If the call succeeds, return the response
    if (response && response.ok) {
      console.log('[withTokenRefresh] API call successful');
      return response;
    }
    
    // If we get a 401 (unauthorized), try to refresh the token
    if (response && response.status === 401 && maxRetries > 0) {
      console.log('[withTokenRefresh] Got 401, attempting token refresh...');
      
      try {
        const refreshResponse = await refreshCall();
        
        if (refreshResponse && refreshResponse.ok) {
          console.log('[withTokenRefresh] Token refresh successful, retrying API call...');
          // Retry the original API call
          return await withTokenRefresh(apiCall, refreshCall, maxRetries - 1);
        } else {
          console.log('[withTokenRefresh] Token refresh failed:', refreshResponse?.status);
          return response; // Return the original 401 response
        }
      } catch (refreshError) {
        console.error('[withTokenRefresh] Token refresh error:', refreshError);
        return response; // Return the original 401 response
      }
    }
    
    // For other error status codes or if we're out of retries, return the response
    console.log('[withTokenRefresh] Returning response with status:', response?.status);
    return response;
    
  } catch (error) {
    console.error('[withTokenRefresh] API call failed with error:', error);
    
    // If it's a network error and we haven't tried refreshing, try once
    if (maxRetries > 0 && refreshCall) {
      try {
        console.log('[withTokenRefresh] Network error, trying token refresh...');
        const refreshResponse = await refreshCall();
        
        if (refreshResponse && refreshResponse.ok) {
          console.log('[withTokenRefresh] Token refresh successful after network error, retrying...');
          return await withTokenRefresh(apiCall, refreshCall, maxRetries - 1);        
        }
      } catch (refreshError) {
        console.error('[withTokenRefresh] Token refresh failed after network error:', refreshError);
      }
    }
    
    // If all else fails, throw the original error
    throw error;
  }
};

export default withTokenRefresh;