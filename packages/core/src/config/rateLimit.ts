/**
 * Rate limiting configuration for API calls - Base chain only
 * Adjust these values to control the frequency of API calls to Base chain
 */

export const RATE_LIMIT_CONFIG = {
  // Cache duration in milliseconds
  CACHE_DURATION: 15000, // 15 seconds
  
  // Debounce delays in milliseconds
  BALANCE_DEBOUNCE: 500,    // Balance fetching debounce
  QUOTE_DEBOUNCE: 1000,      // Quote fetching debounce
  SEARCH_DEBOUNCE: 500,     // Token search debounce
  
  // Provider throttle limits (concurrent requests per provider)
  PROVIDER_THROTTLE_LIMIT: 3, // Conservative for Base
  
  // Minimum interval between identical requests (milliseconds)
  MIN_REQUEST_INTERVAL: 5000, // 5 seconds for Base
  
  // Base chain specific settings
  CHAIN_SETTINGS: {
    // Base chain (8453) - optimized settings
    8453: {
      THROTTLE_LIMIT: 1,
      MIN_REQUEST_INTERVAL: 5000, // 5 seconds
    },
  } as Record<number, { THROTTLE_LIMIT: number; MIN_REQUEST_INTERVAL: number }>
};

/**
 * Get rate limit settings for Base chain
 */
export function getChainRateLimitSettings() {
  // Always return Base chain settings
  return RATE_LIMIT_CONFIG.CHAIN_SETTINGS[8453] || {
    THROTTLE_LIMIT: RATE_LIMIT_CONFIG.PROVIDER_THROTTLE_LIMIT,
    MIN_REQUEST_INTERVAL: RATE_LIMIT_CONFIG.MIN_REQUEST_INTERVAL,
  };
} 