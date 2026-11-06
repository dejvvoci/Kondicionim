import type { Brand } from './types';

/**
 * Markat me të cilat punon ustai. Shfaqen vetëm me tekst; logot vetëm me leje ose kur
 * ustai është partner i autorizuar.
 */
export const BRANDS: Brand[] = [
  // TODO: konfirmo me ustain listën (markat kryesore që shiten në Shqipëri); authorized: true
  // vetëm nëse është partner/servis i autorizuar i markës.
  { name: 'Daikin', authorized: false },
  { name: 'Mitsubishi Electric', authorized: false },
  { name: 'LG', authorized: false },
  { name: 'Samsung', authorized: false },
  { name: 'Gree', authorized: false },
  { name: 'Midea', authorized: false },
  { name: 'Toshiba', authorized: false },
  { name: 'Hisense', authorized: false },
  { name: 'Haier', authorized: false },
  { name: 'Beko', authorized: false },
];
