import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { buildCanonical, buildTitle, type RouteSeo } from './seo';

/**
 * Vendos title, description dhe canonical për çdo rrugë nga `data.seo`.
 * Open Graph dhe JSON-LD shtohen në fazën e SEO-së.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  init(): void {
    const sub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.apply());
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  private apply(): void {
    const seo = this.deepestSeo(this.router.routerState.snapshot.root);
    this.title.setTitle(buildTitle(seo?.title ?? null));
    if (seo?.description) {
      this.meta.updateTag({ name: 'description', content: seo.description });
    } else {
      this.meta.removeTag('name="description"');
    }
    if (seo?.noindex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex' });
      this.setCanonical(null);
    } else {
      this.meta.removeTag('name="robots"');
      this.setCanonical(buildCanonical(this.router.url));
    }
  }

  private deepestSeo(route: ActivatedRouteSnapshot): RouteSeo | undefined {
    let seo: RouteSeo | undefined;
    for (let r: ActivatedRouteSnapshot | null = route; r; r = r.firstChild) {
      seo = (r.data['seo'] as RouteSeo | undefined) ?? seo;
    }
    return seo;
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
}
