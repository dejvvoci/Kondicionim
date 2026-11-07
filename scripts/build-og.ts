/**
 * Imazhi për ndarjen e linkut në WhatsApp/Facebook (Open Graph, 1200×630) → public/og-image.png.
 * Ekzekutimi: `npm run build:og` (kërkon `npx playwright install chromium`).
 * Riekzekutoje kur ndryshon emri i biznesit (business.ts), qytetet (cities.ts) ose logoja
 * (public/images/logo/logo.png, nga `npm run build:logo`).
 *
 * Përmbajtja: emri, shërbimet dhe qytetet me ngjyrat e faqes, dhe logoja mbi një kartë të bardhë.
 * Pa foto stock; kur të ketë foto reale të ustait, mund të zëvendësohet me të.
 */
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BUSINESS, businessName } from '../src/app/data/business.ts';
import { activeCities } from '../src/app/data/cities.ts';

const root = join(import.meta.dirname, '..');
const out = join(root, 'public/og-image.png');

const font = (file: string) =>
  `url(data:font/woff2;base64,${readFileSync(join(root, 'public/fonts', file)).toString('base64')}) format('woff2')`;

const cities = activeCities();
// Kur punon në të gjithë vendin, një rresht i shkurtër në vend të listës së qyteteve.
const area = BUSINESS.servesWholeCountry
  ? `${BUSINESS.locality ?? cities[0].name} · Në të gjithë Shqipërinë`
  : cities.map((c) => c.name).join(' · ');
// "&" mbetet bashkë me fjalët rreth tij ("Klima & Elektrik" në një rresht).
const heading = businessName().replace(/ & /g, '\u00a0&amp;\u00a0');
const logo = `data:image/png;base64,${readFileSync(join(root, 'public/images/logo/logo.png')).toString('base64')}`;

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
  .card { display: grid; grid-template-columns: 1fr 380px; align-items: center; gap: 56px; height: 100%; padding: 72px 72px 72px 80px; }
  .text { display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { color: #1ba39c; font-weight: 600; font-size: 24px; letter-spacing: .08em; text-transform: uppercase; }
  h1 { margin-top: 20px; font-family: Poppins, sans-serif; font-weight: 600; font-size: 64px; line-height: 1.1; }
  p { margin-top: 24px; color: #c3dcdc; font-size: 34px; line-height: 1.35; }
  .cities { margin-top: auto; padding-top: 32px; border-top: 2px solid rgba(255,255,255,.15); color: #fff; font-size: 28px; font-weight: 600; }
  .logo { width: 380px; height: 380px; border-radius: 24px; background: #fff; }
</style>
</head>
<body>
  <div class="card">
    <div class="text">
      <div class="eyebrow">Montim · Riparim · Mirëmbajtje</div>
      <h1>${heading}</h1>
      <p>Kondicionerë split, multi-split, kanal, kasetë dhe VRF/VRV</p>
      <div class="cities">${area}</div>
    </div>
    <img class="logo" src="${logo}" alt="">
  </div>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => Promise.all([document.fonts.ready, document.images[0].decode()]));
await page.screenshot({ path: out, type: 'png' });
await browser.close();
console.log(`build-og: ${out}`);
