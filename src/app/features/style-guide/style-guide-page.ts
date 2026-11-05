import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { WhatsAppFlow } from '../../core/contact/whatsapp-flow.service';
import { AccordionItem } from '../../shared/ui/accordion/accordion-item';
import { Accordion } from '../../shared/ui/accordion/accordion';
import { Badge } from '../../shared/ui/badge/badge';
import { BeforeAfter } from '../../shared/ui/before-after/before-after';
import { Button } from '../../shared/ui/button/button';
import { Card } from '../../shared/ui/card/card';
import { Section } from '../../shared/ui/section/section';
import { Sheet } from '../../shared/ui/sheet/sheet';

/** /stili: katalogu i komponentëve UI. Vetëm në development (shih app.routes.ts). */
@Component({
  selector: 'app-style-guide-page',
  imports: [Section, Button, Badge, BeforeAfter, Card, Accordion, AccordionItem, Sheet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './style-guide-page.html',
  styleUrl: './style-guide-page.scss',
})
export class StyleGuidePage {
  protected readonly flow = inject(WhatsAppFlow);
  protected readonly sheetOpen = signal(false);
  protected readonly demoBefore = {
    src: '/images/demo/para.svg',
    alt: 'Demo para',
    width: 1200,
    height: 900,
  };
  protected readonly demoAfter = {
    src: '/images/demo/pas.svg',
    alt: 'Demo pas',
    width: 1200,
    height: 900,
  };

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
