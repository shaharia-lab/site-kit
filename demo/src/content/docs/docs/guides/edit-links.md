---
title: Edit on GitHub
description: Point Edit on GitHub at the file a contributor should really edit.
---

With `editLink.baseUrl` alone, the link follows Starlight's own rule: the
page's path under `src/content/docs`, appended to the base URL.

That is wrong for sites that generate their docs pages. A site that copies a
`docs/` folder into `src/content/docs` at build time would send contributors to
the generated copy, which is usually gitignored and 404s on GitHub.

Such sites pass `sources`, a map from each page's entry id to the real file:

```js
import { PAGES } from './docs.manifest.mjs';

siteKit({
  theme,
  editLink: {
    baseUrl: 'https://github.com/org/project/edit/main/',
    sources: Object.fromEntries(
      PAGES.map((page) => [`docs/${page.slug}`, `docs/${page.file}`]),
    ),
  },
});
```

With `sources` set, the map is the only source of truth. A page that is not in
it gets no Edit on GitHub link rather than a broken one.
