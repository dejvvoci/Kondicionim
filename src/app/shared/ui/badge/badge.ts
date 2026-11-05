import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';
import type { IconName } from '../icon/icons';

/** Badge besueshmërie: kapsulë jo e klikueshme me ikonë teal, p.sh. "Garanci 2 vjet". */
@Component({
  selector: 'ui-badge',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (icon(); as name) {
      <ui-icon [name]="name" [size]="18" />
    }
    <span><ng-content /></span>
  `,
  host: { '[class.ui-badge--soft]': 'tone() === "soft"' },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--sp-2);
      padding: 0.375rem 0.875rem 0.375rem 0.625rem;
      border: 1px solid var(--c-border);
      border-radius: var(--radius-badge);
      background: var(--c-white);
      color: var(--c-base);
      font-size: var(--fs-sm);
      font-weight: 600;
      line-height: 1.3;
      cursor: default;
    }
    :host(.ui-badge--soft) {
      background: var(--c-bg-soft);
    }
    ui-icon {
      color: var(--c-teal);
    }
  `,
})
export class Badge {
  readonly icon = input<IconName>();
  readonly tone = input<'white' | 'soft'>('white');
}
