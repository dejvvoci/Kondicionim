import type { Photo } from './types';

/**
 * FOTO SHEMBULL për prezantim, derisa klienti të dërgojë fotot reale.
 *
 * Çdo thirrje `placeholder(...)` në skedarët e të dhënave është një vend fotoje në faqe, me
 * përmasat dhe përmbajtjen që pritet. Imazhet (public/images/shembull/*.svg) tregojnë qartë
 * "Foto shembull", çfarë duhet të shfaqë fotoja reale dhe emrin e sugjeruar të skedarit.
 * Gjenerohen nga këto të dhëna me `npm run build:placeholders`.
 *
 * Kur vjen fotoja reale: vendose te public/images/ me emrin e sugjeruar (AVIF ose WebP) dhe
 * zëvendëso thirrjen me objektin Photo real, p.sh.
 *   { src: '/images/usta-ne-pune.avif', alt: 'Ustai duke montuar…', width: 1200, height: 900 }
 * `node scripts/check-content.ts --strict` dështon derisa të mos mbetet asnjë foto shembull.
 */

export const PLACEHOLDER_DIR = '/images/shembull/';
export const PLACEHOLDER_ALT_PREFIX = 'Foto shembull: ';

/**
 * @param name emri i skedarit pa prapashtesë; fotoja reale merr të njëjtin emër me .avif
 * @param content çfarë duhet të shfaqë fotoja reale
 */
export function placeholder(name: string, content: string, width = 1200, height = 900): Photo {
  return {
    src: `${PLACEHOLDER_DIR}${name}.svg`,
    alt: `${PLACEHOLDER_ALT_PREFIX}${content}`,
    width,
    height,
  };
}

/** Tri foto për faqen e një shërbimi. */
export function servicePlaceholders(slug: string, title: string): Photo[] {
  return [
    placeholder(`${slug}-1`, `${title}: ustai gjatë punës`),
    placeholder(`${slug}-2`, `${title}: detaj nga puna (lidhjet, veglat ose matjet)`),
    placeholder(`${slug}-3`, `${title}: puna e përfunduar`),
  ];
}

export const isPlaceholder = (photo: Photo): boolean => photo.src.startsWith(PLACEHOLDER_DIR);
