import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  isDevMode,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { WhatsAppFlow } from '../../core/contact/whatsapp-flow.service';
import { CITIES } from '../../data/cities';
import { SYSTEM_LABELS, filterProjects, sortedProjects } from '../../data/projects';
import type { SystemKind } from '../../data/types';
import { UI_TEXT } from '../../i18n';
import { Breadcrumbs, type Crumb } from '../../shared/ui/breadcrumbs/breadcrumbs';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { Section } from '../../shared/ui/section/section';
import { ProjectCard } from './project-card';

interface FilterOption {
  value: string | null;
  label: string;
}

/** /projektet?lloji=&qyteti=: galeria me filtra sipas sistemit dhe qytetit. */
@Component({
  selector: 'app-projects-page',
  imports: [RouterLink, Breadcrumbs, Button, Icon, Section, ProjectCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss',
})
export class ProjectsPage {
  /** Query params (withComponentInputBinding). */
  readonly qyteti = input<string>();
  readonly lloji = input<string>();

  protected readonly t = UI_TEXT.projects;
  protected readonly contact = UI_TEXT.contact;
  protected readonly flow = inject(WhatsAppFlow);
  protected readonly showTodo = isDevMode();
  protected readonly crumbs: Crumb[] = [
    { label: UI_TEXT.breadcrumbs.home, path: '/' },
    { label: UI_TEXT.breadcrumbs.projects },
  ];

  private readonly all = sortedProjects();

  /** Vetëm opsionet që kanë të paktën një projekt (asnjë filtër bosh). */
  protected readonly systemOptions: FilterOption[] = [
    { value: null, label: this.t.all },
    ...(Object.keys(SYSTEM_LABELS) as SystemKind[])
      .filter((k) => this.all.some((p) => p.system === k))
      .map((k) => ({ value: k, label: SYSTEM_LABELS[k] })),
  ];
  protected readonly cityOptions: FilterOption[] = [
    { value: null, label: this.t.all },
    ...CITIES.filter((c) => this.all.some((p) => p.city === c.slug)).map((c) => ({
      value: c.slug,
      label: c.name,
    })),
  ];

  protected readonly projects = computed(() =>
    filterProjects(this.all, { city: this.qyteti(), system: this.lloji() }),
  );
  protected readonly hasProjects = this.all.length > 0;
  protected readonly hasExamples = this.all.some((p) => p.example);

  protected openWhatsApp(): void {
    this.flow.open({ source: 'cta' });
  }
}
