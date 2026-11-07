import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { BUSINESS, businessName } from '../../data/business';
import type { RouteSeo } from './seo';
import { SeoService } from './seo.service';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class Blank {}

const SITE = BUSINESS.siteUrl;

describe('SeoService', () => {
  let doc: Document;
  let router: Router;

  const meta = (selector: string) =>
    doc.head.querySelector<HTMLMetaElement>(`meta[${selector}]`)?.content ?? null;
  const ld = (key: string) => {
    const text = doc.head.querySelector(`script[data-ld="${key}"]`)?.textContent;
    return text ? (JSON.parse(text) as Record<string, unknown>) : null;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'sherbimet',
            component: Blank,
            data: {
              seo: {
                title: 'Shërbimet',
                description: 'Të gjitha shërbimet.',
                jsonLd: [{ '@type': 'Service', name: 'Montim' }],
              } satisfies RouteSeo,
            },
          },
          {
            path: 'keshilla/artikull',
            component: Blank,
            data: {
              seo: {
                title: 'Artikull',
                description: 'Përshkrimi.',
                type: 'article',
                publishedTime: '2026-11-05',
              } satisfies RouteSeo,
            },
          },
          {
            path: '**',
            component: Blank,
            data: { seo: { title: 'Faqja nuk u gjet', description: '', noindex: true } },
          },
        ]),
      ],
    });
    doc = TestBed.inject(DOCUMENT);
    router = TestBed.inject(Router);
    TestBed.inject(SeoService).init();
  });

  afterEach(() => {
    doc.head
      .querySelectorAll('meta[property], meta[name], link[rel="canonical"], script[data-ld]')
      .forEach((el) => el.remove());
  });

  it('title, description, canonical, Open Graph dhe Twitter Card nga të dhënat e rrugës', async () => {
    await router.navigateByUrl('/sherbimet?burimi=x#seksioni');

    expect(doc.title).toBe(`Shërbimet | ${businessName()}`);
    expect(meta('name="description"')).toBe('Të gjitha shërbimet.');
    expect(doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe(
      `${SITE}/sherbimet/`,
    );
    expect(meta('property="og:title"')).toBe(`Shërbimet | ${businessName()}`);
    expect(meta('property="og:url"')).toBe(`${SITE}/sherbimet/`);
    expect(meta('property="og:type"')).toBe('website');
    expect(meta('property="og:image"')).toBe(`${SITE}/og-image.png`);
    expect(meta('property="og:image:width"')).toBe('1200');
    expect(meta('property="og:locale"')).toBe('sq_AL');
    expect(meta('name="twitter:card"')).toBe('summary_large_image');
    expect(meta('name="robots"')).toBeNull();
  });

  it('JSON-LD: HVACBusiness në çdo faqe dhe JSON-LD i faqes nga rruga', async () => {
    await router.navigateByUrl('/sherbimet');
    expect(ld('business')?.['@type']).toEqual(['HVACBusiness', 'Electrician']);
    expect(ld('page')).toEqual({ '@type': 'Service', name: 'Montim' });

    await router.navigateByUrl('/keshilla/artikull');
    expect(ld('business')?.['@type']).toEqual(['HVACBusiness', 'Electrician']);
    expect(ld('page')).toBeNull();
    expect(doc.head.querySelectorAll('script[data-ld="business"]').length).toBe(1);
  });

  it('artikujt: og:type article dhe data e publikimit', async () => {
    await router.navigateByUrl('/keshilla/artikull');
    expect(meta('property="og:type"')).toBe('article');
    expect(meta('property="article:published_time"')).toBe('2026-11-05');

    await router.navigateByUrl('/sherbimet');
    expect(meta('property="article:published_time"')).toBeNull();
  });

  it('noindex: robots, pa canonical dhe pa og:url', async () => {
    await router.navigateByUrl('/nuk-ekziston');
    expect(meta('name="robots"')).toBe('noindex');
    expect(doc.head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(meta('property="og:url"')).toBeNull();
    expect(meta('name="description"')).toBeNull();
  });

  it('BreadcrumbList me URL absolute; faqja aktuale pa URL; null e heq', () => {
    const seo = TestBed.inject(SeoService);
    seo.setBreadcrumbs([
      { label: 'Kryefaqja', path: '/' },
      { label: 'Shërbimet', path: '/sherbimet' },
      { label: 'Montim split' },
    ]);
    expect(ld('breadcrumbs')?.['itemListElement']).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Kryefaqja', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Shërbimet', item: `${SITE}/sherbimet/` },
      { '@type': 'ListItem', position: 3, name: 'Montim split' },
    ]);

    seo.setBreadcrumbs(null);
    expect(ld('breadcrumbs')).toBeNull();
  });

  it('teksti në JSON-LD nuk mund ta mbyllë skriptin', async () => {
    TestBed.inject(SeoService).setBreadcrumbs([{ label: '</script><b>x' }]);
    const text = doc.head.querySelector('script[data-ld="breadcrumbs"]')?.textContent ?? '';
    expect(text).not.toContain('</script>');
    expect(ld('breadcrumbs')?.['itemListElement']).toEqual([
      { '@type': 'ListItem', position: 1, name: '</script><b>x' },
    ]);
  });
});
