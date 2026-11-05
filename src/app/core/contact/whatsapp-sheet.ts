import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BUSINESS } from '../../data/business';
import { UI_TEXT } from '../../i18n';
import { Button } from '../../shared/ui/button/button';
import { Sheet } from '../../shared/ui/sheet/sheet';
import { WhatsAppFlow } from './whatsapp-flow.service';

/** Sheet-i i rrjedhës WhatsApp, një i vetëm për gjithë aplikacionin. */
@Component({
  selector: 'app-whatsapp-sheet',
  imports: [Sheet, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-sheet
      [title]="t.contact.sheetTitle"
      [open]="flow.isOpen()"
      (openChange)="onOpenChange($event)"
    >
      <!-- TODO (faza 3): forma me shërbimin, qytetin, adresën, vendndodhjen dhe shënimet. -->
      <p>{{ t.contact.sheetPending }}</p>
      @if (whatsappHref) {
        <a ui-button variant="primary" [href]="whatsappHref" target="_blank" rel="noopener">
          {{ t.contact.openWhatsapp }}
        </a>
      }
    </ui-sheet>
  `,
})
export class WhatsAppSheet {
  protected readonly t = UI_TEXT;
  protected readonly flow = inject(WhatsAppFlow);
  protected readonly whatsappHref = BUSINESS.whatsapp ? `https://wa.me/${BUSINESS.whatsapp}` : null;

  protected onOpenChange(open: boolean): void {
    if (!open) this.flow.close();
  }
}
