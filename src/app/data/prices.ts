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

/** Faqja /cmimet-dhe-garancia. Listat bosh nuk shfaqen. */
export const PRICE_PAGE = {
  eyebrow: 'Transparencë',
  title: 'Çmimet dhe garancia',
  lead: 'Çmime orientuese "duke filluar nga", çfarë përfshihet dhe çfarë llogaritet veçmas. Oferta përfundimtare jepet me shkrim pas inspektimit.',
  tableTitle: 'Çmimet orientuese',
  colService: 'Shërbimi',
  colPrice: 'Duke filluar nga',
  colNote: 'Përfshin',
  // TODO: konfirmo me ustain çfarë përfshin montimi standard
  standardIncludes: [
    'Montimi i njësisë së brendshme dhe të jashtme',
    'Tuba bakri të izoluar deri në gjatësinë standarde',
    'Vakumim i plotë dhe test presioni me azot',
    'Testim me matje dhe shpjegim i përdorimit',
  ],
  standardIncludesTitle: 'Çfarë përfshin montimi standard',
  // TODO: konfirmo me ustain çfarë paguhet veçmas
  extras: [
    'Metra shtesë tubi mbi gjatësinë standarde',
    'Mbajtëse speciale ose bazament për njësinë e jashtme',
    'Punë në lartësi ose me pajisje ngritëse',
  ],
  extrasTitle: 'Çfarë llogaritet veçmas',
  warrantyTitle: 'Garancia mbi punën',
  warranty: {
    duration: null as string | null, // TODO: kohëzgjatja e garancisë mbi punën, p.sh. "2 vjet"
    covers: [] as string[], // TODO: çfarë mbulon garancia, p.sh. "Rrjedhje në lidhjet e montuara nga ne"
    excludes: [] as string[], // TODO: çfarë nuk mbulon, p.sh. "Defekte të aparatit (mbulohen nga garancia e prodhuesit)"
  },
  warrantyDuration: 'Kohëzgjatja',
  warrantyCovers: 'Çfarë mbulon',
  warrantyExcludes: 'Çfarë nuk mbulon',
  note: 'Çmimet janë orientuese dhe mund të ndryshojnë sipas ambientit. Oferta e saktë jepet pas inspektimit, para se të fillojë puna.',
};
