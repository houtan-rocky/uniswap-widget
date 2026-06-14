import { defineConfig } from 'vitest/config'

// Core ships only pure-logic tests (amount conversion, address checksum, rate
// limit config, theme shape) — no DOM, so a plain node environment with no
// setup files. Kept separate from vite.config.ts so the lib-build plugins
// (vite-plugin-dts, terser) don't run during tests.
export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['src/**/*.spec.ts'],
  },
})
