import { TestBed } from '@angular/core/testing';
import { WhatsAppFlow } from '../../core/contact/whatsapp-flow.service';
import { BtuCalculator } from './btu-calculator';

describe('BtuCalculator', () => {
  async function render() {
    const fixture = TestBed.createComponent(BtuCalculator);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const size = () => el.querySelector('.result__size')?.textContent?.replace(/\s+/g, ' ').trim();
    const type = async (id: string, value: string) => {
      const input = el.querySelector<HTMLInputElement>(`#${id}`);
      if (!input) throw new Error(`mungon #${id}`);
      input.value = value;
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };
    const choose = async (name: string, value: string) => {
      const radio = el.querySelector<HTMLInputElement>(`input[name="${name}"][value="${value}"]`);
      radio?.click();
      await fixture.whenStable();
    };
    return { fixture, el, size, type, choose };
  }

  it('llogarit live pa buton', async () => {
    const { size, type } = await render();
    expect(size()).toBe('9000 BTU'); // 20 m² → 6800
    await type('btu-area', '30'); // 10200
    expect(size()).toBe('12000 BTU');
  });

  it('kati i fundit dhe dielli e rrisin rezultatin dhe shfaqen te faktorët', async () => {
    const { el, size, type, choose } = await render();
    await type('btu-area', '30');
    await choose('btu-floor', 'fundit');
    await choose('btu-sun', 'shume'); // 30 × 340 × 1.15 × 1.15 = 13490
    expect(size()).toBe('18000 BTU');
    expect(el.querySelector('.result__factors')?.textContent).toContain('Kati i fundit nën çati');
  });

  it('mbi 24000 BTU rekomandon inspektim, jo aparat të vetëm', async () => {
    const { el, size, type } = await render();
    await type('btu-area', '90');
    expect(size()).toBe('Mbi 24000 BTU');
    expect(el.querySelector('.result__over')?.textContent).toContain('multi-split');
  });

  it('rezultati është në aria-live', async () => {
    const { el } = await render();
    expect(el.querySelector('.result__size')?.closest('[aria-live="polite"]')).toBeTruthy();
  });

  it('"Kërko çmimin" hap WhatsApp me përmbledhjen në shënime', async () => {
    const { el, type, choose } = await render();
    await type('btu-area', '28');
    await choose('btu-floor', 'fundit');
    el.querySelector<HTMLButtonElement>('.result__cta')?.click();
    expect(TestBed.inject(WhatsAppFlow).request()).toEqual({
      source: 'kalkulatori',
      service: 'konsulence-dhe-zgjedhja-e-sistemit',
      notes: 'Kalkulatori: 28 m², dhomë gjumi, kati i fundit → 12000 BTU',
    });
  });
});
