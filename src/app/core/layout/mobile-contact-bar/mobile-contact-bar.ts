import { ChangeDetectionStrategy, Component, inject, isDevMode } from '@angular/core';
import { BUSINESS } from '../../../data/business';
import { UI_TEXT } from '../../../i18n';
import { TrackPhone } from '../../analytics/track-phone.directive';
import { Icon } from '../../../shared/ui/icon/icon';
import { telHref } from '../../contact/phone';
import { WhatsAppFlow } from '../../contact/whatsapp-flow.service';

/**
 * Shiriti i kontaktit, i fiksuar poshtë vetëm nën 768px: Telefono, WhatsApp, Ofertë.
 * Hapësira poshtë body-t për të vendoset në styles/_base.scss.
 */
@Component({
  selector: 'app-mobile-contact-bar',
  imports: [Icon, TrackPhone],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mobile-contact-bar.html',
  styleUrl: './mobile-contact-bar.scss',
})
export class MobileContactBar {
  protected readonly t = UI_TEXT;
  protected readonly phoneHref = BUSINESS.phone ? telHref(BUSINESS.phone) : null;
  protected readonly showTodo = isDevMode();
  protected readonly flow = inject(WhatsAppFlow);

  protected openWhatsApp(): void {
    this.flow.open({ source: 'shiriti' });
  }

  protected openOffer(): void {
    this.flow.open({ source: 'shiriti', service: 'oferte' });
  }
}
