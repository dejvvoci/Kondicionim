export interface Coords {
  lat: number;
  lng: number;
}

export type LocationError = 'denied' | 'unavailable' | 'unsupported';

/**
 * Kërkon vendndodhjen vetëm kur thirret (pas klikimit të përdoruesit).
 * Gabimet kthehen si `LocationError`, që UI të shfaqë mesazhin e duhur.
 */
export function requestLocation(geo: Geolocation | undefined, timeoutMs = 15000): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (!geo) {
      reject('unsupported' satisfies LocationError);
      return;
    }
    geo.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject((err.code === 1 ? 'denied' : 'unavailable') satisfies LocationError),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 60000 },
    );
  });
}
