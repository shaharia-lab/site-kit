import type { StarlightPlugin, StarlightUserConfig } from '@astrojs/starlight/types';

/**
 * A theme is everything that decides how a site looks, and nothing else.
 *
 * Components in this kit never name a colour. They use the shared token names
 * (`--ink`, `--paper`, `--accent`, `--font-body`, ...) and Starlight's own
 * `--sl-*` properties, and a theme is what gives those values. So a new design
 * is a new theme, and no component changes. `npm run check:tokens` enforces the
 * component side of that.
 *
 * Light and dark are not optional: Starlight's toggle flips `data-theme` on
 * <html> between `light` and `dark`, and every theme must give values for both.
 *
 * A theme can go further than colours when a design needs to:
 *   - `components` swaps Starlight components (a different header, footer...);
 *   - `plugins` brings in an existing community Starlight theme plugin as the
 *     base, with this theme's CSS layered on top of it.
 */
export interface SiteKitTheme {
  /** Stable identifier, used in build logs. */
  name: string;
  /**
   * Stylesheets, in cascade order, as Starlight `customCss` entries: package
   * specifiers (`@scope/pkg/file.css`) or paths relative to the site root.
   */
  css: string[];
  /**
   * Expressive Code settings for code blocks. They have to be literal colours,
   * not `var(--...)`: Expressive Code parses every colour at build time and
   * drops its whole stylesheet if one of them is not a colour it understands.
   */
  expressiveCode?: StarlightUserConfig['expressiveCode'];
  /** Starlight component overrides this design needs. A site's own still win. */
  components?: StarlightUserConfig['components'];
  /** Starlight plugins the theme is built on, registered before the kit's own. */
  plugins?: StarlightPlugin[];
}

/** Identity helper, so a theme file gets type-checking without importing the interface. */
export function defineTheme(theme: SiteKitTheme): SiteKitTheme {
  return theme;
}
