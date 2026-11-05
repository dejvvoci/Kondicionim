import type { City } from './types';

/** Shtimi i një qyteti të ri = një rresht i ri këtu. `projectCount: null` = nuk shfaqet. */
export const CITIES: City[] = [
  // TODO: numri i projekteve për çdo qytet (projectCount)
  { slug: 'tirane', name: 'Tiranë', lat: 41.3275, lng: 19.8187, projectCount: null, active: true },
  { slug: 'durres', name: 'Durrës', lat: 41.3246, lng: 19.4565, projectCount: null, active: true },
  {
    slug: 'elbasan',
    name: 'Elbasan',
    lat: 41.1125,
    lng: 20.0822,
    projectCount: null,
    active: true,
  },
  { slug: 'lezhe', name: 'Lezhë', lat: 41.7836, lng: 19.6436, projectCount: null, active: true },
  {
    slug: 'shkoder',
    name: 'Shkodër',
    lat: 42.0693,
    lng: 19.5033,
    projectCount: null,
    active: true,
  },
];

export const activeCities = (): City[] => CITIES.filter((c) => c.active);
