import { WHATSAPP_TEMPLATE } from '../../data/business';
import { buildMessage, buildWhatsAppUrl, mapsUrl, normalizeWhatsAppNumber } from './whatsapp';

describe('buildMessage', () => {
  const full = {
    sherbimi: 'Montim multi-split',
    qyteti: 'Durrës',
    adresa: 'Rruga e Plazhit, pallati 5',
    lat: '41.31234',
    lng: '19.45678',
    shenime: 'Aparati pikon ujë',
  };

  it('plotëson të gjitha rreshtat', () => {
    expect(buildMessage(WHATSAPP_TEMPLATE, full)).toBe(
      [
        'Përshëndetje! Ju kontaktoj nga faqja juaj për të marrë një ofertë ose një vlerësim.',
        'Shërbimi: Montim multi-split',
        'Qyteti: Durrës',
        'Zona/adresa: Rruga e Plazhit, pallati 5',
        'Vendndodhja: https://maps.google.com/?q=41.31234,19.45678',
        'Shënime: Aparati pikon ujë',
      ].join('\n'),
    );
  });

  it('heq rreshtat bosh dhe mungesën e vendndodhjes', () => {
    const msg = buildMessage(WHATSAPP_TEMPLATE, {
      sherbimi: 'Riparim',
      qyteti: 'Tiranë',
      adresa: '   ',
      lat: null,
      lng: undefined,
      shenime: '',
    });
    expect(msg).toBe(
      [
        'Përshëndetje! Ju kontaktoj nga faqja juaj për të marrë një ofertë ose një vlerësim.',
        'Shërbimi: Riparim',
        'Qyteti: Tiranë',
      ].join('\n'),
    );
  });

  it('kthen vetëm përshëndetjen kur nuk ka asnjë vlerë', () => {
    expect(buildMessage(WHATSAPP_TEMPLATE, {})).toBe(WHATSAPP_TEMPLATE[0]);
  });

  it('heq hapësirat në skaje të vlerave', () => {
    expect(buildMessage(['Qyteti: {qyteti}'], { qyteti: '  Lezhë ' })).toBe('Qyteti: Lezhë');
  });
});

describe('buildWhatsAppUrl', () => {
  it('kodon karakteret shqipe dhe rreshtat e rinj', () => {
    const url = buildWhatsAppUrl('355691234567', 'Shërbimi: Çmontim\nQyteti: Shkodër');
    expect(url).toBe(
      'https://wa.me/355691234567?text=Sh%C3%ABrbimi%3A%20%C3%87montim%0AQyteti%3A%20Shkod%C3%ABr',
    );
    expect(decodeURIComponent(url.split('text=')[1])).toBe('Shërbimi: Çmontim\nQyteti: Shkodër');
  });

  it('pa mesazh kthen vetëm linkun e chatit', () => {
    expect(buildWhatsAppUrl('355691234567')).toBe('https://wa.me/355691234567');
  });

  it('kodon & dhe ? që të mos prishin URL-në', () => {
    expect(buildWhatsAppUrl('1', 'a & b?')).toBe('https://wa.me/1?text=a%20%26%20b%3F');
  });
});

describe('normalizeWhatsAppNumber', () => {
  it('heq +, hapësirat dhe 00', () => {
    expect(normalizeWhatsAppNumber('+355 69 123 4567')).toBe('355691234567');
    expect(normalizeWhatsAppNumber('00355691234567')).toBe('355691234567');
  });
});

describe('mapsUrl', () => {
  it('rrumbullakon në 5 shifra dhjetore', () => {
    expect(mapsUrl(41.327546789, 19.818698123)).toBe(
      'https://maps.google.com/?q=41.32755,19.81870',
    );
  });
});
