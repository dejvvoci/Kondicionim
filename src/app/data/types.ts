import type { IconName } from '../shared/ui/icon/icons';

/**
 * Tipet e përmbajtjes. Vlera `null` = e dhënë që mungon (TODO): në development shfaqet si
 * placeholder i dukshëm, në prodhim elementi fshihet.
 */

export interface OpeningHours {
  /** P.sh. "E hënë – e shtunë" */
  days: string;
  /** P.sh. "08:00 – 19:00" */
  hours: string;
  /** I njëjti orar për Google (schema.org), p.sh. "Mo-Sa 08:00-19:00". */
  schema: string;
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
  /** Qyteti i bazës (ose adresa, nëse ka pikë fizike), për Google. null = vetëm vendi. */
  locality: string | null;
  /** Niveli i çmimeve për Google, p.sh. "$$" ose "3000–60000 ALL". null = nuk shfaqet. */
  priceRange: string | null;
}

export interface City {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  projectCount: number | null;
  active: boolean;
  /** Ku vendoset emri në hartë kur dy qytete janë afër (parazgjedhur: djathtas). */
  mapLabel?: 'right' | 'left' | 'below';
}

/** Foto reale në public/images. Emër skedari përshkrues: montim-multi-split-vile-tirane.avif */
export interface Photo {
  src: string;
  /** Përshkrim në shqip i asaj që shihet në foto. */
  alt: string;
  width: number;
  height: number;
}

/** Emrat e ikonave nga shared/ui/icon/icons.ts (për një ikonë të re, shtoje atje). */
export type IconKey = IconName;

export interface QA {
  q: string;
  a: string;
}

export interface Service {
  /** Pjesë e URL-së: /sherbimet/{slug}. Pa ë/ç. */
  slug: string;
  title: string;
  /** Një fjali për kartën. */
  short: string;
  icon: IconKey;
  /** Paragrafi hyrës në faqen e shërbimit. */
  intro: string;
  /** Çfarë përfshin. */
  includes: string[];
  /** Kujt i shërben. */
  audience: string[];
  /** P.sh. "2–4 orë për një split". null = nuk shfaqet. */
  duration: string | null;
  /** Foto nga punë të vërteta. */
  photos: Photo[];
  /** 2–3 pyetje specifike për shërbimin. */
  faq: QA[];
  seo: { title: string; description: string };
}

export interface Price {
  /** P.sh. "Montim standard split 9000–12000 BTU". */
  label: string;
  /** Çmimi "duke filluar nga". null = nuk shfaqet. */
  from: number | null;
  currency: 'ALL' | 'EUR';
  /** Shërbimi ku shfaqet çmimi. */
  serviceSlug: string;
  /** Çfarë përfshin çmimi, me pak fjalë. */
  note: string;
}

export interface Stat {
  label: string;
  /** P.sh. "12+", "2 vjet". null = nuk shfaqet. */
  value: string | null;
}

export interface TrustBadge {
  icon: IconKey;
  label: string;
}

export interface InstallStandard {
  slug: string;
  title: string;
  /** 2–3 fjali: pse ka rëndësi për klientin. */
  text: string;
  icon: IconKey;
  /** Shfaqet te përmbledhja në kryefaqe. */
  featured: boolean;
  photo: Photo | null;
}

export interface ProcessStep {
  title: string;
  text: string;
  icon: IconKey;
}

export interface FaqItem {
  q: string;
  a: string;
  /** Shfaqet në FAQ e shkurtër të kryefaqes. */
  home: boolean;
}

export interface Brand {
  name: string;
  /** Partner/servis i autorizuar (vetëm atëherë lejohet logoja). */
  authorized: boolean;
}

/** Lloji i sistemit për filtrat e projekteve. */
export type SystemKind =
  'split' | 'multi-split' | 'kanal' | 'kasete' | 'dysheme-tavan' | 'vrf' | 'pompe-nxehtesie';

export interface ProjectVideo {
  platform: 'youtube' | 'instagram' | 'tiktok';
  /** YouTube: ID e videos; Instagram/TikTok: URL e plotë e postimit. */
  id: string;
  title: string;
  /** Pamja që shfaqet para klikimit (facade). */
  thumbnail: Photo;
}

export interface Project {
  /** /projektet/{slug}, p.sh. "vile-multi-split-5-koka-tirane". */
  slug: string;
  title: string;
  /** Slug-u nga cities.ts. */
  city: string;
  system: SystemKind;
  /** Fuqia totale, p.sh. 48000. */
  btu: number | null;
  /** P.sh. "2 ditë". */
  duration: string | null;
  /** Përshkrim teknik i shkurtër (1–2 fjali) për kartën. */
  summary: string;
  /** Rasti i plotë: sfida, zgjidhja, çfarë ishte e veçantë. Paragrafë të ndarë me rresht bosh. */
  story: string;
  before: Photo;
  after: Photo;
  /** Foto shtesë nga puna. */
  gallery: Photo[];
  video: ProjectVideo | null;
  /** Slug-et e shërbimeve nga services.ts (lidhjet e brendshme). */
  services: string[];
  /** Shfaqet në kryefaqe (maksimum 3). */
  featured: boolean;
  /** ISO, p.sh. "2026-06-15". */
  date: string;
}

/** Artikull blogu, i gjeneruar nga Markdown (scripts/build-content.ts). */
export interface Article {
  slug: string;
  title: string;
  description: string;
  /** ISO, p.sh. "2026-11-05". */
  date: string;
  services: string[];
  readingMinutes: number;
}

export interface Certification {
  title: string;
  /** P.sh. "Daikin Academy", "AKU". */
  issuer: string;
  year: number | null;
  photo: Photo | null;
}

export interface NavItem {
  label: string;
  path: string;
}
