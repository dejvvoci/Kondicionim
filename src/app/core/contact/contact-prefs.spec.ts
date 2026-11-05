import { loadPrefs, savePrefs } from './contact-prefs';

function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
  } as Storage;
}

describe('contact prefs', () => {
  it('ruan dhe lexon shërbimin dhe qytetin', () => {
    const s = memoryStorage();
    savePrefs(s, { service: 'montim-split', city: 'durres' });
    expect(loadPrefs(s)).toEqual({ service: 'montim-split', city: 'durres' });
  });

  it('nuk prishet nga JSON i pavlefshëm ose storage që hedh gabim', () => {
    const broken = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('QuotaExceeded');
      },
    } as unknown as Storage;
    expect(loadPrefs(broken)).toEqual({});
    expect(() => savePrefs(broken, { city: 'tirane' })).not.toThrow();

    const s = memoryStorage();
    s.setItem('kondicionim.contact', '{nuk-eshte-json');
    expect(loadPrefs(s)).toEqual({});
  });

  it('pa storage (prerender)', () => {
    expect(loadPrefs(undefined)).toEqual({});
  });
});
