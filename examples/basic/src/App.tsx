import React from "react";
import {
  Provider,
  SwapWidget,
  WagmiAdapter,
  createAppKit,
  base,
  type TokenInfo,
  type ThemeConfig,
} from "@uniswap-widget/react";
import { QueryClient } from "@tanstack/react-query";

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
  tokenOut: SOLACE_TOKEN,
  poolAddress: SOLACE_VIRTUAL_POOL,
  version: "V2" as const,
};

const projectId =
  import.meta.env.VITE_REOWN_PROJECT_ID || "a76ff31b5428ab5acc3b017e142d6365";

const queryClient = new QueryClient();

const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [base],
  ssr: true,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [base],
  projectId,
  themeMode: "dark",
  metadata: {
    name: "@uniswap-widget/react",
    description: "A clean, embeddable Uniswap swap widget",
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

// A dark, glassy theme so the widget blends into the example's card.
const widgetTheme: Partial<ThemeConfig> = {
  background: "transparent",
  foreground: "rgba(255, 255, 255, 0.03)",
  border: "rgba(255, 255, 255, 0.08)",
  text: "#ffffff",
  textSecondary: "#8b8b96",
  tokenButton: {
    background: "rgba(255, 255, 255, 0.06)",
    text: "#ffffff",
    border: "rgba(255, 255, 255, 0.10)",
    hoverBackground: "rgba(255, 255, 255, 0.10)",
    paddingX: 10,
    paddingY: 8,
  },
  swapButton: {
    background: "#FF007A",
    text: "#ffffff",
    hoverBackground: "#ff2e94",
    disabledBackground: "rgba(255, 255, 255, 0.06)",
    disabledText: "#6b7280",
  },
  connectButton: {
    background: "#FF007A",
    text: "#ffffff",
    hoverBackground: "#ff2e94",
  },
  inputField: {
    background: "transparent",
    text: "#ffffff",
    placeholder: "#6b7280",
    disabledBackground: "transparent",
    disabledText: "#6b7280",
  },
  buySection: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "rgba(255, 255, 255, 0.08)",
  },
};

const App: React.FC = () => {
  const handleSwap = async (inputAmount: string, outputAmount: string) => {
    console.log("Custom swap handler:", { inputAmount, outputAmount });
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0a0a0f] text-white">
      {/* Animated gradient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -left-24 -top-32 h-[440px] w-[440px] rounded-full bg-[#FF007A]/30 blur-[130px]" />
        <div className="animate-blob animation-delay-3000 absolute -right-24 top-1/3 h-[440px] w-[440px] rounded-full bg-[#7c3aed]/30 blur-[130px]" />
        <div className="animate-blob animation-delay-6000 absolute -bottom-32 left-1/3 h-[440px] w-[440px] rounded-full bg-[#2563eb]/25 blur-[130px]" />
      </div>

      {/* Nav */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#FF007A] to-[#7c3aed] text-lg font-black shadow-lg shadow-[#FF007A]/30">
            U
          </div>
          <span className="text-lg font-semibold tracking-tight">@uniswap-widget/react</span>
        </div>
        <a
          href="https://www.npmjs.com/package/@uniswap-widget/react"
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
        >
          npm ↗
        </a>
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="mb-8 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live on Base
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Swap{" "}
            <span className="bg-gradient-to-r from-[#FF007A] to-[#a855f7] bg-clip-text text-transparent">
              instantly
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-white/55">
            A clean, embeddable Uniswap swap widget. No warnings, no extra fees 
            just trade.
          </p>
        </div>

        {/* Glass card wrapping the widget */}
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="flex items-center justify-between px-3 pb-1 pt-2">
            <h2 className="text-base font-semibold">Swap</h2>
            <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/60">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0052FF]" />
              Base
            </span>
          </div>
          <Provider wagmiAdapter={wagmiAdapter} queryClient={queryClient}>
            <SwapWidget
              poolConfig={poolConfig}
              theme={widgetTheme}
              allowTokenChange={true}
              onSwap={handleSwap}
              searchConfig={{
                enabled: true,
                chainIds: [8453],
              }}
            />
          </Provider>
        </div>

        <p className="mt-6 text-center text-xs text-white/40">
          Built with <span className="text-white/70">@uniswap-widget/react</span> · demo
          on Base mainnet
        </p>
      </main>
    </div>
  );
};

export default App;
