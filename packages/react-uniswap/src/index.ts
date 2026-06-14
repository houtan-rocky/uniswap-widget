import { type CreateConnectorFn } from "wagmi";
import { base } from "@reown/appkit/networks";
import { Features } from "@reown/appkit/react";

// Components
export { default as SwapWidget } from "./components/SwapWidget";
export { Provider } from "./components/Provider";
export type { ProviderProps } from "./components/Provider";

// modal
export { createAppKit, useAppKit } from "@reown/appkit/react";
export { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// Networks
export {
  base,
  mainnet,
  polygon,
  optimism,
  arbitrum,
  avalanche,
  fantom,
  moonbeam,
  solana,
} from "@reown/appkit/networks";

// Constants
export {
  VIRTUAL_PROTOCOL_TOKEN,
  DEFAULT_SLIPPAGE,
  DEFAULT_DEADLINE_MINUTES,
  VritualProtocolTokenInfo,
  SolaceTokenInfo,
} from "./constants";

// Types from ./types
export type {
  SwapProps,
  ThemeConfig,
  TokenInfo,
  PoolConfig,
  SwapState,
} from "./types";

// Constants from ./types
export { lightTheme, darkTheme } from "./types";

// AppKit types
export type AppKitNetwork = typeof base;
export type AppKitFeatures = Features;

export interface AppKitMetadata {
  name: string;
  description: string;
  url: string;
  icons: string[];
}

// Wagmi types
export type { CreateConnectorFn };
