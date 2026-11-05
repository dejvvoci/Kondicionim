/**
 * Projeksioni i hartës (ekuirektangular me korrigjim cos(lat0)): i njëjti në skriptin
 * scripts/build-map.ts dhe në browser, që pin-et e qyteteve të bien saktë mbi kufirin.
 */
export interface MapProjection {
  lng0: number;
  lat0: number;
  scale: number;
  offsetX: number;
  offsetY: number;
}

const RAD = Math.PI / 180;

export function project(lat: number, lng: number, p: MapProjection): [x: number, y: number] {
  const x = (lng - p.lng0) * Math.cos(p.lat0 * RAD) * p.scale + p.offsetX;
  const y = (p.lat0 - lat) * p.scale + p.offsetY;
  return [x, y];
}
