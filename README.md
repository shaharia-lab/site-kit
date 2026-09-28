# site-kit

A themeable [Starlight](https://starlight.astro.build) layer shared by the
Shaharia Lab open-source project sites. It is not a framework: Astro and
Starlight do the heavy lifting, and the kit adds themes, page actions
(Copy page, View as Markdown, Open in ChatGPT / Claude, Edit on GitHub),
Markdown twins of every page and llms.txt. Where a reliable community plugin
exists it is used rather than rewritten.

- Package: [`packages/site-kit`](packages/site-kit) (published as `@shaharia-lab/site-kit`)
- Demo and docs: [`demo`](demo), deployed to https://shaharia-lab.github.io/site-kit/

## Development

```sh
npm install
npm run dev          # the demo site, with the kit linked from packages/
npm run check        # colour literals outside themes/, then types
npm test             # unit tests, then a real demo build with output assertions
SITE_KIT_ACCENT=ink npm run build   # build with another accent
```

## Rules

- **Only themes name colours.** Kit components use tokens (`var(--ink)`,
  `var(--sl-color-gray-5)`); `npm run check:tokens` fails on a literal.
- **Every theme ships light and dark.** Starlight's toggle sets `data-theme`.
- **Prefer a community plugin** to new code, and wrap it rather than fork it.
- **Behaviour is tested**: logic in `packages/*/test`, rendered output in `tests/`.

## Releasing

Bump `packages/site-kit/package.json`, update its CHANGELOG, merge, then tag:

```sh
git tag site-kit@0.1.0 && git push origin site-kit@0.1.0
```

`publish.yml` runs the checks and tests again and publishes with npm trusted
publishing (no token). The very first version has to be published once by
hand, because npm only offers the trusted-publisher setting on a package that
already exists.

## License

MIT
