/**
 * Ndërtimi i mesazhit dhe i URL-së WhatsApp: funksione të pastra, pa varësi nga Angular.
 */

export type MessageValues = Record<string, string | number | null | undefined>;

const PLACEHOLDER = /\{(\w+)\}/g;

const isEmpty = (v: MessageValues[string]): boolean =>
  v === null || v === undefined || String(v).trim() === '';

/**
 * Plotëson template-in rresht pas rreshti. Një rresht që ka placeholder-a hiqet krejt nëse
 * të gjithë placeholder-at e tij janë bosh (p.sh. "Zona/adresa: {adresa}" pa adresë).
 */
export function buildMessage(template: readonly string[], values: MessageValues): string {
  return template
    .filter((line) => {
      const keys = [...line.matchAll(PLACEHOLDER)].map((m) => m[1]);
      return keys.length === 0 || keys.some((k) => !isEmpty(values[k]));
    })
    .map((line) =>
      line.replace(PLACEHOLDER, (_, k: string) =>
        isEmpty(values[k]) ? '' : String(values[k]).trim(),
      ),
    )
    .join('\n');
}

/**
 * Numri në formatin që pret wa.me: vetëm shifra, pa + dhe pa 00 në fillim.
 * "+355 69 123 4567" → "355691234567".
 */
export function normalizeWhatsAppNumber(number: string): string {
  return number.replace(/\D/g, '').replace(/^00/, '');
}

/** https://wa.me/{numri}?text={mesazhi i koduar}. Pa mesazh, vetëm linku i chatit. */
export function buildWhatsAppUrl(number: string, message?: string): string {
  const base = `https://wa.me/${normalizeWhatsAppNumber(number)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Link Google Maps për koordinatat, të rrumbullakuara në ~1 m. */
export function mapsUrl(lat: number, lng: number): string {
  return `https://maps.google.com/?q=${lat.toFixed(5)},${lng.toFixed(5)}`;
}
