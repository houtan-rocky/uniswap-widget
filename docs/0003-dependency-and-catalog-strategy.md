# 0003 — Dependency & catalog strategy

- **Status:** Accepted
- **Date:** 2026-06-13

## Context

In the single-package setup, nothing pinned the heavy external deps. A fresh
install resolved **React 19.2.7, wagmi 3.6.16, viem 2.52.2** — none of which the
widget was built against (it targets React 18 / wagmi 2 / Reown AppKit 1.4 /
ethers 5). We need one place to keep versions coherent across the widget and
every example.

## Decision

Use **pnpm catalogs** (declared in `pnpm-workspace.yaml`) as the single source
of truth for versions. Packages reference a catalog entry with the `catalog:`
protocol instead of a literal range.

### Catalogs

- **Default catalog** (`catalog:`) — repo-wide **build & lint tooling**
  (typescript, vite, plugins, eslint stack, tailwind/postcss/autoprefixer).
  Dev-only and identical everywhere.
- **Named catalogs** (`catalog:<name>`) — coherent version *sets*, grouped by
  concern:
  - **`react18`** — `react`, `react-dom`, `@types/react`, `@types/react-dom`.
    Isolating the React line means a future `react19` catalog can host a second
    example with zero changes here.
  - **`web3`** — the external wallet/chain stack (`wagmi`, `viem`,
    `@reown/appkit`, `@reown/appkit-adapter-wagmi`, `@tanstack/react-query`,
    `ethers`), pinned to the set the widget was built against.
  - **`uniswap`** — the Uniswap SDK suite actually imported
    (`@uniswap/sdk-core`, `@uniswap/v3-sdk`, `@uniswap/v3-core`).

Grouping the **external** stacks (`web3`, `uniswap`) into named catalogs is the
version-management half of "core separate from external deps" — the external
versions are quarantined in one block, separate from the widget's own tooling.

### Peer vs dev vs runtime — who references what

| Manifest | Field | Spec form | Why |
|----------|-------|-----------|-----|
| `packages/react-uniswap` | `peerDependencies` | **explicit ranges** (`>=18`, `>=2.0.0`, …) | The published *contract*; stays broad so consumers aren't over-constrained |
| `packages/react-uniswap` | `devDependencies` | `catalog:*` | The pinned versions the widget is **built/typechecked** against |
| `examples/*` | `dependencies` | `catalog:*` + `react-uniswap: workspace:*` | A concrete consumer install; mirrors the widget's peer set |

This is deliberate: the **peer ranges describe compatibility**, while the
**catalog pins describe what we actually build and ship against**. They are
allowed to differ (a wide peer range, a single pinned dev/example version).

### Build-script allowlist

pnpm blocks dependency build scripts by default. On **pnpm 11** the allowlist is
the `allowBuilds` map in `pnpm-workspace.yaml` — `name: true` permits a
package's `postinstall`, `false` keeps it blocked. `esbuild`, `keccak`,
`bufferutil`, `utf-8-validate`, and `@reown/appkit` are enabled. (The older
`onlyBuiltDependencies` array is **not** honored on pnpm 11.)

### Overrides — keep wagmi on one major

Reown AppKit 1.4's transitive ranges are loose enough that pnpm floats
`@wagmi/connectors`/`@wagmi/core` to the wagmi-3 line. That second major then
coexists with the widget's wagmi 2 and breaks the `Config` types at build time.
An `overrides` block pins `@wagmi/core` and `@wagmi/connectors` to the exact
versions `wagmi@2.19.5` itself uses, collapsing the tree to a single wagmi
major. This is the resolution half of "core separate from external deps": the
external stack is held to one coherent generation.

### Publishing

`catalog:` is a workspace-only protocol. On `pnpm publish`, pnpm rewrites every
`catalog:` specifier in published fields back to the resolved range, so npm
consumers never see it. The widget's published manifest has **no** `catalog:`
specifiers anyway — its peers are explicit ranges and its catalog usage is
confined to (unpublished) `devDependencies`.

## Consequences

- One edit in `pnpm-workspace.yaml` re-aligns the whole repo; the React 19 /
  wagmi 3 drift is corrected on the next install.
- A new example can opt into a different stack (e.g. `catalog:react19`) without
  touching the widget.
- Contributors must understand the `catalog:` protocol; a literal version in a
  package manifest is now a smell to be moved into a catalog.
