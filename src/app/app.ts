import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, skip } from 'rxjs';
import { Footer } from './core/layout/footer/footer';
import { Header } from './core/layout/header/header';
import { MobileContactBar } from './core/layout/mobile-contact-bar/mobile-contact-bar';
import { WhatsAppSheet } from './core/contact/whatsapp-sheet';
import { WhatsAppFlow } from './core/contact/whatsapp-flow.service';
import { SeoService } from './core/seo/seo.service';
import { UI_TEXT } from './i18n';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, MobileContactBar, WhatsAppSheet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#main" (click)="skipToMain($event)">{{ t.skipToContent }}</a>
    <!--
      Header-i, footer-i dhe shiriti hidratohen kur përdoruesi ndërvepron me to (ose header-i
      pas navigimit të parë, për lidhjen aktive). Deri atëherë janë HTML e prerenderuar.
    -->
    @defer (on immediate; hydrate on interaction; hydrate when navigated()) {
      <app-header />
    }
    <main id="main" tabindex="-1">
      <router-outlet />
    </main>
    @defer (on immediate; hydrate on interaction) {
      <app-footer />
    }
    @defer (on immediate; hydrate on interaction) {
      <app-mobile-contact-bar />
    }
    <!-- Forma WhatsApp ngarkohet kur hapet herën e parë (prefetch kur browser-i është i lirë). -->
    @defer (when flow.isOpen(); prefetch on idle) {
      <app-whatsapp-sheet />
    }
  `,
  styleUrl: './app.scss',
})
export class App {
  protected readonly t = UI_TEXT;
  protected readonly flow = inject(WhatsAppFlow);
  /** true pas navigimit të parë brenda faqes (jo hapja fillestare). */
  protected readonly navigated = toSignal(
    inject(Router).events.pipe(
      filter((e) => e instanceof NavigationEnd),
      skip(1),
      map(() => true),
    ),
    { initialValue: false },
  );

  constructor() {
    inject(SeoService).init();

    // Në celular tab-et e menusë rrëshqasin anash: tab-i i faqes aktuale sillet në pamje. Bëhet
    // këtu dhe jo te header-i, sepse header-i hidratohet vonë (me ndërveprimin e parë), ndërsa
    // HTML-ja e tij me lidhjen aktive është gati që në fillim. Vetëm në browser.
    const router = inject(Router);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      revealActiveTab();
      const sub = router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe(() => requestAnimationFrame(revealActiveTab));
      destroyRef.onDestroy(() => sub.unsubscribe());
    });
  }

  /** href="#main" me <base href="/"> do të çonte te kryefaqja, prandaj fokusi lëviz me dorë. */
  protected skipToMain(event: Event): void {
    event.preventDefault();
    const main = (event.target as HTMLElement).ownerDocument.getElementById('main');
    main?.focus();
    main?.scrollIntoView();
  }
}

/** Lëviz vetëm rreshtin e tab-eve (jo faqen) që tab-i aktiv të jetë në mes, kur rreshti nuk nxë. */
function revealActiveTab(): void {
  const list = document.querySelector<HTMLElement>('app-header .header__list');
  const active = list?.querySelector<HTMLElement>('.header__link.is-active');
  if (!list || !active || list.scrollWidth <= list.clientWidth) return;
  list.scrollTo({ left: active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2 });
}
