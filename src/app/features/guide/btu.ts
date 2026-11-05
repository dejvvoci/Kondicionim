import {
  BTU_CONFIG,
  type BtuConfig,
  type Floor,
  type Insulation,
  type RoomType,
  type Sun,
} from '../../data/btu-config';

export interface BtuInput {
  area: number;
  height: number;
  sun: Sun;
  floor: Floor;
  insulation: Insulation;
  room: RoomType;
  persons: number;
}

export interface BtuResult {
  /** Vlera e llogaritur, e rrumbullakuar në 100. */
  btu: number;
  /** Madhësia standarde e rekomanduar; null = mbi aparatin më të madh (multi-split/kanal/inspektim). */
  size: number | null;
  /** Faktorët që e ndryshuan vlerën nga baza, për shpjegimin. */
  factors: string[];
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const pct = (k: number) => `${k > 1 ? '+' : '−'}${Math.round(Math.abs(k - 1) * 100)}%`;
const fmt = (n: number) => new Intl.NumberFormat('sq-AL').format(n);

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
  const exact = base * sunK * floorK * insulationK + extraPersons * config.perPerson + roomExtra;
  const btu = Math.round(exact / 100) * 100;

  const factors: string[] = [];
  if (heightK !== 1) factors.push(`Tavan ${input.height.toFixed(1)} m: ${pct(heightK)}`);
  if (sunK !== 1) factors.push(`${SUN_LABEL[input.sun]}: ${pct(sunK)}`);
  if (floorK !== 1) factors.push(`${FLOOR_LABEL[input.floor]}: ${pct(floorK)}`);
  if (insulationK !== 1) factors.push(`${INSULATION_LABEL[input.insulation]}: ${pct(insulationK)}`);
  if (extraPersons > 0) {
    factors.push(`${input.persons} persona: +${fmt(extraPersons * config.perPerson)} BTU`);
  }
  if (roomExtra > 0) factors.push(`${ROOM_LABEL[input.room]}: +${fmt(roomExtra)} BTU`);

  // Rrumbullakimi në 100 shërben vetëm për shfaqje; madhësia zgjidhet nga vlera e saktë.
  return { btu, size: pickSize(exact, config.sizes), factors };
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
  const outcome = result.size ? `${result.size} BTU` : `mbi ${config.sizes.at(-1)} BTU`;
  return `Kalkulatori: ${parts.join(', ')} → ${outcome}`;
}
