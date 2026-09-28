import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import agentoCode from '../themes/agento-code';

const PACKAGE = '@shaharia-lab/site-kit/';
const onDisk = (specifier: string) =>
  fileURLToPath(new URL(`../${specifier.slice(PACKAGE.length)}`, import.meta.url));

describe('agento-code theme', () => {
  it('uses the tokens default accent without an extra stylesheet', () => {
    expect(agentoCode().css.some((file) => file.includes('/accents/'))).toBe(false);
  });

  it.each(['ink', 'saffron'] as const)('adds the %s accent stylesheet after the tokens', (accent) => {
    const { css } = agentoCode({ accent });
    const tokens = css.findIndex((file) => file.endsWith('/tokens.css'));
    const accentFile = css.findIndex((file) => file.endsWith(`/accents/${accent}.css`));
    expect(accentFile).toBeGreaterThan(tokens);
  });

  it.each(['forest', 'saffron', 'ink'] as const)('ships every stylesheet it lists (%s)', (accent) => {
    for (const file of agentoCode({ accent }).css) {
      expect(existsSync(onDisk(file)), file).toBe(true);
    }
  });

  it('gives Expressive Code literal colours only', () => {
    const settings = JSON.stringify(agentoCode().expressiveCode);
    expect(settings).not.toMatch(/var\(/);
  });
});
