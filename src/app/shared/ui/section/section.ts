import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { slugify } from '../../utils/slugify';

export type SectionTone = 'white' | 'soft' | 'base';

/**
 * Seksion faqeje me hapësirë vertikale, etiketë (eyebrow), titull H2 dhe hyrje opsionale.
 * `tone="base"` = sfond i errët me tekst të bardhë (p.sh. CTA finale).
 */
@Component({
  selector: 'ui-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="section"
      [attr.aria-labelledby]="title() ? headingId() : null"
      [attr.id]="anchor()"
    >
      <div class="container" [class.section--narrow]="narrow()">
        @if (eyebrow() || title() || lead()) {
          <header class="section__head" [class.section__head--center]="center()">
            @if (eyebrow()) {
              <span class="eyebrow">{{ eyebrow() }}</span>
            }
            @if (title()) {
              <h2 class="section__title" [id]="headingId()">{{ title() }}</h2>
            }
            @if (lead()) {
              <p class="lead section__lead">{{ lead() }}</p>
            }
          </header>
        }
        <ng-content />
      </div>
    </section>
  `,
  host: { '[class]': '"ui-section--" + tone()' },
  styleUrl: './section.scss',
})
export class Section {
  readonly eyebrow = input<string>();
  readonly title = input<string>();
  readonly lead = input<string>();
  readonly tone = input<SectionTone>('white');
  readonly center = input(false);
  readonly narrow = input(false);
  /** id për lidhje me #fragment. */
  readonly anchor = input<string>();

  /** I përcaktuar nga anchor/titulli (jo numërues), që server dhe browser të japin të njëjtin id. */
  protected readonly headingId = computed(
    () => `${this.anchor() ?? slugify(this.title() ?? '')}-titulli`,
  );
}
