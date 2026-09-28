/**
 * Builds the demo site once and checks the real output, so what is tested is
 * what a visitor gets: the pages, their Markdown twins, llms.txt, the page
 * actions markup and the theme's CSS.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'demo/dist');
const read = (path: string) => readFileSync(join(dist, path), 'utf8');
const page = (route: string) => read(`${route}/index.html`);

const SITE = 'https://shaharia-lab.github.io/site-kit';
const EDIT = 'https://github.com/shaharia-lab/site-kit/edit/main/demo/src/content/docs';

beforeAll(() => {
  execFileSync('npm', ['run', 'build', '-w', 'demo'], { cwd: root, stdio: 'pipe' });
});

describe('Markdown twins', () => {
  it('writes one next to every docs page', () => {
    expect(read('docs/guides/theming.md')).toMatch(/^# Theming/);
    expect(read('docs.md')).toMatch(/^# Introduction/);
  });

  it('are what View as Markdown and Copy page point at', () => {
    const html = page('docs/guides/theming');
    expect(html).toContain('href="/site-kit/docs/guides/theming.md"');
    expect(html).toContain('data-page-action="copy-markdown"');
  });
});

describe('Open in ChatGPT and Claude', () => {
  const prompt = encodeURIComponent(`Read ${SITE}/docs/guides/theming/ and answer questions about the content.`);

  it.each([
    ['ChatGPT', `https://chatgpt.com/?q=${prompt}`],
    ['Claude', `https://claude.ai/new?q=${prompt}`],
  ])('links %s with the page in the prompt', (_, href) => {
    expect(page('docs/guides/theming')).toContain(`href="${href}"`);
  });
});

describe('Edit on GitHub', () => {
  it('points at the source file from the map', () => {
    expect(page('docs/guides/theming')).toContain(`class="sk-action" href="${EDIT}/docs/guides/theming.md"`);
    expect(page('docs')).toContain(`href="${EDIT}/docs/index.md"`);
  });

  it("replaces Starlight's footer edit link rather than adding a second one", () => {
    expect(page('docs/guides/theming')).not.toContain('Edit page');
  });
});

describe('llms.txt', () => {
  it('links the full and small sets on the site URL', () => {
    const llms = read('llms.txt');
    expect(llms).toMatch(/^# site-kit/);
    expect(llms).toContain(`${SITE}/llms-full.txt`);
    expect(llms).toContain(`${SITE}/llms-small.txt`);
  });

  it('carries every docs page in the full set', () => {
    const full = read('llms-full.txt');
    for (const title of ['Introduction', 'Getting started', 'Theming', 'Page actions', 'Edit on GitHub']) {
      expect(full).toContain(title);
    }
  });
});

describe('theme', () => {
  const css = () =>
    readdirSync(join(dist, '_astro'))
      .filter((file) => file.endsWith('.css'))
      .map((file) => read(`_astro/${file}`))
      .join('\n');

  it('ships light and dark values, keyed off Starlight’s toggle and the system setting', () => {
    const styles = css();
    expect(styles).toMatch(/\[data-theme=["']?light["']?\]/);
    expect(styles).toMatch(/\[data-theme=["']?dark["']?\]/);
    expect(styles).toMatch(/prefers-color-scheme:\s*dark/);
  });

  it("styles the page title, which is Starlight's classless <h1 id=\"_top\">", () => {
    expect(css()).toMatch(/h1#_top/);
  });

  it('restyles the page actions row', () => {
    expect(css()).toContain('.sk-title');
  });

  it('shows the Star button for the configured repo', () => {
    expect(page('docs')).toContain('class="sk-star" href="https://github.com/shaharia-lab/site-kit"');
  });
});
