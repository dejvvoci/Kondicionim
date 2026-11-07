import { TestBed } from '@angular/core/testing';
import { WhatsAppFlow } from '../../core/contact/whatsapp-flow.service';
import { BtuCalculator } from './btu-calculator';

describe('BtuCalculator', () => {
  async function render() {
    const fixture = TestBed.createComponent(BtuCalculator);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const size = () => el.querySelector('.result__size')?.textContent?.replace(/\s+/g, ' ').trim();
    const active = () => el.querySelector('.seasons__row.is-active dt')?.textContent?.trim();
    const type = async (id: string, value: string) => {
      const input = el.querySelector<HTMLInputElement>(`#${id}`);
      if (!input) throw new Error(`mungon #${id}`);
      input.value = value;
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };
    const choose = async (name: string, value: string) => {
      const radio = el.querySelector<HTMLInputElement>(`input[name="${name}"][value="${value}"]`);
      if (!radio) throw new Error(`mungon ${name}=${value}`);
      radio.click();
      await fixture.whenStable();
    };
    const select = async (id: string, value: string) => {
      const input = el.querySelector<HTMLSelectElement>(`#${id}`);
      if (!input) throw new Error(`mungon #${id}`);
      input.value = value;
      input.dispatchEvent(new Event('change'));
      await fixture.whenStable();
    };
    return { fixture, el, size, active, type, choose, select };
  }

  it('ka vetëm pesë pyetjet: qyteti, sipërfaqja dhe lartësia, muret, izolimi, kati', async () => {
    const { el } = await render();
    const labels = [...el.querySelectorAll('.field__label')].map((l) => l.textContent?.trim());
    expect(labels).toEqual([
      'Qyteti',
      'Sipërfaqja (m²)',
      'Lartësia e tavanit (m)',
      'Sa mure të jashtme ka ambienti',
      'Izolimi',
      'Kati',
    ]);
  });

  it('llogarit live pa buton', async () => {
    const { size, type } = await render();
    expect(size()).toBe('9000 BTU'); // Tiranë, 20 m²: verë ~5400
    await type('btu-area', '40'); // verë ~9400
    expect(size()).toBe('12000 BTU');
  });

  it('tregon verën dhe dimrin veçmas dhe theksohet sezoni që e përcakton madhësinë', async () => {
    const { el, active, choose, select } = await render();
    expect(el.querySelectorAll('.seasons__row')).toHaveLength(2);
    expect(active()).toBe('Vera (ftohje)');

    // Korçë, qoshe me 3 mure, pa izolim, kati i fundit: dimri ~14 100, vera ~8700.
    await select('btu-city', 'korce');
    await choose('btu-walls', '3');
    await choose('btu-insulation', 'dobet');
    await choose('btu-floor', 'fundit');
    expect(active()).toBe('Dimri (ngrohje)');
    expect(el.textContent).toContain('e përcakton dimri');
    expect(el.querySelector('.result__factors')?.textContent).toContain('−7,2');
  });

  it('shënimi për të ftohtin shfaqet vetëm për qytetet me dimër të ftohtë', async () => {
    const { el, select } = await render();
    const note = 'ruan fuqinë e ngrohjes';
    expect(el.textContent).not.toContain(note);
    await select('btu-city', 'korce');
    expect(el.textContent).toContain(note);
  });

  it('mbi 24000 BTU rekomandon inspektim, jo aparat të vetëm', async () => {
    const { el, size, type, choose } = await render();
    await type('btu-area', '120');
    await choose('btu-walls', '3');
    expect(size()).toBe('Mbi 24000 BTU');
    expect(el.querySelector('.result__over')?.textContent).toContain('multi-split');
  });

  it('rezultati është në aria-live', async () => {
    const { el } = await render();
    expect(el.querySelector('.result__size')?.closest('[aria-live="polite"]')).toBeTruthy();
  });

  it('"Kërko çmimin" hap WhatsApp me përmbledhjen në shënime', async () => {
    const { el, type, choose, select } = await render();
    await select('btu-city', 'korce');
    await type('btu-area', '28');
    await choose('btu-floor', 'fundit');
    el.querySelector<HTMLButtonElement>('.result__cta')?.click();
    expect(TestBed.inject(WhatsAppFlow).request()).toEqual({
      source: 'kalkulatori',
      service: 'konsulence-dhe-zgjedhja-e-sistemit',
      notes:
        'Kalkulatori: Korçë, 28 m², 1 mur i jashtëm, izolim mesatar, kati i fundit → 9000 BTU (sipas verës)',
    });
  });
});
