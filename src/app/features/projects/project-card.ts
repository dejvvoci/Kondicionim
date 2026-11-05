import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CITIES } from '../../data/cities';
import { SYSTEM_LABELS } from '../../data/projects';
import type { Project } from '../../data/types';
import { UI_TEXT } from '../../i18n';
import { BeforeAfter } from '../../shared/ui/before-after/before-after';

/** Kartë projekti: slider para/pas, qyteti, sistemi, BTU, kohëzgjatja dhe përshkrimi. */
@Component({
  selector: 'app-project-card',
  imports: [RouterLink, BeforeAfter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let p = project();
    <article class="card">
      <ui-before-after
        [before]="p.before"
        [after]="p.after"
        [label]="p.title"
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
      />
      <div class="card__body">
        <h3 class="card__title">
          <a [routerLink]="'/projektet/' + p.slug">{{ p.title }}</a>
        </h3>
        <ul class="meta">
          <li>{{ cityName() }}</li>
          <li>{{ system() }}</li>
          @if (p.btu) {
            <li>{{ p.btu }} BTU</li>
          }
          @if (p.duration) {
            <li>{{ p.duration }}</li>
          }
        </ul>
        <p class="card__summary">{{ p.summary }}</p>
      </div>
    </article>
  `,
  styleUrl: './project-card.scss',
})
export class ProjectCard {
  readonly project = input.required<Project>();

  protected readonly t = UI_TEXT.projects;
  protected readonly cityName = computed(
    () => CITIES.find((c) => c.slug === this.project().city)?.name ?? this.project().city,
  );
  protected readonly system = computed(() => SYSTEM_LABELS[this.project().system]);
}
