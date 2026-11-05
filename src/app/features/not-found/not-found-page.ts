import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WhatsAppFlow } from '../../core/contact/whatsapp-flow.service';
import { UI_TEXT } from '../../i18n';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { ServiceGrid } from '../services/service-grid';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, Button, Icon, ServiceGrid],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container page">
      <span class="eyebrow">404</span>
      <h1>{{ t.notFound.title }}</h1>
      <p class="lead">{{ t.notFound.text }}</p>
      <div class="actions">
        @if (flow.available) {
          <button ui-button variant="primary" type="button" (click)="openWhatsApp()">
            <ui-icon name="brand-whatsapp" [size]="20" />{{ t.contact.whatsapp }}
          </button>
        }
        <a ui-button variant="outline" routerLink="/">{{ t.notFound.home }}</a>
      </div>
    </section>
    <section class="container services" aria-labelledby="nf-services">
      <h2 id="nf-services">{{ t.notFound.services }}</h2>
      <app-service-grid />
    </section>
  `,
  styles: `
    .page {
      padding-block: var(--section-py) var(--sp-6);
      max-width: 760px;
      margin-inline: 0;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sp-3);
    }
    .services {
      padding-bottom: var(--section-py);
    }
    h2 {
      font-size: var(--fs-h3);
    }
  `,
})
export class NotFoundPage {
  protected readonly t = UI_TEXT;
  protected readonly flow = inject(WhatsAppFlow);

  protected openWhatsApp(): void {
    this.flow.open({ source: 'cta' });
  }
}
