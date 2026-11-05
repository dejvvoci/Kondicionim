import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WhatsAppFlow } from '../../core/contact/whatsapp-flow.service';
import { CITIES } from '../../data/cities';
import { SYSTEM_LABELS, projectBySlug, sortedProjects } from '../../data/projects';
import { SERVICES } from '../../data/services';
import { UI_TEXT } from '../../i18n';
import { BeforeAfter } from '../../shared/ui/before-after/before-after';
import { Breadcrumbs, type Crumb } from '../../shared/ui/breadcrumbs/breadcrumbs';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { Photo } from '../../shared/ui/photo/photo';
import { Section } from '../../shared/ui/section/section';
import { VideoFacade } from '../../shared/ui/video-facade/video-facade';
import { NotFoundPage } from '../not-found/not-found-page';
import { ProjectCard } from './project-card';

/** /projektet/:slug: rasti studimor i një projekti. */
@Component({
  selector: 'app-project-page',
  imports: [
    RouterLink,
    BeforeAfter,
    Breadcrumbs,
    Button,
    Icon,
    Photo,
    Section,
    VideoFacade,
    NotFoundPage,
    ProjectCard,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-page.html',
  styleUrl: './project-page.scss',
})
export class ProjectPage {
  readonly slug = input.required<string>();

  protected readonly t = UI_TEXT.projects;
  protected readonly contact = UI_TEXT.contact;
  protected readonly flow = inject(WhatsAppFlow);

  protected readonly project = computed(() => projectBySlug(this.slug()));
  protected readonly cityName = computed(() => {
    const p = this.project();
    return CITIES.find((c) => c.slug === p?.city)?.name ?? p?.city ?? '';
  });
  protected readonly system = computed(() => {
    const p = this.project();
    return p ? SYSTEM_LABELS[p.system] : '';
  });
  protected readonly paragraphs = computed(
    () =>
      this.project()
        ?.story.split(/\n\s*\n/)
        .filter((s) => s.trim()) ?? [],
  );
  protected readonly services = computed(() =>
    SERVICES.filter((s) => this.project()?.services.includes(s.slug)),
  );
  /** Projekte me të njëjtin sistem ose qytet, maksimum 3. */
  protected readonly related = computed(() => {
    const p = this.project();
    if (!p) return [];
    return sortedProjects()
      .filter((o) => o.slug !== p.slug && (o.system === p.system || o.city === p.city))
      .slice(0, 3);
  });
  protected readonly crumbs = computed<Crumb[]>(() => [
    { label: UI_TEXT.breadcrumbs.home, path: '/' },
    { label: UI_TEXT.breadcrumbs.projects, path: '/projektet' },
    { label: this.project()?.title ?? '' },
  ]);

  protected openWhatsApp(): void {
    this.flow.open({ source: 'cta', service: this.project()?.services[0] });
  }
}
