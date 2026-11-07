/**
 * Koeficientët e kalkulatorit BTU. Ndryshohen vetëm këtu.
 *
 * Kalkulatori supozon që çdo ambient përdoret edhe për verë edhe për dimër: llogarit veçmas
 * ftohjen dhe ngrohjen dhe rekomandon madhësinë standarde që mbulon vlerën më të lartë.
 *
 * Pyetjet janë vetëm qyteti, sipërfaqja, lartësia dhe numri i mureve të jashtme. Pjesa tjetër
 * merret si ambienti më i zakonshëm:
 * - Dhoma modelohet si katror me anë √m². Muret e jashtme janë 1–3 anë të saj.
 * - Kat i ndërmjetëm: muret e brendshme, dyshemeja dhe tavani ndaj fqinjëve nuk shkëmbejnë
 *   nxehtësi (fqinjët ngrohen/ftohen). Kati i fundit dhe përdhe kanë nevojë më të madhe.
 * - Izolim i zakonshëm: mure pa termokapot dhe dritare dopio. Dritaret e vjetra me xham të
 *   thjeshtë ose mungesa e izolimit e rrisin nevojën.
 * - Dritaret zënë 1/8 e sipërfaqes së dyshemesë, në muret e jashtme.
 * - 2 persona në ambient.
 *
 * DIMRI (logjika e EN 12831, nata më e ftohtë: pa diell dhe pa njerëz)
 *   Φ = (U_mur·A_mur + U_dritare·A_dritare + 0,34·n·V) × (20 °C − T_dimër)
 *
 * VERA (dita më e nxehtë)
 *   muret:    U·A × (T_mesatare e ditës − 26 °C + α·I_mesatar/h_e)   [temperatura "sol-air"]
 *   dritaret: U·A × (T_verë − 26 °C) + A × g × dielli në xham
 *   ajri:     0,34·n·V × (T_verë − 26 °C)
 *   njerëzit: 2 persona × 600 BTU/h
 *   Muret janë masive, ndaj për to merret mesatarja e ditës (T_verë − diapazoni/2), jo maja e
 *   pasdites.
 *
 * Burimet
 * - Klima e çdo stacioni: ASHRAE Handbook – Fundamentals 2025 (ashrae-meteo.info): ngrohja 99,6%,
 *   ftohja 0,4%, diapazoni ditor i muajit më të nxehtë, mesatarja vjetore, rrezatimi i korrikut,
 *   dhe τb/τd i korrikut për modelin e qiellit të kthjellët.
 * - Brenda: 20 °C në dimër dhe 26 °C në verë (kufijtë e EN 16798-1, kategoria II).
 * - Ajri: 0,5 ndërrime në orë (minimumi për dhoma banimi në llogaritjet sipas EN 12831,
 *   tabela e CIBSE/MCS); 0,34 Wh/(m³·K) kapaciteti termik i ajrit.
 * - h_e = 25 W/(m²·K): rezistenca e jashtme Rse = 0,04 m²·K/W e EN ISO 6946.
 * - Përthithja e diellit: 0,5 për muret (ngjyrë e çelët/mesatare).
 * - Dielli në xham: maja e rrezatimit mbi një sipërfaqe vertikale më 21 korrik, me modelin e qiellit
 *   të kthjellët të ASHRAE (τb, τd të stacionit), mesatare e katër drejtimeve (V, L, J, P), sepse
 *   drejtimi i dritareve nuk pyetet. Llogaritja: scripts/btu-dielli.ts.
 * - Njerëzit: 600 BTU/h për person (Energy Star), 2 persona.
 * - Vlerat U (W/(m²·K)) dhe g e ambientit të zakonshëm:
 *   · muri pa termokapot: 1,3 (kufiri i poshtëm i 1,3–1,6 te tipologjia e ndërtesave publike në
 *     Shqipëri, SLED);
 *   · dritare dopio: U 2,8, g 0,75.
 * Nuk llogariten: kati i fundit ose përdhe, izolimi ndryshe nga i zakonshmi, pajisjet, gatimi,
 * personat e tjerë, lagështia e ajrit që hyn dhe rënia e fuqisë së ngrohjes së aparatit në
 * temperatura nën zero. Këto i vlerëson ustai në vend.
 */

export type ExteriorWalls = 1 | 2 | 3;
export type Station = 'tirana' | 'korca' | 'shkodra' | 'kucova';

export interface EnvelopeValues {
  wall: number;
  window: number;
  /** Pjesa e diellit që kalon xhamin. */
  g: number;
}

export interface StationClimate {
  name: string;
  /** Temperatura e ngrohjes 99,6% (°C). */
  winter: number;
  /** Temperatura e ftohjes 0,4% (°C). */
  summer: number;
  /** Diapazoni ditor i muajit më të nxehtë (K). */
  dailyRange: number;
  /** Rrezatimi mesatar ditor horizontal i korrikut (kWh/m²). */
  julyRadiation: number;
  /** Maja e diellit mbi xham vertikal, mesatare e 4 drejtimeve (W/m²), nga scripts/btu-dielli.ts. */
  windowSun: number;
}

export const BTU_CONFIG = {
  indoor: { winter: 20, summer: 26 },
  airChangesPerHour: 0.5,
  airHeatCapacity: 0.34,
  windowToFloor: 1 / 8,
  outsideConductance: 25,
  wallAbsorptance: 0.5,
  persons: 2,
  btuPerPerson: 600,
  /** Mur pa termokapot dhe dritare dopio. */
  envelope: { wall: 1.3, window: 2.8, g: 0.75 } satisfies EnvelopeValues,
  stations: {
    tirana: {
      name: 'Tirana Rinas',
      winter: -3.4,
      summer: 35.5,
      dailyRange: 14.1,
      julyRadiation: 7.38,
      windowSun: 532,
    },
    korca: {
      name: 'Korça',
      winter: -7.2,
      summer: 32.1,
      dailyRange: 10.4,
      julyRadiation: 6.96,
      windowSun: 549,
    },
    shkodra: {
      name: 'Shkodra',
      winter: -1.9,
      summer: 36.5,
      dailyRange: 12.0,
      julyRadiation: 6.94,
      windowSun: 530,
    },
    kucova: {
      name: 'Kuçova',
      winter: -3.2,
      summer: 36.7,
      dailyRange: 14.3,
      julyRadiation: 7.34,
      windowSun: 529,
    },
  } satisfies Record<Station, StationClimate>,
  /**
   * Qyteti (slug-u te cities.ts) → stacioni ASHRAE më i afërt me klimë të ngjashme.
   * Durrësi merr Tiranën; Elbasani, Fieri, Berati dhe Vlora marrin Kuçovën (ultësirë e brendshme,
   * verë e nxehtë); Lezha merr Shkodrën. Për Vlorën dhe Durrësin vlera e verës del pak më e lartë se
   * bregdeti, pra në anën e sigurt.
   */
  cities: {
    tirane: 'tirana',
    durres: 'tirana',
    elbasan: 'kucova',
    lezhe: 'shkodra',
    shkoder: 'shkodra',
    korce: 'korca',
    fier: 'kucova',
    berat: 'kucova',
    vlore: 'kucova',
  } as Record<string, Station>,
  /** Madhësitë standarde të aparateve, nga më e vogla. */
  sizes: [9000, 12000, 18000, 24000],
  limits: {
    area: { min: 5, max: 200 },
    height: { min: 2.2, max: 5, default: 2.7 },
  },
} as const;

export type BtuConfig = typeof BTU_CONFIG;
