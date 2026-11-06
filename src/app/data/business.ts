import { BUSINESS_OVERRIDES } from './business.overrides';
import { placeholder } from './placeholders';
import type { Business, Photo } from './types';

export const BUSINESS: Business = {
  name: null, // TODO: emri i biznesit
  fallbackName: 'Usta kondicionimi',
  siteUrl: 'https://kondicionim.pages.dev', // TODO: domeni final
  phone: null, // TODO: numri i telefonit, p.sh. "+3556XXXXXXXX"
  whatsapp: null, // TODO: numri i WhatsApp, p.sh. "3556XXXXXXXX"
  nipt: null, // TODO: NIPT-i
  email: null, // TODO: email-i (opsional)
  openingHours: [], // TODO: orari i punës, p.sh. { days: 'E hënë – e shtunë', hours: '08:00 – 19:00', schema: 'Mo-Sa 08:00-19:00' }
  social: {
    facebook: null, // TODO: linku i Facebook
    instagram: null, // TODO: linku i Instagram
    tiktok: null, // TODO: linku i TikTok
    youtube: null,
  },
  locality: null, // TODO: qyteti i bazës, p.sh. "Tiranë" (i njëjtë me Google Business Profile)
  priceRange: null, // TODO: niveli i çmimeve për Google, p.sh. "$$"
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
