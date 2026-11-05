/**
 * Koeficientët e kalkulatorit BTU. Ndryshohen vetëm këtu.
 *
 * baza   = m² × perM2 × (lartësia / refHeight)
 * BTU    = baza × dielli × kati × izolimi + max(0, persona − basePersons) × perPerson + ambienti
 * rezultati = madhësia standarde më e afërt nga lart; mbi madhësinë më të madhe → inspektim.
 */

export type Sun = 'pak' | 'mesatar' | 'shume';
export type Floor = 'perdhe' | 'ndermjetem' | 'fundit';
export type Insulation = 'mire' | 'mesatar' | 'dobet';
export type RoomType = 'gjumi' | 'ndenjie' | 'kuzhine' | 'zyre' | 'dyqan';

export const BTU_CONFIG = {
  // TODO: konfirmo me ustain
  perM2: 340,
  // TODO: konfirmo me ustain
  refHeight: 2.7,
  // TODO: konfirmo me ustain
  sun: { pak: 0.9, mesatar: 1.0, shume: 1.15 } satisfies Record<Sun, number>,
  // TODO: konfirmo me ustain
  floor: { perdhe: 1.0, ndermjetem: 1.0, fundit: 1.15 } satisfies Record<Floor, number>,
  // TODO: konfirmo me ustain
  insulation: { mire: 0.9, mesatar: 1.0, dobet: 1.2 } satisfies Record<Insulation, number>,
  // TODO: konfirmo me ustain
  basePersons: 2,
  // TODO: konfirmo me ustain
  perPerson: 600,
  /** BTU shtesë sipas ambientit (kuzhina ka burime nxehtësie). TODO: konfirmo me ustain */
  room: {
    gjumi: 0,
    ndenjie: 0,
    kuzhine: 4000,
    zyre: 0,
    dyqan: 0,
  } satisfies Record<RoomType, number>,
  /** Madhësitë standarde të aparateve, nga më e vogla. TODO: konfirmo me ustain */
  sizes: [9000, 12000, 18000, 24000],
  limits: {
    area: { min: 5, max: 200 },
    height: { min: 2.2, max: 5, default: 2.7 },
    persons: { min: 1, max: 30, default: 2 },
  },
} as const;

export type BtuConfig = typeof BTU_CONFIG;
