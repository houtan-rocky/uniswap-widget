/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Provider } from "./components/Provider";
import SwapWidget from "./components/SwapWidget";
import { TokenInfo } from "./types";
import { base } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { QueryClient } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";

const SOLACE_TOKEN = {
  chainId: 8453,
  address: "0x7d6fcB3327D7E17095fA8B0E3513AC7A3564f5E1",
  decimals: 18,
  symbol: "SOLACE",
  name: "Solace by Virtuals",
  logoURI:
    "https://assets.coingecko.com/coins/images/32849/standard/solace_logo_256.png",
  standard: "ERC20",
  projectName: "Solace",
} as TokenInfo;

// const HOLY_TOKEN = {
//   chainId: 8453,
//   address: "0x567cb27139Bcc6C3617636CB4F882564a91D6E10",
//   decimals: 18,
//   symbol: "HOLY",
//   name: "Holy",
//   logoURI:
//     "https://assets.coingecko.com/coins/images/32849/standard/solace_logo_256.png",
//   standard: "ERC20",
//   projectName: "Holy",
// };
// Example production configuration

const SOLACE_VIRTUAL_POOL = "0x912567c105A172777e56411DD0AA4Acc10e628a9";
const poolConfig = {
  tokenIn: {
    chainId: 8453,
    address: "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
    decimals: 18,
    symbol: "VIRTUAL",
    name: "Virtual Protocol",
    logoURI:
      "https://assets.coingecko.com/coins/images/33154/standard/256x256_mark.png",
    standard: "ERC20",
    projectName: "Virtuals Protocol",
  } as TokenInfo,
  tokenOut: SOLACE_TOKEN as TokenInfo,
  poolAddress: SOLACE_VIRTUAL_POOL,
  version: "V2" as const,
};
// project id is a76ff31b5428ab5acc3b017e142d6365
const projectId =
  import.meta.env.VITE_REOWN_PROJECT_ID || "a76ff31b5428ab5acc3b017e142d6365";

// Create a basic wagmi config
// const wagmiConfig = createConfig({
//   chains: [base],
//   transports: {
//     [base.id]: http(),
//   },
// });

// Setup
const queryClient = new QueryClient();

// Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [base],
  ssr: true,
});

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [base],
  projectId,
  metadata: {
    name: "Uniswap Widget",
    description: "Uniswap Widget Integration",
    url: import.meta.env.VITE_APP_URL || "https://uniswap.org",
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
  },
  features: {
    analytics: true,
    email: false,
    socials: [],
    allWallets: true,
    emailShowWallets: true,
    swaps: false,
  },
});

const App: React.FC = () => {
  const handleSwap = async (inputAmount: string, outputAmount: string) => {
    console.log("Custom swap handler:", { inputAmount, outputAmount });
    alert("Swap successful");
    // Add your custom swap logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Provider wagmiAdapter={wagmiAdapter} queryClient={queryClient}>
        <SwapWidget
          poolConfig={poolConfig}
          allowTokenChange={true}
          onSwap={handleSwap}
          searchConfig={{
            enabled: true,
            chainIds: [8453], // Base chain
          }}
        />
      </Provider>
    </div>
  );
};

export default App;
