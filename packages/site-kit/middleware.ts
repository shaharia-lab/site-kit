/// <reference path="./virtual.d.ts" />
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import config from 'virtual:site-kit/config';
import { resolveEditUrl } from './edit-link';

/**
 * Points each page's edit URL at the file a contributor should really edit.
 *
 * Starlight derives the edit URL from the entry's path under src/content/docs.
 * On a site whose docs are copied there from a `docs/` folder at build time,
 * that path is the generated copy, so the link would 404. When the site passes
 * `editLink.sources`, that map is the only source of truth: a page in it gets
 * its real file, a page missing from it gets no link at all.
 */
export const onRequest = defineRouteMiddleware((context) => {
  if (!config.editLink) return;
  const route = context.locals.starlightRoute;
  route.editUrl = resolveEditUrl(route.entry.id, config.editLink, route.editUrl);
});
