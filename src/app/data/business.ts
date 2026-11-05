import type { Business } from './types';

export const BUSINESS: Business = {
  name: null, // TODO: emri i biznesit
  fallbackName: 'Usta kondicionimi',
  siteUrl: 'https://kondicionim.pages.dev', // TODO: domeni final
  phone: null, // TODO: numri i telefonit, p.sh. "+3556XXXXXXXX"
  whatsapp: null, // TODO: numri i WhatsApp, p.sh. "3556XXXXXXXX"
  nipt: null, // TODO: NIPT-i
  email: null, // TODO: email-i (opsional)
  openingHours: [], // TODO: orari i punës, p.sh. { days: 'E hënë – e shtunë', hours: '08:00 – 19:00' }
  social: {
    facebook: null, // TODO: linku i Facebook
    instagram: null, // TODO: linku i Instagram
    tiktok: null, // TODO: linku i TikTok
    youtube: null,
  },
};

export const businessName = (): string => BUSINESS.name ?? BUSINESS.fallbackName;
