import { BUSINESS, businessName } from '../../data/business';

/** Të dhënat SEO të një rruge, në `data.seo` të route-it. */
export interface RouteSeo {
  /** Titulli pa emrin e biznesit (shtohet automatikisht). */
  title: string;
  description: string;
  /** Faqe që nuk duhet indeksuar (p.sh. 404). */
  noindex?: boolean;
}

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

/** "Shërbimet" → "Shërbimet | Emri" (pa e kaluar kufirin kur emri është i gjatë). */
export function buildTitle(pageTitle: string | null, name = businessName()): string {
  if (!pageTitle) return name;
  const full = `${pageTitle} | ${name}`;
  return full.length <= TITLE_MAX ? full : pageTitle;
}

/**
 * URL kanonike me "/" në fund, si i shërben Cloudflare Pages faqet e prerenderuara
 * (/sherbimet → /sherbimet/). Query dhe fragment hiqen.
 */
export function buildCanonical(path: string, siteUrl = BUSINESS.siteUrl): string {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, '');
  return `${siteUrl}${clean}/`;
}

/** Shkurton tekstin në kufirin e description-it, në fund të një fjale. */
export function truncate(text: string, max = DESCRIPTION_MAX): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:]$/, '')}…`;
}
