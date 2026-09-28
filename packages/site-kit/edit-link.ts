/**
 * The edit URL for one docs page, or undefined for "no link".
 *
 * Kept free of Astro and Starlight imports so it can be unit-tested directly;
 * middleware.ts is the thin adapter that applies it to each route.
 */
export function resolveEditUrl(
  entryId: string,
  editLink: { baseUrl: string; sources: Record<string, string> | null },
  starlightDefault: URL | undefined,
): URL | undefined {
  // No map: Starlight's own URL (entry path under the edit baseUrl) is right.
  if (!editLink.sources) return starlightDefault;
  const source = editLink.sources[entryId];
  return source ? new URL(source.replace(/^\/+/, ''), editLink.baseUrl) : undefined;
}
