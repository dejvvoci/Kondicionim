import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SERVICES } from '../../data/services';
import type { Service } from '../../data/types';
import { Card } from '../../shared/ui/card/card';

/** Grid me kartat e shërbimeve, secila me link te faqja e vet. */
@Component({
  selector: 'app-service-grid',
  imports: [Card],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="grid">
      @for (s of services(); track s.slug) {
        <li>
          <ui-card
            [title]="s.title"
            [icon]="s.icon"
            [link]="'/sherbimet/' + s.slug"
            [level]="headingLevel()"
          >
            <p>{{ s.short }}</p>
          </ui-card>
        </li>
      }
    </ul>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
      gap: var(--sp-4);
      margin: 0;
      padding: 0;
      list-style: none;
    }
  `,
})
export class ServiceGrid {
  readonly services = input<Service[]>(SERVICES);
  /** 3 brenda një seksioni me titull (h2); 2 kur grid-i vjen direkt pas h1 (/sherbimet). */
  readonly headingLevel = input<2 | 3>(3);
}
