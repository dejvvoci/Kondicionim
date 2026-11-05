import type { Stat, TrustBadge } from './types';

/** Shifrat e besueshmërisë në kryefaqe. `value: null` = nuk shfaqet. */
export const STATS: Stat[] = [
  { label: 'Vite përvojë', value: null }, // TODO: vitet e përvojës, p.sh. "12+"
  { label: 'Montime të kryera', value: null }, // TODO: numri i përafërt i montimeve, p.sh. "800+"
  { label: 'Garanci mbi punën', value: null }, // TODO: garancia, p.sh. "2 vjet"
  { label: 'Koha e reagimit', value: null }, // TODO: koha e zakonshme e reagimit, p.sh. "brenda ditës"
];

/** Badge-t poshtë butonave në seksionin kryesor. Vetëm fakte të konfirmuara nga ustai. */
export const TRUST_BADGES: TrustBadge[] = [
  // TODO: badge-t e besueshmërisë, p.sh. { icon: 'shield-check', label: 'Garanci 2 vjet' },
  // { icon: 'certificate', label: 'Teknik i certifikuar' }, { icon: 'home-check', label: 'Inspektim falas' },
  // { icon: 'clock', label: 'Përgjigje brenda ditës' }
];

export const visibleStats = (): Stat[] => STATS.filter((s) => s.value !== null);
