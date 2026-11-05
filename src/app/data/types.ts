/**
 * Tipet e përmbajtjes. Vlera `null` = e dhënë që mungon (TODO): në development shfaqet si
 * placeholder i dukshëm, në prodhim elementi fshihet.
 */

export interface OpeningHours {
  /** P.sh. "E hënë – e shtunë" */
  days: string;
  /** P.sh. "08:00 – 19:00" */
  hours: string;
}

export interface SocialLinks {
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
}

export interface Business {
  name: string | null;
  /** Emri që përdoret kur `name` mungon (title, logo). */
  fallbackName: string;
  /** URL-ja finale e faqes, pa / në fund. */
  siteUrl: string;
  /** Format ndërkombëtar me +, p.sh. "+3556XXXXXXXX". */
  phone: string | null;
  /** Format ndërkombëtar pa + dhe pa zero fillestare, p.sh. "3556XXXXXXXX". */
  whatsapp: string | null;
  nipt: string | null;
  email: string | null;
  openingHours: OpeningHours[];
  social: SocialLinks;
}

export interface City {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  projectCount: number | null;
  active: boolean;
}

export interface NavItem {
  label: string;
  path: string;
}
