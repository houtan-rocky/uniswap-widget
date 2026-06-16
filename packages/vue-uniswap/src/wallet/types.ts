import type { ethers } from "ethers";
import type { Component, Ref } from "vue";

/**
 * The wallet state + actions the SwapWidget needs from a wallet integration.
 *
 * Implement this (as a composable — see {@link WalletAdapter}) to plug in any
 * wallet library: Reown AppKit (the default), a raw injected EIP-1193 provider,
 * or your own. The widget never imports a specific wallet library — it only
 * reads this shape from Vue's provide/inject.
 */
export interface WalletConnection {
  /** Whether a wallet is currently connected (reactive). */
  isConnected: Ref<boolean>;
  /** The connected account address, if any (reactive). */
  address: Ref<string | undefined>;
  /**
   * Resolve the connected wallet as an ethers v5 `Signer` (or `undefined`).
   * This is the only thing the core swap/quote logic needs.
   */
  getSigner: () => Promise<ethers.Signer | undefined>;
  /** Open the wallet's connect UI / flow. */
  connect: () => void | Promise<void>;
  /** Disconnect the wallet, if the integration supports it. */
  disconnect?: () => void | Promise<void>;
  /**
   * Optional account UI component rendered by the widget when connected. If
   * omitted, the widget renders a minimal default (truncated address + Disconnect).
   */
  AccountButton?: Component;
}

/**
 * A wallet adapter is a Vue composable returning a {@link WalletConnection}.
 * It runs inside `<WalletAdapterProvider>`, so it may use other composables
 * (`inject`, lifecycle hooks, …).
 */
export type WalletAdapter = () => WalletConnection;
