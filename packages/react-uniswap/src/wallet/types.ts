import type { ethers } from "ethers";
import type { ComponentType } from "react";

/**
 * The wallet state + actions the SwapWidget needs from a wallet integration.
 *
 * Implement this (as a React hook — see {@link WalletAdapter}) to plug in any
 * wallet library: Reown AppKit (the default), RainbowKit, ConnectKit, a raw
 * injected EIP-1193 provider, etc. The widget never imports a specific wallet
 * library — it only reads this shape from context.
 */
export interface WalletConnection {
  /** Whether a wallet is currently connected. */
  isConnected: boolean;
  /** The connected account address, if any. */
  address?: string;
  /**
   * An ethers v5 `Signer` for the connected account, or `undefined` when
   * disconnected. This is the only thing the swap/quote logic needs.
   */
  signer?: ethers.Signer;
  /** Open the wallet's connect UI / flow. */
  connect: () => void | Promise<void>;
  /** Disconnect the wallet, if the integration supports it. */
  disconnect?: () => void | Promise<void>;
  /**
   * Optional account UI rendered by the widget when connected (e.g. the wallet
   * library's own button). If omitted, the widget renders a minimal default
   * (truncated address + Disconnect).
   */
  AccountButton?: ComponentType;
}

/**
 * A wallet adapter is a React hook returning the current {@link WalletConnection}.
 * It runs inside the widget tree, so it may call other hooks (wagmi, AppKit, …).
 */
export type WalletAdapter = () => WalletConnection;
