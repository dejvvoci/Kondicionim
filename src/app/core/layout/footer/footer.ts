import { ChangeDetectionStrategy, Component, inject, isDevMode } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BUSINESS, businessName } from '../../../data/business';
import { activeCities } from '../../../data/cities';
import { FOOTER_NAV } from '../../../data/navigation';
import { UI_TEXT } from '../../../i18n';
import { Icon } from '../../../shared/ui/icon/icon';
import { TrackPhone } from '../../analytics/track-phone.directive';
import { formatPhone, telHref } from '../../contact/phone';
import { WhatsAppFlow } from '../../contact/whatsapp-flow.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Icon, TrackPhone],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly t = UI_TEXT;
  protected readonly b = BUSINESS;
  protected readonly name = businessName();
  protected readonly nav = FOOTER_NAV;
  protected readonly cities = activeCities();
  protected readonly phoneHref = BUSINESS.phone ? telHref(BUSINESS.phone) : null;
  protected readonly phoneLabel = BUSINESS.phone ? formatPhone(BUSINESS.phone) : null;
  protected readonly hasWhatsApp = !!BUSINESS.whatsapp;
  protected readonly socials = [
    { label: 'Facebook', url: BUSINESS.social.facebook },
    { label: 'Instagram', url: BUSINESS.social.instagram },
    { label: 'TikTok', url: BUSINESS.social.tiktok },
    { label: 'YouTube', url: BUSINESS.social.youtube },
  ].filter((s): s is { label: string; url: string } => !!s.url);
  protected readonly hasContact = !!(this.phoneHref || this.hasWhatsApp || this.socials.length);
  protected readonly showTodo = isDevMode();
  protected readonly year = new Date().getFullYear();
  private readonly flow = inject(WhatsAppFlow);

  protected openWhatsApp(): void {
    this.flow.open({ source: 'footer' });
  }
}
