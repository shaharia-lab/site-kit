# @shaharia-lab/site-kit

A themeable [Starlight](https://starlight.astro.build) layer for Shaharia Lab
open-source project sites.

- **Themes**, light and dark: a site picks one, a new design is a new theme.
- **Page actions** under every docs title: Copy page, View as Markdown, Open in
  ChatGPT, Open in Claude, Edit on GitHub.
- **Markdown twins** of every page at its URL plus `.md`.
- **llms.txt**, `llms-full.txt` and `llms-small.txt`.

Built on [starlight-page-actions](https://github.com/dlcastillop/starlight-page-actions)
and [starlight-llms-txt](https://github.com/delucis/starlight-llms-txt) rather
than reimplementing them.

```sh
npm install @shaharia-lab/site-kit
```

```js
// astro.config.mjs
import starlight from '@astrojs/starlight';
import siteKit from '@shaharia-lab/site-kit';
import agentoCode from '@shaharia-lab/site-kit/themes/agento-code';

export default defineConfig({
  site: 'https://example.com',
  integrations: [
    starlight({
      title: 'My project',
      plugins: siteKit({
        theme: agentoCode({ accent: 'ink' }),
        repo: { url: 'https://github.com/org/project' },
        editLink: { baseUrl: 'https://github.com/org/project/edit/main/' },
      }),
    }),
  ],
});
```

Full documentation: https://shaharia-lab.github.io/site-kit/docs/
