import { useEffect, useRef } from "react";
import { ethers } from "ethers";
import { RATE_LIMIT_CONFIG } from "../config/rateLimit";
import { SwapState, PoolConfig } from "../types";
import { fromReadableAmount } from "../utils/conversion";
import { TokenSwapper } from "../libs/trading";

/**
 * Custom hook to get quotes using callStatic
 */
export default function useQuote({
  signer,
  state,
  setState,
  poolConfig,
}: {
  signer?: ethers.Signer;
  state: SwapState;
  setState: React.Dispatch<React.SetStateAction<SwapState>>;
  poolConfig: PoolConfig;
}) {
  const debounceTimeout = useRef<NodeJS.Timeout>();
  const lastQuoteParams = useRef<string>("");
  const abortController = useRef<AbortController>();

  useEffect(() => {
    // Initialize tokens from pool config
    setState((prev) => ({
      ...prev,
      inputToken: poolConfig.tokenIn,
      outputToken: poolConfig.tokenOut,
    }));
  }, [poolConfig]);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (abortController.current) {
      abortController.current.abort();
    }

    async function updateQuote() {
      if (!state.inputAmount || Number(state.inputAmount) === 0) {
        setState((prev) => ({ ...prev, outputAmount: "" }));
        return;
      }

      if (!signer) {
        setState((prev) => ({ 
          ...prev, 
          outputAmount: "",
          error: "Please connect your wallet to get quotes"
        }));
        return;
      }

      const quoteKey = `${poolConfig.tokenIn.address}-${poolConfig.tokenOut.address}-${state.inputAmount}`;
      if (lastQuoteParams.current === quoteKey) {
        return;
      }
      lastQuoteParams.current = quoteKey;

      abortController.current = new AbortController();

      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        console.log("Converting amount", {
          inputAmount: state.inputAmount,
          decimals: poolConfig.tokenIn.decimals,
          tokenAddress: poolConfig.tokenIn.address,
        });

        // Convert input amount to wei
        const amountInWei = fromReadableAmount(
          Number(state.inputAmount),
          poolConfig.tokenIn.decimals
        );

        console.log("Amount in Wei:", amountInWei.toString());

        if (abortController.current?.signal.aborted) {
          return;
        }

        // Create TokenSwapper instance
        const swapper = new TokenSwapper(
          state.inputToken?.address as string,
          state.outputToken?.address as string,
          undefined,
          signer
        );

        const simulationResult = await swapper.simulateTransaction(
          amountInWei.toString()
        );
        if (simulationResult !== "Ok") {
          throw new Error(`Quote simulation failed: ${simulationResult}`);
        }

        const quotedAmountOut = await swapper.getQuotedAmount(
          amountInWei.toString()
        );
        const outDecimals = await swapper.getTokenOutDecimals();

        if (abortController.current?.signal.aborted) {
          return;
        }

        setState((prev) => ({
          ...prev,
          outputAmount: ethers.utils.formatUnits(quotedAmountOut, outDecimals),
          routeInfo: {
            isDirectRoute: true,
            routeString: `Direct via ${poolConfig.tokenIn.symbol}/${poolConfig.tokenOut.symbol} Pool`,
            routeType: poolConfig.version,
          },
        }));
      } catch (err) {
        if (abortController.current?.signal.aborted) {
          return;
        }

        console.error("Error getting quote:", err);

        let errorMessage = "Failed to get quote";

        if (err instanceof Error) {
          errorMessage = err.message;
        }

        setState((prev) => ({
          ...prev,
          outputAmount: "",
          error: errorMessage,
        }));
      } finally {
        if (!abortController.current?.signal.aborted) {
          setState((prev) => ({ ...prev, loading: false }));
        }
      }
    }

    debounceTimeout.current = setTimeout(
      updateQuote,
      RATE_LIMIT_CONFIG.QUOTE_DEBOUNCE
    );

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [state.inputAmount, poolConfig, signer]);

  return;
}
