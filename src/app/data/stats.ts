import type { Stat, TrustBadge } from './types';

/** Shifrat e besueshmërisë në kryefaqe. `value: null` = nuk shfaqet. */
export const STATS: Stat[] = [
  { label: 'Vite përvojë', value: '4' },
  { label: 'Montime të kryera', value: '~100' },
  { label: 'Pajisje të riparuara, në repart dhe në terren', value: '350+' },
  { label: 'Garanci mbi montimin', value: '3 vjet' },
  { label: 'Koha e reagimit', value: null }, // TODO: koha e zakonshme e reagimit, p.sh. "brenda ditës"
];

/** Badge-t poshtë butonave në seksionin kryesor. Vetëm fakte të konfirmuara nga ustai. */
export const TRUST_BADGES: TrustBadge[] = [
  { icon: 'shield-check', label: 'Garanci 3 vjet mbi montimin' },
  { icon: 'tool', label: 'Përvojë me markat kryesore në treg' },
  { icon: 'certificate', label: 'I certifikuar për riparime teknike dhe elektrike' },
];

export const visibleStats = (): Stat[] => STATS.filter((s) => s.value !== null);
