import type { NavItem } from './types';

export const MAIN_NAV: NavItem[] = [
  { label: 'Shërbimet', path: '/sherbimet' },
  { label: 'Standardet', path: '/standardet-e-montimit' },
  { label: 'Udhëzuesi', path: '/si-te-zgjidhni-kondicionerin' },
  { label: 'Projektet', path: '/projektet' },
  { label: 'Çmimet', path: '/cmimet-dhe-garancia' },
  { label: 'Rreth ustait', path: '/rreth-ustait' },
];

export const FOOTER_NAV: NavItem[] = [
  ...MAIN_NAV,
  { label: 'Pyetje të shpeshta', path: '/pyetje-te-shpeshta' },
  { label: 'Këshilla', path: '/keshilla' },
];
