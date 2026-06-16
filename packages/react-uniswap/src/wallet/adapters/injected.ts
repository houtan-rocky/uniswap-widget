import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import type { WalletConnection } from "../types";

type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (
    event: string,
    handler: (...args: unknown[]) => void,
  ) => void;
};

function getInjected(): Eip1193Provider | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { ethereum?: Eip1193Provider }).ethereum;
}

/**
 * Minimal wallet adapter (a hook) backed by the injected EIP-1193 provider
 * (`window.ethereum` — MetaMask, Rabby, Coinbase Wallet, …).
 *
 * No Reown, no wagmi — just ethers. Use it when you want the widget without a
 * wallet-modal library, or as a reference for writing your own adapter:
 *
 * @example
 * ```tsx
 * <WalletAdapterProvider adapter={useInjectedWalletAdapter}>
 *   <SwapWidget poolConfig={…} />
 * </WalletAdapterProvider>
 * ```
 */
export function useInjectedWalletAdapter(): WalletConnection {
  const [address, setAddress] = useState<string | undefined>(undefined);

  // Reflect already-authorized accounts on mount + react to account changes.
  useEffect(() => {
    const injected = getInjected();
    if (!injected) return;

    let active = true;
    injected
      .request({ method: "eth_accounts" })
      .then((accts) => {
        if (active) setAddress((accts as string[])[0]);
      })
      .catch(() => {
        /* no authorized accounts yet */
      });

    const handleAccountsChanged = (...args: unknown[]) => {
      setAddress((args[0] as string[] | undefined)?.[0]);
    };
    injected.on?.("accountsChanged", handleAccountsChanged);
    return () => {
      active = false;
      injected.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const signer = useMemo(() => {
    const injected = getInjected();
    if (!injected || !address) return undefined;
    const provider = new ethers.providers.Web3Provider(
      injected as ethers.providers.ExternalProvider,
    );
    return provider.getSigner(address);
  }, [address]);

  const connect = useCallback(async () => {
    const injected = getInjected();
    if (!injected) {
      throw new Error(
        "No injected wallet found (window.ethereum is undefined).",
      );
    }
    const accts = (await injected.request({
      method: "eth_requestAccounts",
    })) as string[];
    setAddress(accts[0]);
  }, []);

  const disconnect = useCallback(() => setAddress(undefined), []);

  return {
    isConnected: Boolean(address),
    address,
    signer,
    connect,
    disconnect,
  };
}
