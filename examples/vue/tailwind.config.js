/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,vue}",
    // Scan the widget's source so its Tailwind utility classes are generated.
    "../../packages/vue-uniswap/src/**/*.{js,ts,vue}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
