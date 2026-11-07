/**
 * Ikonat e faqes → public/: favicon.ico (16 + 32 px), apple-touch-icon.png (180), icon-192.png
 * dhe icon-512.png (për manifest.webmanifest).
 * Ekzekutimi: `npm run build:icons` (kërkon `npx playwright install chromium`).
 *
 * Motivi: simboli i logos (branding/simboli.png, nga `npm run build:logo`) mbi sfond të bardhë.
 */
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { businessName } from '../src/app/data/business.ts';

const root = join(import.meta.dirname, '..');
const out = (file: string) => join(root, 'public', file);
const symbol = `data:image/png;base64,${readFileSync(join(root, 'branding/simboli.png')).toString('base64')}`;

const browser = await chromium.launch();
const page = await browser.newPage();
/**
 * Katror i bardhë (pa kënde, që sistemi ta presë si të dojë) me simbolin në mes.
 * @param fill pjesa e anës që zë simboli
 */
async function png(size: number, fill: number): Promise<Buffer> {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<style>*{margin:0}body{display:grid;place-items:center;width:${size}px;height:${size}px;background:#fff}img{width:${size * fill}px;height:${size * fill}px}</style><img src="${symbol}">`,
  );
  await page.evaluate(() => document.images[0].decode());
  return page.screenshot({ type: 'png' });
}

writeFileSync(out('apple-touch-icon.png'), await png(180, 0.8));
writeFileSync(out('icon-192.png'), await png(192, 0.8));
// Edhe ikona "maskable": simboli brenda rrethit të sigurt (80% e diametrit) që mos pritet.
writeFileSync(out('icon-512.png'), await png(512, 0.7));

// favicon.ico: format ICO me dy imazhe PNG brenda (16 dhe 32 px); simboli zë gjithë katrorin.
const images = [await png(16, 1), await png(32, 1)];
const header = Buffer.alloc(6 + 16 * images.length);
header.writeUInt16LE(0, 0); // rezervuar
header.writeUInt16LE(1, 2); // tipi: ikonë
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((img, i) => {
  const size = i === 0 ? 16 : 32;
  const e = 6 + 16 * i;
  header.writeUInt8(size, e);
  header.writeUInt8(size, e + 1);
  header.writeUInt8(0, e + 2); // pa paletë
  header.writeUInt8(0, e + 3);
  header.writeUInt16LE(1, e + 4); // planet
  header.writeUInt16LE(32, e + 6); // bit për piksel
  header.writeUInt32LE(img.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += img.length;
});
writeFileSync(out('favicon.ico'), Buffer.concat([header, ...images]));

await browser.close();

/**
 * Emri nën ikonën në ekranin e telefonit (≤ 12 shkronja): fjalët e para që nxënë, pa prerë fjalë
 * dhe pa "&" në fund ("Ardit Klima & Elektrik" → "Ardit Klima").
 */
function shortName(name: string): string {
  const words = name.split(' ');
  for (let n = words.length; n > 1; n--) {
    const head = words.slice(0, n).join(' ').replace(/\s*&$/, '');
    if (head.length <= 12) return head;
  }
  return words[0];
}

writeFileSync(
  out('manifest.webmanifest'),
  JSON.stringify(
    {
      name: businessName(),
      short_name: shortName(businessName()),
      lang: 'sq',
      start_url: '/',
      display: 'browser',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2,
  ) + '\n',
);
console.log(
  'build-icons: favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, manifest.webmanifest',
);
