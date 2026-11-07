/**
 * Llogarit `windowSun` te src/app/data/btu-config.ts: maja e rrezatimit diellor mbi një xham
 * vertikal më 21 korrik, mesatare e katër drejtimeve (veri, lindje, jug, perëndim).
 * Ekzekutimi: `node scripts/btu-dielli.ts`
 *
 * Modeli i qiellit të kthjellët i ASHRAE (Handbook – Fundamentals, 2009 e më pas):
 *   Eb = E0·exp(−τb·m^ab),  Ed = E0·exp(−τd·m^ad)
 *   ab = 1,454 − 0,406τb − 0,268τd + 0,021τbτd,  ad = 0,507 + 0,205τb − 0,080τd − 0,190τbτd
 *   m (masa e ajrit) sipas Kasten–Young. Mbi murin vertikal: rrezja direkte × cos θ,
 *   e shpërndara × Y (Y = max(0,45; 0,55 + 0,437cos θ + 0,313cos² θ)) dhe e reflektuara nga toka
 *   me albedo 0,2.
 * τb dhe τd e korrikut janë nga tabelat ASHRAE 2025 të çdo stacioni (ashrae-meteo.info).
 */

const RAD = Math.PI / 180;

const STATIONS = {
  tirana: { lat: 41.415, taub: 0.438, taud: 2.231 },
  korca: { lat: 40.6, taub: 0.4, taud: 2.264 },
  shkodra: { lat: 42.1, taub: 0.442, taud: 2.27 },
  kucova: { lat: 40.8, taub: 0.442, taud: 2.213 },
};

const ORIENTATIONS = { jug: 0, perendim: 90, veri: 180, lindje: -90 };

function peaks({ lat, taub, taud }: { lat: number; taub: number; taud: number }) {
  const day = 202; // 21 korrik
  const e0 = 1367 * (1 + 0.033 * Math.cos(((360 * (day - 3)) / 365) * RAD));
  const decl = 23.45 * Math.sin(((360 * (284 + day)) / 365) * RAD);
  const ab = 1.454 - 0.406 * taub - 0.268 * taud + 0.021 * taub * taud;
  const ad = 0.507 + 0.205 * taub - 0.08 * taud - 0.19 * taub * taud;
  const max: Record<string, number> = {};
  for (let hour = 4; hour <= 20; hour += 0.25) {
    const h = 15 * (hour - 12);
    const sinB =
      Math.cos(lat * RAD) * Math.cos(decl * RAD) * Math.cos(h * RAD) +
      Math.sin(lat * RAD) * Math.sin(decl * RAD);
    const beta = Math.asin(sinB) / RAD;
    if (beta <= 0) continue;
    const m = 1 / (sinB + 0.50572 * Math.pow(6.07995 + beta, -1.6364));
    const eb = e0 * Math.exp(-taub * Math.pow(m, ab));
    const ed = e0 * Math.exp(-taud * Math.pow(m, ad));
    const cosPhi =
      (sinB * Math.sin(lat * RAD) - Math.sin(decl * RAD)) /
      (Math.cos(beta * RAD) * Math.cos(lat * RAD));
    const phi = (Math.acos(Math.max(-1, Math.min(1, cosPhi))) / RAD) * (h < 0 ? -1 : 1);
    for (const [name, psi] of Object.entries(ORIENTATIONS)) {
      const cosT = Math.cos(beta * RAD) * Math.cos((phi - psi) * RAD);
      const y = Math.max(0.45, 0.55 + 0.437 * cosT + 0.313 * cosT * cosT);
      const total = eb * Math.max(0, cosT) + ed * y + (eb * sinB + ed) * 0.2 * 0.5;
      max[name] = Math.max(max[name] ?? 0, total);
    }
  }
  return max;
}

for (const [name, station] of Object.entries(STATIONS)) {
  const p = peaks(station);
  const avg = Object.values(p).reduce((a, b) => a + b, 0) / Object.values(p).length;
  const detail = Object.entries(p)
    .map(([k, v]) => `${k} ${Math.round(v)}`)
    .join(', ');
  console.log(`${name}: windowSun ${Math.round(avg)} W/m² (${detail})`);
}
