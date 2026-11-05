import { BTU_CONFIG } from '../../data/btu-config';
import { type BtuInput, calculateBtu, normalizeInput, pickSize, summarize } from './btu';

const base: BtuInput = {
  area: 20,
  height: 2.7,
  sun: 'mesatar',
  floor: 'ndermjetem',
  insulation: 'mesatar',
  room: 'gjumi',
  persons: 2,
};

describe('calculateBtu', () => {
  it('baza: m² × 340 pa faktorë', () => {
    const r = calculateBtu(base);
    expect(r.btu).toBe(6800);
    expect(r.size).toBe(9000);
    expect(r.factors).toEqual([]);
  });

  it('zbaton formulën e plotë sipas btu-config', () => {
    // 28 × 340 × (3.0/2.7) × 1.15 × 1.15 × 1.2 + (4−2) × 600 + 4000
    const input: BtuInput = {
      area: 28,
      height: 3,
      sun: 'shume',
      floor: 'fundit',
      insulation: 'dobet',
      room: 'kuzhine',
      persons: 4,
    };
    const exact = 28 * 340 * (3 / 2.7) * 1.15 * 1.15 * 1.2 + 2 * 600 + 4000;
    const r = calculateBtu(input);
    expect(r.btu).toBe(Math.round(exact / 100) * 100);
    expect(r.size).toBe(24000);
    // Shqipja nuk ndan mijëshet te numrat me 4 shifra (CLDR): 1200, por 15 000.
    expect(r.factors).toEqual([
      'Tavan 3.0 m: +11%',
      'Shumë diell: +15%',
      'Kati i fundit nën çati: +15%',
      'Izolim i dobët: +20%',
      '4 persona: +1200 BTU',
      'Kuzhinë: +4000 BTU',
    ]);
  });

  it('faktorët që ulin vlerën shfaqen me minus', () => {
    const r = calculateBtu({ ...base, sun: 'pak', insulation: 'mire' });
    expect(r.factors).toEqual(['Pak diell: −10%', 'Izolim i mirë: −10%']);
    expect(r.btu).toBe(Math.round((20 * 340 * 0.9 * 0.9) / 100) * 100);
  });

  it('mbi madhësinë më të madhe nuk jep aparat të vetëm', () => {
    const r = calculateBtu({ ...base, area: 80 });
    expect(r.size).toBeNull();
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

  it('përdor vlerën e saktë, jo atë të rrumbullakuar për shfaqje', () => {
    // 26.5 × 340 = 9010: shfaqet 9000, por kalon 9000 → 12000
    const r = calculateBtu({ ...base, area: 26.5 });
    expect(r.btu).toBe(9000);
    expect(r.size).toBe(12000);
  });

  it('pikërisht në kufi mbetet në madhësinë e vogël', () => {
    // 12000 / 340 m² japin saktësisht 12000 BTU
    const r = calculateBtu({ ...base, area: 12000 / 340 });
    expect(r.size).toBe(12000);
  });
});

describe('normalizeInput', () => {
  const { area, height, persons } = BTU_CONFIG.limits;

  it('kthen vlerat brenda kufijve', () => {
    const n = normalizeInput({ ...base, area: 1, height: 9, persons: 0 });
    expect(n.area).toBe(area.min);
    expect(n.height).toBe(height.max);
    expect(n.persons).toBe(persons.min);
    expect(normalizeInput({ ...base, area: 999 }).area).toBe(area.max);
  });

  it('fusha bosh (NaN) merr vlerën e paracaktuar ose minimumin', () => {
    const n = normalizeInput({ ...base, area: NaN, height: NaN, persons: NaN });
    expect(n.area).toBe(area.min);
    expect(n.height).toBe(height.default);
    expect(n.persons).toBe(persons.default);
  });
});

describe('summarize', () => {
  it('përmbledh vetëm faktorët që kanë rëndësi', () => {
    const input: BtuInput = { ...base, area: 28, floor: 'fundit' };
    expect(summarize(input, calculateBtu(input))).toBe(
      'Kalkulatori: 28 m², dhomë gjumi, kati i fundit → 12000 BTU',
    );
  });

  it('mbi madhësinë maksimale', () => {
    const input: BtuInput = { ...base, area: 100, room: 'dyqan' };
    expect(summarize(input, calculateBtu(input))).toBe(
      'Kalkulatori: 100 m², dyqan → mbi 24000 BTU',
    );
  });
});
