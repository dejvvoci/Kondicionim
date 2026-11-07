/**
 * Koeficientët e kalkulatorit BTU. Ndryshohen vetëm këtu.
 *
 * Kalkulatori supozon që çdo ambient përdoret edhe për verë edhe për dimër: llogarit veçmas
 * ftohjen dhe ngrohjen dhe rekomandon madhësinë standarde që mbulon vlerën më të lartë.
 *
 * Dhoma modelohet si katror me anë √m². Muret e jashtme janë 1–3 anë të saj; muret e brendshme,
 * dyshemeja dhe tavani ndaj apartamenteve fqinje nuk shkëmbejnë nxehtësi (fqinjët ngrohen/ftohen).
 * Dritaret zënë 1/8 e sipërfaqes së dyshemesë, në muret e jashtme.
 *
 * DIMRI (logjika e EN 12831, nata më e ftohtë: pa diell dhe pa njerëz)
 *   Φ = (U_mur·A_mur + U_dritare·A_dritare + U_tarracë·A_tarracë + 0,34·n·V) × (20 °C − T_dimër)
 *     + U_dysheme·A_dysheme × (20 °C − mesatarja vjetore)        [vetëm kati përdhe, mbi tokë]
 *
 * VERA (dita më e nxehtë)
 *   muret dhe tarraca: U·A × (T_mesatare e ditës − 26 °C + α·I_mesatar/h_e)   [temperatura "sol-air"]
 *   dritaret: U·A × (T_verë − 26 °C) + A × g × dielli në xham
 *   ajri:     0,34·n·V × (T_verë − 26 °C)
 *   njerëzit: 2 persona × 600 BTU/h
 *   Muret dhe tarraca janë masive, ndaj për to merret mesatarja e ditës (T_verë − diapazoni/2),
 *   jo maja e pasdites.
 *
 * Burimet
 * - Klima e çdo stacioni: ASHRAE Handbook – Fundamentals 2025 (ashrae-meteo.info): ngrohja 99,6%,
 *   ftohja 0,4%, diapazoni ditor i muajit më të nxehtë, mesatarja vjetore, rrezatimi i korrikut,
 *   dhe τb/τd i korrikut për modelin e qiellit të kthjellët.
 * - Brenda: 20 °C në dimër dhe 26 °C në verë (kufijtë e EN 16798-1, kategoria II).
 * - Ajri: 0,5 ndërrime në orë (minimumi për dhoma banimi në llogaritjet sipas EN 12831,
 *   tabela e CIBSE/MCS); 0,34 Wh/(m³·K) kapaciteti termik i ajrit.
 * - h_e = 25 W/(m²·K): rezistenca e jashtme Rse = 0,04 m²·K/W e EN ISO 6946.
 * - Përthithja e diellit: 0,5 për muret (ngjyrë e çelët/mesatare), 0,7 për tarracën.
 * - Dielli në xham: maja e rrezatimit mbi një sipërfaqe vertikale më 21 korrik, me modelin e qiellit
 *   të kthjellët të ASHRAE (τb, τd të stacionit), mesatare e katër drejtimeve (V, L, J, P), sepse
 *   drejtimi i dritareve nuk pyetet. Llogaritja: scripts/btu-dielli.ts.
 * - Njerëzit: 600 BTU/h për person (Energy Star), 2 persona.
 * - Vlerat U (W/(m²·K)) dhe g sipas nivelit të izolimit:
 *   · muret pa izolim: 1,3–1,6 (tipologjia e ndërtesave publike në Shqipëri, SLED); me termokapot
 *     5 cm polistiren (si në rikonstruksionet e atjeshme): ≈ 0,45;
 *   · dritaret: xham i thjeshtë 5,8 (g 0,85), dopio 2,8 (g 0,75), dopio me shtresë low-e 1,8 (g 0,6);
 *   · tarraca/dyshemeja: pllakë betoni 15 cm + llaç pa izolim ≈ 3,7 (EN ISO 6946 me vlerat e
 *     materialeve të EN ISO 10456); me 3 cm izolim ≈ 0,9; me 5 cm ≈ 0,6.
 * Nuk llogariten: pajisjet, gatimi, lagështia e ajrit që hyn dhe rënia e fuqisë së ngrohjes së
 * aparatit në temperatura nën zero. Këto i vlerëson ustai në vend.
 */

export type Insulation = 'mire' | 'mesatar' | 'dobet';
export type Floor = 'perdhe' | 'ndermjetem' | 'fundit';
export type ExteriorWalls = 1 | 2 | 3;
export type Station = 'tirana' | 'korca' | 'shkodra' | 'kucova';

export interface InsulationValues {
  wall: number;
  window: number;
  /** Pjesa e diellit që kalon xhamin. */
  g: number;
  /** Tarraca (kati i fundit) dhe dyshemeja mbi tokë (përdhe). */
  slab: number;
}

export interface StationClimate {
  name: string;
  /** Temperatura e ngrohjes 99,6% (°C). */
  winter: number;
  /** Temperatura e ftohjes 0,4% (°C). */
  summer: number;
  /** Diapazoni ditor i muajit më të nxehtë (K). */
  dailyRange: number;
  /** Mesatarja vjetore (°C), për dyshemenë mbi tokë. */
  annualMean: number;
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
  absorptance: { wall: 0.5, slab: 0.7 },
  persons: 2,
  btuPerPerson: 600,
  insulation: {
    mire: { wall: 0.45, window: 1.8, g: 0.6, slab: 0.6 },
    mesatar: { wall: 1.3, window: 2.8, g: 0.75, slab: 0.9 },
    dobet: { wall: 1.6, window: 5.8, g: 0.85, slab: 3.7 },
  } satisfies Record<Insulation, InsulationValues>,
  stations: {
    tirana: {
      name: 'Tirana Rinas',
      winter: -3.4,
      summer: 35.5,
      dailyRange: 14.1,
      annualMean: 16.3,
      julyRadiation: 7.38,
      windowSun: 532,
    },
    korca: {
      name: 'Korça',
      winter: -7.2,
      summer: 32.1,
      dailyRange: 10.4,
      annualMean: 12.6,
      julyRadiation: 6.96,
      windowSun: 549,
    },
    shkodra: {
      name: 'Shkodra',
      winter: -1.9,
      summer: 36.5,
      dailyRange: 12.0,
      annualMean: 16.7,
      julyRadiation: 6.94,
      windowSun: 530,
    },
    kucova: {
      name: 'Kuçova',
      winter: -3.2,
      summer: 36.7,
      dailyRange: 14.3,
      annualMean: 17.0,
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
