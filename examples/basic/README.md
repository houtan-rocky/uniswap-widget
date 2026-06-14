# @examples/basic

A minimal, runnable app that consumes the [`@uniswap-widget/react`](../../packages/react-uniswap) widget exactly the way a real downstream app would — it depends on `@uniswap-widget/react` via `workspace:*` and imports the widget from its public entry point.

This example doubles as the **reference implementation of the host-app contract**: it provides the Tailwind setup, the API proxy, and the Vite env the widget expects.

## Run it

From the repo root:

```bash
pnpm install
pnpm dev          # → runs this example (vite dev server)
```

Or from this folder:

```bash
pnpm --filter @examples/basic dev
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
| **Tailwind** generating the widget's classes | [`tailwind.config.js`](tailwind.config.js) scans `../../packages/react-uniswap/src` |
| **`/api/base-rpc`** + **`/api/uniswap/*`** proxy (dev) | [`vite.config.ts`](vite.config.ts) `server.proxy` |
| Same paths in production | [`api/`](api) Vercel functions + [`vercel.json`](vercel.json) rewrites |
| Vite `import.meta.env.VITE_*` | this is a Vite app; values come from `.env` |
