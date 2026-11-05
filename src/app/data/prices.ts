import type { Price } from './types';

/** Çmimet orientuese "duke filluar nga". `from: null` = nuk shfaqet. */
export const PRICES: Price[] = [
  {
    label: 'Montim standard split',
    from: null, // TODO: çmimi "duke filluar nga" për montim standard
    currency: 'ALL',
    serviceSlug: 'montim-split',
    note: 'Me vakumim, test presioni dhe testim me matje.', // TODO: konfirmo çfarë përfshin
  },
  {
    label: 'Pastrim i plotë i kondicionerit',
    from: null, // TODO: çmimi "duke filluar nga" për pastrim
    currency: 'ALL',
    serviceSlug: 'kontrata-mirembajtjeje-per-biznese',
    note: 'Filtrat, bateritë, ventilatori dhe kondensata.', // TODO: konfirmo çfarë përfshin
  },
  {
    label: 'Diagnostikim',
    from: null, // TODO: çmimi "duke filluar nga" për diagnostikim
    currency: 'ALL',
    serviceSlug: 'diagnostikim-dhe-riparim',
    note: 'Matje dhe shpjegim i shkakut para riparimit.', // TODO: konfirmo çfarë përfshin
  },
];

export const pricesFor = (serviceSlug: string): Price[] =>
  PRICES.filter((p) => p.serviceSlug === serviceSlug && p.from !== null);

/** 15000 ALL → "15 000 lekë"; 120 EUR → "120 €". */
export function formatPrice(amount: number, currency: Price['currency']): string {
  const n = new Intl.NumberFormat('sq-AL').format(amount);
  return currency === 'ALL' ? `${n} lekë` : `${n} €`;
}
