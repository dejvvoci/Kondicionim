import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AccordionItem } from './accordion-item';

@Component({
  imports: [AccordionItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-accordion-item title="Pse pikon kondicioneri?" group="faq">
      <p>Përgjigja</p>
    </ui-accordion-item>
  `,
})
class Host {}

describe('AccordionItem', () => {
  it('përdor details/summary me përmbajtjen në DOM', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const details = el.querySelector('details') as HTMLDetailsElement;

    expect(details.getAttribute('name')).toBe('faq');
    expect(details.open).toBe(false);
    expect(el.querySelector('summary')?.textContent).toContain('Pse pikon kondicioneri?');
    expect(el.querySelector('.item__content p')?.textContent).toBe('Përgjigja');
  });
});
