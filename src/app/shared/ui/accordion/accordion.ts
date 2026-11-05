import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Mbështjellës për <ui-accordion-item>: vija e sipërme dhe hapësira. */
@Component({
  selector: 'ui-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styles: `
    :host {
      display: block;
      border-top: 1px solid var(--c-border);
    }
  `,
})
export class Accordion {}
