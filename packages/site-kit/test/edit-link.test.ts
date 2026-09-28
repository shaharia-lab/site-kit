import { describe, expect, it } from 'vitest';
import { resolveEditUrl } from '../edit-link';

const baseUrl = 'https://github.com/org/repo/edit/main/';
const starlightDefault = new URL('src/content/docs/docs/intro.md', baseUrl);

describe('resolveEditUrl', () => {
  it("keeps Starlight's URL when no source map is given", () => {
    expect(resolveEditUrl('docs/intro', { baseUrl, sources: null }, starlightDefault)).toBe(starlightDefault);
  });

  it('points a mapped page at its real source file', () => {
    const url = resolveEditUrl('docs/intro', { baseUrl, sources: { 'docs/intro': 'docs/intro.md' } }, starlightDefault);
    expect(url?.href).toBe('https://github.com/org/repo/edit/main/docs/intro.md');
  });

  it('gives an unmapped page no link rather than a broken one', () => {
    expect(resolveEditUrl('docs/other', { baseUrl, sources: { 'docs/intro': 'docs/intro.md' } }, starlightDefault)).toBeUndefined();
  });

  it('treats a leading slash in a source path as repository-relative', () => {
    const url = resolveEditUrl('docs/intro', { baseUrl, sources: { 'docs/intro': '/docs/intro.md' } }, undefined);
    expect(url?.href).toBe('https://github.com/org/repo/edit/main/docs/intro.md');
  });
});
