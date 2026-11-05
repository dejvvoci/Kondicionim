import { TestBed } from '@angular/core/testing';
import { WhatsAppFlow } from '../../contact/whatsapp-flow.service';
import { MobileContactBar } from './mobile-contact-bar';

describe('MobileContactBar', () => {
  it('WhatsApp hap rrjedhën nga shiriti, Ofertë me shërbimin "oferte"', async () => {
    const fixture = TestBed.createComponent(MobileContactBar);
    await fixture.whenStable();
    const flow = TestBed.inject(WhatsAppFlow);
    const el = fixture.nativeElement as HTMLElement;

    (el.querySelector('.bar__btn--whatsapp') as HTMLButtonElement).click();
    expect(flow.request()).toEqual({ source: 'shiriti' });

    (el.querySelector('.bar__btn--offer') as HTMLButtonElement).click();
    expect(flow.request()).toEqual({ source: 'shiriti', service: 'oferte' });
  });

  it('butonat kanë tekst të dukshëm', async () => {
    const fixture = TestBed.createComponent(MobileContactBar);
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('WhatsApp');
    expect(text).toContain('Ofertë');
  });
});
