import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// Framework-agnostic core library build. No React/Vue plugins here — this
// package is only trading logic, types, and theme data. The web3/uniswap stack
// stays external (declared as peerDependencies), provided by the host app.
export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/test/**'],
    }),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'UniswapWidgetCore',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: [/^ethers($|\/)/, /^@uniswap\//, 'jsbi'],
      output: {
        preserveModules: false, // required for the UMD build
        globals: {
          ethers: 'ethers',
          '@uniswap/sdk-core': 'uniswapSdkCore',
          '@uniswap/v3-sdk': 'uniswapV3Sdk',
          '@uniswap/v3-core': 'uniswapV3Core',
          jsbi: 'JSBI',
        },
      },
    },
    copyPublicDir: false,
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
