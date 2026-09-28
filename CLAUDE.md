# CLAUDE.md

Guidance for Claude Code working in this repository.

## What this is

`@shaharia-lab/site-kit`: the layer every Shaharia Lab open-source project site
shares on top of [Astro](https://astro.build) and
[Starlight](https://starlight.astro.build). It is **not a framework**. Starlight
does routing, search, the sidebar, Markdown and dark mode; the kit adds only
what our sites have in common:

- **Themes.** The whole look, light and dark, is a theme chosen in config.
- **Page actions** under every docs title: Copy page, Open in ChatGPT, Open in
  Claude, View as Markdown, Edit on GitHub.
- **Markdown twins** of every docs page at its URL plus `.md`, and
  `llms.txt` / `llms-full.txt` / `llms-small.txt`.
- **Edit on GitHub** that can point at a page's real source file.
- **A Star button** in the docs header.

Public repository, MIT. Never commit secrets or tokens.

### Who consumes it

A change here ships to all of these on their next version bump, so check them
before changing behaviour:

| Site | Repo | Accent |
|---|---|---|
| vibexp.io | `vibexp/website` (site at the repo root) | `ink` |
| myagento.app | `shaharia-lab/agento`, `web/` | `forest` |
| slackcli.dev | `shaharia-lab/slackcli`, `web/` | `forest` |

All three generate their docs pages from a `docs/` folder with a
`scripts/sync-docs.mjs` and a `docs.manifest.mjs`, and pass
`editLink.sources` built from that manifest. slackcli has a strict contributing
constitution in its own CLAUDE.md (issue with `ready-for-pr` label before any
PR); read it before opening a PR there.

## Commands

```bash
npm install
npm run dev          # the demo site, with the kit linked from packages/
npm run check        # check:tokens, then astro check over the demo AND the kit
npm test             # Vitest: unit tests, then a real demo build with output assertions
npm run test:unit    # unit tests only (fast)
npm run test:build   # the real-build tests only
SITE_KIT_ACCENT=ink npm run build   # build the demo with another accent
npm pack --dry-run -w @shaharia-lab/site-kit   # what would be published
```

Run `check` and `test` before every commit. CI runs both, builds every accent,
and dry-runs the pack.

## Layout

An npm workspace:

| Path | What it is |
|---|---|
| `packages/site-kit/index.ts` | `siteKit(options)`: returns a **list** of Starlight plugins |
| `packages/site-kit/theme.ts` | The theme contract (`SiteKitTheme`, `defineTheme`) |
| `packages/site-kit/edit-link.ts` | Pure edit-URL logic, unit-tested |
| `packages/site-kit/middleware.ts` | Starlight route middleware applying `edit-link.ts` |
| `packages/site-kit/overrides/` | Starlight component overrides (title row, Edit on GitHub, Star button, empty footer EditLink) |
| `packages/site-kit/styles/` | Theme-neutral base styles for the kit's own components |
| `packages/site-kit/themes/agento-code/` | The built-in theme: tokens, fonts, accents, Starlight surfaces, page-actions look |
| `packages/site-kit/test/` | Unit tests |
| `demo/` | The kit's own docs and visual test bed, deployed to GitHub Pages |
| `tests/build.test.ts` | Builds the demo once and asserts on `demo/dist` |
| `scripts/check-tokens.mjs` | Fails on colour literals outside `themes/` |

The package ships **TypeScript and `.astro` source**, not a build: Astro
compiles it in the consuming site. Anything a consumer imports must be listed in
`exports` and in `files` in `packages/site-kit/package.json`; check with
`npm pack --dry-run`.

## Rules

1. **Only themes name colours.** Kit components and base styles use tokens
   (`var(--ink)`) and Starlight's `--sl-*` properties. `check:tokens` enforces
   it. A new design is a new theme, never an edit to a component.
2. **Every theme ships light and dark.** Starlight's toggle sets
   `data-theme="light" | "dark"` on `<html>`; before a choice, follow
   `prefers-color-scheme`.
3. **Prefer a maintained community plugin to new code**, and wrap it rather
   than fork it. Page actions come from `starlight-page-actions`, llms.txt from
   `starlight-llms-txt`. Write our own only for what no plugin does (so far:
   Edit on GitHub with a source map, the theme contract, the Star button).
4. **Behaviour is tested.** Logic goes in a pure module with unit tests
   (`edit-link.ts` is the pattern); anything visible in the output gets an
   assertion in `tests/build.test.ts`. A bug fix comes with the test that would
   have caught it.
5. **No duplication.** Shared styling lives once (`styles/`, the theme's shared
   selectors). A helper used twice becomes one helper.
6. **Customisation precedence is fixed**, lowest first: Starlight and earlier
   plugins → the kit's defaults → the theme's `components` → the site's
   `components` option. CSS: kit base → theme → site `customCss`. Keep it that
   way; the unit tests pin it.
7. Comments explain *why*, in the voice of the existing files.

## Gotchas that have cost time

- **The page title is `<h1 id="_top">` with no class.** A `h1.page-title`
  selector never matches. Every site carried that bug until the kit fixed it.
- **Expressive Code colours must be literals.** It parses every colour at build
  time; one `var(--...)` silently drops its whole stylesheet. That is why
  `expressiveCode` lives in the theme with a literal code ground.
- **Don't pass `baseUrl` to starlight-page-actions.** It only uses it to write
  its own `llms.txt` after the build, which would overwrite the fuller one from
  starlight-llms-txt.
- **starlight-page-actions installs its own `PageTitle`.** The kit replaces it
  with ours (which wraps theirs), which is why the kit's plugin must stay last in
  the list and why sites pass overrides through the kit's `components` option
  rather than `starlight({ components })`.
- **Starlight's footer "Edit page" link is removed on purpose** (empty
  `EditLink` override), so there is one edit link per page.
- **`editLink.sources` keys are Starlight entry ids** (`docs/user-guide/memory`,
  and `docs` for `docs/index.md`), not URLs or file paths. With `sources` set, a
  page missing from the map gets no link rather than a broken one.
- **Plugins that ship TypeScript source** must be listed in Vitest's
  `server.deps.inline`, or Node refuses to strip types inside `node_modules`.
- **Astro 7's `astro preview` daemonises** and returns at once; stop it with
  `npx astro preview stop` in `demo/`.
- **TypeScript 7 is held back** in `dependabot.yml`: `astro check` refuses it.
  Lift the ignore when `@astrojs/check` supports 7.
- **starlight-blog needs Starlight 0.42**; the sites are on 0.41. Moving to 0.42
  means bumping the kit's dev dependency and all three sites together.
- **Actions must be pinned to full commit SHAs** (org rule
  `sha_pinning_required`); a `@v7` tag fails the run before it starts. Keep the
  `# vX.Y.Z` comment next to each SHA.

## Releasing

1. Bump `packages/site-kit/package.json` and add a dated
   `packages/site-kit/CHANGELOG.md` entry; merge.
2. `git tag site-kit@X.Y.Z && git push origin site-kit@X.Y.Z` on `main`.
3. `publish.yml` runs in the `npm-publish` environment, re-runs check and test,
   and publishes with **npm trusted publishing** (OIDC, provenance, no token).
   A version already on npm is skipped, so re-running is safe.
4. `gh release create site-kit@X.Y.Z` with the changelog entry.
5. Bump `@shaharia-lab/site-kit` in the consuming sites.

The trusted publisher (npmjs.com → package → Settings) names repo
`shaharia-lab/site-kit`, workflow `publish.yml`, environment `npm-publish`.
That environment, GitHub Pages and the repo settings are managed in Terraform in
`shaharia-lab/infrastructure` (`terraform/github-shaharia-lab`), not in the UI.
A human-driven `npm publish` needs the account's 2FA code; CI does not.

Tags are `<directory under packages/>@<version>`, so a second package (a theme
of its own, say) can be released from this repo the same way.
