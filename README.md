# react-uniswap (monorepo)

A pnpm monorepo for the **`react-uniswap`** swap widget and its examples.

The widget lets you embed Uniswap swap functionality into a React dApp with no
token limitations, no warnings, and no added fee.

## Layout

```
packages/
  react-uniswap/     # the published widget  →  npm: react-uniswap
examples/
  basic/             # runnable app that consumes the widget (workspace:*)
docs/               # architecture & design decision records
```

## Quick start

```bash
# Node + Corepack (pins pnpm via the "packageManager" field)
corepack enable pnpm

pnpm install         # install & link every workspace package
pnpm dev             # run examples/basic (Vite dev server)
```

Then copy the example's env file and add your keys:

```bash
cp examples/basic/.env.example examples/basic/.env
```

## Common commands (run at the root)

| Command | Effect |
|---------|--------|
| `pnpm dev` | Run the `examples/basic` dev server |
| `pnpm build` | Build the widget (`packages/react-uniswap`) |
| `pnpm build:all` | Build every package |
| `pnpm typecheck` | `tsc --noEmit` across packages |
| `pnpm test` | Run the Vitest specs (`pnpm --filter react-uniswap test:watch` to watch) |
| `pnpm lint` | ESLint across the repo |

## Packages

| Package | Path | Description |
|---------|------|-------------|
| [`react-uniswap`](packages/react-uniswap/README.md) | `packages/react-uniswap` | The published swap widget. **Start here for usage & API docs.** |

## Examples

| Example | Path | Description |
|---------|------|-------------|
| [`@examples/basic`](examples/basic/README.md) | `examples/basic` | Minimal consumer app; also the reference for the widget's host-app contract (Tailwind + API proxy + env). |

## Version management

Dependency versions live in **pnpm catalogs** in
[`pnpm-workspace.yaml`](pnpm-workspace.yaml) — a default catalog for build/lint
tooling and named catalogs `react18`, `web3`, `uniswap`. Packages reference them
with the `catalog:` protocol. See [docs/0003](docs/0003-dependency-and-catalog-strategy.md).

## Design docs

See [`docs/`](docs/README.md) for the architecture and the planned
core/external-deps decoupling ([0004](docs/0004-core-deps-decoupling.md)).

## License

MIT
