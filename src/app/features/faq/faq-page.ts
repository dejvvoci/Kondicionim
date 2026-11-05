import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WhatsAppFlow } from '../../core/contact/whatsapp-flow.service';
import { FAQ } from '../../data/faq';
import { SERVICES } from '../../data/services';
import { UI_TEXT } from '../../i18n';
import { AccordionItem } from '../../shared/ui/accordion/accordion-item';
import { Accordion } from '../../shared/ui/accordion/accordion';
import { Breadcrumbs, type Crumb } from '../../shared/ui/breadcrumbs/breadcrumbs';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { Section } from '../../shared/ui/section/section';

/** /pyetje-te-shpeshta: pyetjet e përgjithshme dhe ato të çdo shërbimi, të grupuara. */
@Component({
  selector: 'app-faq-page',
  imports: [RouterLink, Accordion, AccordionItem, Breadcrumbs, Button, Icon, Section],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './faq-page.html',
  styles: `
    .group + .group {
      margin-top: var(--sp-7);
    }
    .group h2 {
      font-size: var(--fs-h3);
    }
    .group__link {
      margin-top: var(--sp-2);
    }
  `,
})
export class FaqPage {
  protected readonly t = UI_TEXT.faq;
  protected readonly contact = UI_TEXT.contact;
  protected readonly flow = inject(WhatsAppFlow);
  protected readonly general = FAQ;
  protected readonly byService = SERVICES.filter((s) => s.faq.length);
  protected readonly crumbs: Crumb[] = [
    { label: UI_TEXT.breadcrumbs.home, path: '/' },
    { label: UI_TEXT.faq.title },
  ];

  protected openWhatsApp(): void {
    this.flow.open({ source: 'cta' });
  }
}
