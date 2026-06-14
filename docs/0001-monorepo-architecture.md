# 0001 — Monorepo architecture

- **Status:** Accepted
- **Date:** 2026-06-13

## Context

The project shipped as a single package that played two roles at once:

- the **publishable widget library** (`main`/`module`/`types` → `dist/`, peer
  deps on react / wagmi / reown / uniswap / ethers), and
- a **demo/dev app** (`index.html`, `pages/`, `api/`, `public/`, `vercel.json`,
  the `vite dev` script).

Both shared one `package.json`, one `vite.config.ts`, and one `node_modules`.
Consequences of the tangle:

- The library build config and the demo dev/proxy config lived in the same
  file. The library's `peerDependencies` and the demo's runtime deps were
  indistinguishable.
- The root package was published (`"private": false`) and its README installed
  a package name (`uniswap-widget-package`) that did not match the manifest
  (`react-uniswap`).
- With nothing pinning versions, installs drifted to the latest majors
  (React 19, wagmi 3) even though the code targets React 18 / wagmi 2.

## Decision

Convert to a **pnpm workspace** with two trees:

```
react-uniswap/                 # private workspace root (publishes nothing)
├── pnpm-workspace.yaml        # workspace globs + catalogs + build allowlist
├── package.json               # orchestration scripts + shared lint/TS tooling
├── tsconfig.base.json         # shared compiler options
├── tsconfig.json              # solution file (editor references)
├── eslint.config.js           # one flat config for the whole repo
├── docs/                      # these documents (design records)
├── packages/
│   └── react-uniswap/         # THE published widget
│       ├── package.json       # the only manifest that ships to npm
│       ├── vite.config.ts     # library build only
│       ├── tsconfig.json
│       ├── README.md          # npm-facing docs
│       └── src/               # widget source (public entry: src/index.ts)
└── examples/
    └── basic/                 # runnable consumer app (was the old demo)
        ├── package.json        # depends on react-uniswap via workspace:*
        ├── vite.config.ts      # dev server + API proxy
        ├── tailwind.config.js  # scans the widget source
        ├── index.html, src/, api/, pages/, public/, vercel.json
        └── .env.example
```

- The **root is private** and only orchestrates (`pnpm -r` / `--filter`).
- The **widget** lives in `packages/react-uniswap`; only its `dist/` + README
  are published.
- **Examples** live under `examples/*`; each is a private app that consumes the
  widget exactly as a downstream user would (`"react-uniswap": "workspace:*"`).

See [0002](0002-package-boundaries.md) for the boundary, [0003](0003-dependency-and-catalog-strategy.md)
for version management, and [0004](0004-core-deps-decoupling.md) for the planned
architectural decoupling.

## Commands

| Command (run at root) | Effect |
|------------------------|--------|
| `pnpm install` | Install + link all workspace packages |
| `pnpm dev` | Run `examples/basic` dev server |
| `pnpm build` | Build the widget (`--filter react-uniswap`) |
| `pnpm build:all` | Build every package (`pnpm -r build`) |
| `pnpm typecheck` | `tsc --noEmit` in every package |
| `pnpm lint` | ESLint across the repo |

## Consequences

- **Clean ownership of dependencies.** A dep is either the widget's (peer/dev)
  or an example's (runtime) — never ambiguous.
- **Room to grow.** Additional examples (e.g. a Next.js host, a React-19 host)
  drop into `examples/*` with no change to the widget.
- **Realistic dogfooding.** The example imports from the package entry, so a
  broken public API surface fails locally before publish.
- **Migration cost.** Contributors must use pnpm (pinned via `packageManager`)
  and learn the catalog protocol. The old single-package workflow is gone.
