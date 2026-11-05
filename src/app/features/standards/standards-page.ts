import { ChangeDetectionStrategy, Component, inject, isDevMode } from '@angular/core';
import { WhatsAppFlow } from '../../core/contact/whatsapp-flow.service';
import { STANDARDS, STANDARDS_PAGE, TOOLS_PHOTO } from '../../data/standards';
import { UI_TEXT } from '../../i18n';
import { Breadcrumbs, type Crumb } from '../../shared/ui/breadcrumbs/breadcrumbs';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon';
import { Photo } from '../../shared/ui/photo/photo';
import { Section } from '../../shared/ui/section/section';

/** /standardet-e-montimit: 8 standardet, secili me shpjegim dhe foto. */
@Component({
  selector: 'app-standards-page',
  imports: [Breadcrumbs, Button, Icon, Photo, Section],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './standards-page.html',
  styleUrl: './standards-page.scss',
})
export class StandardsPage {
  protected readonly p = STANDARDS_PAGE;
  protected readonly standards = STANDARDS;
  protected readonly toolsPhoto = TOOLS_PHOTO;
  protected readonly contact = UI_TEXT.contact;
  protected readonly cta = UI_TEXT.services;
  protected readonly flow = inject(WhatsAppFlow);
  protected readonly showTodo = isDevMode();
  protected readonly crumbs: Crumb[] = [
    { label: UI_TEXT.breadcrumbs.home, path: '/' },
    { label: STANDARDS_PAGE.eyebrow },
  ];

  protected openWhatsApp(): void {
    this.flow.open({ source: 'cta' });
  }
}
