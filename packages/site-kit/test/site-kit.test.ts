import { describe, expect, it } from 'vitest';
import { defineTheme } from '../theme';
import { pluginNames, setup, testTheme } from './helpers';

const KIT = '@shaharia-lab/site-kit/overrides';

describe('siteKit() plugin list', () => {
  it('registers page actions, llms.txt, then the kit itself last', () => {
    expect(pluginNames()).toEqual(['starlight-page-actions', 'starlight-llms-txt', '@shaharia-lab/site-kit']);
  });

  it('drops the community plugins that are turned off', () => {
    expect(pluginNames({ pageActions: false, llmsTxt: false })).toEqual(['@shaharia-lab/site-kit']);
  });

  it("puts a theme's own plugins first, so the kit layers on top of them", () => {
    const base = { name: 'community-theme', hooks: { 'config:setup'() {} } };
    const theme = defineTheme({ ...testTheme, plugins: [base] });
    expect(pluginNames({ theme })[0]).toBe('community-theme');
  });
});

describe('styles', () => {
  it('orders kit base, then theme, then the site', () => {
    const { config } = setup({}, { customCss: ['./src/site.css'] });
    expect(config.customCss).toEqual([
      '@shaharia-lab/site-kit/styles/page-actions.css',
      '@test/theme/tokens.css',
      './src/site.css',
    ]);
  });

  it("uses the theme's code block settings when the site has none", () => {
    expect(setup().config.expressiveCode).toEqual({ themes: ['github-dark'] });
  });

  it('leaves code block settings alone when the site sets its own', () => {
    const { config } = setup({}, { expressiveCode: { themes: ['nord'] } });
    expect(config.expressiveCode).toBeUndefined();
  });
});

describe('component overrides', () => {
  it('installs the page actions title and removes the footer edit link', () => {
    const { components } = setup().config;
    expect(components?.PageTitle).toBe(`${KIT}/PageTitle.astro`);
    expect(components?.EditLink).toBe(`${KIT}/EditLink.astro`);
  });

  it('replaces the title a community plugin installed', () => {
    const { components } = setup({}, { components: { PageTitle: 'starlight-page-actions/overrides/PageTitle.astro' } }).config;
    expect(components?.PageTitle).toBe(`${KIT}/PageTitle.astro`);
  });

  it('uses the plain title when page actions are off', () => {
    expect(setup({ pageActions: false }).config.components?.PageTitle).toBe(`${KIT}/PageTitleNoActions.astro`);
  });

  it('adds the Star button only when a repo is given', () => {
    expect(setup().config.components?.SocialIcons).toBeUndefined();
    expect(setup({ repo: { url: 'https://github.com/o/r' } }).config.components?.SocialIcons).toBe(
      `${KIT}/SocialIcons.astro`,
    );
  });

  it('lets a theme replace kit components, and a site replace the theme', () => {
    const theme = defineTheme({ ...testTheme, components: { PageTitle: 'theme/Title.astro', Footer: 'theme/Footer.astro' } });
    const { components } = setup({ theme, components: { Footer: 'site/Footer.astro' } }).config;
    expect(components?.PageTitle).toBe('theme/Title.astro');
    expect(components?.Footer).toBe('site/Footer.astro');
  });

  it('keeps overrides set by Starlight config that nothing else touches', () => {
    const { components } = setup({}, { components: { Sidebar: 'site/Sidebar.astro' } }).config;
    expect(components?.Sidebar).toBe('site/Sidebar.astro');
  });
});

describe('edit links', () => {
  it('registers the route middleware and Starlight base URL when configured', () => {
    const { config, middleware } = setup({ editLink: { baseUrl: 'https://github.com/o/r/edit/main/' } });
    expect(config.editLink).toEqual({ baseUrl: 'https://github.com/o/r/edit/main/' });
    expect(middleware).toEqual(['@shaharia-lab/site-kit/middleware']);
  });

  it('registers nothing when edit links are off', () => {
    const { config, middleware } = setup({ editLink: false });
    expect(config.editLink).toBeUndefined();
    expect(middleware).toEqual([]);
  });
});

it('always provides the runtime config module to the overrides', () => {
  expect(setup().integrations).toEqual(['@shaharia-lab/site-kit/config']);
});
