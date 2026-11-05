import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UI_TEXT } from '../../i18n';
import { Button } from '../../shared/ui/button/button';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container page">
      <span class="eyebrow">404</span>
      <h1>{{ t.notFound.title }}</h1>
      <p class="lead">{{ t.notFound.text }}</p>
      <div class="actions">
        <a ui-button variant="primary" routerLink="/sherbimet">{{ t.notFound.services }}</a>
        <a ui-button variant="outline" routerLink="/">{{ t.notFound.home }}</a>
      </div>
    </section>
  `,
  styles: `
    .page {
      padding-block: var(--section-py);
      min-height: 50vh;
      max-width: 720px;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sp-3);
    }
  `,
})
export class NotFoundPage {
  protected readonly t = UI_TEXT;
}
