import { ethers } from "ethers";
import { TokenSwapper } from "../libs/trading";
import type { TokenInfo } from "../types";

export interface ExecuteSwapParams {
  signer: ethers.Signer;
  inputToken: TokenInfo;
  outputToken: TokenInfo;
  inputAmount: string;
  outputAmount: string;
  /** Optional callback fired once the swap transaction is mined. */
  onSwap?: (inputAmount: string, outputAmount: string) => Promise<void> | void;
}

/**
 * Framework-agnostic swap execution.
 *
 * Builds a {@link TokenSwapper}, sends the swap, waits for the transaction to be
 * mined, then invokes the optional `onSwap` callback. Lifted out of the React
 * `useSwap` hook so every framework binding shares one implementation.
 *
 * @returns the swap transaction hash.
 */
export async function executeSwap({
  signer,
  inputToken,
  outputToken,
  inputAmount,
  outputAmount,
  onSwap,
}: ExecuteSwapParams): Promise<string> {
  const swapper = new TokenSwapper(
    inputToken.address,
    outputToken.address,
    undefined,
    signer
  );

  const signerAddress = await swapper.getSignerAddress();
  const txHash = await swapper.executeSwap(inputAmount, outputAmount, signerAddress);

  // Wait for the transaction to be mined via the wallet's provider.
  const provider = signer.provider;
  if (!provider) throw new Error("Provider not found");
  await provider.waitForTransaction(txHash);

  if (onSwap) {
    await onSwap(inputAmount, outputAmount);
  }

  return txHash;
}
