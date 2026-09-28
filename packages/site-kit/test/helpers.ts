import type { StarlightPlugin, StarlightUserConfig } from '@astrojs/starlight/types';
import siteKit, { type SiteKitOptions } from '../index';
import { defineTheme } from '../theme';

/** A minimal theme, so tests exercise the kit rather than a real design. */
export const testTheme = defineTheme({
  name: 'test',
  css: ['@test/theme/tokens.css'],
  expressiveCode: { themes: ['github-dark'] },
});

export interface SetupResult {
  config: Partial<StarlightUserConfig>;
  middleware: string[];
  integrations: string[];
}

/**
 * Runs the kit's own plugin (always the last one) through Starlight's
 * `config:setup` hook with a recording context, and returns what it changed.
 */
export function setup(
  options: Partial<SiteKitOptions> = {},
  starlightConfig: Partial<StarlightUserConfig> = {},
): SetupResult {
  const plugins = siteKit({ theme: testTheme, ...options });
  const core = plugins.at(-1) as StarlightPlugin;
  const result: SetupResult = { config: {}, middleware: [], integrations: [] };

  const hook = core.hooks['config:setup'] as (context: unknown) => void;
  hook({
    config: { title: 'Test', ...starlightConfig },
    updateConfig: (update: Partial<StarlightUserConfig>) => Object.assign(result.config, update),
    addRouteMiddleware: ({ entrypoint }: { entrypoint: string }) => result.middleware.push(entrypoint),
    addIntegration: ({ name }: { name: string }) => result.integrations.push(name),
    logger: console,
  });
  return result;
}

export const pluginNames = (options: Partial<SiteKitOptions> = {}) =>
  siteKit({ theme: testTheme, ...options }).map((plugin) => plugin.name);
