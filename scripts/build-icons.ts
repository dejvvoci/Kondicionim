/**
 * Ikonat e faqes → public/: favicon.svg, favicon.ico (16 + 32 px), apple-touch-icon.png (180),
 * icon-192.png dhe icon-512.png (për manifest.webmanifest).
 * Ekzekutimi: `npm run build:icons` (kërkon `npx playwright install chromium`).
 *
 * Motivi: ikona "air-conditioning" e Tabler (MIT) mbi ngjyrën bazë të faqes. Kur të ketë logo
 * reale, zëvendëso SVG-në më poshtë dhe riekzekuto skriptin.
 */
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { businessName } from '../src/app/data/business.ts';
import { ICONS } from '../src/app/shared/ui/icon/icons.ts';

const out = (file: string) => join(import.meta.dirname, '..', 'public', file);

/** Sfond katror (pa kënde, që sistemi ta presë si të dojë) dhe ikona brenda zonës së sigurt 60%. */
function svg(rounded: boolean): string {
  const paths = ICONS['air-conditioning'].map((d) => `<path d="${d}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64"${rounded ? ' rx="14"' : ''} fill="#0e3b43"/>
<g transform="translate(13 13) scale(1.583)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</g>
</svg>
`;
}

writeFileSync(out('favicon.svg'), svg(true));

const browser = await chromium.launch();
const page = await browser.newPage();
async function png(size: number, rounded: boolean): Promise<Buffer> {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<style>*{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg(rounded)}`,
  );
  return page.screenshot({ omitBackground: true, type: 'png' });
}

writeFileSync(out('apple-touch-icon.png'), await png(180, false));
writeFileSync(out('icon-192.png'), await png(192, false));
writeFileSync(out('icon-512.png'), await png(512, false));

// favicon.ico: format ICO me dy imazhe PNG brenda (16 dhe 32 px).
const images = [await png(16, true), await png(32, true)];
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

/** Emri nën ikonën në ekranin e telefonit (≤ 12 shkronja): fjalët e fundit që nxënë, pa prerë fjalë. */
function shortName(name: string): string {
  const words = name.split(' ');
  for (let i = 0; i < words.length; i++) {
    const tail = words.slice(i).join(' ');
    if (tail.length <= 12) return tail;
  }
  return words[words.length - 1];
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
      theme_color: '#0e3b43',
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
  'build-icons: favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, manifest.webmanifest',
);
