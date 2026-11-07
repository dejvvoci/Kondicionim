import {
  BTU_CONFIG,
  type BtuConfig,
  type ExteriorWalls,
  type Floor,
  type Insulation,
} from '../../data/btu-config';

export interface BtuInput {
  /** Slug-u i qytetit (cities.ts). */
  city: string;
  area: number;
  height: number;
  walls: ExteriorWalls;
  insulation: Insulation;
  floor: Floor;
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
  /** Kushtet e llogaritjes, për shpjegimin. */
  factors: string[];
}

/** 1 W = 3,412 BTU/h. */
const W_TO_BTU = 3.412;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const fmtTemp = (t: number) =>
  `${new Intl.NumberFormat('sq-AL', { maximumFractionDigits: 1 }).format(t).replace('-', '−')}\u00a0°C`;

export const WALLS_LABEL: Record<ExteriorWalls, string> = {
  1: '1 mur i jashtëm',
  2: '2 mure të jashtme',
  3: '3 mure të jashtme',
};
export const INSULATION_LABEL: Record<Insulation, string> = {
  mire: 'izolim i mirë',
  mesatar: 'izolim mesatar',
  dobet: 'izolim i dobët',
};
export const FLOOR_LABEL: Record<Floor, string> = {
  perdhe: 'kati përdhe',
  ndermjetem: 'kat i ndërmjetëm',
  fundit: 'kati i fundit',
};

/** Vlerat jashtë kufijve ose jo-numerike kthehen brenda kufijve (inputet e lira të formës). */
export function normalizeInput(input: BtuInput, config: BtuConfig = BTU_CONFIG): BtuInput {
  const { area, height } = config.limits;
  const num = (v: number, fallback: number) => (Number.isFinite(v) ? v : fallback);
  return {
    ...input,
    city: input.city in config.cities ? input.city : 'tirane',
    area: clamp(num(input.area, area.min), area.min, area.max),
    height: clamp(num(input.height, height.default), height.min, height.max),
  };
}

/** Madhësia standarde më e afërt nga lart; null nëse kalon më të madhen. */
export function pickSize(btu: number, sizes: readonly number[] = BTU_CONFIG.sizes): number | null {
  return sizes.find((s) => btu <= s) ?? null;
}

/** Sipërfaqet e dhomës që shkëmbejnë nxehtësi me jashtë (m²) dhe vëllimi (m³). */
export function geometry(input: BtuInput, config: BtuConfig = BTU_CONFIG) {
  const side = Math.sqrt(input.area);
  const wallsGross = input.walls * side * input.height;
  const windows = Math.min(input.area * config.windowToFloor, wallsGross * 0.6);
  return {
    walls: wallsGross - windows,
    windows,
    roof: input.floor === 'fundit' ? input.area : 0,
    ground: input.floor === 'perdhe' ? input.area : 0,
    volume: input.area * input.height,
  };
}

const climateOf = (input: BtuInput, config: BtuConfig) =>
  config.stations[config.cities[input.city] ?? 'tirana'];

/** Ngrohja në natën më të ftohtë (W). */
export function heatingWatts(input: BtuInput, config: BtuConfig = BTU_CONFIG): number {
  const climate = climateOf(input, config);
  const u = config.insulation[input.insulation];
  const g = geometry(input, config);
  const air = config.airHeatCapacity * config.airChangesPerHour * g.volume;
  const delta = config.indoor.winter - climate.winter;
  const envelope = u.wall * g.walls + u.window * g.windows + u.slab * g.roof + air;
  const ground = u.slab * g.ground * (config.indoor.winter - climate.annualMean);
  return envelope * delta + ground;
}

/** Ftohja në ditën më të nxehtë (W). */
export function coolingWatts(input: BtuInput, config: BtuConfig = BTU_CONFIG): number {
  const climate = climateOf(input, config);
  const u = config.insulation[input.insulation];
  const g = geometry(input, config);
  const air = config.airHeatCapacity * config.airChangesPerHour * g.volume;
  const peak = climate.summer - config.indoor.summer;
  // Muret dhe tarraca: mesatarja e ditës + dielli mbi sipërfaqen e jashtme (sol-air).
  // Mbi muret vertikale bie afërsisht gjysma e rrezatimit horizontal.
  const dayMean = climate.summer - climate.dailyRange / 2 - config.indoor.summer;
  const horizontalSun = (climate.julyRadiation * 1000) / 24;
  const wallSun = (config.absorptance.wall * horizontalSun * 0.5) / config.outsideConductance;
  const roofSun = (config.absorptance.slab * horizontalSun) / config.outsideConductance;
  const people = (config.persons * config.btuPerPerson) / W_TO_BTU;
  const total =
    u.wall * g.walls * (dayMean + wallSun) +
    u.slab * g.roof * (dayMean + roofSun) +
    u.window * g.windows * peak +
    g.windows * u.g * climate.windowSun +
    air * peak +
    people;
  return Math.max(0, total);
}

export function calculateBtu(raw: BtuInput, config: BtuConfig = BTU_CONFIG): BtuResult {
  const input = normalizeInput(raw, config);
  const cooling = coolingWatts(input, config) * W_TO_BTU;
  const heating = heatingWatts(input, config) * W_TO_BTU;
  const season: Season = heating > cooling ? 'dimer' : 'vere';
  const exact = Math.max(cooling, heating);
  const round = (v: number) => Math.round(v / 100) * 100;

  const climate = climateOf(input, config);
  const factors = [
    `Dimri deri ${fmtTemp(climate.winter)}, vera deri ${fmtTemp(climate.summer)}`,
    capitalize(WALLS_LABEL[input.walls]),
    capitalize(INSULATION_LABEL[input.insulation]),
    capitalize(FLOOR_LABEL[input.floor]),
  ];

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

/** Përmbledhje për shënimet e WhatsApp: "Kalkulatori: Korçë, 28 m², ... → 9000 BTU (sipas verës)". */
export function summarize(
  raw: BtuInput,
  result: BtuResult,
  cityName: string,
  config: BtuConfig = BTU_CONFIG,
): string {
  const input = normalizeInput(raw, config);
  const parts = [cityName, `${input.area} m²`];
  if (input.height !== config.limits.height.default)
    parts.push(`tavan ${input.height.toFixed(1)} m`);
  parts.push(
    WALLS_LABEL[input.walls],
    INSULATION_LABEL[input.insulation],
    FLOOR_LABEL[input.floor],
  );
  const size = result.size ? `${result.size} BTU` : `mbi ${config.sizes.at(-1)} BTU`;
  const outcome = `${size} (sipas ${result.season === 'dimer' ? 'dimrit' : 'verës'})`;
  return `Kalkulatori: ${parts.join(', ')} → ${outcome}`;
}
