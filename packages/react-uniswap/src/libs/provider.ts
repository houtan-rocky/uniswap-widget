import { ethers } from "ethers";
import {
  getChainRateLimitSettings,
  RATE_LIMIT_CONFIG,
} from "../config/rateLimit";

// Base chain configuration (8453)
const BASE_CHAIN_CONFIG = {
  chainId: 8453,
  name: "Base",
  rpcUrl: "/api/base-rpc", // Use proxy to bypass CORS
  throttleLimit: 3,
  minInterval: 2000, // 2 seconds between requests
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
};

// Provider cache
const providerCache = new Map<number, ethers.providers.JsonRpcProvider>();

// Rate limiting to prevent excessive API calls
const requestCache = new Map<string, { result: unknown; timestamp: number }>();
const requestQueue = new Map<number, Promise<unknown>>();

/**
 * Debounced request handler to prevent duplicate API calls
 */
function debouncedRequest<T>(
  chainId: number,
  requestKey: string,
  requestFn: () => Promise<T>
): Promise<T> {
  const cacheKey = `${chainId}-${requestKey}`;
  const chainSettings = getChainRateLimitSettings();

  // Check cache first
  const cached = requestCache.get(cacheKey);
  if (
    cached &&
    Date.now() - cached.timestamp < RATE_LIMIT_CONFIG.CACHE_DURATION
  ) {
    return Promise.resolve(cached.result as T);
  }

  // Check if request is already in progress
  if (requestQueue.has(chainId)) {
    return requestQueue.get(chainId)! as Promise<T>;
  }

  // Check minimum request interval for this chain
  const lastRequestTime = cached?.timestamp || 0;
  const timeSinceLastRequest = Date.now() - lastRequestTime;
  if (timeSinceLastRequest < chainSettings.MIN_REQUEST_INTERVAL) {
    // Wait for the minimum interval
    const waitTime = chainSettings.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    const promise = new Promise<T>((resolve, reject) => {
      setTimeout(async () => {
        try {
          const result = await requestFn();
          // Cache the result
          requestCache.set(cacheKey, { result, timestamp: Date.now() });
          requestQueue.delete(chainId);
          resolve(result);
        } catch (error) {
          requestQueue.delete(chainId);
          reject(error);
        }
      }, waitTime);
    });

    requestQueue.set(chainId, promise);
    return promise;
  }

  // Make new request
  const promise = requestFn()
    .then((result) => {
      // Cache the result
      requestCache.set(cacheKey, { result, timestamp: Date.now() });
      // Remove from queue
      requestQueue.delete(chainId);
      return result as T;
    })
    .catch((error) => {
      // Remove from queue on error
      requestQueue.delete(chainId);
      throw error;
    });

  requestQueue.set(chainId, promise);
  return promise;
}

/**
 * Get provider for Base chain only
 * @param chainId - Optional chain ID (will always use Base)
 * @returns ethers provider for Base chain
 */
export function getProvider(
  chainId?: number
): ethers.providers.JsonRpcProvider {
  // Always use Base chain
  const targetChainId = BASE_CHAIN_CONFIG.chainId;

  if (chainId && chainId !== BASE_CHAIN_CONFIG.chainId) {
    console.warn(
      `Chain ID ${chainId} not supported. Using Base chain (${BASE_CHAIN_CONFIG.chainId})`
    );
  }

  // Check if provider is already cached
  if (providerCache.has(targetChainId)) {
    return providerCache.get(targetChainId)!;
  }

  // Get chain-specific rate limit settings
  const chainSettings = getChainRateLimitSettings();

  // Create new provider with connection limits
  const provider = new ethers.providers.JsonRpcProvider({
    url: BASE_CHAIN_CONFIG.rpcUrl,
    throttleLimit: chainSettings.THROTTLE_LIMIT,
  });

  // Cache the provider
  providerCache.set(targetChainId, provider);

  return provider;
}

/**
 * Get provider for multiple chains (will return Base for all)
 * @param chainIds - Array of chain IDs
 * @returns Map of chainId to Base provider
 */
export function getMultiChainProviders(
  chainIds: number[]
): Map<number, ethers.providers.JsonRpcProvider> {
  const providers = new Map<number, ethers.providers.JsonRpcProvider>();
  const baseProvider = getProvider();

  for (const chainId of chainIds) {
    providers.set(chainId, baseProvider);
  }

  return providers;
}

/**
 * Get supported chain IDs (only Base)
 */
export function getSupportedChainIds(): number[] {
  return [BASE_CHAIN_CONFIG.chainId];
}

/**
 * Get chain configuration (only Base)
 */
export function getChainConfig(chainId: number) {
  if (chainId !== BASE_CHAIN_CONFIG.chainId) {
    console.warn(
      `Chain ID ${chainId} not supported. Returning Base chain config.`
    );
  }
  return BASE_CHAIN_CONFIG;
}

/**
 * Check if a chain is supported (only Base)
 */
export function isSupportedChain(chainId: number): boolean {
  return chainId === BASE_CHAIN_CONFIG.chainId;
}

/**
 * Clear request cache (useful for testing or manual refresh)
 */
export function clearRequestCache(): void {
  requestCache.clear();
  requestQueue.clear();
}

/**
 * Wrapper for provider requests with rate limiting
 */
export async function makeProviderRequest<T>(
  chainId: number,
  requestKey: string,
  requestFn: (provider: ethers.providers.JsonRpcProvider) => Promise<T>
): Promise<T> {
  const provider = getProvider(chainId);

  return debouncedRequest(chainId, requestKey, () => requestFn(provider));
}
