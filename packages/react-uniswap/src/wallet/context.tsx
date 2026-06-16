/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from "react";
import type { WalletAdapter, WalletConnection } from "./types";

const WalletContext = createContext<WalletConnection | null>(null);

/**
 * Runs a {@link WalletAdapter} and exposes its {@link WalletConnection} to the
 * widget via context. Wrap `<SwapWidget/>` in this with the adapter of your
 * choice. The default `<Provider/>` does it for you with the Reown adapter.
 *
 * @example
 * ```tsx
 * <WalletAdapterProvider adapter={useInjectedWalletAdapter}>
 *   <SwapWidget poolConfig={…} />
 * </WalletAdapterProvider>
 * ```
 */
export function WalletAdapterProvider({
  adapter,
  children,
}: {
  adapter: WalletAdapter;
  children: ReactNode;
}) {
  // `adapter` is a hook; calling it here subscribes the provider to wallet state.
  const connection = adapter();
  return (
    <WalletContext.Provider value={connection}>
      {children}
    </WalletContext.Provider>
  );
}

/** Read the active wallet connection. Must be used within a wallet provider. */
export function useWallet(): WalletConnection {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error(
      "useWallet must be used within a wallet provider. Wrap your app in " +
        "<Provider> (Reown default) or <WalletAdapterProvider adapter={…}>.",
    );
  }
  return ctx;
}
