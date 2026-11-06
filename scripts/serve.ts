/**
 * Server statik për build-in, që sillet si Cloudflare Pages:
 * /faqja/ → faqja/index.html, /faqja → ridrejtim 308 te /faqja/, URL e panjohur → 404.html
 * me status 404, header-at nga _headers dhe kompresim gzip.
 * Përdoret nga `npm run preview`, testet e2e (Playwright) dhe Lighthouse CI.
 *
 *   node scripts/serve.ts [dist/kondicionim/browser] [4300]
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = resolve(import.meta.dirname, '..', process.argv[2] ?? 'dist/kondicionim/browser');
const port = Number(process.argv[3] ?? 4300);

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
};
const COMPRESSIBLE = new Set([
  '.html',
  '.js',
  '.css',
  '.json',
  '.xml',
  '.txt',
  '.svg',
  '.webmanifest',
]);

/** Rregullat e _headers: [shembulli i URL-së si RegExp, header-at]. */
function loadHeaders(): [RegExp, [string, string][]][] {
  const file = join(root, '_headers');
  if (!existsSync(file)) return [];
  const rules: [RegExp, [string, string][]][] = [];
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      const pattern = line
        .trim()
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*');
      rules.push([new RegExp(`^${pattern}$`), []]);
    } else if (rules.length) {
      const i = line.indexOf(':');
      rules[rules.length - 1][1].push([line.slice(0, i).trim(), line.slice(i + 1).trim()]);
    }
  }
  return rules;
}
const headerRules = loadHeaders();

const isFile = (p: string) => existsSync(p) && statSync(p).isFile();

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const path = decodeURIComponent(url.pathname);
  const target = normalize(join(root, path));
  if (!target.startsWith(root)) {
    res.writeHead(400).end();
    return;
  }

  let file: string | null = null;
  let status = 200;
  if (path.endsWith('/') && isFile(join(target, 'index.html'))) {
    file = join(target, 'index.html');
  } else if (isFile(target)) {
    file = target;
  } else if (isFile(join(target, 'index.html'))) {
    res.writeHead(308, { Location: `${path}/${url.search}` }).end();
    return;
  } else {
    file = join(root, '404.html');
    status = 404;
  }

  const ext = extname(file);
  const headers: Record<string, string> = {
    'Content-Type': TYPES[ext] ?? 'application/octet-stream',
  };
  for (const [pattern, values] of headerRules) {
    if (pattern.test(path)) for (const [k, v] of values) headers[k] = v;
  }
  let body = readFileSync(file);
  if (COMPRESSIBLE.has(ext) && /\bgzip\b/.test(String(req.headers['accept-encoding']))) {
    body = gzipSync(body);
    headers['Content-Encoding'] = 'gzip';
    headers['Vary'] = 'Accept-Encoding';
  }
  res.writeHead(status, headers).end(req.method === 'HEAD' ? undefined : body);
});

server.listen(port, () => console.log(`serve: ${root} në http://localhost:${port}`));
