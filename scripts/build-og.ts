/**
 * Imazhi për ndarjen e linkut në WhatsApp/Facebook (Open Graph, 1200×630) → public/og-image.png.
 * Ekzekutimi: `npm run build:og` (kërkon `npx playwright install chromium`).
 * Riekzekutoje kur ndryshon emri i biznesit (business.ts) ose qytetet (cities.ts).
 *
 * Përmbajtja: emri, shërbimet, qytetet dhe harta e Shqipërisë, me ngjyrat e faqes.
 * Pa foto stock; kur të ketë foto reale të ustait, mund të zëvendësohet me të.
 */
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { businessName } from '../src/app/data/business.ts';
import { activeCities } from '../src/app/data/cities.ts';
import { ALBANIA_MAP } from '../src/app/shared/ui/map-albania/albania-map.generated.ts';
import { project } from '../src/app/shared/ui/map-albania/projection.ts';

const root = join(import.meta.dirname, '..');
const out = join(root, 'public/og-image.png');

const font = (file: string) =>
  `url(data:font/woff2;base64,${readFileSync(join(root, 'public/fonts', file)).toString('base64')}) format('woff2')`;

const cities = activeCities();
const dots = cities
  .map((c) => {
    const [x, y] = project(c.lat, c.lng, ALBANIA_MAP.projection);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" fill="#f5b700" stroke="#0e3b43" stroke-width="4"/>`;
  })
  .join('');

const html = `<!doctype html>
<html lang="sq">
<head>
<meta charset="utf-8">
<style>
  @font-face { font-family: Poppins; font-weight: 600; src: ${font('poppins-600-latin.woff2')}; }
  @font-face { font-family: Poppins; font-weight: 600; src: ${font('poppins-600-latin-ext.woff2')}; unicode-range: U+0100-024F; }
  @font-face { font-family: 'Open Sans'; font-weight: 400 600; src: ${font('open-sans-latin.woff2')}; }
  @font-face { font-family: 'Open Sans'; font-weight: 400 600; src: ${font('open-sans-latin-ext.woff2')}; unicode-range: U+0100-024F; }
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; background: #0e3b43; color: #fff; font-family: 'Open Sans', sans-serif; }
  .card { display: grid; grid-template-columns: 1fr 300px; gap: 48px; height: 100%; padding: 72px 80px; }
  .text { display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { color: #1ba39c; font-weight: 600; font-size: 24px; letter-spacing: .08em; text-transform: uppercase; }
  h1 { margin-top: 20px; font-family: Poppins, sans-serif; font-weight: 600; font-size: 76px; line-height: 1.1; }
  p { margin-top: 24px; color: #c3dcdc; font-size: 34px; line-height: 1.35; }
  .cities { margin-top: auto; padding-top: 32px; border-top: 2px solid rgba(255,255,255,.15); color: #fff; font-size: 28px; font-weight: 600; }
  svg { width: 100%; height: 100%; }
</style>
</head>
<body>
  <div class="card">
    <div class="text">
      <div class="eyebrow">Montim · Riparim · Mirëmbajtje</div>
      <h1>${businessName()}</h1>
      <p>Kondicionerë split, multi-split, kanal, VRF/VRV dhe pompa nxehtësie</p>
      <div class="cities">${cities.map((c) => c.name).join(' · ')}</div>
    </div>
    <svg viewBox="0 0 ${ALBANIA_MAP.width} ${ALBANIA_MAP.height}" aria-hidden="true">
      <path d="${ALBANIA_MAP.path}" fill="#1ba39c" fill-opacity=".35" stroke="#1ba39c" stroke-width="3"/>
      ${dots}
    </svg>
  </div>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out, type: 'png' });
await browser.close();
console.log(`build-og: ${out}`);
