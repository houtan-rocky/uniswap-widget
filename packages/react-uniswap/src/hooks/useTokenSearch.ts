import { useCallback, useState, useRef } from "react";
import { RATE_LIMIT_CONFIG } from "../config/rateLimit";
import { TokenInfo, UniswapSearchResponse, UniswapSearchTokenResponse } from "../types";

export function useTokenSearch() {
  const [searchResults, setSearchResults] = useState<TokenInfo[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  // Refs to manage debouncing and request cancellation
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentAbortControllerRef = useRef<AbortController | null>(null);

  // Convert Uniswap API response to our TokenInfo format
  const convertToTokenInfo = (uniswapToken: UniswapSearchTokenResponse): TokenInfo => ({
    address: uniswapToken.address,
    symbol: uniswapToken.symbol,
    name: uniswapToken.name,
    decimals: uniswapToken.decimals,
    chainId: uniswapToken.chainId,
    feeData: uniswapToken.feeData,
    protectionInfo: uniswapToken.protectionInfo,
    standard: uniswapToken.standard,
    projectName: uniswapToken.projectName,
    isSpam: uniswapToken.isSpam,
    safetyLevel: uniswapToken.safetyLevel,
    tokenId: uniswapToken.tokenId,
    logoURI: uniswapToken.logoUrl || "",
  });

  const searchTokens = useCallback(async (query: string): Promise<TokenInfo[]> => {
    // Cancel any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Cancel any ongoing request
    if (currentAbortControllerRef.current) {
      currentAbortControllerRef.current.abort();
      currentAbortControllerRef.current = null;
    }

    if (!query.trim()) {
      setSearchResults([]);
      setSearching(false);
      setSearchError(null);
      return [];
    }

    // Set up debounced search using centralized configuration
    return new Promise((resolve) => {
      debounceTimerRef.current = setTimeout(async () => {
        setSearching(true);
        setSearchError(null);

        // Create new AbortController for this request
        const abortController = new AbortController();
        currentAbortControllerRef.current = abortController;

        try {
          // Use the local proxy instead of calling the API directly
          const response = await fetch(
            "/api/uniswap/v2/Search.v1.SearchService/SearchTokens",
            {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                searchQuery: query.trim(),
                chainIds: [8453], // Base chain only
                searchType: "TOKEN",
                page: 1,
                size: 15
              }),
              signal: abortController.signal, // Add abort signal
            }
          );

          // Check if request was aborted
          if (abortController.signal.aborted) {
            resolve([]);
            return;
          }

          if (!response.ok) {
            throw new Error(`Search failed: ${response.status}`);
          }

          const data: UniswapSearchResponse = await response.json();
          const uniswapTokens = data.tokens || [];
          
          // Convert to our TokenInfo format without filtering spam tokens
          const results = uniswapTokens.map(convertToTokenInfo);
          
          // Only update state if this request wasn't aborted
          if (!abortController.signal.aborted) {
            setSearchResults(results);
            setSearching(false);
          }
          
          resolve(results);
        } catch (error) {
          // Don't show errors for aborted requests
          if (error instanceof Error && error.name === 'AbortError') {
            resolve([]);
            return;
          }

          console.error("Token search error:", error);
          
          // Only update error state if request wasn't aborted
          if (!abortController.signal.aborted) {
            setSearchError(error instanceof Error ? error.message : "Search failed");
            setSearchResults([]);
            setSearching(false);
          }
          
          resolve([]);
        } finally {
          // Clear the controller reference if this was the current request
          if (currentAbortControllerRef.current === abortController) {
            currentAbortControllerRef.current = null;
          }
        }
      }, RATE_LIMIT_CONFIG.SEARCH_DEBOUNCE); // Use centralized configuration
    });
  }, []);

  const clearSearch = useCallback(() => {
    // Cancel any pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Cancel any ongoing request
    if (currentAbortControllerRef.current) {
      currentAbortControllerRef.current.abort();
      currentAbortControllerRef.current = null;
    }

    setSearchResults([]);
    setSearchError(null);
    setSearching(false);
  }, []);

  return {
    searchTokens,
    searchResults,
    searching,
    searchError,
    clearSearch,
  };
} 