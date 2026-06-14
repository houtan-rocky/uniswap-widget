import { ethers } from "ethers";
import { TokenSwapper } from "../libs/trading";
import { fromReadableAmount } from "../utils/conversion";
import type { PoolConfig, TokenInfo } from "../types";

export interface GetQuoteParams {
  signer: ethers.Signer;
  inputToken: TokenInfo;
  outputToken: TokenInfo;
  inputAmount: string;
  poolConfig: PoolConfig;
  /** Optional abort signal so callers can cancel a stale, in-flight quote. */
  signal?: AbortSignal;
}

export interface QuoteResult {
  outputAmount: string;
  routeInfo: {
    isDirectRoute: boolean;
    routeString?: string;
    routeType?: string;
  };
}

/**
 * Framework-agnostic quote fetch.
 *
 * This is the logic that used to live inline in the React `useQuote` hook,
 * lifted out so React, Vue, and any other binding share one implementation.
 * Reactive concerns (debounce, state, abort wiring) stay in the framework layer.
 */
export async function getQuote({
  signer,
  inputToken,
  outputToken,
  inputAmount,
  poolConfig,
  signal,
}: GetQuoteParams): Promise<QuoteResult> {
  // Convert the human-readable input amount to wei using the input decimals.
  const amountInWei = fromReadableAmount(Number(inputAmount), inputToken.decimals);

  const swapper = new TokenSwapper(
    inputToken.address,
    outputToken.address,
    undefined,
    signer
  );

  const simulationResult = await swapper.simulateTransaction(amountInWei.toString());
  if (simulationResult !== "Ok") {
    throw new Error(`Quote simulation failed: ${simulationResult}`);
  }

  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  const quotedAmountOut = await swapper.getQuotedAmount(amountInWei.toString());
  const outDecimals = await swapper.getTokenOutDecimals();

  return {
    outputAmount: ethers.utils.formatUnits(quotedAmountOut, outDecimals),
    routeInfo: {
      isDirectRoute: true,
      routeString: `Direct via ${poolConfig.tokenIn.symbol}/${poolConfig.tokenOut.symbol} Pool`,
      routeType: poolConfig.version,
    },
  };
}
