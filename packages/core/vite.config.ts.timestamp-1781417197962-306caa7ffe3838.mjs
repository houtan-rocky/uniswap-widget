// vite.config.ts
import { defineConfig } from "file:///home/anon/Repos/react-uniswap/node_modules/.pnpm/vite@5.4.21_@types+node@25.9.3_terser@5.48.0/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
import dts from "file:///home/anon/Repos/react-uniswap/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@25.9.3_rollup@4.61.1_supports-color@8.1.1_typescript@_1531528aa77f261742a1d60dd2943faf/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "/home/anon/Repos/react-uniswap/packages/core";
var vite_config_default = defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.spec.ts", "src/test/**"]
    })
  ],
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "UniswapWidgetCore",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "umd"]
    },
    rollupOptions: {
      external: [/^ethers($|\/)/, /^@uniswap\//, "jsbi"],
      output: {
        preserveModules: false,
        // required for the UMD build
        globals: {
          ethers: "ethers",
          "@uniswap/sdk-core": "uniswapSdkCore",
          "@uniswap/v3-sdk": "uniswapV3Sdk",
          "@uniswap/v3-core": "uniswapV3Core",
          jsbi: "JSBI"
        }
      }
    },
    copyPublicDir: false,
    sourcemap: true,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9hbm9uL1JlcG9zL3JlYWN0LXVuaXN3YXAvcGFja2FnZXMvY29yZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvYW5vbi9SZXBvcy9yZWFjdC11bmlzd2FwL3BhY2thZ2VzL2NvcmUvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvYW5vbi9SZXBvcy9yZWFjdC11bmlzd2FwL3BhY2thZ2VzL2NvcmUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcblxuLy8gRnJhbWV3b3JrLWFnbm9zdGljIGNvcmUgbGlicmFyeSBidWlsZC4gTm8gUmVhY3QvVnVlIHBsdWdpbnMgaGVyZSAgdGhpc1xuLy8gcGFja2FnZSBpcyBvbmx5IHRyYWRpbmcgbG9naWMsIHR5cGVzLCBhbmQgdGhlbWUgZGF0YS4gVGhlIHdlYjMvdW5pc3dhcCBzdGFja1xuLy8gc3RheXMgZXh0ZXJuYWwgKGRlY2xhcmVkIGFzIHBlZXJEZXBlbmRlbmNpZXMpLCBwcm92aWRlZCBieSB0aGUgaG9zdCBhcHAuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgZHRzKHtcbiAgICAgIGluc2VydFR5cGVzRW50cnk6IHRydWUsXG4gICAgICByb2xsdXBUeXBlczogdHJ1ZSxcbiAgICAgIGluY2x1ZGU6IFsnc3JjLyoqLyoudHMnXSxcbiAgICAgIGV4Y2x1ZGU6IFsnc3JjLyoqLyouc3BlYy50cycsICdzcmMvdGVzdC8qKiddLFxuICAgIH0pLFxuICBdLFxuXG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcbiAgICAgIG5hbWU6ICdVbmlzd2FwV2lkZ2V0Q29yZScsXG4gICAgICBmaWxlTmFtZTogKGZvcm1hdCkgPT4gYGluZGV4LiR7Zm9ybWF0fS5qc2AsXG4gICAgICBmb3JtYXRzOiBbJ2VzJywgJ3VtZCddLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFsvXmV0aGVycygkfFxcLykvLCAvXkB1bmlzd2FwXFwvLywgJ2pzYmknXSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBwcmVzZXJ2ZU1vZHVsZXM6IGZhbHNlLCAvLyByZXF1aXJlZCBmb3IgdGhlIFVNRCBidWlsZFxuICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgZXRoZXJzOiAnZXRoZXJzJyxcbiAgICAgICAgICAnQHVuaXN3YXAvc2RrLWNvcmUnOiAndW5pc3dhcFNka0NvcmUnLFxuICAgICAgICAgICdAdW5pc3dhcC92My1zZGsnOiAndW5pc3dhcFYzU2RrJyxcbiAgICAgICAgICAnQHVuaXN3YXAvdjMtY29yZSc6ICd1bmlzd2FwVjNDb3JlJyxcbiAgICAgICAgICBqc2JpOiAnSlNCSScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgY29weVB1YmxpY0RpcjogZmFsc2UsXG4gICAgc291cmNlbWFwOiB0cnVlLFxuICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1QsU0FBUyxvQkFBb0I7QUFDblYsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sU0FBUztBQUZoQixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsTUFDRixrQkFBa0I7QUFBQSxNQUNsQixhQUFhO0FBQUEsTUFDYixTQUFTLENBQUMsYUFBYTtBQUFBLE1BQ3ZCLFNBQVMsQ0FBQyxvQkFBb0IsYUFBYTtBQUFBLElBQzdDLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFFQSxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ3hDLE1BQU07QUFBQSxNQUNOLFVBQVUsQ0FBQyxXQUFXLFNBQVMsTUFBTTtBQUFBLE1BQ3JDLFNBQVMsQ0FBQyxNQUFNLEtBQUs7QUFBQSxJQUN2QjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLGlCQUFpQixlQUFlLE1BQU07QUFBQSxNQUNqRCxRQUFRO0FBQUEsUUFDTixpQkFBaUI7QUFBQTtBQUFBLFFBQ2pCLFNBQVM7QUFBQSxVQUNQLFFBQVE7QUFBQSxVQUNSLHFCQUFxQjtBQUFBLFVBQ3JCLG1CQUFtQjtBQUFBLFVBQ25CLG9CQUFvQjtBQUFBLFVBQ3BCLE1BQU07QUFBQSxRQUNSO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGVBQWU7QUFBQSxJQUNmLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLGVBQWU7QUFBQSxNQUNqQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
