import {
  BTU_CONFIG,
  type BtuConfig,
  type Floor,
  type Insulation,
  type RoomType,
  type Sun,
  type Zone,
} from '../../data/btu-config';

export interface BtuInput {
  area: number;
  height: number;
  sun: Sun;
  floor: Floor;
  insulation: Insulation;
  room: RoomType;
  persons: number;
  zone: Zone;
}

export type Season = 'vere' | 'dimer';

export interface BtuResult {
  /** Nevoja në verë (ftohje), e rrumbullakuar në 100. */
  cooling: number;
  /** Nevoja në dimër (ngrohje), e rrumbullakuar në 100. */
  heating: number;
  /** Sezoni që e përcakton madhësinë (ai me nevojën më të madhe). */
  season: Season;
  /** Vlera më e lartë e dy sezoneve, e rrumbullakuar në 100. */
  btu: number;
  /** Madhësia standarde e rekomanduar; null = mbi aparatin më të madh (multi-split/kanal/inspektim). */
  size: number | null;
  /** Faktorët që e ndryshuan vlerën nga baza, për shpjegimin. */
  factors: string[];
}

/** 1 W = 3,412 BTU/h. */
const W_TO_BTU = 3.412;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const pct = (k: number) => `${k > 1 ? '+' : '−'}${Math.round(Math.abs(k - 1) * 100)}%`;
const fmt = (n: number) => new Intl.NumberFormat('sq-AL').format(n);
const fmtTemp = (t: number) =>
  `${new Intl.NumberFormat('sq-AL', { maximumFractionDigits: 1 }).format(t).replace('-', '−')}\u00a0°C`;

const SUN_LABEL: Record<Sun, string> = { pak: 'Pak diell', mesatar: '', shume: 'Shumë diell' };
const FLOOR_LABEL: Record<Floor, string> = {
  perdhe: 'Kati përdhe',
  ndermjetem: 'Kat i ndërmjetëm',
  fundit: 'Kati i fundit nën çati',
};
const INSULATION_LABEL: Record<Insulation, string> = {
  mire: 'Izolim i mirë',
  mesatar: '',
  dobet: 'Izolim i dobët',
};
export const ZONE_LABEL: Record<Zone, string> = {
  ultesire: 'Bregdet dhe ultësirë',
  malore: 'Zonë kodrinore-malore',
};
const ROOM_LABEL: Record<RoomType, string> = {
  gjumi: 'Dhomë gjumi',
  ndenjie: 'Dhomë ndenjie',
  kuzhine: 'Kuzhinë',
  zyre: 'Zyrë',
  dyqan: 'Dyqan',
};

/** Vlerat jashtë kufijve ose jo-numerike kthehen brenda kufijve (inputet e lira të formës). */
export function normalizeInput(input: BtuInput, config: BtuConfig = BTU_CONFIG): BtuInput {
  const { area, height, persons } = config.limits;
  const num = (v: number, fallback: number) => (Number.isFinite(v) ? v : fallback);
  return {
    ...input,
    area: clamp(num(input.area, area.min), area.min, area.max),
    height: clamp(num(input.height, height.default), height.min, height.max),
    persons: Math.round(clamp(num(input.persons, persons.default), persons.min, persons.max)),
  };
}

/** Madhësia standarde më e afërt nga lart; null nëse kalon më të madhen. */
export function pickSize(btu: number, sizes: readonly number[] = BTU_CONFIG.sizes): number | null {
  return sizes.find((s) => btu <= s) ?? null;
}

export function calculateBtu(raw: BtuInput, config: BtuConfig = BTU_CONFIG): BtuResult {
  const input = normalizeInput(raw, config);
  const heightK = input.height / config.refHeight;
  const sunK = config.sun[input.sun];
  const floorK = config.floor[input.floor];
  const insulationK = config.insulation[input.insulation];
  const extraPersons = Math.max(0, input.persons - config.basePersons);
  const roomExtra = config.room[input.room];

  const base = input.area * config.perM2 * heightK;
  const cooling = base * sunK * floorK * insulationK + extraPersons * config.perPerson + roomExtra;

  const { heating: h } = config;
  const deltaT = h.indoor - h.zone[input.zone];
  const heating = input.area * h.perM2K[input.insulation] * deltaT * heightK * floorK * W_TO_BTU;

  const season: Season = heating > cooling ? 'dimer' : 'vere';
  const exact = Math.max(cooling, heating);
  const round = (v: number) => Math.round(v / 100) * 100;

  const factors: string[] = [];
  if (heightK !== 1) factors.push(`Tavan ${input.height.toFixed(1)} m: ${pct(heightK)}`);
  if (sunK !== 1) factors.push(`${SUN_LABEL[input.sun]}: ${pct(sunK)}`);
  if (floorK !== 1) factors.push(`${FLOOR_LABEL[input.floor]}: ${pct(floorK)}`);
  if (insulationK !== 1) factors.push(`${INSULATION_LABEL[input.insulation]}: ${pct(insulationK)}`);
  if (extraPersons > 0) {
    factors.push(`${input.persons} persona: +${fmt(extraPersons * config.perPerson)} BTU`);
  }
  if (roomExtra > 0) factors.push(`${ROOM_LABEL[input.room]}: +${fmt(roomExtra)} BTU`);
  if (input.zone === 'malore') {
    factors.push(`${ZONE_LABEL.malore}: dimër deri ${fmtTemp(h.zone.malore)}`);
  }

  // Rrumbullakimi në 100 shërben vetëm për shfaqje; madhësia zgjidhet nga vlera e saktë.
  return {
    cooling: round(cooling),
    heating: round(heating),
    season,
    btu: round(exact),
    size: pickSize(exact, config.sizes),
    factors,
  };
}

/** Përmbledhje për shënimet e WhatsApp: "Kalkulatori: 28 m², kati i fundit → 12000 BTU". */
export function summarize(
  raw: BtuInput,
  result: BtuResult,
  config: BtuConfig = BTU_CONFIG,
): string {
  const input = normalizeInput(raw, config);
  const parts = [`${input.area} m²`, ROOM_LABEL[input.room].toLowerCase()];
  if (input.height !== config.refHeight) parts.push(`tavan ${input.height.toFixed(1)} m`);
  if (input.floor === 'fundit') parts.push('kati i fundit');
  if (input.sun === 'shume') parts.push('shumë diell');
  if (input.insulation === 'dobet') parts.push('izolim i dobët');
  if (input.persons > config.basePersons) parts.push(`${input.persons} persona`);
  if (input.zone === 'malore') parts.push('zonë malore');
  const size = result.size ? `${result.size} BTU` : `mbi ${config.sizes.at(-1)} BTU`;
  const outcome = result.season === 'dimer' ? `${size} (sipas dimrit)` : size;
  return `Kalkulatori: ${parts.join(', ')} → ${outcome}`;
}
