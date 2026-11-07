import type { Article, Business, City, Photo, Price, QA, Service } from '../../data/types';

/**
 * Të dhënat e strukturuara (schema.org, JSON-LD): funksione të pastra, pa varësi nga Angular.
 * Fushat që mungojnë (null, lista bosh) nuk shkruhen fare: asnjë vlerë e shpikur.
 * Nuk ka aggregateRating, sepse faqja nuk ka vlerësime reale.
 */

export type JsonLd = Record<string, unknown>;

const CONTEXT = 'https://schema.org';

/** Llojet schema.org të biznesit: kondicionim dhe punime elektrike. */
const BUSINESS_TYPES = ['HVACBusiness', 'Electrician'];

/** URL-ja e imazhit OG (public/og-image.png, 1200×630; ndërtohet me `npm run build:og`). */
export const OG_IMAGE: Photo = {
  src: '/og-image.png',
  alt: 'Montim, riparim dhe mirëmbajtje kondicionerësh në Shqipëri',
  width: 1200,
  height: 630,
};

export const absoluteUrl = (siteUrl: string, path: string): string =>
  /^https?:\/\//.test(path) ? path : `${siteUrl}${path.startsWith('/') ? '' : '/'}${path}`;

/** Identifikuesi i biznesit, që Service dhe BlogPosting t'i referohen të njëjtit subjekt. */
export const businessId = (siteUrl: string): string => `${siteUrl}/#business`;

/** Heq çelësat me vlerë null/undefined ose me listë bosh. */
function compact(obj: JsonLd): JsonLd {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0),
    ),
  );
}

const areaServed = (cities: readonly City[]) =>
  cities.map((c) => ({ '@type': 'City', name: c.name }));

export interface BusinessJsonLdInput {
  business: Business;
  /** Emri që shfaqet (BUSINESS.name ose emri rezervë). */
  name: string;
  cities: readonly City[];
  /** Foto e biznesit; parazgjedhur: imazhi OG. */
  image?: Photo | null;
}

/** HVACBusiness dhe Electrician (kondicionim dhe punime elektrike), në çdo faqe. */
export function businessJsonLd({ business: b, name, cities, image }: BusinessJsonLdInput): JsonLd {
  // Vetëm profile të vërteta (me path), jo faqja kryesore e rrjetit (p.sh. facebook.com/).
  const sameAs = Object.values(b.social).filter(
    (url): url is string => !!url && new URL(url).pathname.replace(/\/+$/, '') !== '',
  );
  return compact({
    '@context': CONTEXT,
    '@type': BUSINESS_TYPES,
    '@id': businessId(b.siteUrl),
    name,
    url: `${b.siteUrl}/`,
    image: absoluteUrl(b.siteUrl, (image ?? OG_IMAGE).src),
    logo: b.logo ? absoluteUrl(b.siteUrl, b.logo) : null,
    telephone: b.phone,
    email: b.email,
    address: compact({
      '@type': 'PostalAddress',
      addressLocality: b.locality,
      addressCountry: 'AL',
    }),
    areaServed: [
      ...areaServed(cities),
      ...(b.servesWholeCountry ? [{ '@type': 'Country', name: 'Shqipëri' }] : []),
    ],
    openingHours: b.openingHours.map((h) => h.schema).filter(Boolean),
    priceRange: b.priceRange,
    sameAs,
  });
}

export interface ServiceJsonLdInput {
  service: Service;
  siteUrl: string;
  url: string;
  cities: readonly City[];
  /** Çmimet "duke filluar nga" të shërbimit (vetëm ato me vlerë). */
  prices?: readonly Price[];
}

/** Service, në çdo faqe shërbimi. */
export function serviceJsonLd({ service, siteUrl, url, cities, prices = [] }: ServiceJsonLdInput) {
  const offers = prices
    .filter((p): p is Price & { from: number } => p.from !== null)
    .map((p) => ({
      '@type': 'Offer',
      name: p.label,
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: p.from,
        priceCurrency: p.currency,
      },
    }));
  return compact({
    '@context': CONTEXT,
    '@type': 'Service',
    name: service.title,
    serviceType: service.title,
    description: service.intro,
    url,
    provider: { '@id': businessId(siteUrl) },
    areaServed: areaServed(cities),
    offers,
  });
}

/** FAQPage, në faqen e pyetjeve. */
export function faqJsonLd(items: readonly QA[]): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export interface ArticleJsonLdInput {
  article: Article;
  siteUrl: string;
  url: string;
  /** Autori/botuesi (biznesi). */
  name: string;
  image?: Photo;
}

/** BlogPosting, në çdo artikull. */
export function articleJsonLd({
  article,
  siteUrl,
  url,
  name,
  image = OG_IMAGE,
}: ArticleJsonLdInput) {
  const business = {
    '@type': BUSINESS_TYPES,
    '@id': businessId(siteUrl),
    name,
    url: `${siteUrl}/`,
  };
  return {
    '@context': CONTEXT,
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: 'sq',
    url,
    mainEntityOfPage: url,
    image: absoluteUrl(siteUrl, image.src),
    author: business,
    publisher: business,
  };
}

export interface BreadcrumbJsonLdItem {
  label: string;
  /** URL absolute; mungon te faqja aktuale. */
  url?: string;
}

/** BreadcrumbList, në faqet e brendshme (i njëjti shteg që shihet në faqe). */
export function breadcrumbJsonLd(items: readonly BreadcrumbJsonLdItem[]): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) =>
      compact({ '@type': 'ListItem', position: i + 1, name: c.label, item: c.url }),
    ),
  };
}
