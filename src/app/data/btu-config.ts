/**
 * Koeficientët e kalkulatorit BTU. Ndryshohen vetëm këtu.
 *
 * Kalkulatori llogarit veçmas verën (ftohje) dhe dimrin (ngrohje) dhe rekomandon madhësinë që
 * mbulon të dyja, pra vlerën më të lartë.
 *
 * VERA:  baza = m² × perM2 × (lartësia / refHeight)
 *        BTU  = baza × dielli × kati × izolimi + max(0, persona − basePersons) × perPerson + ambienti
 * DIMRI: W    = m² × heating.perM2K[izolimi] × (heating.indoor − temperatura e zonës)
 *               × (lartësia / refHeight) × kati;  BTU = W × 3,412
 * rezultati = madhësia standarde më e afërt nga lart e max(verë, dimër);
 *             mbi madhësinë më të madhe → inspektim.
 *
 * Metoda e thjeshtuar, me rregullat e njohura publikisht (llogaritja e plotë e ngarkesës termike
 * bëhet me ACCA Manual J / ASHRAE ose EN 12831 dhe kërkon matje në vend):
 * - Baza 340 BTU/h për m² me tavan 2,7 m (≈ 100 W/m²), rregulli evropian për klimë mesdhetare:
 *   Bosch Home Comfort Italia, Selectra (BTU = m² × lartësia × faktor klimatik).
 *   Energy Star jep rreth 20 BTU/ft² (≈ 215 BTU/m²), por për klimën e SHBA-së dhe tavan 2,44 m.
 * - Dielli: −10% për ambient në hije, +10% shumë me diell (Energy Star); +15% me ekspozim në jug
 *   (Altroconsumo). Përdorim +15%, sepse vera në Shqipëri është e nxehtë.
 * - Kati i fundit nën çati: faktori klimatik 140 në vend të 120 te Selectra (≈ +17%); përdorim +15%.
 * - Izolimi: i dobët +30% (vlera më e ulët e intervalit 30–50% që japin burimet italiane);
 *   i mirë −10% (Selectra: 100 në vend të 120 për ambient të izoluar mirë dhe në hije).
 * - Persona: +600 BTU për çdo person mbi 2 që qëndron rregullisht në ambient (Energy Star).
 * - Kuzhina: +4000 BTU (Energy Star).
 * - Madhësitë: fuqitë standarde të aparateve split në treg (9000, 12000, 18000, 24000 BTU).
 *
 * Dimri, sipas logjikës së EN 12831: humbja e nxehtësisë = koeficienti × diferenca e temperaturës.
 * Llogaritja bëhet për natën më të ftohtë, ndaj dielli, personat dhe kuzhina nuk e ulin nevojën.
 * - Temperatura e zonës: ASHRAE Handbook – Fundamentals 2025, temperatura e ngrohjes 99,6%
 *   (vetëm 0,4% e orëve të vitit janë më të ftohta): Tirana Rinas −3,4 °C, Korça −7,2 °C.
 * - Brenda: 20 °C, temperatura e zakonshme e projektimit për dhoma banimi.
 * - Koeficientët W/(m²·K): kufiri i sipërm i intervaleve që japin udhëzuesit për pompa nxehtësie
 *   (izolim i mirë 35–50 W/m², mesatar 60–80, i dobët 70–100), pjesëtuar me diferencën 24 K për
 *   të cilën janë dhënë (21 °C brenda, −3 °C jashtë). Kufiri i sipërm, që aparati të mos dalë i vogël.
 * - Kati i fundit: +15%, si në verë (humbje nga çatia).
 * Në temperatura nën zero aparatet humbasin fuqi ngrohjeje sipas modelit; këtë e vlerëson ustai.
 */

export type Sun = 'pak' | 'mesatar' | 'shume';
export type Zone = 'ultesire' | 'malore';
export type Floor = 'perdhe' | 'ndermjetem' | 'fundit';
export type Insulation = 'mire' | 'mesatar' | 'dobet';
export type RoomType = 'gjumi' | 'ndenjie' | 'kuzhine' | 'zyre' | 'dyqan';

export const BTU_CONFIG = {
  perM2: 340,
  refHeight: 2.7,
  sun: { pak: 0.9, mesatar: 1.0, shume: 1.15 } satisfies Record<Sun, number>,
  floor: { perdhe: 1.0, ndermjetem: 1.0, fundit: 1.15 } satisfies Record<Floor, number>,
  insulation: { mire: 0.9, mesatar: 1.0, dobet: 1.3 } satisfies Record<Insulation, number>,
  basePersons: 2,
  perPerson: 600,
  /** BTU shtesë sipas ambientit (kuzhina ka burime nxehtësie). */
  room: {
    gjumi: 0,
    ndenjie: 0,
    kuzhine: 4000,
    zyre: 0,
    dyqan: 0,
  } satisfies Record<RoomType, number>,
  heating: {
    indoor: 20,
    /** Temperatura e jashtme e projektimit (°C), ASHRAE 2025, 99,6%. */
    zone: { ultesire: -3.4, malore: -7.2 } satisfies Record<Zone, number>,
    /** W për m² për çdo gradë diferencë (50/24, 80/24, 100/24). */
    perM2K: { mire: 2.1, mesatar: 3.3, dobet: 4.2 } satisfies Record<Insulation, number>,
  },
  /** Madhësitë standarde të aparateve, nga më e vogla. */
  sizes: [9000, 12000, 18000, 24000],
  limits: {
    area: { min: 5, max: 200 },
    height: { min: 2.2, max: 5, default: 2.7 },
    persons: { min: 1, max: 30, default: 2 },
  },
} as const;

export type BtuConfig = typeof BTU_CONFIG;
