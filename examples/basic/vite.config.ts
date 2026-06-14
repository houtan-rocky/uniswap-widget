import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-server config for the example app. The proxies below stand in for the
// backend the widget expects: a host app must forward these paths (token
// search + Base RPC) so the widget's network calls succeed. In production this
// example uses the Vercel functions under ./api (see vercel.json).
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api/uniswap/v1': {
        target: 'https://trading-api-labs.interface.gateway.uniswap.org',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/uniswap/, ''),
        headers: {
          'origin': 'https://app.uniswap.org',
          'referer': 'https://app.uniswap.org/',
          'content-type': 'application/json',
          'x-api-key': process.env.VITE_UNISWAP_API_KEY ?? '',
          'x-request-source': 'uniswap-web',
          'x-universal-router-version': '2.0',
        },
      },
      '/api/uniswap/v2': {
        target: 'https://interface.gateway.uniswap.org',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/uniswap/, ''),
        headers: {
          'origin': 'https://app.uniswap.org',
          'referer': 'https://app.uniswap.org/',
          'content-type': 'application/json',
          'x-api-key': process.env.VITE_UNISWAP_API_KEY ?? '',
          'x-request-source': 'uniswap-web',
        },
      },
      '/api/base-rpc': {
        target: 'https://base-pokt.nodies.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/base-rpc/, ''),
        headers: {
          'Origin': 'https://base.org',
          'Referer': 'https://base.org/',
        },
      },
    },
  },
})
