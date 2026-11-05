import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UI_TEXT } from '../../i18n';

/** Faqe e përkohshme për rrugët që ndërtohen në fazat e ardhshme. H1 vjen nga `data.h1`. */
@Component({
  selector: 'app-placeholder-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container page">
      <h1>{{ h1() }}</h1>
      <p class="lead">{{ t.placeholder.wip }}</p>
    </section>
  `,
  styles: `
    .page {
      padding-block: var(--section-py);
      min-height: 50vh;
    }
  `,
})
export class PlaceholderPage {
  protected readonly t = UI_TEXT;
  readonly h1 = input.required<string>();
}
