import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { BUSINESS, HERO_PHOTO, businessName } from '../../data/business';
import { CITIES } from '../../data/cities';
import { OG_IMAGE, absoluteUrl, breadcrumbJsonLd, businessJsonLd, type JsonLd } from './json-ld';
import { buildCanonical, buildTitle, type RouteSeo } from './seo';

/** Një hap i shtegut të navigimit (si te ui-breadcrumbs). */
export interface SeoCrumb {
  label: string;
  path?: string;
}

/** Çelësat e skripteve JSON-LD në <head>: biznesi, faqja (nga rruga) dhe shtegu. */
type LdKey = 'business' | 'page' | 'breadcrumbs';

/**
 * Për çdo rrugë, nga `data.seo`: title, description, robots, canonical, Open Graph,
 * Twitter Card dhe JSON-LD. Funksionon njësoj gjatë prerender-it dhe në browser.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  init(): void {
    this.setJsonLd(
      'business',
      businessJsonLd({
        business: BUSINESS,
        name: businessName(),
        cities: CITIES.filter((c) => c.active),
        image: HERO_PHOTO,
      }),
    );
    const sub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.apply());
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  /**
   * BreadcrumbList nga shtegu që shfaq ui-breadcrumbs (null = faqja s'ka shteg).
   * Faqja aktuale (hapi i fundit) shkruhet pa URL, siç e lejon Google.
   */
  setBreadcrumbs(crumbs: readonly SeoCrumb[] | null): void {
    this.setJsonLd(
      'breadcrumbs',
      crumbs?.length
        ? breadcrumbJsonLd(
            crumbs.map((c, i) => ({
              label: c.label,
              url: c.path && i < crumbs.length - 1 ? buildCanonical(c.path) : undefined,
            })),
          )
        : null,
    );
  }

  private apply(): void {
    const seo = this.deepestSeo(this.router.routerState.snapshot.root);
    const title = buildTitle(seo?.title ?? null);
    const description = seo?.description || null;
    const canonical = seo?.noindex ? null : buildCanonical(this.router.url);
    const image = seo?.image ?? OG_IMAGE;

    this.title.setTitle(title);
    this.setMeta('name', 'description', description);
    this.setMeta('name', 'robots', seo?.noindex ? 'noindex' : null);
    this.setCanonical(canonical);

    this.setMeta('property', 'og:type', seo?.type ?? 'website');
    this.setMeta('property', 'og:site_name', businessName());
    this.setMeta('property', 'og:locale', 'sq_AL');
    this.setMeta('property', 'og:title', title);
    this.setMeta('property', 'og:description', description);
    this.setMeta('property', 'og:url', canonical);
    this.setMeta('property', 'og:image', absoluteUrl(BUSINESS.siteUrl, image.src));
    this.setMeta('property', 'og:image:width', String(image.width));
    this.setMeta('property', 'og:image:height', String(image.height));
    this.setMeta('property', 'og:image:alt', image.alt);
    this.setMeta('property', 'article:published_time', seo?.publishedTime ?? null);
    // Twitter/X merr titullin, përshkrimin dhe imazhin nga etiketat og:.
    this.setMeta('name', 'twitter:card', 'summary_large_image');

    const page = seo?.jsonLd ?? [];
    this.setJsonLd('page', page.length > 1 ? page : (page[0] ?? null));
  }

  private deepestSeo(route: ActivatedRouteSnapshot): RouteSeo | undefined {
    let seo: RouteSeo | undefined;
    for (let r: ActivatedRouteSnapshot | null = route; r; r = r.firstChild) {
      seo = (r.data['seo'] as RouteSeo | undefined) ?? seo;
    }
    return seo;
  }

  private setMeta(attr: 'name' | 'property', key: string, content: string | null): void {
    if (content === null) {
      this.meta.removeTag(`${attr}="${key}"`);
    } else {
      this.meta.updateTag({ [attr]: key, content });
    }
  }

  private setCanonical(href: string | null): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!href) {
      link?.remove();
      return;
    }
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = 'canonical';
      this.doc.head.appendChild(link);
    }
    link.href = href;
  }

  /** Një <script type="application/ld+json" data-ld="…"> për çelës; null e heq. */
  private setJsonLd(key: LdKey, data: JsonLd | JsonLd[] | null): void {
    let script = this.doc.head.querySelector<HTMLScriptElement>(`script[data-ld="${key}"]`);
    if (!data) {
      script?.remove();
      return;
    }
    if (!script) {
      script = this.doc.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-ld', key);
      this.doc.head.appendChild(script);
    }
    // "<" si <, që teksti të mos e mbyllë dot skriptin (</script>).
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
  }
}
