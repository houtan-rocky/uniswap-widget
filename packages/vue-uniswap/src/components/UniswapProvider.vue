<script setup lang="ts">
import { provide } from "vue";
import type { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { UNISWAP_WIDGET_KEY, type AppKitLike } from "../context";
import WalletAdapterProvider from "../wallet/WalletAdapterProvider.vue";
import { useReownWalletAdapter } from "../wallet/adapters/reown";
import type { WalletAdapter } from "../wallet/types";

/**
 * Provides the wagmi config + AppKit instance, then exposes a wallet connection
 * to the widget via the Reown adapter (by default). Vue counterpart of
 * `@uniswap-widget/react`'s `<Provider>`.
 *
 * To use a different wallet library, pass `walletAdapter`, or skip this provider
 * and wrap `<SwapWidget/>` in your own `<WalletAdapterProvider/>`.
 */
const props = withDefaults(
  defineProps<{
    wagmiAdapter: WagmiAdapter;
    appKit: AppKitLike;
    walletAdapter?: WalletAdapter;
  }>(),
  { walletAdapter: () => useReownWalletAdapter },
);

provide(UNISWAP_WIDGET_KEY, {
  wagmiConfig: props.wagmiAdapter.wagmiConfig,
  appKit: props.appKit,
});
</script>

<template>
  <WalletAdapterProvider :adapter="props.walletAdapter">
    <slot />
  </WalletAdapterProvider>
</template>
