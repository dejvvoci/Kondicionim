import { PROJECTS_ENABLED } from './features';
import type { NavItem } from './types';

const ALL_NAV: NavItem[] = [
  { label: 'Shërbimet', path: '/sherbimet' },
  { label: 'Standardet', path: '/standardet-e-montimit' },
  { label: 'Kalkulatori BTU', path: '/si-te-zgjidhni-kondicionerin' },
  { label: 'Projektet', path: '/projektet' },
  { label: 'Çmimet', path: '/cmimet-dhe-garancia' },
  { label: 'Rreth ustait', path: '/rreth-ustait' },
];

/** Menuja kryesore; "Projektet" vetëm kur projektet janë të ndezura (features.ts). */
export const MAIN_NAV: NavItem[] = ALL_NAV.filter(
  (item) => PROJECTS_ENABLED || item.path !== '/projektet',
);

export const FOOTER_NAV: NavItem[] = [
  ...MAIN_NAV,
  { label: 'Pyetje të shpeshta', path: '/pyetje-te-shpeshta' },
  { label: 'Këshilla', path: '/keshilla' },
];
