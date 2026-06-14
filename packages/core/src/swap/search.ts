import type {
  TokenInfo,
  UniswapSearchResponse,
  UniswapSearchTokenResponse,
} from "../types";

export interface SearchTokensOptions {
  /** Chains to search. Defaults to Base (8453). */
  chainIds?: number[];
  /** Abort signal so callers can cancel a stale, in-flight search. */
  signal?: AbortSignal;
  /**
   * Proxy endpoint the host app exposes for Uniswap's search API. Defaults to
   * the path the examples proxy in their dev server / serverless functions.
   */
  endpoint?: string;
  /** Max results to request. */
  size?: number;
}

const DEFAULT_SEARCH_ENDPOINT =
  "/api/uniswap/v2/Search.v1.SearchService/SearchTokens";

/** Normalize a Uniswap search API token into the widget's `TokenInfo` shape. */
export function convertSearchTokenToInfo(
  uniswapToken: UniswapSearchTokenResponse
): TokenInfo {
  return {
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
  };
}

/**
 * Framework-agnostic token search.
 *
 * The pure request half of the React `useTokenSearch` hook. Debounce, abort
 * lifecycle, and result state stay in the framework layer; this just performs
 * one search and returns the normalized results (or throws on failure).
 */
export async function searchTokens(
  query: string,
  options: SearchTokensOptions = {}
): Promise<TokenInfo[]> {
  const {
    chainIds = [8453],
    signal,
    endpoint = DEFAULT_SEARCH_ENDPOINT,
    size = 15,
  } = options;

  if (!query.trim()) return [];

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      searchQuery: query.trim(),
      chainIds,
      searchType: "TOKEN",
      page: 1,
      size,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  const data: UniswapSearchResponse = await response.json();
  return (data.tokens || []).map(convertSearchTokenToInfo);
}
