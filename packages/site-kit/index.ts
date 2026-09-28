import type { StarlightPlugin, StarlightUserConfig } from '@astrojs/starlight/types';
import starlightLlmsTxt from 'starlight-llms-txt';
import starlightPageActions from 'starlight-page-actions';
import type { SiteKitTheme } from './theme';

export type { SiteKitTheme } from './theme';
export { defineTheme } from './theme';

type LlmsTxtOptions = NonNullable<Parameters<typeof starlightLlmsTxt>[0]>;

export interface SiteKitOptions {
  /** How the site looks. See theme.ts for what a theme is allowed to contain. */
  theme: SiteKitTheme;
  /**
   * The project's repository, for the Star button in the docs header. Leave
   * `stars` out (or null) to show the button without a count.
   */
  repo?: { url: string; stars?: number | null };
  /**
   * Where "Edit on GitHub" points. `baseUrl` is an edit URL ending in a slash,
   * such as `https://github.com/org/repo/edit/main/`.
   *
   * Sites that generate their docs pages from another folder (a sync script
   * copying `docs/` into `src/content/docs/`) must pass `sources`, mapping each
   * Starlight entry id to the file a contributor should actually edit. Without
   * it the link would point at the generated copy, which is usually gitignored
   * and 404s on GitHub. With `sources`, a page missing from the map gets no
   * edit link rather than a broken one.
   */
  editLink?: { baseUrl: string; sources?: Record<string, string> } | false;
  /**
   * The page actions under each docs title: Copy page, and a menu with View as
   * Markdown, Open in ChatGPT and Open in Claude. Every docs page also gets a
   * Markdown twin at the same URL plus `.md`.
   */
  pageActions?:
    | {
        /** Prompt sent to the chat apps. `{url}` is replaced with the page URL. */
        prompt?: string;
        chatgpt?: boolean;
        claude?: boolean;
        /** The "View as Markdown" entry. The `.md` files are generated either way. */
        markdown?: boolean;
      }
    | false;
  /**
   * `/llms.txt`, `/llms-full.txt` and `/llms-small.txt`, from starlight-llms-txt.
   * Requires `site` in the Astro config.
   */
  llmsTxt?: LlmsTxtOptions | false;
  /**
   * The site's own Starlight component overrides. Pass them here rather than to
   * `starlight({ components })`: the kit and its plugins install overrides of
   * their own, and only this option is guaranteed to win over all of them.
   */
  components?: StarlightUserConfig['components'];
}

/** What the runtime pieces (overrides, route middleware) are allowed to see. */
export interface SiteKitRuntimeConfig {
  theme: string;
  repo: { url: string; stars: number | null } | null;
  editLink: { baseUrl: string; sources: Record<string, string> | null } | null;
  pageActions: boolean;
}

/** Theme-neutral styles for the kit's own components. Themes restyle them. */
const KIT_CSS = ['@shaharia-lab/site-kit/styles/page-actions.css'];

const DEFAULT_PROMPT = 'Read {url} and answer questions about the content.';

/**
 * The kit, as a list of Starlight plugins:
 *
 *   starlight({ plugins: siteKit({ theme: agentoCode() }) })
 *
 * A list because Starlight has no way for one plugin to register another, and
 * the kit is deliberately built from existing community plugins rather than
 * reimplementing them. Order matters: the kit's own plugin runs last so its
 * component overrides land on top of the ones the others install.
 */
export default function siteKit(options: SiteKitOptions): StarlightPlugin[] {
  // A theme built on a community Starlight theme registers that plugin first,
  // so everything after it (and the theme's own CSS) layers on top.
  const plugins: StarlightPlugin[] = [...(options.theme.plugins ?? [])];
  const pageActions = options.pageActions === false ? null : (options.pageActions ?? {});

  if (pageActions) {
    plugins.push(
      starlightPageActions({
        prompt: pageActions.prompt ?? DEFAULT_PROMPT,
        // No `baseUrl`, on purpose: starlight-page-actions only uses it to write
        // its own llms.txt after the build, which would overwrite the fuller
        // one starlight-llms-txt generates below.
        actions: {
          chatgpt: pageActions.chatgpt ?? true,
          claude: pageActions.claude ?? true,
          markdown: pageActions.markdown ?? true,
        },
      }),
    );
  }

  if (options.llmsTxt !== false) {
    plugins.push(starlightLlmsTxt(options.llmsTxt ?? {}));
  }

  plugins.push(corePlugin(options, pageActions !== null));
  return plugins;
}

function corePlugin(options: SiteKitOptions, pageActions: boolean): StarlightPlugin {
  const runtime: SiteKitRuntimeConfig = {
    theme: options.theme.name,
    repo: options.repo ? { url: options.repo.url, stars: options.repo.stars ?? null } : null,
    editLink: options.editLink
      ? { baseUrl: options.editLink.baseUrl, sources: options.editLink.sources ?? null }
      : null,
    pageActions,
  };

  return {
    name: '@shaharia-lab/site-kit',
    hooks: {
      'config:setup'({ config, updateConfig, addIntegration, addRouteMiddleware }) {
        const { theme } = options;

        updateConfig({
          // Kit base styles, then the theme, then the site's own, so each layer
          // can restyle the one before it.
          customCss: [...KIT_CSS, ...theme.css, ...(config.customCss ?? [])],
          // A site that configures Expressive Code itself keeps its settings.
          ...(config.expressiveCode === undefined && theme.expressiveCode !== undefined
            ? { expressiveCode: theme.expressiveCode }
            : {}),
          // Starlight's own edit URL is the fallback for pages not in `sources`
          // when no map is given; the route middleware handles the rest.
          ...(runtime.editLink ? { editLink: { baseUrl: runtime.editLink.baseUrl } } : {}),
          // Precedence, lowest first: what Starlight and earlier plugins set
          // (starlight-page-actions installs its own PageTitle), the kit's
          // defaults, the theme's swaps, and finally the site's own choices.
          components: {
            ...config.components,
            PageTitle: pageActions
              ? '@shaharia-lab/site-kit/overrides/PageTitle.astro'
              : '@shaharia-lab/site-kit/overrides/PageTitleNoActions.astro',
            EditLink: '@shaharia-lab/site-kit/overrides/EditLink.astro',
            ...(runtime.repo ? { SocialIcons: '@shaharia-lab/site-kit/overrides/SocialIcons.astro' } : {}),
            ...theme.components,
            ...options.components,
          },
        });

        if (runtime.editLink) {
          addRouteMiddleware({ entrypoint: '@shaharia-lab/site-kit/middleware' });
        }

        addIntegration({
          name: '@shaharia-lab/site-kit/config',
          hooks: {
            'astro:config:setup'({ updateConfig: updateAstroConfig }) {
              updateAstroConfig({ vite: { plugins: [virtualConfig(runtime)] } });
            },
          },
        });
      },
    },
  };
}

const VIRTUAL_ID = 'virtual:site-kit/config';

/** Hands the serialisable part of the options to the overrides and middleware. */
function virtualConfig(runtime: SiteKitRuntimeConfig) {
  const resolved = `\0${VIRTUAL_ID}`;
  return {
    name: 'site-kit-config',
    resolveId(id: string) {
      return id === VIRTUAL_ID ? resolved : undefined;
    },
    load(id: string) {
      return id === resolved ? `export default ${JSON.stringify(runtime)};` : undefined;
    },
  };
}
