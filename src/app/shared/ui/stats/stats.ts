import { ChangeDetectionStrategy, Component, isDevMode } from '@angular/core';
import { STATS, visibleStats } from '../../../data/stats';

/**
 * Shifrat e besueshmërisë nga stats.ts. Në prodhim shfaqen vetëm ato me vlerë (dhe asgjë kur
 * mungojnë të gjitha); në development edhe ato që mungojnë, si TODO.
 */
@Component({
  selector: 'ui-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (stats.length) {
      <section class="stats" aria-label="Shifrat">
        <dl class="container stats__list">
          @for (s of stats; track s.label) {
            <div class="stats__item">
              <dt>{{ s.label }}</dt>
              <dd>
                @if (s.value) {
                  {{ s.value }}
                } @else {
                  <span class="todo">TODO</span>
                }
              </dd>
            </div>
          }
        </dl>
      </section>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .stats {
      border-bottom: 1px solid var(--c-border);
    }
    .stats__list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--sp-5) var(--sp-4);
      margin-block: 0;
      padding-block: var(--sp-6);
    }
    @media (min-width: 768px) {
      .stats__list {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    .stats__item {
      display: flex;
      flex-direction: column-reverse;
      gap: var(--sp-1);
    }
    dt {
      color: var(--c-text-muted);
    }
    dd {
      margin: 0;
      font-family: var(--font-heading);
      font-size: var(--fs-h2);
      font-weight: 600;
      line-height: 1.1;
      color: var(--c-base);
    }
  `,
})
export class Stats {
  protected readonly stats = isDevMode() ? STATS : visibleStats();
}
