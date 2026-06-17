import { defineConfig } from 'vitepress'

// Project site served at https://houtan-rocky.github.io/uniswap-widget/
// so `base` MUST match the repo name. Change both `base` and the GitHub URLs
// below if the repo is ever renamed.
const REPO = 'https://github.com/houtan-rocky/uniswap-widget'

export default defineConfig({
  title: 'uniswap-widget',
  description:
    'Embeddable Uniswap swap widget — a framework-agnostic core with React and Vue bindings.',
  base: '/uniswap-widget/',
  lastUpdated: true,

  // Emit sitemap.xml so search engines can index every page (discoverability).
  sitemap: {
    hostname: 'https://houtan-rocky.github.io/uniswap-widget/',
  },

  // The React README documents env vars in an ```env block; Shiki has no `env`
  // grammar, so map it to `ini` (KEY=value) to highlight it and silence the
  // build warning — without editing the published README.
  markdown: {
    languageAlias: { env: 'ini' },
  },

  // Favicon + Open Graph/Twitter tags for rich link previews when shared.
  head: [
    ['link', { rel: 'icon', href: '/uniswap-widget/favicon.ico' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'uniswap-widget' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Embeddable Uniswap swap widget — a framework-agnostic core with React and Vue bindings.',
      },
    ],
    ['meta', { property: 'og:url', content: 'https://houtan-rocky.github.io/uniswap-widget/' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
  ],

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Packages', link: '/packages/react' },
      { text: 'Playground', link: '/playground/' },
      {
        text: 'npm',
        items: [
          {
            text: '@uniswap-widget/react',
            link: 'https://www.npmjs.com/package/@uniswap-widget/react',
          },
          {
            text: '@uniswap-widget/vue',
            link: 'https://www.npmjs.com/package/@uniswap-widget/vue',
          },
          {
            text: '@uniswap-widget/core',
            link: 'https://www.npmjs.com/package/@uniswap-widget/core',
          },
        ],
      },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Getting started', link: '/guide/getting-started' },
        ],
      },
      {
        text: 'Packages',
        items: [
          { text: '@uniswap-widget/react', link: '/packages/react' },
          { text: '@uniswap-widget/vue', link: '/packages/vue' },
          { text: '@uniswap-widget/core', link: '/packages/core' },
        ],
      },
      {
        text: 'Playground',
        items: [{ text: 'Example apps', link: '/playground/' }],
      },
      {
        text: 'Design',
        items: [{ text: 'Architecture', link: '/architecture/' }],
      },
    ],

    socialLinks: [{ icon: 'github', link: REPO }],

    search: { provider: 'local' },

    editLink: {
      pattern: `${REPO}/edit/main/docs-site/:path`,
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © ${new Date().getFullYear()} houtan-rocky`,
    },
  },
})
