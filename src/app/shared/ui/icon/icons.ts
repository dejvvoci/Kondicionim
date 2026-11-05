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
  'chevron-down': ['M6 9l6 6l6 -6'],
  'shield-check': [
    'M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06',
    'M15 19l2 2l4 -4',
  ],
  certificate: [
    'M12 15a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
    'M13 17.5v4.5l2 -1.5l2 1.5v-4.5',
    'M10 19h-5a2 2 0 0 1 -2 -2v-10c0 -1.1 .9 -2 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -1 1.73',
    'M6 9l12 0',
    'M6 12l3 0',
    'M6 15l2 0',
  ],
  'home-check': [
    'M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2',
    'M19 13.488v-1.488h2l-9 -9l-9 9h2v7a2 2 0 0 0 2 2h4.525',
    'M15 19l2 2l4 -4',
  ],
  'file-description': [
    'M14 3v4a1 1 0 0 0 1 1h4',
    'M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2',
    'M9 17h6',
    'M9 13h6',
  ],
  'air-conditioning': [
    'M8 16a3 3 0 0 1 -3 3',
    'M16 16a3 3 0 0 0 3 3',
    'M12 16v4',
    'M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -4',
    'M7 13v-3a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v3',
  ],
  tool: ['M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6 -6a6 6 0 0 1 -8 -8l3.5 3.5'],
} as const satisfies Record<string, readonly string[]>;

export type IconName = keyof typeof ICONS;
