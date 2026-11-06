import { ChangeDetectionStrategy, Component, inject, isDevMode } from '@angular/core';
import { TrackPhone } from '../../core/analytics/track-phone.directive';
import { telHref } from '../../core/contact/phone';
import { WhatsAppFlow } from '../../core/contact/whatsapp-flow.service';
import { ABOUT, ABOUT_PHOTOS } from '../../data/about';
import { BRANDS } from '../../data/brands';
import { BUSINESS } from '../../data/business';
import { UI_TEXT } from '../../i18n';
import { Breadcrumbs, type Crumb } from '../../shared/ui/breadcrumbs/breadcrumbs';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { Photo } from '../../shared/ui/photo/photo';
import { Section } from '../../shared/ui/section/section';
import { Stats } from '../../shared/ui/stats/stats';

/** /rreth-ustait: përvoja, fotot, certifikatat dhe markat. */
@Component({
  selector: 'app-about-page',
  imports: [TrackPhone, Breadcrumbs, Button, Icon, Photo, Section, Stats],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
})
export class AboutPage {
  protected readonly a = ABOUT;
  protected readonly contact = UI_TEXT.contact;
  protected readonly flow = inject(WhatsAppFlow);
  protected readonly showTodo = isDevMode();
  protected readonly phoneHref = BUSINESS.phone ? telHref(BUSINESS.phone) : null;
  protected readonly photos = ABOUT_PHOTOS;
  protected readonly brands = BRANDS;
  protected readonly crumbs: Crumb[] = [
    { label: UI_TEXT.breadcrumbs.home, path: '/' },
    { label: ABOUT.title },
  ];

  protected openWhatsApp(): void {
    this.flow.open({ source: 'cta' });
  }
}
