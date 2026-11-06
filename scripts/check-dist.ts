/**
 * Kontrollet mbi build-in (`node scripts/check-dist.ts [dist/kondicionim/browser]`):
 * 1. Lidhjet e brendshme: çdo href/src/srcset "/..." në çdo faqe çon te një faqe ose skedar
 *    që ekziston, dhe çdo #fragment te një element me atë id.
 * 2. Buxhetet (seksioni 6.2): JavaScript-i fillestar < 150 KB gzip; imazhi hero
 *    (fetchpriority="high") < 150 KB.
 * Del me kod 1 nëse diçka nuk shkon.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { gzipSync } from 'node:zlib';

const dist = join(
  import.meta.dirname,
  '..',
  process.argv[2] ?? join('dist', 'kondicionim', 'browser'),
);
const JS_BUDGET = 150 * 1024;
const HERO_BUDGET = 150 * 1024;

const errors: string[] = [];

function htmlFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name);
    if (e.isDirectory()) return htmlFiles(path);
    return e.name.endsWith('.html') ? [path] : [];
  });
}

const routeOf = (file: string) => {
  const rel = relative(dist, file).split(sep).join('/');
  return rel === 'index.html' ? '/' : '/' + rel.replace(/(^|\/)index\.html$/, '/');
};

/** /faqja, /faqja/ ose /skedar.ext → skedari në dist; null nëse nuk ekziston. */
function resolveFile(path: string): string | null {
  const target = join(dist, decodeURIComponent(path));
  if (existsSync(target) && statSync(target).isFile()) return target;
  const index = join(target, 'index.html');
  return existsSync(index) ? index : null;
}

const ids = new Map<string, Set<string>>();
function idsOf(file: string): Set<string> {
  let set = ids.get(file);
  if (!set) {
    set = new Set([...readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    ids.set(file, set);
  }
  return set;
}

// 1. Lidhjet
const files = htmlFiles(dist);
let checked = 0;
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const urls = [
    ...[...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((m) =>
      m[1].split(',').map((s) => s.trim().split(/\s+/)[0]),
    ),
  ];
  for (const raw of urls) {
    const url = raw.replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|tel:|data:|javascript:|\/\/)/.test(url)) continue;
    const [beforeHash, hash] = url.split('#');
    const path = beforeHash.split('?')[0];
    checked++;
    // <base href="/">: lidhjet relative (main-*.js, styles-*.css) zgjidhen nga rrënja.
    const target = path === '' ? file : resolveFile(path.startsWith('/') ? path : '/' + path);
    if (!target) {
      errors.push(`${routeOf(file)}: lidhje e prishur "${url}"`);
      continue;
    }
    if (hash && target.endsWith('.html') && !idsOf(target).has(decodeURIComponent(hash))) {
      errors.push(`${routeOf(file)}: "${url}" çon te #${hash}, që nuk ekziston`);
    }
  }
}

// 2. Buxhetet: skriptet që ngarkohen në hapjen e kryefaqes (boot + main + modulepreload).
const home = readFileSync(join(dist, 'index.html'), 'utf8');
const boot = /<script src="([^"]+\.js)" defer data-main="([^"]+)" data-preload="([^"]*)"/.exec(
  home,
);
if (!boot) {
  console.error('check-dist: kryefaqja nuk ka skriptin boot (scripts/postbuild.ts)');
  process.exit(1);
}
const initialJs = [boot[1], boot[2], ...boot[3].split(',').filter(Boolean)];
const jsGzip = [...new Set(initialJs)].reduce(
  (sum, src) => sum + gzipSync(readFileSync(join(dist, src.replace(/^\//, '')))).length,
  0,
);
if (jsGzip > JS_BUDGET) {
  errors.push(`JavaScript fillestar ${(jsGzip / 1024).toFixed(1)} KB gzip > 150 KB`);
}

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/<img\b[^>]*fetchpriority="high"[^>]*>/g)) {
    const src = /\ssrc="([^"]+)"/.exec(m[0])?.[1];
    const target = src ? resolveFile('/' + src.split('?')[0].replace(/^\//, '')) : null;
    if (target && statSync(target).size > HERO_BUDGET) {
      errors.push(`${routeOf(file)}: imazhi hero ${src} > 150 KB`);
    }
  }
}

if (errors.length) {
  console.error(`check-dist: ${errors.length} probleme\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(
  `check-dist: ${files.length} faqe, ${checked} lidhje në rregull; JS fillestar ${(jsGzip / 1024).toFixed(1)} KB gzip`,
);
