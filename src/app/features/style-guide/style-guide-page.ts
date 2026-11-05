import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { WhatsAppFlow } from '../../core/contact/whatsapp-flow.service';
import { AccordionItem } from '../../shared/ui/accordion/accordion-item';
import { Accordion } from '../../shared/ui/accordion/accordion';
import { Badge } from '../../shared/ui/badge/badge';
import { Button } from '../../shared/ui/button/button';
import { Card } from '../../shared/ui/card/card';
import { Section } from '../../shared/ui/section/section';
import { Sheet } from '../../shared/ui/sheet/sheet';

/** /stili: katalogu i komponentëve UI. Vetëm në development (shih app.routes.ts). */
@Component({
  selector: 'app-style-guide-page',
  imports: [Section, Button, Badge, Card, Accordion, AccordionItem, Sheet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './style-guide-page.html',
  styleUrl: './style-guide-page.scss',
})
export class StyleGuidePage {
  protected readonly flow = inject(WhatsAppFlow);
  protected readonly sheetOpen = signal(false);

  protected readonly colors = [
    'base',
    'teal',
    'teal-text',
    'bg-soft',
    'border',
    'cta',
    'cta-hover',
    'text',
    'text-muted',
    'whatsapp',
  ];
}
