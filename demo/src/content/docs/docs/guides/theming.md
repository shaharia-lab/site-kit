---
title: Theming
description: How themes work, and how to write a new one.
---

A theme is everything that decides how a site looks, and nothing else. The
kit's components never name a colour; they use shared token names such as
`--ink`, `--paper` and `--accent`, plus Starlight's own `--sl-*` properties.
A theme is what gives those names their values.

## Light and dark

Every theme must define both. Starlight's theme toggle sets
`data-theme="light"` or `data-theme="dark"` on `<html>`, and before a visitor
chooses, a theme should follow `prefers-color-scheme`. Try the toggle in the
header of this page.

## What a theme can contain

```ts
import { defineTheme } from '@shaharia-lab/site-kit';

export default defineTheme({
  name: 'my-theme',
  // Stylesheets in cascade order. Light and dark values both required.
  css: ['@my-scope/my-theme/tokens.css', '@my-scope/my-theme/starlight.css'],
  // Code block settings. Literal colours only: Expressive Code cannot read
  // var(--...) and drops its whole stylesheet if it meets one.
  expressiveCode: { themes: ['github-dark'] },
  // Optional: swap Starlight components this design needs.
  components: { Footer: '@my-scope/my-theme/Footer.astro' },
  // Optional: build on an existing community Starlight theme plugin.
  plugins: [],
});
```

The cascade is: Starlight, then the kit's neutral base styles, then the
theme, then the site's own `customCss`. Each layer can restyle the one before.

## The built-in theme

`agento-code` is the [agento-code design system](https://github.com/shaharia-lab/design-system)
as a theme. It takes one option, the accent:

| Accent | Look |
| --- | --- |
| `forest` | Bottle green. The default. |
| `saffron` | Warm yellow. Warnings turn letterpress red. |
| `ink` | No accent colour; near-black does every job. |

## Rule for kit components

Kit components may not contain colour literals. `npm run check:tokens` fails
the build if one does. Only theme folders may name colours.
