import { defineConfig } from 'astro/config';

// Deploys as a static site. For a GitHub Pages project site set BASE_PATH=/repo-name/.
export default defineConfig({
  site: process.env.SITE_URL || 'https://rohitsainier.github.io',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
  vite: { build: { assetsInlineLimit: 2048 } },
});
