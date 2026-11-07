import { BUSINESS_OVERRIDES } from './business.overrides';
import { placeholder } from './placeholders';
import type { Business, Photo } from './types';

export const BUSINESS: Business = {
  name: 'Ardit Klima & Elektrik',
  fallbackName: 'Usta kondicionimi',
  logo: '/images/logo/logo.png',
  siteUrl: 'https://montimkondicioneri.al',
  phone: '06xxxxxxxxx', // TODO: numër shembull, vendos numrin real, p.sh. "+3556XXXXXXXX"
  whatsapp: '06xxxxxxxxx', // TODO: numër shembull, vendos numrin real, p.sh. "3556XXXXXXXX"
  email: 'email@email.com', // TODO: email shembull, vendos email-in real
  openingHours: [],
  hoursNote: 'Kontaktoni për të lënë orarin e takimit të përshtatshëm për të dy.',
  social: {
    facebook: 'https://www.facebook.com/', // TODO: linku i faqes së biznesit
    instagram: 'https://www.instagram.com/', // TODO: linku i profilit të biznesit
    tiktok: 'https://www.tiktok.com/', // TODO: linku i profilit të biznesit
    youtube: null,
  },
  locality: 'Tiranë',
  // Google pret një interval të shkurtër ose "$"; çmimi me kërkesë shpjegohet te faqja e çmimeve.
  priceRange: null,
  servesWholeCountry: true,
  ...BUSINESS_OVERRIDES,
};

export const businessName = (): string => BUSINESS.name ?? BUSINESS.fallbackName;

/** Foto e ustait në punë për seksionin kryesor (elementi LCP). Asnjë foto stock. */
// TODO: foto reale e ustait në punë, p.sh. { src: '/images/usta-montim-tirane.avif', alt: '...', width: 1200, height: 900 }
export const HERO_PHOTO: Photo | null = placeholder(
  'usta-ne-pune',
  'ustai në punë, duke montuar ose kontrolluar një kondicioner (pa foto stock)',
); // TODO: foto shembull, zëvendësohet me foton reale

/**
 * Mesazhi i parambushur i WhatsApp. Çdo rresht me {fushë} hiqet nëse fusha është bosh.
 * Fushat: sherbimi, qyteti, adresa, lat, lng, shenime.
 */
export const WHATSAPP_TEMPLATE: readonly string[] = [
  'Përshëndetje! Ju kontaktoj nga faqja juaj për të marrë një ofertë ose një vlerësim.',
  'Shërbimi: {sherbimi}',
  'Qyteti: {qyteti}',
  'Zona/adresa: {adresa}',
  'Vendndodhja: https://maps.google.com/?q={lat},{lng}',
  'Shënime: {shenime}',
];
