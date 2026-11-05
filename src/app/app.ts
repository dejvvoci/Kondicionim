import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './core/layout/footer/footer';
import { Header } from './core/layout/header/header';
import { MobileContactBar } from './core/layout/mobile-contact-bar/mobile-contact-bar';
import { WhatsAppSheet } from './core/contact/whatsapp-sheet';
import { SeoService } from './core/seo/seo.service';
import { UI_TEXT } from './i18n';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, MobileContactBar, WhatsAppSheet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#main" (click)="skipToMain($event)">{{ t.skipToContent }}</a>
    <app-header />
    <main id="main" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
    <app-mobile-contact-bar />
    <app-whatsapp-sheet />
  `,
  styleUrl: './app.scss',
})
export class App {
  protected readonly t = UI_TEXT;

  constructor() {
    inject(SeoService).init();
  }

  /** href="#main" me <base href="/"> do të çonte te kryefaqja, prandaj fokusi lëviz me dorë. */
  protected skipToMain(event: Event): void {
    event.preventDefault();
    const main = (event.target as HTMLElement).ownerDocument.getElementById('main');
    main?.focus();
    main?.scrollIntoView();
  }
}
