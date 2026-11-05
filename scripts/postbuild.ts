/**
 * Hapat pas `ng build` (ekzekutohet me `node scripts/postbuild.ts`):
 * - 404/index.html → 404.html, që Cloudflare Pages ta shërbejë me status 404
 *   (pa 404.html, Pages e trajton faqen si SPA dhe kthen index.html për çdo URL).
 * - fshin index.csr.html dhe imazhet demo të /stili.
 */
import { cpSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(import.meta.dirname, '..', 'dist', 'kondicionim', 'browser');
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
console.log('postbuild: 404.html u krijua');
