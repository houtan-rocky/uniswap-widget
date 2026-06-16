import { inject, provide, type InjectionKey } from "vue";
import type { WalletConnection } from "./types";

/** Injection key the `<WalletAdapterProvider>` fills and the widget reads. */
export const WALLET_KEY: InjectionKey<WalletConnection> = Symbol(
  "uniswap-widget-wallet",
);

/** Provide a {@link WalletConnection} to descendants. Call during `setup()`. */
export function provideWallet(connection: WalletConnection): void {
  provide(WALLET_KEY, connection);
}

/** Read the active wallet connection. Must be used within a wallet provider. */
export function useWallet(): WalletConnection {
  const conn = inject(WALLET_KEY);
  if (!conn) {
    throw new Error(
      "useWallet() must be used inside <UniswapProvider> or <WalletAdapterProvider>.",
    );
  }
  return conn;
}
