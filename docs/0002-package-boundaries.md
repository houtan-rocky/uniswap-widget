# 0002  Package boundaries & public API

- **Status:** Accepted
- **Date:** 2026-06-13

## Context

Splitting the repo (see [0001](0001-monorepo-architecture.md)) forces an
explicit answer to "what is the widget, and what is just the demo?"  a line
that did not exist before.

## Decision

### The widget = everything in `src/` except the demo entry

Moved to `packages/react-uniswap/src/`:

- `index.ts` (public entry), `components/`, `hooks/`, `libs/`, `config/`,
  `contracts/`, `utils/`, `constants.ts`, `types.ts`, `vite-env.d.ts`.

Moved to `examples/basic/` (these are **app** concerns, not the widget):

- `App.tsx`, `main.tsx`, `index.css`  demo entry + styles
- `index.html`, `public/`, `api/`, `pages/`, `vercel.json`  host/deploy
- `tailwind.config.js`, `postcss.config.js`, `.env*`  host build/config

### Public API surface

The published API is exactly what `src/index.ts` re-exports:

- **Components:** `SwapWidget`, `Provider` (+ `ProviderProps`)
- **AppKit/wagmi re-exports:** `createAppKit`, `useAppKit`, `WagmiAdapter`,
  `CreateConnectorFn`
- **Networks:** `base`, `mainnet`, `polygon`, `optimism`, `arbitrum`,
  `avalanche`, `fantom`, `moonbeam`, `solana`
- **Themes:** `lightTheme`, `darkTheme`
- **Constants:** `VIRTUAL_PROTOCOL_TOKEN`, `DEFAULT_SLIPPAGE`,
  `DEFAULT_DEADLINE_MINUTES`, `VritualProtocolTokenInfo`, `SolaceTokenInfo`
- **Types:** `SwapProps`, `ThemeConfig`, `TokenInfo`, `PoolConfig`, `SwapState`,
  `AppKitNetwork`, `AppKitFeatures`, `AppKitMetadata`

### What ships to npm

Only `dist/` (built by `vite build` + `vite-plugin-dts`) and `README.md`, per
the package's `files` field. Source, configs, and examples are not published.

### Dependency declarations corrected to match real imports

A scan of `src/` (imports of `@uniswap/*`, `wagmi`, `viem`, `ethers`,
`@reown/*`, `@tanstack/*`, `jsbi`) revealed the declared deps were wrong:

| Change | Reason |
|--------|--------|
| **+ `@uniswap/v3-sdk`** to `peerDependencies` | `libs/pool.ts` & `libs/dynamicFees.ts` import `computePoolAddress`/`FeeAmount` at runtime, and the bundle externalizes `@uniswap/*`  consumers must have it |
| **+ `@uniswap/v3-core`** to `peerDependencies` | `libs/*` import the `IUniswapV3Pool.json` artifact at runtime |
| **− `@uniswap/smart-order-router`** | Installed but never imported |
| **− `@uniswap/v3-periphery`** | Installed but never imported |
| **− `jsbi`** (as a direct dep) | Never imported directly; only a transitive dep of the Uniswap SDKs |

> This makes the widget installable with V3 pools working out of the box, which
> it previously was not unless the consumer happened to have `@uniswap/v3-sdk`.

### The host-app contract (previously implicit, now documented)

These are real boundaries the widget assumes of its host. They are documented
in the package README and slated for removal in [0004](0004-core-deps-decoupling.md):

1. **Tailwind**  the widget emits Tailwind utility class names and ships no
   CSS; the host must run Tailwind and scan the package.
2. **API proxy**  the widget calls relative paths `/api/base-rpc` (always) and
   `/api/uniswap/v2/Search.v1.SearchService/SearchTokens` (when search is on).
3. **Vite env**  config is read from `import.meta.env.VITE_*`.

## Consequences

- Consumers get a correct, installable peer set; V3 usage no longer silently
  breaks.
- The widget's runtime expectations are written down instead of being folk
  knowledge embedded in the old demo.
- Adding `@uniswap/v3-sdk`/`v3-core` to peers is a **packaging fix**, published
  with a patch/minor bump and a changelog note.
