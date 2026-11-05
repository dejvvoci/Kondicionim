import { requestLocation } from './geolocation';

function fakeGeo(result: { lat: number; lng: number } | { code: number }): Geolocation {
  return {
    getCurrentPosition: (ok: PositionCallback, fail?: PositionErrorCallback | null) => {
      if ('lat' in result) {
        ok({ coords: { latitude: result.lat, longitude: result.lng } } as GeolocationPosition);
      } else {
        fail?.({ code: result.code } as GeolocationPositionError);
      }
    },
  } as Geolocation;
}

describe('requestLocation', () => {
  it('kthen koordinatat', async () => {
    await expect(requestLocation(fakeGeo({ lat: 41.3, lng: 19.8 }))).resolves.toEqual({
      lat: 41.3,
      lng: 19.8,
    });
  });

  it('dallon refuzimin e lejes', async () => {
    await expect(requestLocation(fakeGeo({ code: 1 }))).rejects.toBe('denied');
  });

  it('gabimet e tjera (timeout, pa sinjal) janë "unavailable"', async () => {
    await expect(requestLocation(fakeGeo({ code: 3 }))).rejects.toBe('unavailable');
  });

  it('pa Geolocation API', async () => {
    await expect(requestLocation(undefined)).rejects.toBe('unsupported');
  });
});
