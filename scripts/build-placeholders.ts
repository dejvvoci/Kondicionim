/**
 * Fotot shembull (public/images/shembull/*.svg) nga thirrjet `placeholder(...)` në të dhëna.
 * Ekzekutimi: `npm run build:placeholders`. Fshin SVG-të që nuk përdoren më.
 *
 * Çdo imazh tregon: "Foto shembull", çfarë duhet të shfaqë fotoja reale, përmasat dhe raportin,
 * formatin e rekomanduar dhe emrin e sugjeruar të skedarit real.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { HERO_PHOTO } from '../src/app/data/business.ts';
import { PLACEHOLDER_ALT_PREFIX, isPlaceholder } from '../src/app/data/placeholders.ts';
import { PROJECTS } from '../src/app/data/projects.ts';
import { SERVICES } from '../src/app/data/services.ts';
import { STANDARDS, TOOLS_PHOTO } from '../src/app/data/standards.ts';
import type { Photo } from '../src/app/data/types.ts';

const dir = join(import.meta.dirname, '..', 'public', 'images', 'shembull');

const photos: Photo[] = [
  ...(HERO_PHOTO ? [HERO_PHOTO] : []),
  ...SERVICES.flatMap((s) => s.photos),
  ...STANDARDS.flatMap((s) => (s.photo ? [s.photo] : [])),
  ...(TOOLS_PHOTO ? [TOOLS_PHOTO] : []),
  ...PROJECTS.flatMap((p) => [p.before, p.after, ...p.gallery]),
].filter(isPlaceholder);

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** Ndarje e thjeshtë në rreshta sipas numrit të shkronjave. */
function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    if (line && (line + ' ' + word).length > max) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function svg(photo: Photo): string {
  const { width: w, height: h } = photo;
  const unit = Math.min(w, h) / 30;
  const pad = unit * 2.4;
  const font = `font-family="'Segoe UI', Roboto, system-ui, sans-serif"`;
  const content = photo.alt.replace(PLACEHOLDER_ALT_PREFIX, '');
  const descSize = unit * 1.8;
  const desc = wrap(
    content.charAt(0).toUpperCase() + content.slice(1),
    Math.floor((w * 0.82) / (descSize * 0.52)),
  );
  const k = gcd(w, h);
  const realName = `${basename(photo.src, '.svg')}.avif`;
  const cx = w / 2;
  // Para/pas me ngjyra të ndryshme, që slider-i të tregojë ndryshimin edhe me foto shembull.
  const stage = /-para.svg$/.test(photo.src) ? 'para' : /-pas.svg$/.test(photo.src) ? 'pas' : null;
  const bg = stage === 'para' ? '#ebe4da' : stage === 'pas' ? '#d6eeeb' : '#e6ecec';
  const badge = stage ? `FOTO SHEMBULL · ${stage.toUpperCase()}` : 'FOTO SHEMBULL';
  const badgeW = unit * (stage ? 17.5 : 13);
  const iconY = h * 0.3;
  const titleY = iconY + unit * 4.6;
  const descY = titleY + unit * 2.8;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<rect width="${w}" height="${h}" fill="${bg}"/>
<rect x="${pad / 2}" y="${pad / 2}" width="${w - pad}" height="${h - pad}" rx="${unit}" fill="none" stroke="#a9bcbe" stroke-width="${unit / 6}" stroke-dasharray="${unit} ${unit / 1.5}"/>
<rect x="${cx - badgeW / 2}" y="${pad}" width="${badgeW}" height="${unit * 2.8}" rx="${unit * 1.4}" fill="#10766f"/>
<text x="${cx}" y="${pad + unit * 1.9}" text-anchor="middle" ${font} font-size="${unit * 1.35}" font-weight="700" letter-spacing="${unit / 12}" fill="#ffffff">${badge}</text>
<g transform="translate(${cx - unit * 2.4} ${iconY - unit * 2.4}) scale(${unit / 5})" fill="none" stroke="#7d9497" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"/><path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/>
</g>
<text x="${cx}" y="${titleY}" text-anchor="middle" ${font} font-size="${unit * 2.6}" font-weight="600" fill="#3c5a5f">Foto reale këtu</text>
${desc.map((l, i) => `<text x="${cx}" y="${descY + i * descSize * 1.35}" text-anchor="middle" ${font} font-size="${descSize}" fill="#3c5a5f">${escape(l)}</text>`).join('\n')}
<text x="${cx}" y="${h - pad - unit * 2.4}" text-anchor="middle" ${font} font-size="${unit * 1.4}" fill="#55706f">${w} × ${h} px · raporti ${w / k}:${h / k} · AVIF ose WebP</text>
<text x="${cx}" y="${h - pad - unit * 0.7}" text-anchor="middle" ${font} font-size="${unit * 1.4}" fill="#55706f">Skedari: ${escape(realName)}</text>
</svg>
`;
}

mkdirSync(dir, { recursive: true });
const written = new Set<string>();
for (const photo of photos) {
  const file = basename(photo.src);
  writeFileSync(join(dir, file), svg(photo));
  written.add(file);
}
const stale = readdirSync(dir).filter((f) => f.endsWith('.svg') && !written.has(f));
for (const f of stale) rmSync(join(dir, f));
console.log(
  `build-placeholders: ${written.size} foto shembull${stale.length ? `, ${stale.length} të fshira` : ''}`,
);
