import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  isDevMode,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrackPhone } from '../../core/analytics/track-phone.directive';
import { telHref } from '../../core/contact/phone';
import { WhatsAppFlow } from '../../core/contact/whatsapp-flow.service';
import { ARTICLES } from '../../data/articles.generated';
import { BUSINESS } from '../../data/business';
import { formatPrice, pricesFor } from '../../data/prices';
import { projectsForService } from '../../data/projects';
import { SERVICES, serviceBySlug } from '../../data/services';
import { UI_TEXT } from '../../i18n';
import { AccordionItem } from '../../shared/ui/accordion/accordion-item';
import { Accordion } from '../../shared/ui/accordion/accordion';
import { Breadcrumbs, type Crumb } from '../../shared/ui/breadcrumbs/breadcrumbs';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { Photo } from '../../shared/ui/photo/photo';
import { Section } from '../../shared/ui/section/section';
import { NotFoundPage } from '../not-found/not-found-page';
import { ProjectCard } from '../projects/project-card';
import { ServiceGrid } from './service-grid';

/** /sherbimet/:slug: një template i vetëm, i ushqyer nga services.ts. */
@Component({
  selector: 'app-service-page',
  imports: [
    RouterLink,
    TrackPhone,
    Accordion,
    AccordionItem,
    Breadcrumbs,
    Button,
    Icon,
    Photo,
    Section,
    ServiceGrid,
    NotFoundPage,
    ProjectCard,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './service-page.html',
  styleUrl: './service-page.scss',
})
export class ServicePage {
  /** Nga parametri i rrugës (withComponentInputBinding). */
  readonly slug = input.required<string>();

  protected readonly t = UI_TEXT.services;
  protected readonly contact = UI_TEXT.contact;
  protected readonly flow = inject(WhatsAppFlow);
  protected readonly showTodo = isDevMode();
  protected readonly phoneHref = BUSINESS.phone ? telHref(BUSINESS.phone) : null;

  protected readonly service = computed(() => serviceBySlug(this.slug()));
  protected readonly prices = computed(() =>
    pricesFor(this.slug()).map((p) => ({ ...p, amount: formatPrice(p.from ?? 0, p.currency) })),
  );
  protected readonly projects = computed(() => projectsForService(this.slug()).slice(0, 3));
  /** Artikujt e këshillave që i referohen këtij shërbimi (lidhje në të dy drejtimet). */
  protected readonly articles = computed(() =>
    ARTICLES.filter((a) => a.services.includes(this.slug())).slice(0, 3),
  );
  protected readonly crumbs = computed<Crumb[]>(() => [
    { label: UI_TEXT.breadcrumbs.home, path: '/' },
    { label: UI_TEXT.breadcrumbs.services, path: '/sherbimet' },
    { label: this.service()?.title ?? '' },
  ]);
  /** Tre shërbimet që vijnë pas këtij në listë (lidhje të brendshme). */
  protected readonly others = computed(() => {
    const i = SERVICES.findIndex((s) => s.slug === this.slug());
    return [1, 2, 3].map((n) => SERVICES[(i + n) % SERVICES.length]);
  });

  protected openWhatsApp(): void {
    this.flow.open({ source: 'sherbimi', service: this.slug() });
  }
}
