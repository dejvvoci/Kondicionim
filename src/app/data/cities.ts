import type { City } from './types';

/** Shtimi i një qyteti të ri = një rresht i ri këtu. `projectCount: null` = nuk shfaqet. */
export const CITIES: City[] = [
  // projectCount: numri i punëve (montime dhe riparime). null = nuk shfaqet.
  // TODO: numri i punëve për Shkodrën, Vlorën, Fierin dhe Beratin
  { slug: 'tirane', name: 'Tiranë', lat: 41.3275, lng: 19.8187, projectCount: 180, active: true },
  {
    slug: 'durres',
    name: 'Durrës',
    lat: 41.3246,
    lng: 19.4565,
    projectCount: 70,
    active: true,
    mapLabel: 'below',
  },
  { slug: 'elbasan', name: 'Elbasan', lat: 41.1125, lng: 20.0822, projectCount: 25, active: true },
  { slug: 'lezhe', name: 'Lezhë', lat: 41.7836, lng: 19.6436, projectCount: 35, active: true },
  {
    slug: 'shkoder',
    name: 'Shkodër',
    lat: 42.0693,
    lng: 19.5033,
    projectCount: null,
    active: true,
  },
  {
    slug: 'korce',
    name: 'Korçë',
    lat: 40.6186,
    lng: 20.7808,
    projectCount: 15,
    active: true,
    mapLabel: 'left',
  },
  { slug: 'fier', name: 'Fier', lat: 40.7239, lng: 19.5567, projectCount: null, active: true },
  { slug: 'berat', name: 'Berat', lat: 40.7058, lng: 19.9522, projectCount: null, active: true },
  { slug: 'vlore', name: 'Vlorë', lat: 40.4686, lng: 19.4914, projectCount: null, active: true },
];

export const activeCities = (): City[] => CITIES.filter((c) => c.active);
