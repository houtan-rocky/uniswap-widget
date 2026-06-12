import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    }),
  ],

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
        }
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
        }
      },
      '/api/base-rpc': {
        target: 'https://base-pokt.nodies.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/base-rpc/, ''),
        headers: {
          'Origin': 'https://base.org',
          'Referer': 'https://base.org/',
        }
      }
    }
  },

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'UniswapWidget',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: [
        // react
        'react',
        'react-dom',
        'react/jsx-runtime',
        // wagmi ecosystem
        '@wagmi/core',
        'wagmi',
        'viem',
        // reown
        '@reown/appkit',
        '@reown/appkit-adapter-wagmi',
        // uniswap
        '@uniswap/sdk-core',
        '@uniswap/v3-sdk',
        // others
        '@tanstack/react-query',
        'ethers',
        'jsbi',
      ],
      output: {
        preserveModules: false, // UMD با true کار نمی‌کنه
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsx',
          '@wagmi/core': 'wagmiCore',
          'wagmi': 'wagmi',
          'viem': 'viem',
          '@reown/appkit': 'reownAppkit',
          '@reown/appkit-adapter-wagmi': 'reownAppkitAdapterWagmi',
          '@uniswap/sdk-core': 'uniswapSdkCore',
          '@uniswap/v3-sdk': 'uniswapV3Sdk',
          '@tanstack/react-query': 'reactQuery',
          'ethers': 'ethers',
          'jsbi': 'JSBI',
        }
      }
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,   // console.log از bundle حذف میشه
        drop_debugger: true,
      }
    }
  }
})