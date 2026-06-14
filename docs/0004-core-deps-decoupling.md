# 0004  Core ↔ external-deps decoupling

- **Status:** Proposed (phase 2  not yet implemented)
- **Date:** 2026-06-13

## Context

[0001](0001-monorepo-architecture.md)–[0003](0003-dependency-and-catalog-strategy.md)
established a **package boundary**: the widget is its own package and declares
its deps honestly. But the widget's *core logic* (quoting, pool math, swap
construction) is still hard-wired to specific external choices. A scan of `src/`
surfaces six couplings:

| # | Coupling | Where | Problem |
|---|----------|-------|---------|
| 1 | RPC URL is hardcoded | `libs/provider.ts`: `rpcUrl: "/api/base-rpc"` | Consumer must proxy that exact path; can't point at their own RPC |
| 2 | Token search hits a fixed path | `useTokenSearch.ts`: `fetch("/api/uniswap/v2/Search…")` | Same proxy assumption; search provider not swappable |
| 3 | Config read from Vite env | `config/env.ts`, `config/appConfig.ts`: `import.meta.env.VITE_*` | Breaks in non-Vite hosts (Next.js, CRA, Webpack); bakes build-time values into the bundle |
| 4 | No CSS shipped | `index.css` (Tailwind) lives only in the example | Widget is unstyled unless the host runs Tailwind and scans the package |
| 5 | Uniswap SDKs externalized as peers | `vite.config.ts` `external` + `peerDependencies` | `v3-sdk`/`v3-core` are *implementation details* leaking into the consumer's install |
| 6 | `ethers` baked in as the chain I/O lib | `libs/*`, `hooks/*` | The whole stack already carries `viem` (via wagmi); two chain libs, and the choice isn't the consumer's |

These are exactly the "external deps" the project wants the **core** to be
independent of.

## Decision (proposed)

Invert the dependencies: the **core** defines interfaces and receives
implementations; the **external** wiring is supplied by the host (or by thin
adapter packages we ship). Concretely:

### 1 & 2  Inject network access

Define small interfaces and accept them as configuration instead of reaching
for fixed URLs:

```ts
export interface RpcProvider {
  call(method: string, params: unknown[]): Promise<unknown>;
}

export interface TokenSearchProvider {
  search(query: string, opts: { chainIds: number[] }): Promise<TokenInfo[]>;
}
```

Pass them through `Provider` (or a `WidgetConfig` context). Ship the current
behavior as the **default** implementations (`createUniswapTokenSearch()`,
an RPC provider seeded from a `rpcUrl` prop that still defaults to
`/api/base-rpc`) so nothing breaks for existing users.

### 3  Replace `import.meta.env` with explicit config

Introduce a `WidgetConfig` object passed to `Provider`:

```ts
<Provider wagmiAdapter={adapter} config={{ projectId, appUrl, allowTokenChange }} />
```

`config/env.ts` keeps reading `import.meta.env` only as a **fallback inside the
example**, not inside core. Core becomes bundler-agnostic.

### 4  Ship styles

Add `import './index.css'` to a dedicated style entry and emit a CSS file from
the library build; expose it as `react-uniswap/styles.css`. Hosts import one
file instead of configuring Tailwind. (Keep the Tailwind-scan path documented as
an advanced opt-in.)

### 5 & 6  Split into core + adapters (the larger move)

Restructure into multiple packages so the dependency graph encodes the boundary:

```
packages/
  core/                  # @react-uniswap/core  pure quoting/pool/swap logic,
                         #   depends only on interfaces + a math lib. No wagmi,
                         #   no reown, ideally no concrete chain client.
  react/                 # @react-uniswap/react  the SwapWidget UI + hooks
  adapter-wagmi/         # wires wagmi/viem to the core interfaces
  adapter-ethers/        # wires ethers to the core interfaces
react-uniswap            # meta-package: re-exports react + wagmi adapter
                         #   (preserves today's single-import DX)
```

The current `react-uniswap` name stays as a convenience meta-package, so the
public API in [0002](0002-package-boundaries.md) is preserved.

## Migration plan

1. **Non-breaking, do first:** add `rpcUrl`/`config` props with defaults equal
   to today's behavior (covers 1 & 3 without an API break). Ship CSS (4).
2. **Minor:** introduce the `RpcProvider`/`TokenSearchProvider` interfaces and
   default impls (2); deprecate the implicit proxy paths in docs.
3. **Major (`2.0.0`):** extract `@react-uniswap/core` + adapters (5 & 6); make
   `react-uniswap` a meta-package. Drop `import.meta.env` from core entirely.

## Consequences

- Core becomes testable without a wallet, a browser, or a proxy  pure inputs
  and outputs.
- Hosts on any bundler/framework can use the widget; the Vite assumption dies.
- More packages to version and release (mitigated by catalogs + a release tool
  like Changesets, to be decided in a future spec).
- A `2.0.0` is required for the core/adapter split; steps 1–2 buy most of the
  decoupling with no breaking change.
