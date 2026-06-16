"use client";

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { WalletAdapterProvider } from "../wallet/context";
import { useReownWalletAdapter } from "../wallet/adapters/reown";
import type { WalletAdapter } from "../wallet/types";

export interface ProviderProps {
  children: React.ReactNode;
  wagmiAdapter: WagmiAdapter;
  queryClient?: QueryClient;
  /**
   * Wallet integration the widget uses. Defaults to the Reown AppKit adapter.
   * Pass a custom {@link WalletAdapter} to use a different wallet library.
   */
  walletAdapter?: WalletAdapter;
}

/**
 * Default provider: sets up wagmi (from the Reown `WagmiAdapter`) + React Query,
 * then exposes a wallet connection to the widget via the Reown adapter.
 *
 * To use a different wallet library, either pass `walletAdapter`, or skip this
 * Provider entirely and wrap `<SwapWidget/>` in your own `<WalletAdapterProvider/>`.
 */
export function Provider({
  children,
  wagmiAdapter,
  queryClient = new QueryClient(),
  walletAdapter = useReownWalletAdapter,
}: ProviderProps) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletAdapterProvider adapter={walletAdapter}>
          {children}
        </WalletAdapterProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
