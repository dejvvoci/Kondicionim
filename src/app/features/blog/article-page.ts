import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WhatsAppFlow } from '../../core/contact/whatsapp-flow.service';
import { ARTICLES } from '../../data/articles.generated';
import { businessName } from '../../data/business';
import { SERVICES } from '../../data/services';
import { UI_TEXT } from '../../i18n';
import { Breadcrumbs, type Crumb } from '../../shared/ui/breadcrumbs/breadcrumbs';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { Section } from '../../shared/ui/section/section';
import { NotFoundPage } from '../not-found/not-found-page';
import { formatDate } from './article-date';

/** /keshilla/:slug: artikulli, me datën, autorin, kohën e leximit dhe CTA WhatsApp në fund. */
@Component({
  selector: 'app-article-page',
  imports: [RouterLink, Breadcrumbs, Button, Icon, Section, NotFoundPage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './article-page.html',
  styleUrl: './article-page.scss',
})
export class ArticlePage {
  readonly slug = input.required<string>();

  protected readonly t = UI_TEXT.blog;
  protected readonly contact = UI_TEXT.contact;
  protected readonly flow = inject(WhatsAppFlow);
  protected readonly author = businessName();

  protected readonly article = computed(() => ARTICLES.find((a) => a.slug === this.slug()));
  protected readonly date = computed(() => formatDate(this.article()?.date ?? ''));
  protected readonly services = computed(() =>
    SERVICES.filter((s) => this.article()?.services.includes(s.slug)),
  );
  protected readonly others = computed(() =>
    ARTICLES.filter((a) => a.slug !== this.slug()).slice(0, 3),
  );
  protected readonly crumbs = computed<Crumb[]>(() => [
    { label: UI_TEXT.breadcrumbs.home, path: '/' },
    { label: UI_TEXT.breadcrumbs.blog, path: '/keshilla' },
    { label: this.article()?.title ?? '' },
  ]);

  protected openWhatsApp(): void {
    this.flow.open({ source: 'cta', service: this.article()?.services[0] });
  }
}
