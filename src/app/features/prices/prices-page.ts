import { ChangeDetectionStrategy, Component, inject, isDevMode } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WhatsAppFlow } from '../../core/contact/whatsapp-flow.service';
import { PRICES, PRICE_PAGE, formatPrice } from '../../data/prices';
import { serviceBySlug } from '../../data/services';
import { UI_TEXT } from '../../i18n';
import { Breadcrumbs, type Crumb } from '../../shared/ui/breadcrumbs/breadcrumbs';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { Section } from '../../shared/ui/section/section';

/** /cmimet-dhe-garancia: çmimet orientuese, çfarë përfshihet dhe garancia mbi punën. */
@Component({
  selector: 'app-prices-page',
  imports: [RouterLink, Breadcrumbs, Button, Icon, Section],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './prices-page.html',
  styleUrl: './prices-page.scss',
})
export class PricesPage {
  protected readonly p = PRICE_PAGE;
  protected readonly contact = UI_TEXT.contact;
  protected readonly flow = inject(WhatsAppFlow);
  protected readonly showTodo = isDevMode();
  protected readonly crumbs: Crumb[] = [
    { label: UI_TEXT.breadcrumbs.home, path: '/' },
    { label: PRICE_PAGE.title },
  ];

  protected readonly prices = PRICES.filter((x) => x.from !== null).map((x) => ({
    ...x,
    amount: formatPrice(x.from ?? 0, x.currency),
    service: serviceBySlug(x.serviceSlug),
  }));
  protected readonly w = PRICE_PAGE.warranty;
  protected readonly hasWarranty = !!(this.w.duration || this.w.covers.length);

  protected openWhatsApp(): void {
    this.flow.open({ source: 'cta', service: 'oferte' });
  }
}
