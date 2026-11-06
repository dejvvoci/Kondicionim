import type { Price } from './types';

/** Çmimet orientuese "duke filluar nga". `from: null` = nuk shfaqet. */
export const PRICES: Price[] = [
  {
    label: 'Montim standard split',
    from: 150, // TODO: çmim shembull, vendos çmimin real
    currency: 'EUR',
    serviceSlug: 'montim-split',
    note: 'Me vakumim, test presioni dhe testim me matje.', // TODO: konfirmo çfarë përfshin
  },
  {
    label: 'Pastrim i plotë i kondicionerit',
    from: 150, // TODO: çmim shembull, vendos çmimin real
    currency: 'EUR',
    serviceSlug: 'kontrata-mirembajtjeje-per-biznese',
    note: 'Filtrat, bateritë, ventilatori dhe kondensata.', // TODO: konfirmo çfarë përfshin
  },
  {
    label: 'Diagnostikim',
    from: 150, // TODO: çmim shembull, vendos çmimin real
    currency: 'EUR',
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
  standardIncludes: [
    'Inspektim i ambientit dhe zgjedhja e pozicionit të njësive: qarkullimi i ajrit, largësia nga burimet e nxehtësisë dhe aksesi për servis',
    'Montimi i njësisë së brendshme në nivel, mbi pllakën e saj të fiksuar mirë në mur',
    'Hapja e vrimës në mur me pjerrësi nga jashtë dhe me mbrojtje të mureve dhe mobiljeve',
    'Tuba bakri të izoluar deri në 3 metra, të përkulur me vegël dhe me fllanxha të punuara me fllanxhator',
    'Montimi i njësisë së jashtme në nivel, mbi mbajtëse me antivibrim dhe me hapësirë ajrimi rreth saj',
    'Lidhja elektrike me kabllo sipas fuqisë së aparatit',
    'Tubi i kondensatës me pjerrësi të vazhdueshme dhe provë me ujë që kullon jashtë',
    'Shtrëngimi i lidhjeve me çelës dinamometrik, sipas vlerave të prodhuesit',
    'Test presioni me azot për të gjetur çdo rrjedhje para hapjes së gazit',
    'Vakumim i plotë i linjës me pompë vakumi dhe kontroll me vakummetër',
    'Hapja e gazit dhe testim në ftohje dhe ngrohje, me matje temperature dhe presioni',
    'Pastrimi i ambientit dhe shpjegimi i përdorimit dhe i mirëmbajtjes',
  ],
  standardIncludesTitle: 'Çfarë përfshin montimi standard',
  // TODO: konfirmo me ustain çfarë paguhet veçmas
  extras: [
    'Metra shtesë tubi mbi 3 metrat e përfshirë',
    'Mbajtëse speciale ose bazament për njësinë e jashtme',
    'Punë në lartësi ose me pajisje ngritëse',
  ],
  extrasTitle: 'Çfarë llogaritet veçmas',
  warrantyTitle: 'Garancia mbi punën',
  warranty: {
    duration: '3 vjet' as string | null,
    covers: [
      'Çdo problem që vjen nga montimi',
      'Rrjedhje gazi nga lidhjet e montuara nga ne',
      'Probleme me tubat, izolimin dhe kondensatën',
    ] as string[],
    excludes: [
      'Defektet teknike të vetë kondicionerit (mbulohen nga garancia e prodhuesit). Edhe për to ofrojmë suport teknik në terren ose në repart, sipas vlerësimit të situatës.',
    ] as string[],
  },
  warrantyDuration: 'Kohëzgjatja',
  warrantyCovers: 'Çfarë mbulon',
  warrantyExcludes: 'Çfarë nuk mbulon',
  note: 'Kontaktoni për të marrë çmimin për shërbimin që keni nevojë. Çmimet janë orientuese dhe oferta e saktë jepet pas inspektimit, para se të fillojë puna.',
};
