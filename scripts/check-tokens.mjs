/**
 * Fails when a kit component names a colour.
 *
 * The theming contract is that only a theme decides how a site looks: kit
 * components use token names (`var(--ink)`, `var(--sl-color-gray-5)`) and
 * never a literal. One `#fff` in a component is enough to break every other
 * theme, and it would only show up in the one theme nobody checked. So the
 * rule is checked here instead of in review.
 *
 * Theme folders are exempt, since giving values is their job.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../packages/site-kit/', import.meta.url));
const EXEMPT = ['themes/'];
const EXTENSIONS = /\.(astro|css|ts|mjs|js)$/;

const RULES = [
  // A hex colour, but not an HTML entity such as &#9733;
  { name: 'hex colour', pattern: /(?<![&\w])#[0-9a-fA-F]{3,8}\b/g },
  { name: 'colour function', pattern: /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/g },
];

/** @param {string} dir */
function files(dir) {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((file) => EXTENSIONS.test(file) && !file.includes('node_modules'))
    .filter((file) => !EXEMPT.some((prefix) => file.startsWith(prefix)))
    .map((file) => join(dir, file));
}

/** Strips comments so a colour named in an explanation does not count. */
function code(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

const problems = [];
for (const file of files(root)) {
  const lines = code(readFileSync(file, 'utf8')).split('\n');
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      for (const match of line.matchAll(rule.pattern)) {
        problems.push(`${relative(process.cwd(), file)}:${i + 1}  ${rule.name} "${match[0]}"`);
      }
    }
  });
}

if (problems.length) {
  console.error('Colour literals outside a theme. Use a token instead:\n');
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}
console.log('check:tokens  no colour literals outside themes/');
