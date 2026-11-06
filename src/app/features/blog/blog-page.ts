import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ARTICLES } from '../../data/articles.generated';
import { UI_TEXT } from '../../i18n';
import { Breadcrumbs, type Crumb } from '../../shared/ui/breadcrumbs/breadcrumbs';
import { Section } from '../../shared/ui/section/section';
import { formatDate } from './article-date';

/** /keshilla: lista e artikujve, më të rinjtë të parët. */
@Component({
  selector: 'app-blog-page',
  imports: [RouterLink, Breadcrumbs, Section],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div class="container">
        <ui-breadcrumbs [items]="crumbs" />
        <span class="eyebrow">{{ t.eyebrow }}</span>
        <h1>{{ t.title }}</h1>
        <p class="lead">{{ t.lead }}</p>
      </div>
    </header>
    <!-- Pjesa poshtë kokës hidratohet në ndërveprimin e parë. -->
    @defer (on immediate; hydrate on interaction) {
      <ui-section tone="soft">
        <ul class="articles">
          @for (a of articles; track a.slug) {
            <li class="article">
              <p class="article__meta">
                <time [attr.datetime]="a.date">{{ date(a.date) }}</time> · {{ a.readingMinutes }}
                {{ t.minutes }}
              </p>
              <h2 class="article__title">
                <a [routerLink]="'/keshilla/' + a.slug">{{ a.title }}</a>
              </h2>
              <p class="article__desc">{{ a.description }}</p>
            </li>
          }
        </ul>
      </ui-section>
    }
  `,
  styles: `
    .articles {
      display: grid;
      gap: var(--sp-4);
      margin: 0;
      padding: 0;
      list-style: none;
    }
    @media (min-width: 768px) {
      .articles {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .article {
      position: relative;
      padding: var(--sp-5);
      border: 1px solid var(--c-border);
      border-radius: var(--radius-card);
      background: var(--c-white);
    }
    .article:hover {
      border-color: var(--c-teal);
    }
    .article:focus-within {
      outline: 3px solid var(--c-focus);
      outline-offset: 2px;
    }
    .article__meta {
      margin-bottom: var(--sp-2);
      font-size: var(--fs-sm);
      color: var(--c-text-muted);
    }
    .article__title {
      margin-bottom: var(--sp-2);
      font-size: var(--fs-h3);
    }
    .article__title a {
      color: var(--c-base);
      text-decoration: none;
    }
    /* E gjithë karta është zona e klikimit. */
    .article__title a::after {
      content: '';
      position: absolute;
      inset: 0;
    }
    .article__title a:focus-visible {
      outline: none;
    }
    .article__desc {
      margin: 0;
      color: var(--c-text-muted);
    }
  `,
})
export class BlogPage {
  protected readonly t = UI_TEXT.blog;
  protected readonly articles = ARTICLES;
  protected readonly date = formatDate;
  protected readonly crumbs: Crumb[] = [
    { label: UI_TEXT.breadcrumbs.home, path: '/' },
    { label: UI_TEXT.breadcrumbs.blog },
  ];
}
