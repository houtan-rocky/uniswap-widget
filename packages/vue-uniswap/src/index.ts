// =============================================================================
// @uniswap-widget/vue  Vue 3 binding for the Uniswap swap widget
//
// A thin reactive layer over @uniswap-widget/core. The components and
// composables here own Vue-specific concerns (reactivity, lifecycle, template);
// all trading logic lives in the framework-agnostic core.
// =============================================================================

// Components
export { default as SwapWidget } from "./components/SwapWidget.vue";
export { default as UniswapProvider } from "./components/UniswapProvider.vue";
export { default as WalletAdapterProvider } from "./wallet/WalletAdapterProvider.vue";

// Wallet plugin — adapter context + built-in adapters. Provide a custom adapter
// to swap Reown AppKit for any other wallet library.
export { useWallet, provideWallet } from "./wallet/context";
export { useReownWalletAdapter } from "./wallet/adapters/reown";
export { useInjectedWalletAdapter } from "./wallet/adapters/injected";
export type { WalletConnection, WalletAdapter } from "./wallet/types";

// Composables  for building custom Vue UIs on the core.
export { useQuote } from "./composables/useQuote";
export { useSwap } from "./composables/useSwap";
export { createWidgetState } from "./composables/state";
export type { WidgetState } from "./composables/state";

// Provider context (advanced: provide your own context).
export { UNISWAP_WIDGET_KEY } from "./context";
export type { AppKitLike, UniswapWidgetContext } from "./context";

// Re-export the core's data + types so Vue consumers have a single import
// surface, mirroring what `@uniswap-widget/react` re-exports.
export {
  DEFAULT_POOL_CONFIG,
  lightTheme,
  darkTheme,
  VIRTUAL_PROTOCOL_TOKEN,
  DEFAULT_SLIPPAGE,
  DEFAULT_DEADLINE_MINUTES,
  VritualProtocolTokenInfo,
  SolaceTokenInfo,
} from "@uniswap-widget/core";
export type {
  ThemeConfig,
  TokenInfo,
  PoolConfig,
} from "@uniswap-widget/core";
