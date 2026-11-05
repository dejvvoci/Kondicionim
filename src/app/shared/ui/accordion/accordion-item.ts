import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';

/**
 * Element akordeoni mbi <details>/<summary> nativ: i aksesueshëm me tastierë dhe lexues ekrani
 * pa JavaScript, dhe përmbajtja është në HTML-në e prerenderuar (SEO).
 * `group` = emri i përbashkët që vetëm një element të jetë i hapur njëherësh.
 */
@Component({
  selector: 'ui-accordion-item',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <details class="item" [attr.name]="group()" [open]="open()">
      <summary class="item__summary">
        <span class="item__title">{{ title() }}</span>
        <ui-icon class="item__chevron" name="chevron-down" [size]="20" />
      </summary>
      <div class="item__content"><ng-content /></div>
    </details>
  `,
  styleUrl: './accordion-item.scss',
})
export class AccordionItem {
  readonly title = input.required<string>();
  readonly group = input<string>();
  readonly open = input(false);
}
