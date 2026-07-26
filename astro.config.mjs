// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The canonical production origin. Override at build time with SITE_URL so the
// same source can be deployed to a preview domain without emitting wrong canonicals.
const SITE = process.env.SITE_URL || 'https://www.guptagroups.in';

export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  build: {
    // Emit /about/index.html rather than /about.html so URLs stay extensionless
    // on every static host without rewrite rules.
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  image: {
    // Local sharp service; all product/factory imagery is processed at build time.
    responsiveStyles: true,
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin'),
      changefreq: 'monthly',
      priority: 0.7,
      // Only `priority` is varied per page. `changefreq` is deliberately left
      // at the collection-level default — search engines largely ignore it,
      // and overriding it per item requires the sitemap package's enum type.
      serialize(item) {
        const { pathname } = new URL(item.url);
        if (pathname === '/') return { ...item, priority: 1.0 };
        if (/^\/(products|rfq|capabilities)/.test(pathname)) {
          return { ...item, priority: 0.9 };
        }
        return item;
      },
    }),
  ],
  vite: {
    build: {
      cssCodeSplit: true,
    },
  },
});
