/**
 * Gjeneron hartën SVG të Shqipërisë nga Natural Earth (domain publik):
 * filtron vendin, e projekton, e thjeshton dhe shkruan
 * src/app/shared/ui/map-albania/albania-map.generated.ts
 *
 *   npm run build:map                          # shkarkon ne_10m_admin_0_countries.geojson
 *   npm run build:map -- path/to/file.geojson  # nga një skedar lokal
 *
 * Ekzekutohet vetëm kur ndryshon burimi ose madhësia; skedari i gjeneruar ruhet në git.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { type MapProjection, project } from '../src/app/shared/ui/map-albania/projection.ts';

const SOURCE =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson';
const WIDTH = 400;
const PAD = 12;
/** Toleranca e thjeshtimit në njësi viewBox (~piksel në 400px). */
const EPSILON = 0.6;

type Ring = [number, number][];
interface Feature {
  properties: Record<string, unknown>;
  geometry:
    { type: 'Polygon'; coordinates: Ring[] } | { type: 'MultiPolygon'; coordinates: Ring[][] };
}

async function loadAlbania(path?: string): Promise<Ring[]> {
  const text = path ? readFileSync(path, 'utf8') : await (await fetch(SOURCE)).text();
  const { features } = JSON.parse(text) as { features: Feature[] };
  const alb = features.find((f) => f.properties['ADM0_A3'] === 'ALB');
  if (!alb) throw new Error('Shqipëria (ADM0_A3=ALB) nuk u gjet në burim');
  const polygons =
    alb.geometry.type === 'Polygon' ? [alb.geometry.coordinates] : alb.geometry.coordinates;
  // Vetëm unaza e jashtme e çdo poligoni (Shqipëria nuk ka vrima).
  return polygons.map((poly) => poly[0]);
}

/** Ramer–Douglas–Peucker. */
function simplify(points: [number, number][], eps: number): [number, number][] {
  if (points.length < 3) return points;
  const [ax, ay] = points[0];
  const [bx, by] = points[points.length - 1];
  const len = Math.hypot(bx - ax, by - ay);
  let maxD = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    // Unazë e mbyllur (fillimi = fundi): distanca nga pika e parë.
    const d =
      len === 0
        ? Math.hypot(px - ax, py - ay)
        : Math.abs((by - ay) * px - (bx - ax) * py + bx * ay - by * ax) / len;
    if (d > maxD) [maxD, index] = [d, i];
  }
  if (maxD <= eps) return [points[0], points[points.length - 1]];
  return [
    ...simplify(points.slice(0, index + 1), eps).slice(0, -1),
    ...simplify(points.slice(index), eps),
  ];
}

function fit(rings: Ring[]): { projection: MapProjection; height: number } {
  const all = rings.flat();
  const lats = all.map(([, lat]) => lat);
  const lngs = all.map(([lng]) => lng);
  const lat0 = (Math.min(...lats) + Math.max(...lats)) / 2;
  const lng0 = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  const unit: MapProjection = { lng0, lat0, scale: 1, offsetX: 0, offsetY: 0 };
  const xy = all.map(([lng, lat]) => project(lat, lng, unit));
  const xs = xy.map(([x]) => x);
  const ys = xy.map(([, y]) => y);
  const scale = (WIDTH - 2 * PAD) / (Math.max(...xs) - Math.min(...xs));
  const projection: MapProjection = {
    lng0,
    lat0,
    scale,
    offsetX: PAD - Math.min(...xs) * scale,
    offsetY: PAD - Math.min(...ys) * scale,
  };
  const height = Math.ceil((Math.max(...ys) - Math.min(...ys)) * scale + 2 * PAD);
  return { projection, height };
}

const round = (n: number) => Math.round(n * 10) / 10;

async function main(): Promise<void> {
  const rings = await loadAlbania(process.argv[2]);
  const { projection, height } = fit(rings);
  const path = rings
    .map((ring) => {
      const pts = simplify(
        ring.map(([lng, lat]) => project(lat, lng, projection)),
        EPSILON,
      ).map(([x, y]) => `${round(x)} ${round(y)}`);
      return `M${pts.join('L')}Z`;
    })
    .join('');

  const out = join(
    import.meta.dirname,
    '..',
    'src/app/shared/ui/map-albania/albania-map.generated.ts',
  );
  const r6 = (n: number) => Math.round(n * 1e6) / 1e6;
  writeFileSync(
    out,
    `// Gjeneruar nga scripts/build-map.ts. Mos e ndrysho me dorë.
// Burimi: Natural Earth, Admin 0 Countries 1:10m (domain publik), https://www.naturalearthdata.com
import type { MapProjection } from './projection';

export const ALBANIA_MAP = {
  width: ${WIDTH},
  height: ${height},
  projection: ${JSON.stringify({
    lng0: r6(projection.lng0),
    lat0: r6(projection.lat0),
    scale: r6(projection.scale),
    offsetX: r6(projection.offsetX),
    offsetY: r6(projection.offsetY),
  })} satisfies MapProjection,
  path: '${path}',
} as const;
`,
  );
  // Vetëm përmasat, për placeholder-in e @defer (pa e ngarkuar path-in).
  writeFileSync(
    out.replace('albania-map.generated.ts', 'albania-map-size.generated.ts'),
    `// Gjeneruar nga scripts/build-map.ts. Mos e ndrysho me dorë.
export const ALBANIA_MAP_SIZE = { width: ${WIDTH}, height: ${height} } as const;
`,
  );
  console.log(
    `build-map: ${rings.reduce((n, r) => n + r.length, 0)} pika → path ${path.length} bajt, viewBox ${WIDTH}×${height}`,
  );
}

await main();
