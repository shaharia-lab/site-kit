// @ts-check
import { readdirSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import siteKit from '@shaharia-lab/site-kit';
import agentoCode from '@shaharia-lab/site-kit/themes/agento-code';

const REPO = 'https://github.com/shaharia-lab/site-kit';
const CONTENT = 'src/content/docs';

/**
 * Entry id -> file in this repository, for Edit on GitHub.
 *
 * The demo's pages are ordinary files under src/content/docs, so the map is
 * just their paths from the repository root. A site that copies its docs in
 * from elsewhere builds the same map from its own manifest instead, pointing
 * each page at the file it was copied from.
 */
const sources = Object.fromEntries(
  readdirSync(new URL(`./${CONTENT}`, import.meta.url), { recursive: true, encoding: 'utf8' })
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const id = file.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '');
      return [id, `demo/${CONTENT}/${file}`];
    }),
);

// The accent is switchable at build time so every variant can be previewed
// and tested: SITE_KIT_ACCENT=ink npm run build
const accent = /** @type {'forest' | 'saffron' | 'ink'} */ (process.env.SITE_KIT_ACCENT ?? 'forest');

export default defineConfig({
  site: 'https://shaharia-lab.github.io',
  base: '/site-kit',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'site-kit',
      description: 'A themeable Starlight layer for open-source project sites.',
      social: [{ icon: 'github', label: 'GitHub', href: REPO }],
      plugins: siteKit({
        theme: agentoCode({ accent }),
        repo: { url: REPO },
        editLink: { baseUrl: `${REPO}/edit/main/`, sources },
      }),
      sidebar: [
        { label: 'Introduction', slug: 'docs' },
        {
          label: 'Guides',
          items: [
            { label: 'Getting started', slug: 'docs/guides/getting-started' },
            { label: 'Theming', slug: 'docs/guides/theming' },
            { label: 'Page actions', slug: 'docs/guides/page-actions' },
            { label: 'Edit on GitHub', slug: 'docs/guides/edit-links' },
          ],
        },
        { label: 'Style reference', slug: 'docs/style-reference' },
      ],
    }),
  ],
});
