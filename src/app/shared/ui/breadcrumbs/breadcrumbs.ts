import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UI_TEXT } from '../../../i18n';

export interface Crumb {
  label: string;
  /** Mungon te elementi i fundit (faqja aktuale). */
  path?: string;
}

/** Shtegu i navigimit për faqet e brendshme. JSON-LD BreadcrumbList shtohet nga SEO. */
@Component({
  selector: 'ui-breadcrumbs',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav [attr.aria-label]="t.label">
      <ol class="crumbs">
        @for (c of items(); track c.label; let last = $last) {
          <li>
            @if (c.path && !last) {
              <a [routerLink]="c.path">{{ c.label }}</a>
            } @else {
              <span aria-current="page">{{ c.label }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: `
    .crumbs {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: var(--fs-sm);
      color: var(--c-text-muted);
    }
    li + li::before {
      content: '/';
      margin-inline: var(--sp-2);
      color: var(--c-text-muted);
    }
    a {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      color: var(--c-teal-text);
    }
  `,
})
export class Breadcrumbs {
  protected readonly t = UI_TEXT.breadcrumbs;
  readonly items = input.required<Crumb[]>();
}
