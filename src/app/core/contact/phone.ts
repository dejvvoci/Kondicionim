/** Linku tel: nga një numër ndërkombëtar ("+355 69 ..." → "tel:+35569..."). */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

/**
 * Format i lexueshëm për numrat shqiptarë celularë: "+355691234567" → "+355 69 123 4567".
 * Numrat e tjerë kthehen ashtu siç janë.
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  const m = /^\+355(\d{2})(\d{3})(\d{3,4})$/.exec(digits);
  return m ? `+355 ${m[1]} ${m[2]} ${m[3]}` : phone;
}
