# @examples/vue

A minimal, runnable **Vue 3** app that consumes the
[`@uniswap-widget/vue`](../../packages/vue-uniswap) widget the way a real
downstream app would  it depends on the package via `workspace:*` and imports
the widget from its public entry point.

It's the Vue counterpart of [`@examples/basic`](../basic) (React) and proves the
same [`@uniswap-widget/core`](../../packages/core) drives both.

## Run it

From the repo root:

```bash
pnpm install
pnpm dev:vue       # → runs this example (vite dev server)
```

Or from this folder:

```bash
pnpm --filter @examples/vue dev
```

Then open the printed local URL.

## Configure

```bash
cp .env.example .env
# then fill in VITE_REOWN_PROJECT_ID and VITE_UNISWAP_API_KEY
```

| Variable | Used by | Purpose |
|----------|---------|---------|
| `VITE_REOWN_PROJECT_ID` | app | WalletConnect/AppKit project id |
| `VITE_UNISWAP_API_KEY` | `vite.config.ts` proxy | Auth header for the Uniswap gateway in dev |
| `UNISWAP_API_KEY` | `api/*.js` | Auth header for the Vercel functions in prod |

## How it satisfies the widget's host-app contract

| Requirement | Where it lives here |
|-------------|---------------------|
| **Tailwind** generating the widget's classes | [`tailwind.config.js`](tailwind.config.js) scans `../../packages/vue-uniswap/src` |
| **`/api/base-rpc`** + **`/api/uniswap/*`** proxy (dev) | [`vite.config.ts`](vite.config.ts) `server.proxy` |
| Same paths in production | [`api/`](api) Vercel functions + [`vercel.json`](vercel.json) rewrites |
| Vite `import.meta.env.VITE_*` | this is a Vite app; values come from `.env` |

## Wallet layer

This example wires up Reown AppKit with the wagmi adapter (`createAppKit` +
`WagmiAdapter`), then hands the adapter and AppKit instance to
`<UniswapProvider>`. The widget talks to `@wagmi/core` directly  no
`@wagmi/vue` needed.
