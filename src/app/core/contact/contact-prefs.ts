/** Shërbimi dhe qyteti i fundit, që klienti të mos i zgjedhë sërish. Vetëm slug-e, asgjë personale. */
export interface ContactPrefs {
  service?: string;
  city?: string;
}

const KEY = 'kondicionim.contact';

/** localStorage mund të mungojë ose të hedhë gabim (privat, i bllokuar): asnjëherë s'e prish rrjedhën. */
export function loadPrefs(storage: Storage | undefined): ContactPrefs {
  try {
    const raw = storage?.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== 'object') return {};
    const { service, city } = parsed as Record<string, unknown>;
    return {
      service: typeof service === 'string' ? service : undefined,
      city: typeof city === 'string' ? city : undefined,
    };
  } catch {
    return {};
  }
}

export function savePrefs(storage: Storage | undefined, prefs: ContactPrefs): void {
  try {
    storage?.setItem(KEY, JSON.stringify(prefs));
  } catch {
    // pa hapësirë ose i bllokuar: nuk ka rëndësi
  }
}
