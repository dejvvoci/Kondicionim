import { ChangeDetectionStrategy, Component, isDevMode } from '@angular/core';
import { formatPhone, telHref } from '../../core/contact/phone';
import { businessName } from '../../data/business';
import { PRIVACY } from '../../data/privacy';
import { UI_TEXT } from '../../i18n';
import { Breadcrumbs, type Crumb } from '../../shared/ui/breadcrumbs/breadcrumbs';

/** /privatesia: teksti nga data/privacy.ts, që pronari ta rishikojë pa prekur kodin. */
@Component({
  selector: 'app-privacy-page',
  imports: [Breadcrumbs],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div class="container">
        <ui-breadcrumbs [items]="crumbs" />
        <h1>{{ p.title }}</h1>
        <p class="lead">{{ p.intro }}</p>
        @if (p.updated) {
          <p class="updated">{{ updatedLabel }} {{ p.updated }}</p>
        }
      </div>
    </header>
    <!-- Pjesa poshtë kokës hidratohet në ndërveprimin e parë. -->
    @defer (on immediate; hydrate on interaction) {
      <div class="container prose">
        @for (s of p.sections; track s.title) {
          <section>
            <h2>{{ s.title }}</h2>
            @for (para of s.paragraphs; track $index) {
              <p>{{ para }}</p>
            }
          </section>
        }

        <section>
          <h2>{{ p.contactTitle }}</h2>
          <ul>
            <li>{{ name }}</li>
            @if (b.nipt) {
              <li>NIPT: {{ b.nipt }}</li>
            }
            @if (b.phone) {
              <li>
                <a [href]="tel(b.phone)">{{ format(b.phone) }}</a>
              </li>
            }
            @if (b.email) {
              <li>
                <a [href]="'mailto:' + b.email">{{ b.email }}</a>
              </li>
            }
          </ul>
          @if (showTodo && !b.phone && !b.email) {
            <p><span class="todo">TODO: kontakti (business.ts)</span></p>
          }
        </section>
      </div>
    }
  `,
  styles: `
    .prose {
      max-width: calc(760px + 2 * var(--gutter));
      padding-bottom: var(--section-py);
    }
    section + section {
      margin-top: var(--sp-6);
    }
    h2 {
      font-size: var(--fs-h3);
    }
    .updated {
      margin-top: var(--sp-3);
      font-size: var(--fs-sm);
      color: var(--c-text-muted);
    }
  `,
})
export class PrivacyPage {
  protected readonly p = PRIVACY;
  protected readonly b = PRIVACY.business;
  protected readonly name = businessName();
  protected readonly showTodo = isDevMode();
  protected readonly updatedLabel = 'Përditësuar më';
  protected readonly tel = telHref;
  protected readonly format = formatPhone;
  protected readonly crumbs: Crumb[] = [
    { label: UI_TEXT.breadcrumbs.home, path: '/' },
    { label: PRIVACY.title },
  ];
}
