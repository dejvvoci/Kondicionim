import { TestBed } from '@angular/core/testing';
import { BUSINESS } from '../../data/business';
import { WhatsAppFlow } from './whatsapp-flow.service';
import { WhatsAppSheet } from './whatsapp-sheet';

describe('WhatsAppSheet', () => {
  const original = BUSINESS.whatsapp;

  beforeEach(() => {
    BUSINESS.whatsapp = '355691234567';
    localStorage.clear();
  });
  afterEach(() => {
    BUSINESS.whatsapp = original;
  });

  async function open(request: Parameters<WhatsAppFlow['open']>[0]) {
    const fixture = TestBed.createComponent(WhatsAppSheet);
    const flow = TestBed.inject(WhatsAppFlow);
    flow.open(request);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const sendLink = () => el.querySelector<HTMLAnchorElement>('.actions__send');
    const message = () => decodeURIComponent(sendLink()?.href.split('text=')[1] ?? '');
    return { fixture, flow, el, sendLink, message };
  }

  function choose(el: HTMLElement, id: string, value: string): void {
    const field = el.querySelector<HTMLSelectElement | HTMLInputElement>(`#${id}`);
    if (!field) throw new Error(`mungon #${id}`);
    field.value = value;
    field.dispatchEvent(new Event(field instanceof HTMLSelectElement ? 'change' : 'input'));
  }

  it('parazgjedh shërbimin nga faqja dhe ndërton mesazhin', async () => {
    const { fixture, el, sendLink, message } = await open({
      source: 'sherbimi',
      service: 'montim-multi-split',
    });
    choose(el, 'wa-city', 'durres');
    choose(el, 'wa-address', 'Plazh, Rruga Taulantia');
    await fixture.whenStable();

    expect(sendLink()?.href).toMatch(/^https:\/\/wa\.me\/355691234567\?text=/);
    expect(sendLink()?.target).toBe('_blank');
    expect(sendLink()?.rel).toContain('noopener');
    expect(message()).toBe(
      [
        'Përshëndetje! Ju kontaktoj nga faqja juaj për të marrë një ofertë ose një vlerësim.',
        'Shërbimi: Montim multi-split',
        'Qyteti: Durrës',
        'Zona/adresa: Plazh, Rruga Taulantia',
      ].join('\n'),
    );
  });

  it('"Ofertë" nga shiriti dhe shënimet e parambushura', async () => {
    const { message } = await open({
      source: 'kalkulatori',
      service: 'oferte',
      notes: 'Kalkulatori: 28 m², kati i fundit → 12000 BTU',
    });
    expect(message()).toContain('Shërbimi: Ofertë / vlerësim');
    expect(message()).toContain('Shënime: Kalkulatori: 28 m², kati i fundit → 12000 BTU');
  });

  it('"Tjetër qytet" përdor emrin e shkruar', async () => {
    const { fixture, el, message } = await open({ source: 'hero' });
    choose(el, 'wa-city', 'tjeter');
    await fixture.whenStable();
    choose(el, 'wa-city-other', 'Fier');
    await fixture.whenStable();
    expect(message()).toContain('Qyteti: Fier');
  });

  it('ruan qytetin dhe e parazgjedh herën tjetër, pa të dhëna personale', async () => {
    const first = await open({ source: 'hero' });
    choose(first.el, 'wa-city', 'shkoder');
    choose(first.el, 'wa-address', 'Rruga ime 1');
    await first.fixture.whenStable();
    first.sendLink()?.addEventListener('click', (e) => e.preventDefault());
    first.sendLink()?.click();

    const stored = localStorage.getItem('kondicionim.contact') ?? '';
    expect(JSON.parse(stored)).toEqual({ service: '', city: 'shkoder' });
    expect(stored).not.toContain('Rruga');

    first.flow.open({ source: 'shiriti' });
    await first.fixture.whenStable();
    expect(first.message()).toContain('Qyteti: Shkodër');
    expect(first.message()).not.toContain('Rruga');
  });

  it('ka edhe linkun "Hap WhatsApp pa plotësuar"', async () => {
    const { el } = await open({ source: 'hero' });
    const skip = el.querySelector<HTMLAnchorElement>('.actions__skip');
    expect(skip?.textContent).toContain('Hap WhatsApp pa plotësuar');
    expect(skip?.href).toMatch(/^https:\/\/wa\.me\/355691234567\?text=P%C3%ABrsh/);
  });
});
