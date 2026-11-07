import type { Brand } from './types';

/**
 * Markat me të cilat punon ustai, me logon zyrtare (public/images/markat/, SVG nga Wikimedia
 * Commons, pa të drejtë autori sipas Commons, por marka tregtare të pronarëve të tyre).
 * `authorized: true` vetëm nëse ustai është partner/servis i autorizuar i markës.
 */
export const BRANDS: Brand[] = [
  // TODO: konfirmo me ustain listën (markat kryesore që shiten në Shqipëri)
  { name: 'Daikin', logo: '/images/markat/daikin.svg', authorized: false },
  {
    name: 'Mitsubishi Electric',
    logo: '/images/markat/mitsubishi-electric.svg',
    authorized: false,
  },
  { name: 'LG', logo: '/images/markat/lg.svg', authorized: false },
  { name: 'Samsung', logo: '/images/markat/samsung.svg', authorized: false },
  { name: 'Gree', logo: '/images/markat/gree.svg', authorized: false },
  { name: 'Midea', logo: '/images/markat/midea.svg', authorized: false },
  { name: 'Toshiba', logo: '/images/markat/toshiba.svg', authorized: false },
  { name: 'Hisense', logo: '/images/markat/hisense.svg', authorized: false },
  { name: 'Haier', logo: '/images/markat/haier.svg', authorized: false },
  { name: 'Beko', logo: '/images/markat/beko.svg', authorized: false },
];

export const AUTHORIZED_LABEL = 'Partner i autorizuar';

/** Që logot të mos lexohen si partneritet zyrtar. */
export const BRANDS_NOTE =
  'Logot dhe emrat janë marka tregtare të pronarëve të tyre. Tregojnë markat me të cilat punojmë, jo partneritet zyrtar.';
