import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'link' | 'outline-light';
export type ButtonSize = 'md' | 'lg';

/**
 * Buton i përbashkët, vendoset mbi elementin nativ që routerLink, href dhe type të punojnë:
 * `<a ui-button variant="primary" href="tel:...">` ose `<button ui-button>`.
 */
@Component({
  selector: 'a[ui-button], button[ui-button]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'ui-button',
    '[class]': '"ui-button--" + variant() + " ui-button--" + size()',
  },
  styleUrl: './button.scss',
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
}
