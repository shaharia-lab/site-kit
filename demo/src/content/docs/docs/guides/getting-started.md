---
title: Getting started
description: Add site-kit to an existing Starlight site.
---

Install the kit next to Astro and Starlight:

```sh
npm install @shaharia-lab/site-kit
```

Then hand Starlight the kit's plugins, with a theme:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import siteKit from '@shaharia-lab/site-kit';
import agentoCode from '@shaharia-lab/site-kit/themes/agento-code';

export default defineConfig({
  site: 'https://example.com', // required for llms.txt
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

`siteKit()` returns a list of plugins, not one, because Starlight has no way
for one plugin to register another. Pass it as the whole `plugins` array, or
spread it next to your own: `plugins: [...siteKit({ ... }), myPlugin()]`.

## Options

| Option | What it does |
| --- | --- |
| `theme` | Required. The look of the site. See [Theming](/site-kit/docs/guides/theming/). |
| `repo` | Adds a Star button to the docs header. `stars` shows a count from 100 up. |
| `editLink` | Where Edit on GitHub points. See [Edit on GitHub](/site-kit/docs/guides/edit-links/). |
| `pageActions` | The Copy page and Open buttons. `false` turns them off. |
| `llmsTxt` | Options for starlight-llms-txt. `false` turns it off. |
| `components` | Your own Starlight component overrides. They win over the kit's and the theme's. |
