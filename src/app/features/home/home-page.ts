import { ChangeDetectionStrategy, Component, inject, isDevMode } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrackPhone } from '../../core/analytics/track-phone.directive';
import { telHref } from '../../core/contact/phone';
import { WhatsAppFlow, type WhatsAppSource } from '../../core/contact/whatsapp-flow.service';
import { BRANDS } from '../../data/brands';
import { BUSINESS, HERO_PHOTO } from '../../data/business';
import { activeCities } from '../../data/cities';
import { homeFaq } from '../../data/faq';
import { HOME } from '../../data/home';
import { PROCESS } from '../../data/process';
import { STANDARDS } from '../../data/standards';
import { STATS, TRUST_BADGES, visibleStats } from '../../data/stats';
import { UI_TEXT } from '../../i18n';
import { AccordionItem } from '../../shared/ui/accordion/accordion-item';
import { Accordion } from '../../shared/ui/accordion/accordion';
import { Badge } from '../../shared/ui/badge/badge';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { Photo } from '../../shared/ui/photo/photo';
import { ALBANIA_MAP_SIZE } from '../../shared/ui/map-albania/albania-map-size.generated';
import { MapAlbania } from '../../shared/ui/map-albania/map-albania';
import { Section } from '../../shared/ui/section/section';
import { ServiceGrid } from '../services/service-grid';

@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink,
    TrackPhone,
    Accordion,
    AccordionItem,
    Badge,
    Button,
    Icon,
    MapAlbania,
    Photo,
    Section,
    ServiceGrid,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  protected readonly home = HOME;
  protected readonly t = UI_TEXT.contact;
  protected readonly flow = inject(WhatsAppFlow);
  protected readonly showTodo = isDevMode();

  protected readonly phoneHref = BUSINESS.phone ? telHref(BUSINESS.phone) : null;
  protected readonly heroPhoto = HERO_PHOTO;
  protected readonly badges = TRUST_BADGES;
  /** Në development shfaqen edhe shifrat që mungojnë (si TODO), në prodhim vetëm ato me vlerë. */
  protected readonly stats = isDevMode() ? STATS : visibleStats();
  protected readonly cities = activeCities();
  protected readonly mapRatio = `${ALBANIA_MAP_SIZE.width} / ${ALBANIA_MAP_SIZE.height}`;
  protected readonly standards = STANDARDS.filter((s) => s.featured);
  protected readonly process = PROCESS;
  protected readonly brands = BRANDS;
  protected readonly faq = homeFaq();

  protected openWhatsApp(source: WhatsAppSource): void {
    this.flow.open({ source });
  }
}
