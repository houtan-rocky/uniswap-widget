<script setup lang="ts">
import { provideWallet } from "./context";
import type { WalletAdapter } from "./types";

/**
 * Runs a {@link WalletAdapter} and exposes its connection to the widget via
 * provide/inject. Wrap `<SwapWidget/>` in this with the adapter of your choice;
 * the default `<UniswapProvider/>` does it for you with the Reown adapter.
 */
const props = defineProps<{ adapter: WalletAdapter }>();

// `adapter` is a composable; calling it here wires its reactive state in.
provideWallet(props.adapter());
</script>

<template>
  <slot />
</template>
