import { filterProjects, PROJECTS } from './projects';
import { CITIES } from './cities';
import { SERVICES } from './services';
import type { Project } from './types';

const photo = { src: '/x.avif', alt: 'x', width: 4, height: 3 };
const make = (slug: string, city: string, system: Project['system']): Project => ({
  slug,
  title: slug,
  city,
  system,
  btu: null,
  duration: null,
  summary: '',
  story: '',
  before: photo,
  after: photo,
  gallery: [],
  video: null,
  services: [],
  featured: false,
  date: '2026-01-01',
});

describe('filterProjects', () => {
  const list = [
    make('a', 'tirane', 'split'),
    make('b', 'durres', 'multi-split'),
    make('c', 'tirane', 'multi-split'),
  ];

  it('pa filtër kthen të gjitha', () => {
    expect(filterProjects(list, {}).map((p) => p.slug)).toEqual(['a', 'b', 'c']);
  });

  it('filtron sipas qytetit, sistemit ose të dyjave', () => {
    expect(filterProjects(list, { city: 'tirane' }).map((p) => p.slug)).toEqual(['a', 'c']);
    expect(filterProjects(list, { system: 'multi-split' }).map((p) => p.slug)).toEqual(['b', 'c']);
    expect(
      filterProjects(list, { city: 'tirane', system: 'multi-split' }).map((p) => p.slug),
    ).toEqual(['c']);
  });
});

describe('PROJECTS (të dhënat)', () => {
  it('çdo projekt ka qytet dhe shërbime që ekzistojnë, slug pa ë/ç', () => {
    for (const p of PROJECTS) {
      expect(p.slug).toMatch(/^[a-z0-9-]+$/);
      expect(CITIES.some((c) => c.slug === p.city)).toBe(true);
      for (const s of p.services) expect(SERVICES.some((x) => x.slug === s)).toBe(true);
      expect(p.before.alt && p.after.alt).toBeTruthy();
    }
  });

  it('projektet shembull janë të shënuara dhe pa shifra të trilluara', () => {
    for (const p of PROJECTS.filter((x) => x.slug.startsWith('projekt-shembull'))) {
      expect(p.example).toBe(true);
      expect(p.title).toMatch(/^Projekt shembull: /);
      expect(p.btu).toBeNull();
      expect(p.duration).toBeNull();
      expect(p.before.alt).toMatch(/^Foto shembull: /);
    }
  });
});
