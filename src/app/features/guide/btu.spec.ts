import { BTU_CONFIG } from '../../data/btu-config';
import { CITIES } from '../../data/cities';
import {
  type BtuInput,
  calculateBtu,
  coolingWatts,
  geometry,
  heatingWatts,
  normalizeInput,
  pickSize,
  summarize,
} from './btu';

const base: BtuInput = {
  city: 'tirane',
  area: 20,
  height: 2.7,
  walls: 1,
  insulation: 'mesatar',
  floor: 'ndermjetem',
};

describe('geometry', () => {
  it('dhomë katrore: muret e jashtme, dritaret 1/8 e dyshemesë dhe vëllimi', () => {
    const g = geometry(base);
    // Ana √20 = 4,472 m; muri 4,472 × 2,7 = 12,07 m²; dritaret 20/8 = 2,5 m².
    expect(g.windows).toBeCloseTo(2.5, 5);
    expect(g.walls).toBeCloseTo(12.075 - 2.5, 2);
    expect(g.volume).toBeCloseTo(54, 5);
    expect(g.roof).toBe(0);
    expect(g.ground).toBe(0);
    expect(geometry({ ...base, floor: 'fundit' }).roof).toBe(20);
    expect(geometry({ ...base, floor: 'perdhe' }).ground).toBe(20);
  });
});

describe('calculateBtu', () => {
  it('rasti bazë në Tiranë: dimri dhe vera sipas formulës', () => {
    // Dimri: (1,3 × 9,575 + 2,8 × 2,5 + 0,34 × 0,5 × 54) × (20 + 3,4) = 669,9 W → 2286 BTU.
    expect(heatingWatts(base)).toBeCloseTo(669.9, 0);
    // Vera: mure 68,8 + xham 66,5 + diell 997,5 + ajër 87,2 + njerëz 351,7 = 1571,7 W → 5363 BTU.
    expect(coolingWatts(base)).toBeCloseTo(1571.7, 0);
    const r = calculateBtu(base);
    expect(r.heating).toBe(2300);
    expect(r.cooling).toBe(5400);
    expect(r.season).toBe('vere');
    expect(r.btu).toBe(5400);
    expect(r.size).toBe(9000);
  });

  it('Korça ka verë më të freskët dhe dimër më të ftohtë se Tirana', () => {
    const tirane = calculateBtu(base);
    const korce = calculateBtu({ ...base, city: 'korce' });
    expect(korce.cooling).toBeLessThan(tirane.cooling);
    expect(korce.heating).toBeGreaterThan(tirane.heating);
  });

  it('dhomë e izoluar mirë në Korçë: e përcakton vera, por më pak se në Tiranë', () => {
    const input: BtuInput = { ...base, city: 'korce', area: 35, insulation: 'mire' };
    const r = calculateBtu(input);
    expect(r.season).toBe('vere');
    expect(r.size).toBe(9000);
    expect(r.cooling).toBeLessThan(calculateBtu({ ...input, city: 'tirane' }).cooling);
  });

  it('qoshe në katin e fundit, pa izolim, në Korçë: e përcakton dimri', () => {
    const r = calculateBtu({
      ...base,
      city: 'korce',
      walls: 3,
      insulation: 'dobet',
      floor: 'fundit',
    });
    expect(r.season).toBe('dimer');
    expect(r.heating).toBeGreaterThan(r.cooling);
    expect(r.size).toBe(18000);
  });

  it('çdo mur i jashtëm, izolimi më i dobët dhe kati i fundit rrisin të dy sezonet', () => {
    const r = calculateBtu(base);
    for (const change of [
      { walls: 2 as const },
      { insulation: 'dobet' as const },
      { floor: 'fundit' as const },
    ]) {
      const c = calculateBtu({ ...base, ...change });
      expect(c.heating).toBeGreaterThan(r.heating);
      expect(c.cooling).toBeGreaterThan(r.cooling);
    }
  });

  it('kati përdhe rrit vetëm dimrin (dyshemeja mbi tokë)', () => {
    const r = calculateBtu(base);
    const ground = calculateBtu({ ...base, floor: 'perdhe' });
    expect(ground.heating).toBeGreaterThan(r.heating);
    expect(ground.cooling).toBe(r.cooling);
  });

  it('tregon kushtet e llogaritjes', () => {
    expect(calculateBtu({ ...base, city: 'korce' }).factors).toEqual([
      'Dimri deri −7,2\u00a0°C, vera deri 32,1\u00a0°C',
      '1 mur i jashtëm',
      'Izolim mesatar',
      'Kat i ndërmjetëm',
    ]);
  });

  it('mbi madhësinë më të madhe nuk jep aparat të vetëm', () => {
    expect(calculateBtu({ ...base, area: 150, walls: 3 }).size).toBeNull();
  });
});

describe('qytetet', () => {
  it('çdo qytet ku punojmë ka një stacion klimatik', () => {
    for (const c of CITIES) expect(BTU_CONFIG.cities[c.slug]).toBeDefined();
  });

  it('qyteti i panjohur llogaritet si Tirana', () => {
    expect(calculateBtu({ ...base, city: 'nuk-ekziston' })).toEqual(calculateBtu(base));
  });
});

describe('pickSize: kufijtë e rrumbullakimit', () => {
  it.each([
    [1, 9000],
    [9000, 9000],
    [9000.01, 12000],
    [12000, 12000],
    [12001, 18000],
    [18000, 18000],
    [18001, 24000],
    [24000, 24000],
    [24000.01, null],
  ])('%d BTU → %s', (btu, size) => {
    expect(pickSize(btu)).toBe(size);
  });
});

describe('normalizeInput', () => {
  const { area, height } = BTU_CONFIG.limits;

  it('kthen vlerat brenda kufijve', () => {
    const n = normalizeInput({ ...base, area: 1, height: 9 });
    expect(n.area).toBe(area.min);
    expect(n.height).toBe(height.max);
    expect(normalizeInput({ ...base, area: 999 }).area).toBe(area.max);
  });

  it('fusha bosh (NaN) merr vlerën e paracaktuar ose minimumin', () => {
    const n = normalizeInput({ ...base, area: NaN, height: NaN });
    expect(n.area).toBe(area.min);
    expect(n.height).toBe(height.default);
  });
});

describe('summarize', () => {
  it('përmbledh të dhënat dhe sezonin vendimtar', () => {
    const input: BtuInput = { ...base, city: 'korce', area: 28, floor: 'fundit' };
    expect(summarize(input, calculateBtu(input), 'Korçë')).toBe(
      'Kalkulatori: Korçë, 28 m², 1 mur i jashtëm, izolim mesatar, kati i fundit → 9000 BTU (sipas verës)',
    );
  });

  it('shënon kur e përcakton dimri', () => {
    const input: BtuInput = {
      ...base,
      city: 'korce',
      walls: 3,
      insulation: 'dobet',
      floor: 'fundit',
    };
    expect(summarize(input, calculateBtu(input), 'Korçë')).toContain('(sipas dimrit)');
  });
});
