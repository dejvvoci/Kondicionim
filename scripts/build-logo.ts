/**
 * Versionet e logos, nga skedari origjinal branding/logo.png (logoja e plotë: simboli sipër, emri
 * poshtë, mbi sfond të bardhë):
 * - public/images/logo/logo.png: logoja e plotë, e prerë, 600 px (të dhënat për Google, imazhi OG);
 * - public/images/logo/logo-header.webp: simboli majtas dhe emri djathtas, për header-in (i
 *   lexueshëm në 52 px lartësi);
 * - branding/simboli.png: vetëm simboli në katror, për ikonat (scripts/build-icons.ts).
 * Ekzekutimi: `npm run build:logo` (kërkon `npx playwright install chromium`). Kur ndryshon logoja,
 * zëvendëso branding/logo.png dhe riekzekuto build:logo, build:icons dhe build:og.
 *
 * Simboli dhe emri gjenden vetë: janë dy blloqet e para të rreshtave jo të bardhë (nga lart poshtë).
 */
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const dir = join(root, 'public/images/logo');
mkdirSync(dir, { recursive: true });
const source = `data:image/png;base64,${readFileSync(join(root, 'branding/logo.png')).toString('base64')}`;

/** Lartësia e logos në header (px CSS); imazhi bëhet 3× për ekranet me densitet të lartë. */
const HEADER_LOGO_HEIGHT = 52;

const browser = await chromium.launch();
const page = await browser.newPage();
const files = await page.evaluate(
  async ({ src, headerHeight }) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const canvas = (w: number, h: number) => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.imageSmoothingQuality = 'high';
      return { c, ctx };
    };

    // Sfondi pothuajse i bardhë (253–255) bëhet krejt i bardhë, që të mos duket mbi header-in.
    const full = canvas(img.width, img.height);
    full.ctx.drawImage(img, 0, 0);
    const pixels = full.ctx.getImageData(0, 0, img.width, img.height);
    const d = pixels.data;
    for (let k = 0; k < d.length; k += 4) {
      if (Math.min(d[k], d[k + 1], d[k + 2]) >= 245) d[k] = d[k + 1] = d[k + 2] = 255;
    }
    full.ctx.putImageData(pixels, 0, 0);

    // Kutia e çdo blloku: rreshtat dhe kolonat me pikë jo të bardha.
    const ink = (i: number, j: number) => {
      const k = (j * img.width + i) * 4;
      return Math.min(d[k], d[k + 1], d[k + 2]) < 200;
    };
    const blocks: { top: number; bottom: number }[] = [];
    let start = -1;
    for (let j = 0; j <= img.height; j++) {
      let any = false;
      for (let i = 0; j < img.height && i < img.width && !any; i++) any = ink(i, j);
      if (any && start < 0) start = j;
      if (!any && start >= 0) {
        blocks.push({ top: start, bottom: j - 1 });
        start = -1;
      }
    }
    const box = (top: number, bottom: number) => {
      let left = img.width;
      let right = 0;
      for (let j = top; j <= bottom; j++)
        for (let i = 0; i < img.width; i++)
          if (ink(i, j)) {
            left = Math.min(left, i);
            right = Math.max(right, i);
          }
      return { x: left, y: top, w: right - left + 1, h: bottom - top + 1 };
    };
    if (blocks.length < 2) throw new Error('build-logo: nuk u gjetën simboli dhe emri');
    const symbol = box(blocks[0].top, blocks[0].bottom);
    const name = box(blocks[1].top, blocks.at(-1)!.bottom);
    const all = box(blocks[0].top, blocks.at(-1)!.bottom);

    const draw = (
      ctx: CanvasRenderingContext2D,
      r: { x: number; y: number; w: number; h: number },
      x: number,
      y: number,
      w: number,
      h: number,
    ) => ctx.drawImage(full.c, r.x, r.y, r.w, r.h, x, y, w, h);

    // 1. Logoja e plotë, në katror 600 px me 6% hapësirë rreth e rrotull.
    const size = 600;
    const inner = size * 0.88;
    const scale = Math.min(inner / all.w, inner / all.h);
    const logo = canvas(size, size);
    draw(
      logo.ctx,
      all,
      (size - all.w * scale) / 2,
      (size - all.h * scale) / 2,
      all.w * scale,
      all.h * scale,
    );

    // 2. Header: simboli në lartësinë e plotë, emri djathtas, i qendërzuar vertikalisht.
    const H = headerHeight * 3;
    const symW = (symbol.w * H) / symbol.h;
    const nameH = H * 0.7;
    const nameW = (name.w * nameH) / name.h;
    const gap = H * 0.14;
    const header = canvas(Math.ceil(symW + gap + nameW), H);
    draw(header.ctx, symbol, 0, 0, symW, H);
    draw(header.ctx, name, symW + gap, (H - nameH) / 2, nameW, nameH);

    // 3. Simboli në katror 512 px, pa hapësirë (ikonat e shtojnë vetë).
    const sym = canvas(512, 512);
    const s = Math.min(512 / symbol.w, 512 / symbol.h);
    draw(
      sym.ctx,
      symbol,
      (512 - symbol.w * s) / 2,
      (512 - symbol.h * s) / 2,
      symbol.w * s,
      symbol.h * s,
    );

    return {
      logo: logo.c.toDataURL('image/png'),
      header: header.c.toDataURL('image/webp', 0.9),
      headerSize: [header.c.width / 3, H / 3],
      symbol: sym.c.toDataURL('image/png'),
    };
  },
  { src: source, headerHeight: HEADER_LOGO_HEIGHT },
);
await browser.close();

const save = (file: string, dataUrl: string, folder = dir) => {
  const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
  writeFileSync(join(folder, file), buf);
  return `${file} ${(buf.length / 1024).toFixed(1)} KB`;
};
console.log(
  `build-logo: ${save('logo.png', files.logo)}, ${save('logo-header.webp', files.header)} ` +
    `(${files.headerSize.map((n) => Math.round(n)).join('×')} px CSS), ${save('simboli.png', files.symbol, join(root, 'branding'))}`,
);
