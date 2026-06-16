/* eslint-disable react-refresh/only-export-components */
import { useMemo } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { ethers } from "ethers";
import type { WalletConnection } from "../types";

/** Reown AppKit's own account button web component. */
function ReownAccountButton() {
  return <appkit-account-button />;
}

/**
 * Default wallet adapter, backed by Reown AppKit + wagmi. It is a hook — use it
 * via the default `<Provider/>`, or `<WalletAdapterProvider adapter={useReownWalletAdapter}>`.
 *
 * Requires the tree to be wrapped in `<Provider>` (which sets up `WagmiProvider`
 * from the Reown `WagmiAdapter`).
 */
export function useReownWalletAdapter(): WalletConnection {
  const { open } = useAppKit();
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const signer = useMemo(() => {
    if (!walletClient) return undefined;
    const { account, chain, transport } = walletClient;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new ethers.providers.Web3Provider(transport, network);
    return provider.getSigner(account.address);
  }, [walletClient]);

  return {
    isConnected,
    address,
    signer,
    connect: () => open({ view: "Connect" }),
    AccountButton: ReownAccountButton,
  };
}
