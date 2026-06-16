import { h, inject, onMounted, onUnmounted, ref } from "vue";
import { ethers } from "ethers";
import {
  getAccount,
  getWalletClient,
  reconnect,
  watchAccount,
} from "@wagmi/core";
import { UNISWAP_WIDGET_KEY } from "../../context";
import type { WalletConnection } from "../types";

/** Reown AppKit's own account button web component. */
const ReownAccountButton = {
  name: "ReownAccountButton",
  render: () => h("appkit-account-button"),
};

/**
 * Default Vue wallet adapter, backed by `@wagmi/core` + Reown AppKit. Reads the
 * wagmi config + AppKit instance from `<UniswapProvider>`'s context. It is a
 * composable — used by the default `<UniswapProvider>`.
 */
export function useReownWalletAdapter(): WalletConnection {
  const ctx = inject(UNISWAP_WIDGET_KEY);
  if (!ctx) {
    throw new Error(
      "useReownWalletAdapter() needs <UniswapProvider> (wagmiConfig + appKit) above it.",
    );
  }
  const { wagmiConfig, appKit } = ctx;

  const initial = getAccount(wagmiConfig);
  const isConnected = ref(initial.isConnected);
  const address = ref<string | undefined>(initial.address);

  let unwatch: (() => void) | undefined;
  onMounted(() => {
    // Restore a previous session if there is one.
    reconnect(wagmiConfig).catch(() => {
      /* no previous session — fine */
    });
    unwatch = watchAccount(wagmiConfig, {
      onChange(account) {
        isConnected.value = account.isConnected;
        address.value = account.address;
      },
    });
  });
  onUnmounted(() => unwatch?.());

  async function getSigner(): Promise<ethers.Signer | undefined> {
    const walletClient = await getWalletClient(wagmiConfig).catch(() => null);
    if (!walletClient) return undefined;
    const { account, chain, transport } = walletClient;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new ethers.providers.Web3Provider(transport, network);
    return provider.getSigner(account.address);
  }

  return {
    isConnected,
    address,
    getSigner,
    connect: () => void appKit.open({ view: "Connect" }),
    AccountButton: ReownAccountButton,
  };
}
