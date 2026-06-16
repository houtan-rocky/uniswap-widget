import { onMounted, onUnmounted, ref } from "vue";
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
 * Minimal Vue wallet adapter (a composable) backed by the injected EIP-1193
 * provider (`window.ethereum` — MetaMask, Rabby, Coinbase Wallet, …).
 *
 * No Reown, no wagmi — just ethers. Use it via
 * `<WalletAdapterProvider :adapter="useInjectedWalletAdapter">`, or as a
 * reference for writing your own.
 */
export function useInjectedWalletAdapter(): WalletConnection {
  const address = ref<string | undefined>(undefined);
  const isConnected = ref(false);

  function setAddress(next?: string) {
    address.value = next;
    isConnected.value = Boolean(next);
  }

  function handleAccountsChanged(...args: unknown[]) {
    setAddress((args[0] as string[] | undefined)?.[0]);
  }

  onMounted(() => {
    const injected = getInjected();
    if (!injected) return;
    injected
      .request({ method: "eth_accounts" })
      .then((accts) => setAddress((accts as string[])[0]))
      .catch(() => {
        /* no authorized accounts yet */
      });
    injected.on?.("accountsChanged", handleAccountsChanged);
  });

  onUnmounted(() => {
    getInjected()?.removeListener?.("accountsChanged", handleAccountsChanged);
  });

  async function getSigner(): Promise<ethers.Signer | undefined> {
    const injected = getInjected();
    if (!injected || !address.value) return undefined;
    const provider = new ethers.providers.Web3Provider(
      injected as ethers.providers.ExternalProvider,
    );
    return provider.getSigner(address.value);
  }

  async function connect() {
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
  }

  function disconnect() {
    setAddress(undefined);
  }

  return { isConnected, address, getSigner, connect, disconnect };
}
