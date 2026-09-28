import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['packages/*/test/**/*.test.ts'],
          // The community plugins ship TypeScript source, which Node will not
          // strip types from inside node_modules, so Vitest has to transform them.
          server: { deps: { inline: ['starlight-page-actions', 'starlight-llms-txt'] } },
        },
      },
      {
        test: {
          name: 'build',
          include: ['tests/**/*.test.ts'],
          // One real `astro build` per run, shared by every assertion.
          hookTimeout: 180_000,
          testTimeout: 30_000,
        },
      },
    ],
  },
});
