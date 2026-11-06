import { CITIES } from '../../data/cities';
import { SERVICES } from '../../data/services';
import type { Article, Business } from '../../data/types';
import {
  articleJsonLd,
  breadcrumbJsonLd,
  businessJsonLd,
  faqJsonLd,
  serviceJsonLd,
} from './json-ld';

const SITE = 'https://shembull.al';

const empty: Business = {
  name: null,
  fallbackName: 'Usta kondicionimi',
  siteUrl: SITE,
  phone: null,
  whatsapp: null,
  nipt: null,
  email: null,
  openingHours: [],
  social: { facebook: null, instagram: null, tiktok: null, youtube: null },
  locality: null,
  priceRange: null,
};

describe('businessJsonLd', () => {
  it('HVACBusiness me qytetet nga cities.ts dhe pa fusha të shpikura kur mungojnë të dhënat', () => {
    const ld = businessJsonLd({ business: empty, name: 'Usta kondicionimi', cities: CITIES });
    expect(ld).toEqual({
      '@context': 'https://schema.org',
      '@type': 'HVACBusiness',
      '@id': `${SITE}/#business`,
      name: 'Usta kondicionimi',
      url: `${SITE}/`,
      image: `${SITE}/og-image.png`,
      address: { '@type': 'PostalAddress', addressCountry: 'AL' },
      areaServed: CITIES.map((c) => ({ '@type': 'City', name: c.name })),
    });
    expect(ld).not.toHaveProperty('aggregateRating');
  });

  it('shton telefonin, orarin, çmimet dhe rrjetet sociale kur plotësohen', () => {
    const ld = businessJsonLd({
      business: {
        ...empty,
        phone: '+355690000000',
        nipt: 'L00000000A',
        locality: 'Tiranë',
        priceRange: '$$',
        openingHours: [
          { days: 'E hënë – e shtunë', hours: '08:00 – 19:00', schema: 'Mo-Sa 08:00-19:00' },
        ],
        social: { ...empty.social, facebook: 'https://facebook.com/x' },
      },
      name: 'Klima X',
      cities: [],
      image: { src: '/images/usta.avif', alt: '', width: 1200, height: 900 },
    });
    expect(ld).toMatchObject({
      name: 'Klima X',
      telephone: '+355690000000',
      taxID: 'L00000000A',
      image: `${SITE}/images/usta.avif`,
      address: { addressLocality: 'Tiranë', addressCountry: 'AL' },
      openingHours: ['Mo-Sa 08:00-19:00'],
      priceRange: '$$',
      sameAs: ['https://facebook.com/x'],
    });
    expect(ld).not.toHaveProperty('areaServed');
  });
});

describe('serviceJsonLd', () => {
  const service = SERVICES.find((s) => s.slug === 'montim-split')!;

  it('Service me ofruesin (biznesin) dhe zonat', () => {
    const ld = serviceJsonLd({
      service,
      siteUrl: SITE,
      url: `${SITE}/sherbimet/montim-split/`,
      cities: CITIES.slice(0, 1),
    });
    expect(ld).toMatchObject({
      '@type': 'Service',
      name: service.title,
      provider: { '@id': `${SITE}/#business` },
      areaServed: [{ '@type': 'City', name: CITIES[0].name }],
    });
    expect(ld).not.toHaveProperty('offers');
  });

  it('oferta vetëm për çmimet me vlerë', () => {
    const ld = serviceJsonLd({
      service,
      siteUrl: SITE,
      url: '',
      cities: [],
      prices: [
        {
          label: 'Montim 9000 BTU',
          from: 15000,
          currency: 'ALL',
          serviceSlug: service.slug,
          note: '',
        },
        { label: 'Pa çmim', from: null, currency: 'ALL', serviceSlug: service.slug, note: '' },
      ],
    });
    expect(ld['offers']).toEqual([
      {
        '@type': 'Offer',
        name: 'Montim 9000 BTU',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: 15000,
          priceCurrency: 'ALL',
        },
      },
    ]);
  });
});

describe('faqJsonLd', () => {
  it('çdo pyetje me përgjigjen e saj', () => {
    expect(faqJsonLd([{ q: 'Sa BTU?', a: 'Varet nga dhoma.' }])).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Sa BTU?',
          acceptedAnswer: { '@type': 'Answer', text: 'Varet nga dhoma.' },
        },
      ],
    });
  });
});

describe('articleJsonLd', () => {
  it('BlogPosting me datën dhe biznesin si autor', () => {
    const article: Article = {
      slug: 'pse-pikon',
      title: 'Pse pikon?',
      description: 'Shkaqet.',
      date: '2026-11-05',
      services: [],
      readingMinutes: 3,
    };
    const ld = articleJsonLd({
      article,
      siteUrl: SITE,
      url: `${SITE}/keshilla/pse-pikon/`,
      name: 'Usta',
    });
    expect(ld).toMatchObject({
      '@type': 'BlogPosting',
      headline: 'Pse pikon?',
      datePublished: '2026-11-05',
      inLanguage: 'sq',
      image: `${SITE}/og-image.png`,
      author: { '@id': `${SITE}/#business`, name: 'Usta' },
    });
  });
});

describe('breadcrumbJsonLd', () => {
  it('pozicionet nga 1 dhe faqja aktuale pa URL', () => {
    expect(
      breadcrumbJsonLd([
        { label: 'Kryefaqja', url: `${SITE}/` },
        { label: 'Shërbimet', url: `${SITE}/sherbimet/` },
        { label: 'Montim split' },
      ])['itemListElement'],
    ).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Kryefaqja', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Shërbimet', item: `${SITE}/sherbimet/` },
      { '@type': 'ListItem', position: 3, name: 'Montim split' },
    ]);
  });
});
