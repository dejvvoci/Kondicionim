/**
 * Ikonat SVG inline nga Tabler Icons v3.50 (licenca MIT), vetëm ato që përdoren.
 * Për një ikonë të re: kopjo atributet `d` nga icons/outline/<emri>.svg.
 */
export const ICONS = {
  'menu-2': ['M4 6l16 0', 'M4 12l16 0', 'M4 18l16 0'],
  x: ['M18 6l-12 12', 'M6 6l12 12'],
  phone: [
    'M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2',
  ],
  'brand-whatsapp': [
    'M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9',
    'M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1',
  ],
  'map-pin': [
    'M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0',
    'M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0',
  ],
  clock: ['M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0', 'M12 7v5l3 3'],
  'arrow-right': ['M5 12l14 0', 'M13 18l6 -6', 'M13 6l6 6'],
} as const satisfies Record<string, readonly string[]>;

export type IconName = keyof typeof ICONS;
