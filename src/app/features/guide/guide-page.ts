import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrackPhone } from '../../core/analytics/track-phone.directive';
import { telHref } from '../../core/contact/phone';
import { WhatsAppFlow } from '../../core/contact/whatsapp-flow.service';
import { BUSINESS } from '../../data/business';
import { GUIDE, GUIDE_TOPICS, SYSTEM_TYPES } from '../../data/guide';
import { UI_TEXT } from '../../i18n';
import { Breadcrumbs, type Crumb } from '../../shared/ui/breadcrumbs/breadcrumbs';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { Section } from '../../shared/ui/section/section';
import { BtuCalculator } from './btu-calculator';

/** /si-te-zgjidhni-kondicionerin: kalkulatori BTU, krahasimi i sistemeve dhe këshilla. */
@Component({
  selector: 'app-guide-page',
  imports: [RouterLink, TrackPhone, Breadcrumbs, Button, Icon, Section, BtuCalculator],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './guide-page.html',
  styleUrl: './guide-page.scss',
})
export class GuidePage {
  protected readonly g = GUIDE;
  protected readonly contact = UI_TEXT.contact;
  protected readonly more = UI_TEXT.common.more;
  protected readonly types = SYSTEM_TYPES;
  protected readonly topics = GUIDE_TOPICS;
  protected readonly flow = inject(WhatsAppFlow);
  protected readonly phoneHref = BUSINESS.phone ? telHref(BUSINESS.phone) : null;
  protected readonly crumbs: Crumb[] = [
    { label: UI_TEXT.breadcrumbs.home, path: '/' },
    { label: GUIDE.title },
  ];

  /**
   * Krahasimi: karta të hapura në desktop, akordeon në celular. Prerender-i i nxjerr të hapura
   * (përmbajtja e plotë në HTML); në celular mbyllen pas ngarkimit.
   */
  protected readonly wide = signal(true);

  constructor() {
    const win = inject(DOCUMENT).defaultView;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const mql = win?.matchMedia('(min-width: 768px)');
      if (!mql) return;
      const update = () => this.wide.set(mql.matches);
      update();
      mql.addEventListener('change', update);
      destroyRef.onDestroy(() => mql.removeEventListener('change', update));
    });
  }

  /** Në desktop karta nuk mbyllet. */
  protected onSummaryClick(event: Event): void {
    if (this.wide()) event.preventDefault();
  }

  protected openWhatsApp(): void {
    this.flow.open({ source: 'cta', service: 'konsulence-dhe-zgjedhja-e-sistemit' });
  }
}
