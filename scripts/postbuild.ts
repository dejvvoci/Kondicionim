/**
 * Hapat pas `ng build` (`node scripts/postbuild.ts [dist/kondicionim/browser]`):
 * - 404/index.html → 404.html, që Cloudflare Pages ta shërbejë me status 404
 *   (pa 404.html, Pages e trajton faqen si SPA dhe kthen index.html për çdo URL).
 * - fshin index.csr.html dhe imazhet demo të /stili.
 * - gjeneron sitemap.xml dhe robots.txt nga faqet e prerenderuara: çdo faqe që nuk ka
 *   noindex hyn në sitemap me URL-në e saj kanonike (pra listën e rrugëve dhe të dhënave).
 */
import { createHash } from 'node:crypto';
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const dist = join(
  import.meta.dirname,
  '..',
  process.argv[2] ?? join('dist', 'kondicionim', 'browser'),
);
const notFoundDir = join(dist, '404');

if (!existsSync(join(notFoundDir, 'index.html'))) {
  console.error('postbuild: mungon 404/index.html, a u prerenderua rruga /404?');
  process.exit(1);
}

cpSync(join(notFoundDir, 'index.html'), join(dist, '404.html'));
rmSync(notFoundDir, { recursive: true });
// Shell-i SPA nuk nevojitet: çdo rrugë ka HTML-në e vet.
rmSync(join(dist, 'index.csr.html'), { force: true });
// Imazhet demo të /stili (vetëm development).
rmSync(join(dist, 'images', 'demo'), { recursive: true, force: true });

/** Të gjitha index.html të faqeve, rekursivisht. */
function pages(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name);
    if (e.isDirectory()) return pages(path);
    return e.name === 'index.html' ? [path] : [];
  });
}

/*
 * Performanca (seksioni 6.2). Çdo faqe është HTML e plotë (prerender), ndaj:
 * 1. CSS-ja globale (~6 KB) futet brenda faqes: pa kërkesë shtesë, pa rillogaritje stilesh
 *    kur ngarkohet, dhe pa `onload` inline (që do të kërkonte 'unsafe-inline' në CSP).
 * 2. JavaScript-i nis pas eventit `load`, nga boot-*.js: teksti, fontet dhe imazhet marrin
 *    gjithë lidhjen, dhe JS-ja nevojitet vetëm për ndërveprimin. Klikimet e hershme ruhen nga
 *    withEventReplay() dhe përsëriten pas hidratimit.
 */
const BOOT = `(function () {
  var s = document.currentScript;
  function start() {
    (s.getAttribute('data-preload') || '').split(',').forEach(function (href) {
      if (!href) return;
      var l = document.createElement('link');
      l.rel = 'modulepreload';
      l.href = href;
      document.head.appendChild(l);
    });
    var m = document.createElement('script');
    m.type = 'module';
    m.src = s.getAttribute('data-main');
    document.body.appendChild(m);
  }
  if (document.readyState === 'complete') setTimeout(start);
  else addEventListener('load', function () { setTimeout(start); }, { once: true });
})();
`;
const bootFile = `boot-${createHash('sha256').update(BOOT).digest('hex').slice(0, 8)}.js`;
writeFileSync(join(dist, bootFile), BOOT);

const stylesheets = new Map<string, string>();
for (const file of pages(dist).concat(join(dist, '404.html'))) {
  let html = readFileSync(file, 'utf8');

  html = html.replace(
    /<link rel="stylesheet" href="(styles-[\w-]+\.css)"[^>]*>/g,
    (_, href: string) => {
      if (!stylesheets.has(href)) stylesheets.set(href, readFileSync(join(dist, href), 'utf8'));
      return `<style>${stylesheets.get(href)}</style>`;
    },
  );

  const main = /<script src="([^"]+)" type="module"[^>]*><\/script>/.exec(html)?.[1];
  if (main) {
    const preload = [...html.matchAll(/<link rel="modulepreload" href="([^"]+)">/g)].map(
      (m) => m[1],
    );
    html = html
      .replace(/<link rel="modulepreload" href="[^"]+">/g, '')
      .replace(
        /<script src="[^"]+" type="module"[^>]*><\/script>/,
        `<script src="${bootFile}" defer data-main="${main}" data-preload="${preload.join(',')}"></script>`,
      );
  }
  writeFileSync(file, html);
}

const attr = (html: string, pattern: RegExp): string | null => pattern.exec(html)?.[1] ?? null;
const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const entries = pages(dist)
  .map((file) => {
    const html = readFileSync(file, 'utf8');
    const route = '/' + relative(dist, file).split(sep).slice(0, -1).join('/');
    if (/<meta name="robots" content="[^"]*noindex/.test(html)) return null;
    const loc = attr(html, /<link rel="canonical" href="([^"]+)"/);
    if (!loc) {
      console.error(`postbuild: ${route} nuk ka canonical`);
      process.exit(1);
    }
    const lastmod = attr(html, /<meta property="article:published_time" content="([^"]+)"/);
    return { loc, lastmod };
  })
  .filter((e) => e !== null)
  .sort((a, b) => a.loc.localeCompare(b.loc));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url><loc>${escapeXml(e.loc)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}</url>`,
  )
  .join('\n')}
</urlset>
`;
writeFileSync(join(dist, 'sitemap.xml'), sitemap);

// Origjina nga canonical i kryefaqes (BUSINESS.siteUrl).
const origin = new URL(entries[0].loc).origin;
writeFileSync(
  join(dist, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`,
);

console.log(`postbuild: 404.html, sitemap.xml (${entries.length} faqe) dhe robots.txt`);
