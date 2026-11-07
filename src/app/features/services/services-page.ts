import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WhatsAppFlow } from '../../core/contact/whatsapp-flow.service';
import { SERVICE_CATEGORIES, servicesIn } from '../../data/services';
import { UI_TEXT } from '../../i18n';
import { Breadcrumbs, type Crumb } from '../../shared/ui/breadcrumbs/breadcrumbs';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { Section } from '../../shared/ui/section/section';
import { ServiceGrid } from './service-grid';

/** /sherbimet: shërbimet, të ndara në kondicionim dhe punime elektrike. */
@Component({
  selector: 'app-services-page',
  imports: [Breadcrumbs, Button, Icon, Section, ServiceGrid],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div class="container">
        <ui-breadcrumbs [items]="crumbs" />
        <span class="eyebrow">{{ t.eyebrow }}</span>
        <h1>{{ t.title }}</h1>
        <p class="lead">{{ t.lead }}</p>
      </div>
    </header>
    <!-- Pjesa poshtë kokës hidratohet në ndërveprimin e parë. -->
    @defer (on immediate; hydrate on interaction) {
      @for (c of categories; track c.key; let odd = $odd) {
        <ui-section
          [tone]="odd ? 'white' : 'soft'"
          [title]="c.title"
          [lead]="c.lead"
          [anchor]="c.key"
        >
          <app-service-grid [services]="servicesIn(c.key)" />
        </ui-section>
      }

      @if (flow.available) {
        <ui-section tone="base" [title]="t.ctaTitle" [lead]="contact.microcopy">
          <button ui-button variant="primary" size="lg" type="button" (click)="openWhatsApp()">
            <ui-icon name="brand-whatsapp" [size]="22" />{{ contact.whatsapp }}
          </button>
        </ui-section>
      }
    }
  `,
})
export class ServicesPage {
  protected readonly t = UI_TEXT.services;
  protected readonly contact = UI_TEXT.contact;
  protected readonly flow = inject(WhatsAppFlow);
  protected readonly categories = SERVICE_CATEGORIES;
  protected readonly servicesIn = servicesIn;
  protected readonly crumbs: Crumb[] = [
    { label: UI_TEXT.breadcrumbs.home, path: '/' },
    { label: UI_TEXT.breadcrumbs.services },
  ];

  protected openWhatsApp(): void {
    this.flow.open({ source: 'sherbimi' });
  }
}
