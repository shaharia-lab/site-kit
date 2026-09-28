import { defineTheme, type SiteKitTheme } from '../../theme';

export interface AgentoCodeOptions {
  /**
   * The accent colour, one of the design system's named palettes. `forest`
   * (bottle green) is the design system's default; `ink` drops the accent and
   * lets near-black do every job.
   */
  accent?: 'forest' | 'saffron' | 'ink';
}

/**
 * The agento-code design system (@shaharia-lab/agento-code) as a site-kit
 * theme: paper and ink grounds, hard 1.5px ink borders, serif display
 * headings, no shadows, code blocks always dark. Light and dark follow the
 * visitor's system setting until they use Starlight's toggle.
 */
export default function agentoCode(options: AgentoCodeOptions = {}): SiteKitTheme {
  const accent = options.accent ?? 'forest';
  const here = '@shaharia-lab/site-kit/themes/agento-code';

  return defineTheme({
    name: `agento-code (${accent})`,
    css: [
      `${here}/fonts.css`,
      `${here}/tokens.css`,
      // The design system picks an accent with `data-accent` on <html>, which
      // Starlight's document never carries, so the choice is made with a
      // stylesheet instead. Forest is the tokens' own default.
      ...(accent === 'forest' ? [] : [`${here}/accents/${accent}.css`]),
      `${here}/starlight.css`,
      `${here}/page-actions.css`,
    ],
    expressiveCode: {
      // One theme for both site themes: code blocks are always inverted
      // relative to the page, which is the design's own rule.
      themes: ['github-dark'],
      styleOverrides: {
        borderRadius: '2px',
        borderWidth: '1.5px',
        codeBackground: INK,
        codeFontSize: '0.82rem',
        // Flatten the frame into the code ground, so a fenced block is one
        // solid rectangle with no light title strip stacked on a dark body.
        frames: {
          frameBoxShadowCssValue: 'none',
          editorBackground: INK,
          editorTabBarBackground: INK,
          editorActiveTabBackground: INK,
          editorActiveTabBorderColor: 'transparent',
          editorActiveTabIndicatorTopColor: 'transparent',
          editorTabBarBorderBottomColor: 'transparent',
          terminalBackground: INK,
          terminalTitlebarBackground: INK,
          terminalTitlebarBorderBottomColor: 'transparent',
          terminalTitlebarDotsOpacity: '0',
        },
      },
    },
  });
}

/** The code ground. A literal because Expressive Code cannot read var(--code-bg). */
const INK = '#0B0C07';
